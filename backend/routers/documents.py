from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from ..database import get_supabase
from ..dependencies import get_current_user

router = APIRouter(prefix="/ingest", tags=["Ingestion"])

class TextIngestRequest(BaseModel):
    title: str
    content: str

class FileRefIngestRequest(BaseModel):
    title: str
    file_path: str
    file_type: str # 'pdf', 'image'

@router.post("/text")
async def ingest_text(
    request: TextIngestRequest,
    user = Depends(get_current_user)
):
    supabase = get_supabase()
    data = {
        "user_id": user.id,
        "title": request.title,
        "content": request.content,
        "file_type": "text"
    }
    
    # Needs Service Role key usually to bypass RLS if using simple client, 
    # but here we rely on the RLS policies in SQL and maybe we should pass auth token working with client?
    # For now, simplistic insert using service key from config (server-side admin).
    # If using 'service_role' key, RLS is bypassed. If using 'anon' key, need to set session.
    # We'll use the service role client for simplicity in backend logic, but RLS policies enforce "auth.uid()".
    # Since we are essentially proxying, we can explicit insert the user_id.
    
    try:
        response = supabase.table("documents").insert(data).execute()
        return {"status": "success", "document_id": response.data[0]["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/file-reference")
async def ingest_file_Ref(
    request: FileRefIngestRequest,
    user = Depends(get_current_user)
):
    supabase = get_supabase()
    data = {
        "user_id": user.id,
        "title": request.title,
        "file_path": request.file_path,
        "file_type": request.file_type
    }
    
    try:
        response = supabase.table("documents").insert(data).execute()
        return {"status": "success", "document_id": response.data[0]["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
