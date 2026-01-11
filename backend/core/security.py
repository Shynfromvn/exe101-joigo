from fastapi import HTTPException, Header
from typing import Optional
from core.config import supabase, SUPABASE_URL, SUPABASE_KEY
from supabase import create_client

async def get_user_supabase_client(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    try:
        token = authorization.replace("Bearer ", "")
        
        # 1. Verify token
        response = supabase.auth.get_user(token)
        
        if not response.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # 2. Tạo client mới và gán Auth
        user_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        user_client.postgrest.auth(token)
        
        return response.user.id, user_client
        
    except Exception as e:
        print(f"Token verification error: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")