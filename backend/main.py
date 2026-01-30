from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import tours, favourites, chat, profile

# Khởi tạo ứng dụng
app = FastAPI()

# --- CẤU HÌNH CORS ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- KẾT NỐI CÁC ROUTER ---
app.include_router(tours.router)
app.include_router(favourites.router)
app.include_router(chat.router)  # Chatbot với semantic search
app.include_router(profile.router)  # Profile management

@app.get("/")
def read_root():
    return {"message": "Hello! Backend Tour Guide (Modular Version) đang chạy ngon lành."}