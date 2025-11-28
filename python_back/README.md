# MusicSearch Python Backend

FastAPI backend for music similarity matching using AI embeddings.

## Installation

### 1. System Dependencies

**FFmpeg** is required for audio processing. Install it based on your OS:

- **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html) or use `choco install ffmpeg`
- **macOS**: `brew install ffmpeg`
- **Linux**: `sudo apt-get install ffmpeg` (Ubuntu/Debian) or `sudo yum install ffmpeg` (CentOS/RHEL)

### 2. Python Dependencies

Create a virtual environment and install dependencies:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Variables

Create a `.env` file in the `python_back` directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### 4. Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

## Dependencies

- **FastAPI**: Web framework
- **Uvicorn**: ASGI server
- **Transformers**: HuggingFace models (CLAP for audio embeddings)
- **PyTorch**: Deep learning framework (required by transformers)
- **Librosa**: Audio analysis and feature extraction
- **Pydub**: Audio file manipulation
- **yt-dlp**: YouTube video/audio downloading
- **Supabase**: Database client
- **NumPy**: Numerical computing

## API Endpoints

- `POST /music/compare` - Compare a YouTube URL with songs in database
- `GET /health` - Health check endpoint
- `GET /docs` - Interactive API documentation

