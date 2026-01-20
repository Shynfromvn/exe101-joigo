-- SQL Script để cập nhật Supabase cho embeddings 1024 dimensions
-- Chạy script này trong Supabase SQL Editor

-- Thêm cột embedding_1024 vào bảng tours (nếu chưa có)
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS embedding_1024 vector(1024);

