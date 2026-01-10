from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
from dotenv import load_dotenv
load_dotenv()
# --- 1. CẤU HÌNH KẾT NỐI ---
# Thay bằng thông tin thật của bạn lấy từ Supabase Settings -> API
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Khởi tạo kết nối đến Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Khởi tạo ứng dụng FastAPI
app = FastAPI()

# --- 2. CẤU HÌNH CORS (Quan trọng) ---
# Cho phép Frontend (có thể chạy ở port 5173 hoặc 8080) gọi được API này
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. CÁC API ENDPOINT ---

@app.get("/")
def read_root():
    return {"message": "Hello! Backend Tour Guide đang chạy ngon lành."}

# API lấy danh sách tất cả các tour
@app.get("/api/tours")
def get_tours():
    try:
        # Gọi xuống Supabase, bảng 'tours', lấy tất cả cột ('*')
        response = supabase.table("tours").select("*").execute()
        
        # Trả về dữ liệu (response.data chứa danh sách tour)
        return response.data
        
    except Exception as e:
        print(f"Lỗi: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# API lấy chi tiết 1 tour theo ID (để dùng cho trang Detail sau này)
@app.get("/api/tours/{tour_id}")
def get_tour_detail(tour_id: str):
    try:
        response = supabase.table("tours").select("*").eq("id", tour_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Không tìm thấy tour này")
            
        return response.data[0] # Trả về object đầu tiên tìm thấy
        
    except Exception as e:
        print(f"Lỗi: {e}")
        raise HTTPException(status_code=500, detail=str(e))