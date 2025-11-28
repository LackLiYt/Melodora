from dotenv import load_dotenv
import os

load_dotenv()  # Зчитує ключі з .env

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
