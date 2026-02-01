from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import Optional
from core.config import supabase_admin
from datetime import datetime

router = APIRouter(prefix="/api/tracking", tags=["Tracking"])

class VisitorTrack(BaseModel):
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    page_path: Optional[str] = None

class TourViewTrack(BaseModel):
    tour_id: str
    user_id: Optional[str] = None
    ip_address: Optional[str] = None

@router.post("/visitor")
async def track_visitor(track_data: VisitorTrack, request: Request):
    """Track visitor (public endpoint)"""
    try:
        # Lấy IP từ request nếu không có
        ip_address = track_data.ip_address
        if not ip_address:
            # Lấy IP từ headers
            forwarded = request.headers.get("X-Forwarded-For")
            if forwarded:
                ip_address = forwarded.split(",")[0].strip()
            else:
                ip_address = request.client.host if request.client else None
        
        # Lấy user agent từ request nếu không có
        user_agent = track_data.user_agent
        if not user_agent:
            user_agent = request.headers.get("User-Agent")
        
        insert_data = {
            "ip_address": ip_address,
            "user_agent": user_agent,
            "page_path": track_data.page_path,
            "visited_at": datetime.now().isoformat()
        }
        
        # Insert vào database (dùng admin client để bypass RLS)
        response = supabase_admin.table("visitors").insert(insert_data).execute()
        
        return {"success": True, "id": response.data[0].get("id") if response.data else None}
    except Exception as e:
        # Không fail nếu tracking lỗi, chỉ log
        print(f"Error tracking visitor: {e}")
        return {"success": False, "error": str(e)}

@router.post("/tour-view")
async def track_tour_view(track_data: TourViewTrack, request: Request):
    """Track tour view (public endpoint)"""
    try:
        # Lấy IP từ request nếu không có
        ip_address = track_data.ip_address
        if not ip_address:
            forwarded = request.headers.get("X-Forwarded-For")
            if forwarded:
                ip_address = forwarded.split(",")[0].strip()
            else:
                ip_address = request.client.host if request.client else None
        
        insert_data = {
            "tour_id": track_data.tour_id,
            "user_id": track_data.user_id if track_data.user_id else None,
            "ip_address": ip_address,
            "viewed_at": datetime.now().isoformat()
        }
        
        # Insert vào database
        response = supabase_admin.table("tour_views").insert(insert_data).execute()
        
        return {"success": True, "id": response.data[0].get("id") if response.data else None}
    except Exception as e:
        # Không fail nếu tracking lỗi, chỉ log
        print(f"Error tracking tour view: {e}")
        return {"success": False, "error": str(e)}
