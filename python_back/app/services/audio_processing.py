import librosa
import numpy as np
from transformers import ClapProcessor, ClapModel

processor = ClapProcessor.from_pretrained("laion/clap-htsat-fused")
model = ClapModel.from_pretrained("laion/clap-htsat-fused")

def get_audio_embedding(file_path: str) -> list:
    """
    Get audio embedding in 512 dimensions (matching the songs in database).
    This is used for similarity comparison.
    """
    y, sr = librosa.load(file_path, sr=48000)
    inputs = processor(audios=y, sampling_rate=48000, return_tensors="pt")
    emb = model.get_audio_features(**inputs)
    return emb[0].detach().numpy().tolist()

def pad_embedding_to_1536(embedding: list) -> list:
    """
    Pad 512-dimensional embedding to 1536 dimensions for database storage.
    Uses zero-padding to match database schema requirement.
    """
    if len(embedding) == 1536:
        return embedding
    elif len(embedding) == 512:
        # Pad with zeros to reach 1536 dimensions
        padding = [0.0] * (1536 - 512)
        return embedding + padding
    else:
        raise ValueError(f"Expected embedding of length 512 or 1536, got {len(embedding)}")

def get_bpm_and_key(file_path: str) -> tuple[int, str]:
    y, sr = librosa.load(file_path)
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
    key_index = chroma.mean(axis=1).argmax()
    key_map = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
    music_key = key_map[key_index]
    return int(tempo), music_key
