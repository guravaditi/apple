from fastapi import Header, HTTPException, Depends
from .database import get_supabase
from .config import settings

async def get_current_user(authorization: str = Header(None)):
    """
    Validates the Supabase JWT and returns the user object.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization Header")
    
    try:
        token = authorization.replace("Bearer ", "")
        supabase = get_supabase()
        user_response = supabase.auth.get_user(token)
        
        if not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid Token")
            
        return user_response.user
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

async def check_quota(user = Depends(get_current_user)):
    """
    Checks if the user has remaining AI generation quota.
    """
    supabase = get_supabase()
    # Check quota table
    response = supabase.table("user_quotas").select("generation_count").eq("user_id", user.id).execute()
    
    if not response.data:
        # Initialize quota if not exists
        supabase.table("user_quotas").insert({"user_id": user.id, "generation_count": 0}).execute()
        return
        
    count = response.data[0]["generation_count"]
    DAILY_LIMIT = 20 # Hackathon limit
    
    if count >= DAILY_LIMIT:
        raise HTTPException(status_code=429, detail="Daily AI generation quota exceeded")
    
    return count
