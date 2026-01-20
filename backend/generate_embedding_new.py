import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from supabase import create_client
import numpy as np

# Load environment variables
load_dotenv()

# Setup clients
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not all([SUPABASE_URL, SUPABASE_SERVICE_KEY]):
    raise ValueError("⚠️ Thiếu environment variables! Kiểm tra file .env")

# Initialize SentenceTransformer model with 768 dimensions
# Using 'dangvantuan/vietnamese-embedding' which produces 768-dimensional embeddings
print("Loading SentenceTransformer model (768 dimensions)...")
try:
    embedding_model = SentenceTransformer("dangvantuan/vietnamese-embedding")
    embedding_model.max_seq_length = 2048
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"❌ Error loading embedding model: {e}")
    raise

# Supabase client với service key (có quyền admin)
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def generate_embedding_768(text: str):
    """Generate embedding with 768 dimensions using SentenceTransformer"""
    try:
        embedding = embedding_model.encode(text, convert_to_numpy=True)
        # Verify dimension
        if len(embedding) != 768:
            print(f"⚠️ Warning: Expected 768 dimensions, got {len(embedding)}")
        # Convert to list for database storage
        return embedding.tolist()
    except Exception as e:
        print(f"❌ Lỗi generate embedding: {e}")
        return None

def update_tour_embeddings_768():
    """Update embeddings với 768 dimensions cho tất cả tours"""
    print("🚀 Bắt đầu generate embeddings (768 dimensions) cho tours...")
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
            
            # Generate embedding với 768 dimensions
            embedding = generate_embedding_768(text_to_embed)
            
            if embedding:
                # Verify dimension before saving
                if len(embedding) != 768:
                    print(f"   ⚠️ Warning: Embedding has {len(embedding)} dimensions, expected 768")
                
                # Update vào database với cột embedding_768
                supabase.table("tours").update({
                    "embedding_768": embedding
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
    print("\n⚠️ LƯU Ý: Đảm bảo bạn đã thêm cột 'embedding_768' vào bảng 'tours' trong Supabase!")
    print("   SQL: ALTER TABLE tours ADD COLUMN embedding_768 vector(768);")

if __name__ == "__main__":
    print("\n" + "🔮 SENTENCE TRANSFORMER EMBEDDINGS GENERATOR (768D) 🔮".center(60))
    print("=" * 60)
    update_tour_embeddings_768()
    print("\n✨ Script hoàn thành! Bạn có thể test chatbot ngay bây giờ.\n")

