from fastapi import APIRouter, HTTPException, Form, Body
from supabase import create_client
from app.config import SUPABASE_URL, SUPABASE_KEY
from app.services.youtube_download import download_audio
from app.services.audio_processing import get_audio_embedding, get_bpm_and_key, pad_embedding_to_1536
from app.services.similarity import find_most_similar_song
from pydantic import BaseModel
import os
import shutil
import json
from datetime import datetime

router = APIRouter()
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

class CompareRequest(BaseModel):
    user_uid: str
    youtube_url: str

@router.post("/compare")
async def compare_song(request: CompareRequest):
    """
    Process a YouTube song URL, find the most similar song, and save to comparisons table.
    Accepts JSON body with user_uid and youtube_url.
    """
    user_uid = request.user_uid
    youtube_url = request.youtube_url
    
    if not user_uid or not youtube_url:
        raise HTTPException(status_code=400, detail="user_uid and youtube_url are required")
    
    wav_path = None
    try:
        # 1. Download audio from YouTube
        wav_path, title, video_id = download_audio(youtube_url)

        # 2. Process audio: extract BPM, key, and embedding
        bpm, key = get_bpm_and_key(wav_path)
        emb_512 = get_audio_embedding(wav_path)  # 512 dimensions for comparison
        
        # Ensure embedding is a list of floats (not numpy types)
        emb_512 = [float(x) for x in emb_512]
        
        # Validate embedding dimension (should be 512 for CLAP model)
        if len(emb_512) != 512:
            raise HTTPException(
                status_code=500, 
                detail=f"Embedding dimension mismatch: got {len(emb_512)} dimensions, but expected 512 from CLAP model."
            )

        # 3. Get all songs from database
        db_songs = supabase.table("songs").select("*").execute().data
        
        if not db_songs:
            raise HTTPException(status_code=404, detail="No songs found in database")

        # 4. Find the most similar song (using 512-dim embedding to match database songs)
        best_song, similarity = find_most_similar_song(emb_512, db_songs)

        if not best_song:
            raise HTTPException(status_code=404, detail="No matching song found")

        # 5. Save to comparisons table
        # Pad embedding to 1536 dimensions for database storage (database constraint)
        emb_1536 = pad_embedding_to_1536(emb_512)
        
        # Ensure all data types are correct for Supabase
        # Validate embedding is a list of numbers
        if not isinstance(emb_1536, list):
            raise ValueError(f"Embedding must be a list, got {type(emb_1536)}")
        if not all(isinstance(x, (int, float)) for x in emb_1536):
            raise ValueError("Embedding must contain only numbers")
        
        # Get the song ID (must be integer/bigint)
        matched_song_id = best_song.get("id")
        if matched_song_id is None:
            raise HTTPException(status_code=500, detail="Matched song does not have an ID field")
        
        # Validate and convert matched_song_id to integer
        try:
            matched_song_id = int(matched_song_id)
        except (ValueError, TypeError):
            raise HTTPException(
                status_code=500, 
                detail=f"Matched song ID must be an integer, got {type(matched_song_id)}: {matched_song_id}"
            )
        
        # Validate all required fields from best_song
        if not best_song.get("url"):
            raise HTTPException(status_code=500, detail="Matched song does not have a URL field")
        if not best_song.get("title"):
            raise HTTPException(status_code=500, detail="Matched song does not have a title field")
        
        # Prepare comparison data in the exact column order:
        # user_uid, uploaded_url, uploaded_bpm, uploaded_key, uploaded_embedding, matched_song_id, matched_url, similarity
        
        comparison_data = {
            "user_uid": str(user_uid),
            "uploaded_url": str(youtube_url),
            "uploaded_bpm": int(bpm),
            "uploaded_key": str(key),
            "uploaded_embedding": emb_1536,  # 1536 dimensions for database storage
            "matched_song_id": matched_song_id,  # Already validated as int
            "matched_url": str(best_song.get("url", "")),
            "similarity": float(similarity)
        }
        
        # Try different embedding formats based on what Supabase expects
        try:
            # First try: embedding as Python list (Supabase should serialize to JSONB)
            result = supabase.table("comparisons").insert(comparison_data).execute()
        except Exception as e1:
            error_msg = str(e1)
            # Check if it's a Supabase error with details
            if hasattr(e1, 'message') or isinstance(e1, dict):
                error_dict = e1 if isinstance(e1, dict) else getattr(e1, '__dict__', {})
                error_msg = error_dict.get('message', str(e1))
            
            # If that fails and error mentions type conversion, try as JSON string
            if "could not convert" in error_msg.lower() or "invalid input" in error_msg.lower() or "22P02" in error_msg:
                try:
                    # Second try: embedding as JSON string
                    comparison_data["uploaded_embedding"] = json.dumps(emb_1536)
                    result = supabase.table("comparisons").insert(comparison_data).execute()
                except Exception as e2:
                    error_msg2 = str(e2)
                    if hasattr(e2, 'message') or isinstance(e2, dict):
                        error_dict2 = e2 if isinstance(e2, dict) else getattr(e2, '__dict__', {})
                        error_msg2 = error_dict2.get('message', str(e2))
                    raise HTTPException(
                        status_code=500, 
                        detail=f"Failed to insert data. List format error: {error_msg}. JSON string error: {error_msg2}"
                    )
            else:
                raise HTTPException(status_code=500, detail=f"Database error: {error_msg}")
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to save comparison to database")

        # 6. Return result
        return {
            "matched_song": best_song["title"],
            "matched_url": best_song["url"],
            "similarity": float(similarity),
            "uploaded_bpm": bpm,
            "uploaded_key": key,
            "comparison_id": result.data[0]["id"] if result.data else None
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing song: {str(e)}")
    finally:
        # 7. Cleanup temporary files
        if wav_path and os.path.exists(wav_path):
            try:
                os.remove(wav_path)
                if os.path.exists(os.path.dirname(wav_path)):
                    shutil.rmtree(os.path.dirname(wav_path))
            except Exception as e:
                print(f"Warning: Failed to cleanup temporary files: {e}")
