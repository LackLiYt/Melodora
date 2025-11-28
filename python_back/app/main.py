from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import music

app = FastAPI(title="Music Matcher API")

# Add CORS middleware to allow requests from Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001"],  # Add your production URL here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    """Health check endpoint to verify the API is running"""
    return {"status": "ok", "message": "API is running"}

app.include_router(music.router, prefix="/music", tags=["music"])

@app.get("/")
def root():
    return {"message": "FastAPI backend for Music Matcher"}
