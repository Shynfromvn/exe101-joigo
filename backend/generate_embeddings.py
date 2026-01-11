import os
from dotenv import load_dotenv
import google.generativeai as genai
from supabase import create_client

# Load environment variables
load_dotenv()

# Setup clients
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not all([GOOGLE_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY]):
    raise ValueError("⚠️ Thiếu environment variables! Kiểm tra file .env")

# Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)

# Supabase client với service key (có quyền admin)
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def generate_embedding(text: str):
    """Generate embedding using Gemini"""
    try:
        result = genai.embed_content(
            model="models/text-embedding-004",  # Model mới nhất của Gemini
            content=text,
            task_type="retrieval_document",  # Cho việc lưu trữ documents
        )
        return result['embedding']
    except Exception as e:
        print(f"❌ Lỗi generate embedding: {e}")
        return None

def update_tour_embeddings():
    """Update embeddings cho tất cả tours"""
    print("🚀 Bắt đầu generate embeddings cho tours...")
    print("=" * 60)
    
    # Lấy tất cả tours
    try:
        response = supabase.table("tours").select("*").execute()
        tours = response.data
        print(f"📚 Tìm thấy {len(tours)} tours trong database")
    except Exception as e:
        print(f"❌ Lỗi lấy tours: {e}")
        return
    
    if not tours:
        print("⚠️ Không có tour nào trong database!")
        return
    
    success_count = 0
    error_count = 0
    
    for idx, tour in enumerate(tours, 1):
        try:
            # Tạo text để embed (kết hợp title + description)
            title = tour.get('title', '')
            description = tour.get('description', '')
            text_to_embed = f"{title}. {description}"
            
            print(f"\n[{idx}/{len(tours)}] Processing: {title[:50]}...")
            
            # Generate embedding
            embedding = generate_embedding(text_to_embed)
            
            if embedding:
                # Update vào database
                supabase.table("tours").update({
                    "embedding": embedding
                }).eq("id", tour["id"]).execute()
                
                success_count += 1
                print(f"   ✅ Success! (embedding size: {len(embedding)} dimensions)")
            else:
                error_count += 1
                print(f"   ⚠️ Skipped - could not generate embedding")
                
        except Exception as e:
            error_count += 1
            print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print(f"🎉 Hoàn thành!")
    print(f"   ✅ Thành công: {success_count}/{len(tours)} tours")
    if error_count > 0:
        print(f"   ❌ Lỗi: {error_count}/{len(tours)} tours")
    print("=" * 60)

if __name__ == "__main__":
    print("\n" + "🔮 GEMINI EMBEDDINGS GENERATOR 🔮".center(60))
    print("=" * 60)
    update_tour_embeddings()
    print("\n✨ Script hoàn thành! Bạn có thể test chatbot ngay bây giờ.\n")

