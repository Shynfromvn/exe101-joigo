import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_KEY")  # Service key để bypass RLS

# Tạo client admin dùng chung (dùng anon key cho các API endpoints public)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Tạo client admin với service key để bypass RLS (cho admin operations)
supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)