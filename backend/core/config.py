import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_KEY")  # Service key để generate embeddings

# Tạo client admin dùng chung (dùng anon key cho các API endpoints)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)