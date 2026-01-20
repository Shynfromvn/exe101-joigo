# Hướng dẫn sử dụng Embeddings 1024 Dimensions

## Tổng quan

File này hướng dẫn cách tạo và sử dụng embeddings với 1024 chiều bằng SentenceTransformer.

## Các bước thực hiện

### Bước 1: Cài đặt dependencies

Đảm bảo bạn đã cài đặt các package cần thiết:

```bash
pip install sentence-transformers torch
```

### Bước 2: Cập nhật Supabase Database

1. Mở Supabase Dashboard → SQL Editor
2. Chạy script trong file `supabase_update_1024.sql`:
   - Thêm cột `embedding_1024` vào bảng `tours`
   - Tạo hoặc cập nhật function `match_tours` để sử dụng `embedding_1024`
   - (Optional) Tạo index để tăng tốc độ tìm kiếm

### Bước 3: Generate embeddings mới

Chạy script để tạo embeddings 1024 dimensions cho tất cả tours:

```bash
cd backend
python generate_embedding_new.py
```

Script sẽ:
- Load model `thenlper/gte-large` (1024 dimensions)
- Lấy tất cả tours từ database
- Generate embeddings mới cho mỗi tour
- Lưu vào cột `embedding_1024` trong database

### Bước 4: Kiểm tra chat.py

File `chat.py` đã được cập nhật để:
- Sử dụng model `thenlper/gte-large` (1024 dimensions)
- Tạo query embeddings với 1024 dimensions
- Gọi function `match_tours` trong Supabase (cần đảm bảo function này sử dụng `embedding_1024`)

## Lưu ý quan trọng

1. **Model dimension**: Model `thenlper/gte-large` tạo embeddings với 1024 dimensions. Nếu model này không hoạt động, bạn có thể thử:
   - `intfloat/multilingual-e5-large` (1024 dimensions, hỗ trợ đa ngôn ngữ tốt hơn)
   - Hoặc concatenate 2 embeddings 512 dimensions để có 1024

2. **Supabase function**: Đảm bảo function `match_tours` trong Supabase sử dụng cột `embedding_1024` thay vì `embedding`. Nếu không, bạn cần:
   - Cập nhật function hiện tại, hoặc
   - Tạo function mới `match_tours_1024` và cập nhật `chat.py` để gọi function này

3. **Performance**: Việc tạo embeddings có thể mất thời gian, đặc biệt khi có nhiều tours. Hãy kiên nhẫn!

## Troubleshooting

### Lỗi: "different vector dimensions 768 and 1024"
- **Nguyên nhân**: Query embedding có 768 dimensions nhưng database có 1024 dimensions (hoặc ngược lại)
- **Giải pháp**: Đảm bảo cả query embedding và database embeddings đều sử dụng cùng một model và có cùng số chiều

### Lỗi: "column embedding_1024 does not exist"
- **Nguyên nhân**: Cột `embedding_1024` chưa được tạo trong database
- **Giải pháp**: Chạy script SQL trong `supabase_update_1024.sql`

### Lỗi: "function match_tours does not exist"
- **Nguyên nhân**: Function `match_tours` chưa được tạo hoặc chưa được cập nhật
- **Giải pháp**: Chạy script SQL trong `supabase_update_1024.sql` để tạo/cập nhật function

## Kiểm tra kết quả

Sau khi hoàn thành các bước trên:

1. Kiểm tra embeddings đã được tạo:
   ```sql
   SELECT id, title, array_length(embedding_1024, 1) as dimension 
   FROM tours 
   WHERE embedding_1024 IS NOT NULL 
   LIMIT 5;
   ```
   Kết quả phải hiển thị dimension = 1024

2. Test chatbot để đảm bảo semantic search hoạt động đúng

