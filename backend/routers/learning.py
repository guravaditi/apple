from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from ..database import get_supabase
from ..dependencies import get_current_user, check_quota
from ..ai_engine import generate_learning_content

router = APIRouter(prefix="/generate", tags=["Generation"])

class GenerateRequest(BaseModel):
    document_id: str
    type: str # 'flashcards', 'quiz', 'deep-dive'

@router.post("/")
async def generate_content(
    request: GenerateRequest,
    user = Depends(get_current_user),
    quota_current = Depends(check_quota)
):
    supabase = get_supabase()
    
    # 1. Fetch Document
    doc_res = supabase.table("documents").select("*").eq("id", request.document_id).single().execute()
    if not doc_res.data:
        raise HTTPException(status_code=404, detail="Document not found")
        
    doc = doc_res.data
    text_content = ""
    
    # 2. Extract Text
    if doc.get("content"):
        text_content = doc["content"]
    elif doc.get("file_path"):
        # Download from Storage
        # NOTE: For hackathon, assuming PDF text extraction is done? 
        # If not, we need a library like PyPDF2 here.
        # User prompt said "Upload documents OR paste raw text". 
        # If frontend uploads PDF, backend needs to extract text.
        # Let's add simple basic text extraction for now if needed.
        try:
            file_data = supabase.storage.from_("documents").download(doc["file_path"])
            
            if doc.get("file_type") == "pdf":
                import io
                from pypdf import PdfReader
                reader = PdfReader(io.BytesIO(file_data))
                text_content = ""
                for page in reader.pages:
                    text_content += page.extract_text() + "\n"
            else:
                text_content = file_data.decode("utf-8", errors="ignore") 
        except Exception as e:
            text_content = f"Error reading file: {str(e)}"
    
    if not text_content:
        raise HTTPException(status_code=400, detail="No content available to process")
        
    # 3. Call AI
    try:
        ai_result = generate_learning_content(text_content[:10000], request.type) # Limit chars for API
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    # 4. Save Result
    gen_data = {
        "document_id": request.document_id,
        "user_id": user.id,
        "generation_type": request.type,
        "content": ai_result
    }
    
    save_res = supabase.table("generated_content").insert(gen_data).execute()
    
    # 5. Update Quota
    supabase.table("user_quotas").update({"generation_count": quota_current + 1}).eq("user_id", user.id).execute()
    
    return save_res.data[0]
