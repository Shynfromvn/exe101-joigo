from fastapi import APIRouter, HTTPException, Header
from core.config import supabase
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/profile", tags=["Profile"])

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None
    birthdate: Optional[str] = None
    city: Optional[str] = None
    mobile_number: Optional[str] = None

class RoleUpdate(BaseModel):
    role: str  # 'admin' hoặc 'user'

# Middleware để lấy user_id từ token
def get_user_from_token(authorization: str = Header(None)):
    """Lấy user_id từ token"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Thiếu Token xác thực")
    try:
        token = authorization.replace("Bearer ", "")
        user_response = supabase.auth.get_user(token)
        return user_response.user.id
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(status_code=401, detail="Token không hợp lệ hoặc đã hết hạn")

# Lấy thông tin profile
@router.get("")
def get_profile(authorization: str = Header(None)):
    """Lấy thông tin profile của user đang đăng nhập"""
    user_id = get_user_from_token(authorization)
    
    try:
        response = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Không tìm thấy profile")
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Cập nhật profile
@router.put("")
def update_profile(profile: ProfileUpdate, authorization: str = Header(None)):
    """Cập nhật thông tin profile"""
    user_id = get_user_from_token(authorization)
    
    try:
        data = profile.dict(exclude_unset=True)
        if not data:
            raise HTTPException(status_code=400, detail="Không có dữ liệu để cập nhật")
        
        response = supabase.table("profiles").update(data).eq("id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Không tìm thấy profile để cập nhật")
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Chỉ admin mới có thể thay đổi role của user khác
@router.put("/{user_id}/role")
def update_user_role(user_id: str, role_update: RoleUpdate, authorization: str = Header(None)):
    """Cập nhật role của user (chỉ admin)"""
    admin_id = get_user_from_token(authorization)
    
    try:
        # Kiểm tra người gọi có phải admin không
        admin_check = supabase.table("profiles").select("role").eq("id", admin_id).single().execute()
        if not admin_check.data or admin_check.data.get('role') != 'admin':
            raise HTTPException(status_code=403, detail="Bạn không có quyền thay đổi role")
        
        # Cập nhật role
        if role_update.role not in ['admin', 'user']:
            raise HTTPException(status_code=400, detail="Role phải là 'admin' hoặc 'user'")
        
        response = supabase.table("profiles").update({"role": role_update.role}).eq("id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Không tìm thấy user")
        
        return {"message": f"Đã cập nhật role thành {role_update.role}", "user_id": user_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
