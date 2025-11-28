import tempfile
import os
from yt_dlp import YoutubeDL
from pydub import AudioSegment

def download_audio(url: str) -> str:
    tmp_dir = tempfile.mkdtemp()
    out_path = os.path.join(tmp_dir, "%(id)s.%(ext)s")

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": out_path,
        "quiet": True,
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192"
        }],
    }

    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)

    mp3_file = os.path.join(tmp_dir, info["id"] + ".mp3")
    wav_file = os.path.join(tmp_dir, info["id"] + ".wav")
    AudioSegment.from_file(mp3_file).export(wav_file, format="wav")

    return wav_file, info["title"], info["id"]
