from fastapi import APIRouter, HTTPException, status, Header, Query
from pydantic import BaseModel
from typing import Optional, List
from core.config import supabase_admin, supabase
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/admin", tags=["Admin"])

# ==================================================================
# MIDDLEWARE: Kiểm tra quyền Admin
# ==================================================================

def verify_admin(authorization: str = Header(None)):
    """Middleware kiểm tra quyền Admin"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Thiếu Token xác thực")
    try:
        token = authorization.replace("Bearer ", "")
        user_response = supabase.auth.get_user(token)
        user_id = user_response.user.id
        
        profile_response = supabase.table("profiles")\
            .select("role")\
            .eq("id", user_id)\
            .single()\
            .execute()
        
        if not profile_response.data or profile_response.data.get('role') != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Bạn không có quyền Admin"
            )
            
        return user_id
    except HTTPException:
        raise
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(status_code=401, detail="Token không hợp lệ hoặc đã hết hạn")

# ==================================================================
# SCHEMAS
# ==================================================================

class StatusUpdate(BaseModel):
    status: str  # 'pending', 'processing', 'completed', 'cancelled' cho consultations
                 # 'pending', 'confirmed', 'cancelled', 'completed' cho bookings

# ==================================================================
# DASHBOARD STATS
# ==================================================================

@router.get("/dashboard/stats")
async def get_dashboard_stats(authorization: str = Header(None)):
    """Lấy thống kê tổng quan cho dashboard"""
    verify_admin(authorization)
    
    try:
        # 1. Tổng số consultations
        consultations_response = supabase_admin.table("consultations").select("id", count="exact").execute()
        total_consultations = consultations_response.count if consultations_response.count else 0
        
        # 2. Consultations chưa xử lý
        pending_consultations = supabase_admin.table("consultations")\
            .select("id", count="exact")\
            .eq("status", "pending")\
            .execute()
        pending_consultations_count = pending_consultations.count if pending_consultations.count else 0
        
        # 3. Tổng số bookings
        bookings_response = supabase_admin.table("bookings").select("id", count="exact").execute()
        total_bookings = bookings_response.count if bookings_response.count else 0
        
        # 4. Bookings chưa xử lý
        pending_bookings = supabase_admin.table("bookings")\
            .select("id", count="exact")\
            .eq("status", "pending")\
            .execute()
        pending_bookings_count = pending_bookings.count if pending_bookings.count else 0
        
        # 5. Tổng số visitors (từ bảng visitors nếu có, nếu không thì 0)
        try:
            visitors_response = supabase_admin.table("visitors").select("id", count="exact").execute()
            total_visitors = visitors_response.count if visitors_response.count else 0
        except:
            total_visitors = 0
        
        # 6. Visitors hôm nay
        try:
            today = datetime.now().date()
            today_visitors = supabase_admin.table("visitors")\
                .select("id", count="exact")\
                .gte("visited_at", today.isoformat())\
                .execute()
            today_visitors_count = today_visitors.count if today_visitors.count else 0
        except:
            today_visitors_count = 0
        
        # 7. Tổng lượt xem tours
        try:
            tour_views_response = supabase_admin.table("tour_views").select("id", count="exact").execute()
            total_tour_views = tour_views_response.count if tour_views_response.count else 0
        except:
            total_tour_views = 0
        
        # 8. Top tours được xem nhiều nhất
        try:
            top_tours = supabase_admin.table("tour_views")\
                .select("tour_id")\
                .execute()
            # Đếm số lượt xem cho mỗi tour
            tour_counts = {}
            if top_tours.data:
                for view in top_tours.data:
                    tour_id = view.get("tour_id")
                    if tour_id:
                        tour_counts[tour_id] = tour_counts.get(tour_id, 0) + 1
            
            # Lấy top 5 tours
            sorted_tours = sorted(tour_counts.items(), key=lambda x: x[1], reverse=True)[:5]
            top_5_tours = []
            for tour_id, count in sorted_tours:
                try:
                    tour_info = supabase_admin.table("tours")\
                        .select("id, title, image")\
                        .eq("id", tour_id)\
                        .single()\
                        .execute()
                    if tour_info.data:
                        top_5_tours.append({
                            "tour_id": tour_id,
                            "title": tour_info.data.get("title"),
                            "image": tour_info.data.get("image"),
                            "views": count
                        })
                except:
                    pass
        except:
            top_5_tours = []
        
        return {
            "consultations": {
                "total": total_consultations,
                "pending": pending_consultations_count,
                "completed": total_consultations - pending_consultations_count
            },
            "bookings": {
                "total": total_bookings,
                "pending": pending_bookings_count,
                "confirmed": total_bookings - pending_bookings_count
            },
            "visitors": {
                "total": total_visitors,
                "today": today_visitors_count
            },
            "tour_views": {
                "total": total_tour_views,
                "top_tours": top_5_tours
            }
        }
    except Exception as e:
        print(f"Error getting dashboard stats: {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi khi lấy thống kê: {str(e)}")

# ==================================================================
# CONSULTATIONS MANAGEMENT
# ==================================================================

@router.get("/consultations")
async def get_all_consultations(
    authorization: str = Header(None),
    status_filter: Optional[str] = Query(None, description="Lọc theo status"),
    limit: int = Query(50, description="Số lượng records"),
    offset: int = Query(0, description="Offset")
):
    """Lấy danh sách tất cả consultations"""
    verify_admin(authorization)
    
    try:
        query = supabase_admin.table("consultations").select("*")
        
        if status_filter:
            query = query.eq("status", status_filter)
        
        query = query.order("created_at", desc=True).limit(limit).offset(offset)
        response = query.execute()
        
        return {
            "data": response.data if response.data else [],
            "total": len(response.data) if response.data else 0
        }
    except Exception as e:
        print(f"Error getting consultations: {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi khi lấy consultations: {str(e)}")

@router.put("/consultations/{consultation_id}/status")
async def update_consultation_status(
    consultation_id: str,
    status_update: StatusUpdate,
    authorization: str = Header(None)
):
    """Cập nhật trạng thái consultation"""
    verify_admin(authorization)
    
    try:
        valid_statuses = ["pending", "processing", "completed", "cancelled"]
        if status_update.status not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Status phải là một trong: {valid_statuses}")
        
        response = supabase_admin.table("consultations")\
            .update({"status": status_update.status})\
            .eq("id", consultation_id)\
            .execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Không tìm thấy consultation")
        
        return {
            "message": "Đã cập nhật trạng thái thành công",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating consultation status: {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi khi cập nhật trạng thái: {str(e)}")

# ==================================================================
# BOOKINGS MANAGEMENT
# ==================================================================

@router.get("/bookings")
async def get_all_bookings(
    authorization: str = Header(None),
    status_filter: Optional[str] = Query(None, description="Lọc theo status"),
    limit: int = Query(50, description="Số lượng records"),
    offset: int = Query(0, description="Offset")
):
    """Lấy danh sách tất cả bookings"""
    verify_admin(authorization)
    
    try:
        # Lấy bookings với tours (không JOIN profiles vì không có FK trực tiếp)
        query = supabase_admin.table("bookings")\
            .select("*, tours(title, image, price, departure, destination)")
        
        if status_filter:
            query = query.eq("status", status_filter)
        
        query = query.order("booking_date", desc=True).limit(limit).offset(offset)
        response = query.execute()
        
        # Xử lý dữ liệu để map location và lấy profile info
        bookings = response.data if response.data else []
        for booking in bookings:
            # Map location từ departure/destination
            if booking.get("tours") and isinstance(booking.get("tours"), dict):
                tour_data = booking["tours"]
                tour_data["location"] = tour_data.get("departure") or tour_data.get("destination") or "N/A"
            
            # Lấy profile info riêng (vì không có FK trực tiếp)
            user_id = booking.get("user_id")
            if user_id:
                try:
                    profile_response = supabase_admin.table("profiles")\
                        .select("email, full_name")\
                        .eq("id", user_id)\
                        .single()\
                        .execute()
                    if profile_response.data:
                        booking["profiles"] = {
                            "email": profile_response.data.get("email"),
                            "name": profile_response.data.get("full_name")
                        }
                    else:
                        booking["profiles"] = None
                except Exception as profile_err:
                    print(f"Error fetching profile for user {user_id}: {profile_err}")
                    booking["profiles"] = None
            else:
                booking["profiles"] = None
        
        return {
            "data": bookings,
            "total": len(bookings)
        }
    except Exception as e:
        print(f"Error getting bookings: {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi khi lấy bookings: {str(e)}")

@router.put("/bookings/{booking_id}/status")
async def update_booking_status(
    booking_id: str,
    status_update: StatusUpdate,
    authorization: str = Header(None)
):
    """Cập nhật trạng thái booking"""
    verify_admin(authorization)
    
    try:
        valid_statuses = ["pending", "confirmed", "cancelled", "completed"]
        if status_update.status not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Status phải là một trong: {valid_statuses}")
        
        response = supabase_admin.table("bookings")\
            .update({"status": status_update.status})\
            .eq("id", booking_id)\
            .execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Không tìm thấy booking")
        
        return {
            "message": "Đã cập nhật trạng thái thành công",
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating booking status: {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi khi cập nhật trạng thái: {str(e)}")

# ==================================================================
# VISITORS & TOUR VIEWS
# ==================================================================

@router.get("/visitors")
async def get_visitors(
    authorization: str = Header(None),
    limit: int = Query(100, description="Số lượng records"),
    offset: int = Query(0, description="Offset")
):
    """Lấy danh sách visitors"""
    verify_admin(authorization)
    
    try:
        response = supabase_admin.table("visitors")\
            .select("*")\
            .order("visited_at", desc=True)\
            .limit(limit)\
            .offset(offset)\
            .execute()
        
        return {
            "data": response.data if response.data else [],
            "total": len(response.data) if response.data else 0
        }
    except Exception as e:
        # Nếu bảng không tồn tại, trả về empty
        print(f"Error getting visitors (table might not exist): {e}")
        return {
            "data": [],
            "total": 0
        }

@router.get("/tour-views")
async def get_tour_views(
    authorization: str = Header(None),
    tour_id: Optional[str] = Query(None, description="Lọc theo tour_id"),
    limit: int = Query(100, description="Số lượng records"),
    offset: int = Query(0, description="Offset")
):
    """Lấy danh sách tour views"""
    verify_admin(authorization)
    
    try:
        query = supabase_admin.table("tour_views").select("*, tours(title, image)")
        
        if tour_id:
            query = query.eq("tour_id", tour_id)
        
        query = query.order("viewed_at", desc=True).limit(limit).offset(offset)
        response = query.execute()
        
        return {
            "data": response.data if response.data else [],
            "total": len(response.data) if response.data else 0
        }
    except Exception as e:
        # Nếu bảng không tồn tại, trả về empty
        print(f"Error getting tour views (table might not exist): {e}")
        return {
            "data": [],
            "total": 0
        }
