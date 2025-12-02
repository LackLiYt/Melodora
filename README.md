Song Similarity API

A FastAPI-based backend service for extracting audio features and comparing song similarity. The project uses librosa and NumPy/SciPy for audio feature extraction, and provides HTTP endpoints for uploading and processing songs.

🚀 Features

Upload a song via API (YouTube link or file)

Extract audio embeddings using librosa

Store song data in Supabase

Compare similarity between songs using vector distance

Return similarity scores

Ready for Docker deployment

🛠 Tech Stack

Python 3.10+

FastAPI

Uvicorn (ASGI server)

Librosa (audio feature extraction)

NumPy / SciPy

Supabase (database & storage)


▶️ Run Locally


1️⃣ Create and activate virtual environment
python -m venv venv
venv\Scripts\activate

2️⃣ Install dependencies


pip install -r requirements.txt


3️⃣ Start server


uvicorn app.main:app --reload


Server runs at: http://localhost:8000

📝 Notes

Heavy libraries like librosa use a lot of RAM.

For production, consider background jobs (Celery / RQ) to avoid blocking API.
