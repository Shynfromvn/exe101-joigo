from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from core.config import supabase_admin  # Dùng admin client để bypass RLS

router = APIRouter(prefix="/api/consultations", tags=["Consultations"])

# --- 1. Schema dữ liệu (Validation) ---
# Class này đảm bảo dữ liệu gửi lên đúng định dạng
class ConsultationCreate(BaseModel):
    full_name: str = Field(..., min_length=2, description="Tên khách hàng")
    email: EmailStr  # Tự động kiểm tra format a@b.c
    phone: str = Field(..., min_length=9, max_length=15)
    message: Optional[str] = None
    user_id: Optional[str] = None
    tour_id: Optional[str] = None  # ID của tour mà người dùng muốn đặt

# --- 2. API Endpoint ---
@router.post("", status_code=status.HTTP_201_CREATED)
async def create_consultation(form_data: ConsultationCreate):
    """
    Nhận dữ liệu từ Form 'Book Your Tour Now' và lưu vào Supabase
    """
    try:
        # Chuẩn bị payload để insert
        insert_data = {
            "full_name": form_data.full_name,
            "email": form_data.email,
            "phone": form_data.phone,
            "message": form_data.message,
            "status": "pending", # Mặc định là chờ xử lý
            "user_id": form_data.user_id if form_data.user_id else None,
            "tour_id": form_data.tour_id if form_data.tour_id else None
        }

        # Gọi Supabase với admin client (bypass RLS)
        response = supabase_admin.table("consultations").insert(insert_data).execute()

        # Kiểm tra nếu có lỗi trả về từ Supabase (dù hiếm khi dùng supabase-py)
        if not response.data:
            raise HTTPException(status_code=400, detail="Không thể lưu dữ liệu")

        return {
            "message": "Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm.",
            "data": response.data[0]
        }

    except Exception as e:
        print(f"❌ Error saving consultation: {str(e)}")
        # Trả về lỗi 500 cho Frontend biết đường xử lý
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi hệ thống khi lưu yêu cầu tư vấn."
        )