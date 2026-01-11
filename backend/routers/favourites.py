from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from core.security import get_user_supabase_client
from core.config import supabase

router = APIRouter(prefix="/api/favorites", tags=["Favorites"])

class FavoriteRequest(BaseModel):
    tour_id: str

# Thêm tour vào wishlist
@router.post("")
async def add_favorite(
    request: FavoriteRequest,
    # Sử dụng Depends để gọi hàm verify token gọn gàng hơn
    auth_data = Depends(get_user_supabase_client)
):
    user_id, user_supabase = auth_data # Giải nén dữ liệu từ auth_data
    
    try:
        # Kiểm tra tour tồn tại (dùng admin client từ config)
        tour_response = supabase.table("tours").select("*").eq("id", request.tour_id).execute()
        if not tour_response.data:
            raise HTTPException(status_code=404, detail="Tour không tồn tại")
        
        # Kiểm tra đã thích chưa (dùng user client)
        existing = user_supabase.table("favorites")\
            .select("*")\
            .eq("user_id", user_id)\
            .eq("tour_id", request.tour_id)\
            .execute()
        
        if existing.data:
            return {
                "success": True, 
                "message": "Tour đã có trong danh sách yêu thích",
                "favorite": existing.data[0]
            }
        
        # Thêm vào favorites
        favorite_data = {"user_id": user_id, "tour_id": request.tour_id}
        response = user_supabase.table("favorites").insert(favorite_data).execute()
        
        return {
            "success": True, 
            "message": "Đã thêm vào danh sách yêu thích",
            "favorite": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Lỗi add favorite: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Xóa tour khỏi wishlist
@router.delete("/{tour_id}")
async def remove_favorite(
    tour_id: str,
    auth_data = Depends(get_user_supabase_client)
):
    user_id, user_supabase = auth_data
    try:
        user_supabase.table("favorites")\
            .delete()\
            .eq("user_id", user_id)\
            .eq("tour_id", tour_id)\
            .execute()
        
        return {"success": True, "message": "Đã xóa khỏi danh sách yêu thích"}
    except Exception as e:
        print(f"Lỗi remove favorite: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Lấy danh sách wishlist
@router.get("")
async def get_favorites(auth_data = Depends(get_user_supabase_client)):
    user_id, user_supabase = auth_data
    try:
        response = user_supabase.table("favorites")\
            .select("*, tours(*)")\
            .eq("user_id", user_id)\
            .execute()
        
        favorites = []
        for item in response.data:
            if item.get("tours"):
                favorites.append(item["tours"])
        
        return {"success": True, "count": len(favorites), "favorites": favorites}
    except Exception as e:
        print(f"Lỗi get favorites: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Kiểm tra trạng thái thích
@router.get("/check/{tour_id}")
async def check_favorite(
    tour_id: str,
    auth_data = Depends(get_user_supabase_client)
):
    user_id, user_supabase = auth_data
    try:
        response = user_supabase.table("favorites")\
            .select("*")\
            .eq("user_id", user_id)\
            .eq("tour_id", tour_id)\
            .execute()
        
        return {"is_favorite": len(response.data) > 0}
    except Exception as e:
        print(f"Lỗi check favorite: {e}")
        raise HTTPException(status_code=500, detail=str(e))