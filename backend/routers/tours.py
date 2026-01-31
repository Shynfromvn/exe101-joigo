from fastapi import APIRouter, HTTPException, Depends, Header, status
from core.config import supabase, supabase_admin
import uuid
from pydantic import BaseModel
from typing import Optional, List
# Tạo router với prefix chung
router = APIRouter(prefix="/api/tours", tags=["Tours"])

class TourBase(BaseModel):
    title: str
    title_key: Optional[str] = None
    image: Optional[str] = None
    images: Optional[List[str]] = []    # Mapping cột text[] trong DB
    price: Optional[float] = 0
    rating: Optional[float] = 0
    reviews: Optional[int] = 0
    
    # Địa điểm & Vận chuyển
    departure: Optional[str] = None     # Điểm khởi hành
    destination: Optional[str] = None   # Điểm đến
    transportation: Optional[str] = None # Phương tiện
    type: Optional[List[str]] = []      # Loại hình (VD: ["Văn hóa", "Ẩm thực"])

    # Nội dung chi tiết (khớp với database schema)
    description: Optional[str] = None
    additional_info: Optional[str] = None
    description_en: Optional[str] = None

class TourCreate(TourBase):
    # ID là text, optional vì nếu user không gửi thì backend sẽ tự tạo
    id: Optional[str] = None

class TourUpdate(TourBase):
    # Khi update, tiêu đề cũng có thể để trống (không sửa)
    title: Optional[str] = None

# ==================================================================
# 2. SECURITY (Chỉ Admin mới được Thêm/Sửa/Xóa)
# ==================================================================

def verify_admin(authorization: str = Header(None)):
    """Middleware kiểm tra quyền Admin"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Thiếu Token xác thực")
    try:
        # 1. Lấy token
        token = authorization.replace("Bearer ", "")
        
        # 2. Lấy User ID từ Auth
        user_response = supabase.auth.get_user(token)
        user_id = user_response.user.id
        
        # 3. Check Role trong bảng profiles
        profile_response = supabase.table("profiles")\
            .select("role")\
            .eq("id", user_id)\
            .single()\
            .execute()
        
        if not profile_response.data or profile_response.data.get('role') != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Bạn không có quyền Admin để thực hiện thao tác này"
            )
            
        return user_id # Trả về user_id nếu cần log lịch sử
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(status_code=401, detail="Token không hợp lệ hoặc đã hết hạn")

# ==================================================================
# 3. API ENDPOINTS
# ==================================================================

# --- PUBLIC: Lấy danh sách Tour ---
@router.get("")
def get_tours(
    search: Optional[str] = None, 
    destination: Optional[str] = None,
    min_price: Optional[float] = None
):
    try:
        query = supabase.table("tours").select("*")
        
        # Các bộ lọc cơ bản (Optional)
        if search:
            query = query.ilike("title", f"%{search}%")
        if destination:
            query = query.eq("destination", destination)
        if min_price:
            query = query.gte("price", min_price)
            
        # Sắp xếp mới nhất lên đầu
        response = query.order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- PUBLIC: Lấy chi tiết 1 Tour ---
@router.get("/{tour_id}")
def get_tour_detail(tour_id: str):
    try:
        response = supabase.table("tours").select("*").eq("id", tour_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Không tìm thấy tour này")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- ADMIN ONLY: Tạo Tour mới ---
@router.post("", status_code=201)
def create_tour(tour: TourCreate, user_id: str = Depends(verify_admin)):
    try:
        data = tour.dict(exclude_unset=True)
        
        # Logic tự sinh ID nếu client không gửi lên (vì DB id là text, không tự tăng)
        if "id" not in data or not data["id"]:
            data["id"] = str(uuid.uuid4())
            
        # Dùng supabase_admin để bypass RLS
        response = supabase_admin.table("tours").insert(data).execute()
        
        if not response.data:
             raise HTTPException(status_code=400, detail="Lỗi khi tạo tour")
             
        return response.data[0]
    except Exception as e:
        print(f"Create Tour Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- ADMIN ONLY: Cập nhật Tour ---
@router.put("/{tour_id}")
def update_tour(tour_id: str, tour: TourUpdate, user_id: str = Depends(verify_admin)):
    try:
        data = tour.dict(exclude_unset=True)
        
        if not data:
            raise HTTPException(status_code=400, detail="Không có dữ liệu để cập nhật")

        # Dùng supabase_admin để bypass RLS
        response = supabase_admin.table("tours").update(data).eq("id", tour_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Không tìm thấy tour để sửa")
            
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- ADMIN ONLY: Xóa Tour ---
@router.delete("/{tour_id}")
def delete_tour(tour_id: str, user_id: str = Depends(verify_admin)):
    try:
        # Do bạn đã set "ON DELETE CASCADE" trong DB bảng favorites
        # Nên khi xóa tour, các lượt like của tour đó cũng tự mất theo -> Không lo lỗi rằng buộc
        # Dùng supabase_admin để bypass RLS
        response = supabase_admin.table("tours").delete().eq("id", tour_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Không tìm thấy tour hoặc lỗi khi xóa")
            
        return {"message": "Đã xóa tour thành công", "deleted_id": tour_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))