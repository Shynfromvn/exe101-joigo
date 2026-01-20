import os
import uuid
from google import genai
from google.genai import types
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from core.config import supabase
from sentence_transformers import SentenceTransformer
import torch

# --- Initialize Vietnamese Embedding Model ---
print("Loading Vietnamese Embedding Model...")
try:
    embedding_model = SentenceTransformer("dangvantuan/vietnamese-embedding")
    embedding_model.max_seq_length = 2048
    print("✅ Vietnamese Embedding Model loaded successfully")
except Exception as e:
    print(f"❌ Error loading embedding model: {e}")
    embedding_model = None

# --- Configuration ---
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=GOOGLE_API_KEY)
router = APIRouter(prefix="/api/chat", tags=["Chatbot"])

# --- Fake chat memory (Production should use Redis/DB) ---
# Format: session_id -> list of messages
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
    # Keep only last 10 messages to save tokens
    fake_chat_memory[session_id].append(f"{role}: {content}")
    if len(fake_chat_memory[session_id]) > 10:
        fake_chat_memory[session_id].pop(0)

# --- New step: Rephrase query (STANDALONE QUERY) ---
def contextualize_query(chat_history: List[str], new_question: str) -> str:
    """
    Dùng Gemini để viết lại câu hỏi dựa trên lịch sử chat.
    Ví dụ: History="Tour HN", User="Giá?" -> Output="Giá tour HN"
    """
    if not chat_history:
        return new_question

    history_text = "\n".join(chat_history)
    prompt = f"""
    Dựa trên lịch sử hội thoại dưới đây và câu hỏi mới nhất của người dùng, 
    hãy viết lại câu hỏi mới sao cho nó đầy đủ ý nghĩa, độc lập và có thể dùng để tìm kiếm thông tin.
    KHÔNG trả lời câu hỏi, chỉ viết lại câu hỏi. Giữ nguyên ngôn ngữ tiếng Việt.
    
    Lịch sử hội thoại:
    {history_text}
    
    Câu hỏi mới: {new_question}
    
    Câu hỏi viết lại (Standalone query):
    """
    
    try:
        response = client.models.generate_content(
            contents=prompt,
            model="gemini-2.5-flash",
        )
        refined_query = response.text.strip()
        print(f"Rephrased Query: '{new_question}' -> '{refined_query}'")
        return refined_query
    except Exception:
        return new_question

def generate_query_embedding(text: str):
    """
    Generate embedding using Vietnamese SentenceTransformer model
    """
    if embedding_model is None:
        print("❌ Embedding model not loaded")
        return None
    
    try:
        # Encode text to get embedding vector
        embedding = embedding_model.encode(text, convert_to_numpy=True)
        # Convert to list for JSON serialization
        return embedding.tolist()
    except Exception as e:
        print(f"❌ Error generating embedding: {e}")
        return None

def format_price(price: float, language: str) -> str:
    """Format price according to language: USD for EN, VND for VI"""
    if language == "EN":
        return f"${price:.2f}"
    else:
        vnd_price = price * 26275
        return f"{vnd_price:,.0f}₫"

def remove_markdown(text: str) -> str:
    """Remove markdown formatting like **bold**"""
    import re
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    text = re.sub(r'\*([^*]+)\*', r'\1', text)
    return text

@router.post("")
async def chat_with_gemini(request: ChatRequest):
    user_query = request.message
    language = request.language or "VI"
    session_id = request.session_id
    if not session_id:
        session_id = str(uuid.uuid4())
    
    # 1. Get chat history
    history = get_chat_history(session_id)
    
    # 2. Rephrase query (Contextualization)
    search_query = contextualize_query(history, user_query)
    
    # 3. Semantic Search by rephrased query (search_query)
    relevant_tours = []
    query_embedding = generate_query_embedding(search_query)
    
    if query_embedding:
        print(f"Searching for: {search_query}")
        print(f"Query embedding dimension: {len(query_embedding)}")
        try:
            response = supabase.rpc(
                'match_tours',
                {
                    'query_embedding': query_embedding,
                    'match_threshold': 0.4,
                    'match_count': 4
                }
            ).execute()
            relevant_tours = response.data
        except Exception as e:
            print(f"Database error: {e}")

    # 4. Create context text with formatted price
    if not relevant_tours:
        if language == "EN":
            context_text = "No specific tour information found in the database."
        else:
            context_text = "Không tìm thấy thông tin tour cụ thể trong dữ liệu."
    else:
        if language == "EN":
            context_text = "TOUR INFORMATION FOUND:\n"
        else:
            context_text = "THÔNG TIN TOUR TÌM THẤY:\n"
        for tour in relevant_tours:
            price_formatted = format_price(tour.get('price', 0), language)
            if language == "EN":
                context_text += f"- {tour['title']}: Price {price_formatted}. {tour.get('description')}\n"
            else:
                context_text += f"- {tour['title']}: Giá {price_formatted}. {tour.get('description')}\n"

    # 5. Final prompt
    history_text = "\n".join(history)
    
    # Create prompt according to language
    if language == "EN":
        final_prompt = f"""
        You are JOIGO's virtual assistant. Please answer the question based on the provided information.
        
        CHAT HISTORY:
        {history_text}
        
        TOUR DATA INFORMATION (Context):
        {context_text}
        
        CUSTOMER QUESTION: "{user_query}"
        
        REQUIREMENTS:
        - If information is available in Context, provide detailed answers.
        - If the customer asks follow-up questions (e.g., "any other tours?"), base your answer on Context.
        - Use a friendly, concise tone.
        - DO NOT use markdown formatting like **bold** or *italic* in your response.
        - Format prices exactly as shown in the Context (with $ for USD or ₫ for VND).
        """
    else:
        final_prompt = f"""
        Bạn là trợ lý ảo JOIGO. Hãy trả lời câu hỏi dựa trên thông tin được cung cấp.
        
        LỊCH SỬ HỘI THOẠI:
        {history_text}
        
        THÔNG TIN DỮ LIỆU TOUR (Context):
        {context_text}
        
        KHÁCH HÀNG HỎI: "{user_query}"
        
        YÊU CẦU:
        - Nếu thông tin có trong Context, hãy trả lời chi tiết.
        - Nếu khách hỏi nối tiếp (ví dụ: "còn tour nào khác?"), hãy dựa vào Context.
        - Giọng điệu thân thiện, ngắn gọn.
        - KHÔNG sử dụng định dạng markdown như **bold** hoặc *italic* trong câu trả lời.
        - Format giá chính xác như trong Context (với $ cho USD hoặc ₫ cho VND).
        """

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=final_prompt
        )
        ai_reply = response.text
        
        ai_reply = remove_markdown(ai_reply)
        
        # 6. Save chat history
        save_chat_history(session_id, "User", user_query)
        save_chat_history(session_id, "AI", ai_reply)
        
        return {
            "response": ai_reply,
            "rewritten_query": search_query,
            "relevant_tours_count": len(relevant_tours)
        }
        
    except Exception as e:
        print(f"Generate Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))