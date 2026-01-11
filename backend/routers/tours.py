from fastapi import APIRouter, HTTPException
from core.config import supabase

# Tạo router với prefix chung
router = APIRouter(prefix="/api/tours", tags=["Tours"])

@router.get("")
def get_tours():
    try:
        response = supabase.table("tours").select("*").execute()
        return response.data
    except Exception as e:
        print(f"Lỗi: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{tour_id}")
def get_tour_detail(tour_id: str):
    try:
        response = supabase.table("tours").select("*").eq("id", tour_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Không tìm thấy tour này")
            
        return response.data[0]
    except Exception as e:
        print(f"Lỗi: {e}")
        raise HTTPException(status_code=500, detail=str(e))