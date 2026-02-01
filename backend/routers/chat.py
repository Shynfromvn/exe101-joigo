import os
import uuid
from openai import OpenAI
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional, List
from pathlib import Path
import json
from core.config import supabase, supabase_admin

# --- Cấu hình Yescale API ---
AI_URL = "https://api.yescale.io/v1/chat/completions"
AI_TOKEN = os.getenv("AI_TOKEN")

# Khởi tạo OpenAI client với Yescale base URL
# Yescale tương thích với OpenAI API, chỉ cần thay đổi base_url
# Lấy base URL bằng cách loại bỏ phần endpoint cuối cùng
if "/chat/completions" in AI_URL:
    base_url = AI_URL.replace("/chat/completions", "")
else:
    # Nếu không có /chat/completions, giả sử đã là base URL
    base_url = AI_URL.rstrip("/")

client = OpenAI(
    api_key=AI_TOKEN,
    base_url=base_url
)
router = APIRouter(prefix="/api/chat", tags=["Chatbot"])

# Tên model
MODEL_NAME = "gpt-4o-mini"

# --- Biến toàn cục chứa dữ liệu Tour ---
TOUR_CONTEXT = ""
# --- Biến toàn cục chứa nội dung hướng dẫn đặt tour ---
HOW_TO_BOOK_CONTEXT = ""

def format_price(price):
    """Hàm format giá tiền VNĐ"""
    return f"{price:,.0f}đ".replace(",", ".")

def load_tour_data():
    global TOUR_CONTEXT
    try:
        current_file_path = Path(__file__).resolve()
        # Đổi tên file thành tours.json
        file_path = current_file_path.parent.parent / "data" / "tours.json"
        
        if file_path.exists():
            with open(file_path, "r", encoding="utf-8") as f:
                tours_data = json.load(f) # Đọc dưới dạng List Python
            
            # --- BƯỚC QUAN TRỌNG: CHUYỂN JSON -> TEXT ĐỂ TIẾT KIỆM TOKEN ---
            text_lines = []
            for tour in tours_data:
                # Tạo một dòng text ngắn gọn cho mỗi tour
                line = (
                    f"- {tour['title']}. "
                    f"Giá: {format_price(tour['price'])}. "
                    f"Chi tiết: {tour['description']}"
                )
                text_lines.append(line)
            
            # Nối lại thành một đoạn văn bản
            TOUR_CONTEXT = "\n".join(text_lines)
            
            print(f"✅ Đã load và convert {len(tours_data)} tour sang text.")
        else:
            print(f"⚠️ Không tìm thấy file: {file_path}")
            TOUR_CONTEXT = ""
            
    except Exception as e:
        print(f"❌ Lỗi đọc file JSON: {e}")

def load_how_to_book_data():
    global HOW_TO_BOOK_CONTEXT
    try:
        current_file_path = Path(__file__).resolve()
        file_path = current_file_path.parent.parent / "data" / "how_to_book.txt"
        
        if file_path.exists():
            with open(file_path, "r", encoding="utf-8") as f:
                HOW_TO_BOOK_CONTEXT = f.read().strip()
            print(f"✅ Đã load nội dung hướng dẫn đặt tour.")
        else:
            print(f"⚠️ Không tìm thấy file: {file_path}")
            HOW_TO_BOOK_CONTEXT = ""
            
    except Exception as e:
        print(f"❌ Lỗi đọc file how_to_book.txt: {e}")

# Gọi hàm load ngay khi file này được import/chạy
load_tour_data()
load_how_to_book_data()

# --- Hàm helper để lấy user_id từ token (optional) ---
def get_user_id_from_token(authorization: Optional[str] = None) -> Optional[str]:
    """Lấy user_id từ token, trả về None nếu không có token hoặc token không hợp lệ"""
    if not authorization:
        return None
    try:
        token = authorization.replace("Bearer ", "")
        user_response = supabase.auth.get_user(token)
        return user_response.user.id if user_response.user else None
    except Exception as e:
        print(f"⚠️ Không thể lấy user_id từ token: {e}")
        return None

# --- Hàm helper để lấy hoặc tạo chat session ---
def get_or_create_session(session_id: Optional[str], user_id: Optional[str], language: str) -> str:
    """Lấy session_id hiện tại hoặc tạo mới, tự động load chat gần nhất nếu không có session_id và có user_id"""
    # Nếu có session_id, kiểm tra session có tồn tại không
    if session_id:
        try:
            response = supabase_admin.table("chat_sessions").select("id").eq("id", session_id).execute()
            if response.data:
                return session_id
        except Exception as e:
            print(f"⚠️ Lỗi kiểm tra session: {e}")
    
    # Nếu không có session_id nhưng có user_id, tìm chat gần nhất
    if not session_id and user_id:
        try:
            response = supabase_admin.table("chat_sessions")\
                .select("id")\
                .eq("user_id", user_id)\
                .order("updated_at", desc=True)\
                .limit(1)\
                .execute()
            if response.data:
                return response.data[0]["id"]
        except Exception as e:
            print(f"⚠️ Lỗi tìm chat gần nhất: {e}")
    
    # Tạo session mới
    try:
        new_session = {
            "user_id": user_id,
            "language": language
        }
        response = supabase_admin.table("chat_sessions").insert(new_session).execute()
        return response.data[0]["id"]
    except Exception as e:
        print(f"❌ Lỗi tạo session mới: {e}")
        # Fallback: tạo UUID mới nếu không thể lưu vào DB
        return str(uuid.uuid4())

# --- Hàm để lấy lịch sử chat từ database ---
def get_chat_history_from_db(session_id: str, limit: int = 20) -> List[dict]:
    """Lấy lịch sử chat từ database, trả về dạng list các dict với role và content"""
    try:
        response = supabase_admin.table("chat_messages")\
            .select("role, content")\
            .eq("session_id", session_id)\
            .order("created_at", desc=False)\
            .limit(limit)\
            .execute()
        
        if response.data:
            return response.data
        return []
    except Exception as e:
        print(f"⚠️ Lỗi lấy lịch sử chat: {e}")
        return []

# --- Hàm để lưu tin nhắn vào database ---
def save_message_to_db(session_id: str, role: str, content: str):
    """Lưu tin nhắn vào database"""
    try:
        message_data = {
            "session_id": session_id,
            "role": role,
            "content": content
        }
        supabase_admin.table("chat_messages").insert(message_data).execute()
        
        # Tự động tạo title từ tin nhắn đầu tiên nếu chưa có
        if role == "user":
            session_response = supabase_admin.table("chat_sessions")\
                .select("title")\
                .eq("id", session_id)\
                .execute()
            if session_response.data and not session_response.data[0].get("title"):
                # Lấy 50 ký tự đầu làm title
                title = content[:50] + "..." if len(content) > 50 else content
                supabase_admin.table("chat_sessions")\
                    .update({"title": title})\
                    .eq("id", session_id)\
                    .execute()
    except Exception as e:
        print(f"⚠️ Lỗi lưu tin nhắn: {e}")

def remove_markdown(text: str) -> str:
    import re
    # Xoá **bold**, *italic*
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    text = re.sub(r'\*([^*]+)\*', r'\1', text)
    return text.strip()

# --- Models ---
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    language: Optional[str] = "VI"

class CreateSessionRequest(BaseModel):
    title: Optional[str] = None
    language: Optional[str] = "VI"

# --- API Endpoints ---

@router.post("/sessions", status_code=201)
async def create_chat_session(
    request: CreateSessionRequest,
    authorization: Optional[str] = Header(None)
):
    """Tạo chat session mới"""
    user_id = get_user_id_from_token(authorization)
    
    try:
        session_data = {
            "user_id": user_id,
            "title": request.title,
            "language": request.language or "VI"
        }
        response = supabase_admin.table("chat_sessions").insert(session_data).execute()
        return {
            "session_id": response.data[0]["id"],
            "title": response.data[0].get("title"),
            "created_at": response.data[0]["created_at"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi tạo session: {str(e)}")

@router.get("/sessions")
async def get_chat_sessions(authorization: Optional[str] = Header(None)):
    """Lấy danh sách chat sessions của user"""
    user_id = get_user_id_from_token(authorization)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Cần đăng nhập để xem lịch sử chat")
    
    try:
        response = supabase_admin.table("chat_sessions")\
            .select("id, title, language, created_at, updated_at")\
            .eq("user_id", user_id)\
            .order("updated_at", desc=True)\
            .execute()
        
        return {
            "sessions": response.data if response.data else []
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi lấy danh sách sessions: {str(e)}")

@router.get("/sessions/{session_id}/messages")
async def get_session_messages(session_id: str, authorization: Optional[str] = Header(None)):
    """Lấy tất cả tin nhắn trong một session"""
    user_id = get_user_id_from_token(authorization)
    
    try:
        # Kiểm tra quyền truy cập session
        session_response = supabase_admin.table("chat_sessions")\
            .select("user_id")\
            .eq("id", session_id)\
            .execute()
        
        if not session_response.data:
            raise HTTPException(status_code=404, detail="Không tìm thấy session")
        
        session_user_id = session_response.data[0].get("user_id")
        if session_user_id and session_user_id != user_id:
            raise HTTPException(status_code=403, detail="Không có quyền truy cập session này")
        
        # Lấy messages
        messages_response = supabase_admin.table("chat_messages")\
            .select("id, role, content, created_at")\
            .eq("session_id", session_id)\
            .order("created_at", desc=False)\
            .execute()
        
        return {
            "session_id": session_id,
            "messages": messages_response.data if messages_response.data else []
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi lấy messages: {str(e)}")

@router.delete("/sessions/{session_id}")
async def delete_chat_session(session_id: str, authorization: Optional[str] = Header(None)):
    """Xóa chat session"""
    user_id = get_user_id_from_token(authorization)
    
    try:
        # Kiểm tra quyền
        session_response = supabase_admin.table("chat_sessions")\
            .select("user_id")\
            .eq("id", session_id)\
            .execute()
        
        if not session_response.data:
            raise HTTPException(status_code=404, detail="Không tìm thấy session")
        
        session_user_id = session_response.data[0].get("user_id")
        if session_user_id and session_user_id != user_id:
            raise HTTPException(status_code=403, detail="Không có quyền xóa session này")
        
        # Xóa session (messages sẽ tự động xóa do cascade)
        supabase_admin.table("chat_sessions").delete().eq("id", session_id).execute()
        
        return {"message": "Đã xóa session thành công"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi xóa session: {str(e)}")

@router.post("")
async def chat_with_openai(
    request: ChatRequest,
    authorization: Optional[str] = Header(None)
):
    user_query = request.message
    language = request.language or "VI"
    
    # Lấy user_id từ token (nếu có)
    user_id = get_user_id_from_token(authorization)
    
    # Lấy hoặc tạo session (tự động load chat gần nhất nếu không có session_id)
    session_id = get_or_create_session(request.session_id, user_id, language)
    
    # 1. Lấy lịch sử chat từ database
    history = get_chat_history_from_db(session_id)
    
    # 2. Tạo Prompt (Kết hợp: Chỉ thị + Dữ liệu file text + Lịch sử chat + Câu hỏi mới)
    
    # Prompt cho Tiếng Việt
    if language == "VI":
        system_instruction = f"""
        Bạn là trợ lý ảo AI của công ty du lịch JOIGO.
        
        NHIỆM VỤ CỦA BẠN:
        Trả lời câu hỏi của khách hàng dựa trên CHÍNH XÁC thông tin dữ liệu tour và hướng dẫn đặt tour dưới đây.
        Hãy dựa vào ngôn ngữ mà khách hàng hỏi, nếu ngôn ngữ là tiếng Việt thì phải chuyển giá từ dolar sang giá VNĐ tương ứng với tỷ giá là 1USD=26000VNĐ.
        Khi trả lời về giá nhớ thêm đơn vị USD hoặc VNĐ vào cuối giá tùy thuộc vào ngôn ngữ của người hỏi
        
        DỮ LIỆU TOUR (Nguồn sự thật):
        ---
        {TOUR_CONTEXT}
        ---

        HƯỚNG DẪN ĐẶT TOUR:
        ---
        {HOW_TO_BOOK_CONTEXT}
        ---

        YÊU CẦU TRẢ LỜI:
        1. Sử dụng thông tin trong phần "DỮ LIỆU TOUR" để trả lời về tour. Nếu khách hỏi tour không có trong dữ liệu, hãy xin lỗi và bảo chưa có thông tin.
        2. Sử dụng thông tin trong phần "HƯỚNG DẪN ĐẶT TOUR" để trả lời các câu hỏi về cách đặt tour, quy trình đặt tour, phương thức đặt tour, thông tin liên hệ, v.v.
        3. Giọng điệu: Thân thiện, nhiệt tình, chuyên nghiệp.
        4. Định dạng: Trả lời ngắn gọn, rõ ràng. KHÔNG dùng markdown (không bôi đậm, không in nghiêng).
        5. Nếu khách hỏi giá, hãy trả lời chính xác con số trong dữ liệu. Hãy dựa vào ngôn ngữ mà khách hàng hỏi, nếu ngôn ngữ là tiếng Việt thì phải chuyển giá từ dolar sang giá VNĐ tương ứng với tỷ giá là 1USD=26000VNĐ.
        6. Khi trả lời về giá nhớ thêm đơn vị USD hoặc VNĐ vào cuối giá tùy thuộc vào ngôn ngữ của người hỏi
        """
    else: # Prompt cho Tiếng Anh
        system_instruction = f"""
        You are the AI assistant for JOIGO Travel.
        
        YOUR MISSION:
        Answer customer questions based STRICTLY on the tour data and booking guide provided below.
        If a customer asks about the price, provide the exact figure from the data. Respond in the same language as the customer's inquiry. If the inquiry is in Vietnamese, convert the price from USD to VNĐ using the exchange rate of 1 USD = 26,000 VNĐ.
        When providing the price, always include the currency unit (USD or VNĐ) at the end, depending on the language used by the inquirer.
        
        TOUR DATA (Source of Truth):
        ---
        {TOUR_CONTEXT}
        ---

        HOW TO BOOK GUIDE:
        ---
        {HOW_TO_BOOK_CONTEXT}
        ---

        RESPONSE REQUIREMENTS:
        1. Use information from the "TOUR DATA" section to answer about tours. If information is missing, politely say you don't have it.
        2. Use information from the "HOW TO BOOK GUIDE" section to answer questions about booking process, booking methods, contact information, etc.
        3. Tone: Friendly, enthusiastic, professional.
        4. Format: Plain text only. NO markdown (no bold, no italics).
        5. Keep prices exactly as listed. If the inquiry is in Vietnamese, convert the price from USD to VNĐ using the exchange rate of 1 USD = 26,000 VNĐ.
        6. When providing the price, always include the currency unit (USD or VNĐ) at the end, depending on the language used by the inquirer.
        """

    # 3. Xây dựng danh sách messages cho OpenAI API
    messages = [
        {"role": "system", "content": system_instruction}
    ]
    
    # Thêm lịch sử hội thoại từ database
    for msg in history:
        messages.append({
            "role": msg["role"],
            "content": msg["content"]
        })
    
    # Thêm câu hỏi mới của user
    messages.append({"role": "user", "content": user_query})

    try:
        # 4. Gọi Yescale API (tương thích với OpenAI API)
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages,
            temperature=0.7,
            max_tokens=512
        )
        
        # Kiểm tra response có hợp lệ không
        if not response.choices or len(response.choices) == 0:
            raise ValueError("Response không có choices")
        
        ai_reply = response.choices[0].message.content
        
        # Kiểm tra content có None hoặc rỗng không
        if ai_reply is None:
            ai_reply = "Xin lỗi, tôi không thể tạo phản hồi. Vui lòng thử lại." if language == "VI" else "Sorry, I couldn't generate a response. Please try again."
        elif not ai_reply.strip():
            ai_reply = "Xin lỗi, phản hồi trống. Vui lòng thử lại." if language == "VI" else "Sorry, empty response. Please try again."
        else:
            ai_reply = remove_markdown(ai_reply)

        # 5. Lưu lịch sử vào database
        save_message_to_db(session_id, "user", user_query)
        save_message_to_db(session_id, "assistant", ai_reply)

        return {
            "response": ai_reply,
            "session_id": session_id
        }

    except Exception as e:
        # Xử lý trường hợp hết quota hoặc lỗi mạng
        error_msg = "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau." if language == "VI" else "System busy, please try again."
        return {
            "response": error_msg,
            "error_detail": str(e)
        }
