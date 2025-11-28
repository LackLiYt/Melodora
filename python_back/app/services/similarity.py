import numpy as np
import json

def cosine_similarity(a: list, b: list) -> float:
    a = np.array(a, dtype=np.float32)
    b = np.array(b, dtype=np.float32)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

def parse_embedding(embedding):
    """Parse embedding from database - handles both list and string formats"""
    if isinstance(embedding, str):
        try:
            # Try to parse as JSON string
            return json.loads(embedding)
        except json.JSONDecodeError:
            # If that fails, try eval (less safe but handles some edge cases)
            try:
                return eval(embedding)
            except:
                raise ValueError(f"Could not parse embedding: {type(embedding)}")
    elif isinstance(embedding, list):
        return embedding
    else:
        raise ValueError(f"Unknown embedding type: {type(embedding)}")

def find_most_similar_song(uploaded_emb: list, db_songs: list) -> tuple[dict, float]:
    best_score = -1
    best_song = None

    for song in db_songs:
        try:
            # Parse embedding from database (might be string or list)
            song_emb_raw = song.get("embedding")
            if song_emb_raw is None:
                continue
            
            song_emb = parse_embedding(song_emb_raw)
            song_emb = np.array(song_emb, dtype=np.float32)
            
            score = cosine_similarity(uploaded_emb, song_emb)
            if score > best_score:
                best_score = score
                best_song = song
        except Exception as e:
            print(f"Error processing song {song.get('id', 'unknown')}: {e}")
            continue

    return best_song, best_score
