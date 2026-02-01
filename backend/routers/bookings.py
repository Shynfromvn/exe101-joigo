from fastapi import APIRouter, HTTPException, status, Query
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from core.config import supabase_admin  # Dùng admin client để bypass RLS

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

# --- 1. Schema cho dữ liệu gửi lên (Input) ---
class BookingCreate(BaseModel):
    user_id: str  # ID của người dùng đang đăng nhập
    tour_id: str  # ID của tour đang xem
    full_name: str
    email: EmailStr
    phone: str
    message: Optional[str] = None

# --- 2. API: Tạo Booking mới (Khi bấm Submit) ---
@router.post("", status_code=status.HTTP_201_CREATED)
async def create_booking(booking_data: BookingCreate):
    try:
        # Chuẩn bị dữ liệu
        data = booking_data.model_dump()
        data["status"] = "pending" # Trạng thái mặc định

        # Gửi sang Supabase với admin client (bypass RLS)
        # Lưu ý: Vì bảng này có RLS chặt chẽ (chỉ cho chính chủ insert), 
        # backend dùng SERVICE_ROLE_KEY (trong core/config) sẽ bypass được để ghi dữ liệu.
        response = supabase_admin.table("bookings").insert(data).execute()
        
        return {
            "message": "Đặt tour thành công!",
            "data": response.data[0]
        }
    except Exception as e:
        print(f"Error creating booking: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- 3. API: Lấy danh sách Booking của User (Cho trang My Booking) ---
@router.get("/my-bookings")
async def get_my_bookings(user_id: str = Query(..., description="ID của user muốn xem lịch sử")):
    """
    Lấy danh sách tất cả bookings của user, bao gồm thông tin tour chi tiết
    """
    try:
        print(f"🔍 Fetching bookings for user_id: {user_id}")
        
        # Thử query với join trước
        try:
            # Kỹ thuật quan trọng: JOIN bảng để lấy thông tin chi tiết của Tour
            # select="*, tours(*)" nghĩa là: Lấy hết cột bảng bookings VÀ lấy hết cột bảng tours tương ứng
            # Dùng admin client để bypass RLS và có thể đọc dữ liệu của user
            # Lưu ý: Bảng tours có departure và destination, không có duration và location
            response = supabase_admin.table("bookings")\
                .select("*, tours(title, title_en, image, price, price_vnd, departure, destination)")\
                .eq("user_id", user_id)\
                .order("booking_date", desc=True)\
                .execute()
            
            bookings = response.data if response.data else []
            print(f"✅ Found {len(bookings)} bookings for user {user_id}")
            
            # Nếu không có dữ liệu, trả về mảng rỗng
            if not bookings:
                return []
            
            # Xử lý dữ liệu để đảm bảo format đúng
            processed_bookings = []
            for booking in bookings:
                # Đảm bảo tours là object hoặc null
                tour_data = booking.get("tours")
                if tour_data is None:
                    booking["tours"] = None
                    print(f"⚠️ Booking {booking.get('id')} has no tour data (tour_id: {booking.get('tour_id')})")
                else:
                    # Map departure/destination thành location để tương thích với frontend
                    if isinstance(tour_data, dict):
                        # Tạo location từ departure hoặc destination
                        location = tour_data.get("departure") or tour_data.get("destination") or "N/A"
                        tour_data["location"] = location
                        # Thêm duration = None vì không có field này trong bảng
                        tour_data["duration"] = None
                        print(f"✅ Processed tour data for booking {booking.get('id')}: {tour_data.get('title')}")
                    else:
                        # Nếu tour_data không phải dict, set thành None
                        booking["tours"] = None
                        print(f"⚠️ Tour data is not a dict for booking {booking.get('id')}")
                processed_bookings.append(booking)
            
            return processed_bookings
            
        except Exception as join_error:
            # Nếu join thất bại, thử lấy bookings không có join
            print(f"⚠️ Join failed, trying without join: {str(join_error)}")
            response = supabase_admin.table("bookings")\
                .select("*")\
                .eq("user_id", user_id)\
                .order("booking_date", desc=True)\
                .execute()
            
            bookings = response.data if response.data else []
            
            # Nếu có bookings, thử lấy thông tin tour riêng
            if bookings:
                for booking in bookings:
                    tour_id = booking.get("tour_id")
                    if tour_id:
                        try:
                            tour_response = supabase_admin.table("tours")\
                                .select("title, title_en, image, price, departure, destination")\
                                .eq("id", tour_id)\
                                .single()\
                                .execute()
                            if tour_response.data:
                                tour_data = tour_response.data
                                # Map departure/destination thành location để tương thích với frontend
                                tour_data["location"] = tour_data.get("departure") or tour_data.get("destination") or "N/A"
                                tour_data["duration"] = None  # Không có field duration trong bảng
                                booking["tours"] = tour_data
                            else:
                                booking["tours"] = None
                        except Exception as tour_err:
                            print(f"⚠️ Error fetching tour {tour_id}: {str(tour_err)}")
                            booking["tours"] = None
                    else:
                        booking["tours"] = None
            
            return bookings
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Error fetching bookings for user {user_id}: {error_msg}")
        print(f"Error type: {type(e).__name__}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        
        # Trả về lỗi chi tiết hơn để debug
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể tải lịch sử đặt tour: {error_msg}"
        )