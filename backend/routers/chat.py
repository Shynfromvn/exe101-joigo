import os
import google.generativeai as genai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from core.config import supabase

# --- 1. CẤU HÌNH GEMINI ---
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("Chưa cấu hình GOOGLE_API_KEY trong file .env")

genai.configure(api_key=GOOGLE_API_KEY)

# Model để generate text
gemini_model = genai.GenerativeModel('gemini-2.5-flash')

# Khởi tạo Router
router = APIRouter(prefix="/api/chat", tags=["Chatbot"])

class ChatRequest(BaseModel):
    message: str

def generate_query_embedding(text: str):
    """Generate embedding vector cho câu hỏi của user bằng Gemini"""
    try:
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_query",  # Cho việc search/query
        )
        return result['embedding']
    except Exception as e:
        print(f"❌ Lỗi generate embedding: {e}")
        return None

@router.post("")
async def chat_with_gemini(request: ChatRequest):
    user_query = request.message
    print(f"💬 User hỏi: {user_query}")

    # --- 2. SEMANTIC SEARCH: TÌM TOUR LIÊN QUAN BẰNG VECTOR SIMILARITY ---
    try:
        # Bước 2.1: Chuyển câu hỏi thành embedding
        query_embedding = generate_query_embedding(user_query)
        
        if not query_embedding:
            # Fallback: Lấy tours ngẫu nhiên nếu embedding fail
            print("⚠️ Embedding failed, fallback to random tours")
            response = supabase.table("tours").select("title, price, description").limit(5).execute()
            relevant_tours = response.data
        else:
            # Bước 2.2: Tìm tours có embedding tương tự nhất
            print("🔍 Searching with semantic similarity...")
            response = supabase.rpc(
                'match_tours',
                {
                    'query_embedding': query_embedding,
                    'match_threshold': 0.3,  # Độ tương đồng tối thiểu (0-1)
                    'match_count': 5  # Lấy top 5 tours liên quan nhất
                }
            ).execute()
            
            relevant_tours = response.data
            print(f"✅ Tìm thấy {len(relevant_tours)} tours liên quan")
        
        # Bước 2.3: Tạo context từ tours liên quan
        if not relevant_tours or len(relevant_tours) == 0:
            context_text = "Hiện tại chưa có tour nào phù hợp với yêu cầu của bạn trong hệ thống."
        else:
            context_text = "DANH SÁCH TOUR LIÊN QUAN:\n\n"
            for idx, tour in enumerate(relevant_tours, 1):
                similarity_score = tour.get('similarity', 0)
                context_text += f"{idx}. 📍 Tên: {tour['title']}\n"
                context_text += f"   💰 Giá: ${tour.get('price', 'N/A')}\n"
                context_text += f"   📝 Mô tả: {tour.get('description', 'Chưa có mô tả')}\n"
                if similarity_score > 0:
                    context_text += f"   🎯 Độ phù hợp: {similarity_score:.1%}\n"
                context_text += "\n"
                
    except Exception as e:
        print(f"❌ Lỗi semantic search: {e}")
        import traceback
        traceback.print_exc()
        
        # Fallback: Lấy tours ngẫu nhiên
        try:
            response = supabase.table("tours").select("title, price, description").limit(5).execute()
            context_text = "DANH SÁCH TOUR:\n\n"
            for idx, tour in enumerate(response.data, 1):
                context_text += f"{idx}. {tour['title']} - ${tour.get('price', 'N/A')}\n"
                context_text += f"   {tour.get('description', '')}\n\n"
        except:
            context_text = "Xin lỗi, hiện tại hệ thống gặp sự cố khi tìm kiếm tour."

    # --- 3. TẠO PROMPT CHO GEMINI ---
    prompt = f"""
    Bạn là trợ lý ảo AI chuyên nghiệp của website đặt tour du lịch JOIGO tại Việt Nam.
    
    🎯 NHIỆM VỤ:
    - Trả lời câu hỏi của khách hàng một cách thân thiện, ngắn gọn, chuyên nghiệp
    - Dựa CHÍNH XÁC vào dữ liệu tour được cung cấp bên dưới
    - Nếu có tour phù hợp, giới thiệu chi tiết và làm nổi bật ưu điểm
    - Nếu không có tour phù hợp, lịch sự thông báo và gợi ý khách liên hệ hotline
    
    📚 DỮ LIỆU TOUR (đã được lọc theo độ liên quan):
    {context_text}
    
    ---
    ❓ CÂU HỎI CỦA KHÁCH HÀNG:
    "{user_query}"
    
    💡 LƯU Ý KHI TRẢ LỜI:
    - Chỉ giới thiệu tours có trong dữ liệu trên
    - Đề cập giá cả và điểm nổi bật
    - Giữ câu trả lời ngắn gọn (2-4 câu)
    - Thân thiện và nhiệt tình
    
    ✨ CÂU TRẢ LỜI:
    """

    # --- 4. GỌI GEMINI ĐỂ TRẢ LỜI ---
    try:
        response = gemini_model.generate_content(prompt)
        ai_reply = response.text
        
        return {
            "response": ai_reply,
            "relevant_tours_count": len(relevant_tours) if relevant_tours else 0,
            "search_method": "semantic" if query_embedding else "fallback"
        }
        
    except Exception as e:
        print(f"❌ Lỗi gọi Gemini: {e}")
        raise HTTPException(status_code=500, detail="AI đang bận, vui lòng thử lại sau.")