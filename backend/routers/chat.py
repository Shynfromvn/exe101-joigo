import os
import uuid
from google import genai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from pathlib import Path
import json

# --- Cấu hình ---
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=GOOGLE_API_KEY)
router = APIRouter(prefix="/api/chat", tags=["Chatbot"])

# Tên model chuẩn (Sử dụng Flash 1.5 cho nhanh và rẻ, context lớn)
MODEL_NAME = "gemini-2.5-flash"

# --- Biến toàn cục chứa dữ liệu Tour ---
TOUR_CONTEXT = ""

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
# Gọi hàm load ngay khi file này được import/chạy
load_tour_data()

# --- Fake chat memory ---
fake_chat_memory = {}

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    language: Optional[str] = "VI"

def get_chat_history(session_id: str):
    return fake_chat_memory.get(session_id, [])

def save_chat_history(session_id: str, role: str, content: str):
    if session_id not in fake_chat_memory:
        fake_chat_memory[session_id] = []
    # Lưu user và model
    fake_chat_memory[session_id].append(f"{role}: {content}")
    # Giữ lại 20 tin nhắn gần nhất để model nhớ ngữ cảnh hội thoại tốt hơn
    if len(fake_chat_memory[session_id]) > 20:
        fake_chat_memory[session_id].pop(0)

def remove_markdown(text: str) -> str:
    import re
    # Xoá **bold**, *italic*
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    text = re.sub(r'\*([^*]+)\*', r'\1', text)
    return text.strip()

@router.post("")
async def chat_with_gemini(request: ChatRequest):
    user_query = request.message
    session_id = request.session_id or str(uuid.uuid4())
    language = request.language or "VI"

    # 1. Lấy lịch sử chat
    history = get_chat_history(session_id)
    history_text = "\n".join(history)

    # 2. Tạo Prompt (Kết hợp: Chỉ thị + Dữ liệu file text + Lịch sử chat + Câu hỏi mới)
    
    # Prompt cho Tiếng Việt
    if language == "VI":
        system_instruction = f"""
        Bạn là trợ lý ảo AI của công ty du lịch JOIGO.
        
        NHIỆM VỤ CỦA BẠN:
        Trả lời câu hỏi của khách hàng dựa trên CHÍNH XÁC thông tin dữ liệu tour dưới đây.
        Hãy dựa vào ngôn ngữ mà khách hàng hỏi, nếu ngôn ngữ là tiếng Việt thì phải chuyển giá từ dolar sang giá VNĐ tương ứng với tỷ giá là 1USD=26000VNĐ.
        Khi trả lời về giá nhớ thêm đơn vị USD hoặc VNĐ vào cuối giá tùy thuộc vào ngôn ngữ của người hỏi
        DỮ LIỆU TOUR (Nguồn sự thật):
        ---
        {TOUR_CONTEXT}
        ---

        YÊU CẦU TRẢ LỜI:
        1. Chỉ sử dụng thông tin trong phần "DỮ LIỆU TOUR". Nếu khách hỏi tour không có trong dữ liệu, hãy xin lỗi và bảo chưa có thông tin.
        2. Giọng điệu: Thân thiện, nhiệt tình, chuyên nghiệp.
        3. Định dạng: Trả lời ngắn gọn, rõ ràng. KHÔNG dùng markdown (không bôi đậm, không in nghiêng).
        4. Nếu khách hỏi giá, hãy trả lời chính xác con số trong dữ liệu. Hãy dựa vào ngôn ngữ mà khách hàng hỏi, nếu ngôn ngữ là tiếng Việt thì phải chuyển giá từ dolar sang giá VNĐ tương ứng với tỷ giá là 1USD=26000VNĐ.
        5. Khi trả lời về giá nhớ thêm đơn vị USD hoặc VNĐ vào cuối giá tùy thuộc vào ngôn ngữ của người hỏi
        """
    else: # Prompt cho Tiếng Anh
        system_instruction = f"""
        You are the AI assistant for JOIGO Travel.
        
        YOUR MISSION:
        Answer customer questions based STRICTLY on the tour data provided below.
        If a customer asks about the price, provide the exact figure from the data. Respond in the same language as the customer's inquiry. If the inquiry is in Vietnamese, convert the price from USD to VNĐ using the exchange rate of 1 USD = 26,000 VNĐ.
        When providing the price, always include the currency unit (USD or VNĐ) at the end, depending on the language used by the inquirer.
        
        TOUR DATA (Source of Truth):
        ---
        {TOUR_CONTEXT}
        ---

        RESPONSE REQUIREMENTS:
        1. Only use information from the "TOUR DATA" section. If information is missing, politely say you don't have it.
        2. Tone: Friendly, enthusiastic, professional.
        3. Format: Plain text only. NO markdown (no bold, no italics).
        4. Keep prices exactly as listed. If the inquiry is in Vietnamese, convert the price from USD to VNĐ using the exchange rate of 1 USD = 26,000 VNĐ.
        5. When providing the price, always include the currency unit (USD or VNĐ) at the end, depending on the language used by the inquirer.
        """

    # Nội dung gửi đi
    final_prompt = f"""
    {system_instruction}

    LỊCH SỬ HỘI THOẠI TRƯỚC ĐÓ:
    {history_text}

    KHÁCH HÀNG VỪA HỎI:
    "{user_query}"

    TRẢ LỜI CỦA BẠN:
    """

    try:
        # 3. Gọi Gemini (Chỉ tốn 1 request duy nhất)
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=final_prompt
        )
        
        ai_reply = response.text
        ai_reply = remove_markdown(ai_reply)

        # 4. Lưu lịch sử
        save_chat_history(session_id, "User", user_query)
        save_chat_history(session_id, "AI", ai_reply)

        return {
            "response": ai_reply,
            "session_id": session_id
        }

    except Exception as e:
        print(f"Error: {e}")
        # Xử lý trường hợp hết quota hoặc lỗi mạng
        error_msg = "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau." if language == "VI" else "System busy, please try again."
        return {
            "response": error_msg,
            "error_detail": str(e)
        }