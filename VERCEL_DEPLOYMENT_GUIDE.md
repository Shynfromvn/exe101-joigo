# Hướng Dẫn Deploy Lên Vercel và Cấu Hình Supabase

## Vấn Đề: Chỉ Bạn Vào Được, Bạn Bè Không Vào Được

Vấn đề này thường xảy ra do **Supabase Redirect URLs chưa được cấu hình đúng** cho domain Vercel của bạn.

## Giải Pháp

### Bước 1: Cấu Hình Supabase Redirect URLs

1. **Truy cập Supabase Dashboard:**
   - Vào [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Chọn project của bạn

2. **Vào Authentication Settings:**
   - Click vào **Authentication** ở sidebar bên trái
   - Click vào **URL Configuration**

3. **Thêm Redirect URLs:**
   - Tìm phần **Redirect URLs**
   - Thêm các URL sau (thay `your-vercel-domain` bằng domain Vercel thực tế của bạn):
   
   ```
   https://your-vercel-domain.vercel.app/**
   https://your-vercel-domain.vercel.app
   https://your-vercel-domain.vercel.app/*
   ```
   
   **Lưu ý:** Nếu bạn có custom domain, cũng thêm:
   ```
   https://your-custom-domain.com/**
   https://www.your-custom-domain.com/**
   ```

4. **Site URL:**
   - Đảm bảo **Site URL** được set đúng:
   ```
   https://your-vercel-domain.vercel.app
   ```
   hoặc custom domain của bạn

5. **Lưu lại:**
   - Click **Save** để lưu cấu hình

### Bước 2: Cấu Hình Environment Variables Trên Vercel

1. **Truy cập Vercel Dashboard:**
   - Vào project trên Vercel
   - Click vào **Settings** → **Environment Variables**

2. **Thêm các biến môi trường sau:**

   | Name | Value | Environment |
   |------|-------|-------------|
   | `VITE_SUPABASE_URL` | URL từ Supabase Dashboard → Settings → API | Production, Preview, Development |
   | `VITE_SUPABASE_ANON_KEY` | Anon Key từ Supabase Dashboard → Settings → API | Production, Preview, Development |
   | `VITE_API_URL` | URL backend của bạn (nếu có) | Production, Preview, Development |

3. **Lưu ý:**
   - Chọn tất cả environments (Production, Preview, Development)
   - Sau khi thêm, Vercel sẽ tự động redeploy

### Bước 3: Kiểm Tra Google OAuth Configuration

Nếu bạn sử dụng Google OAuth:

1. **Vào Google Cloud Console:**
   - [https://console.cloud.google.com](https://console.cloud.google.com)
   - Chọn project của bạn

2. **Vào APIs & Services → Credentials:**
   - Tìm OAuth 2.0 Client ID của bạn
   - Click **Edit**

3. **Thêm Authorized redirect URIs:**
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
   
   (URL này có thể tìm thấy trong Supabase Dashboard → Authentication → Providers → Google)

### Bước 4: Redeploy Trên Vercel

Sau khi cấu hình xong:

1. Vào **Deployments** trên Vercel
2. Click vào deployment mới nhất
3. Click **Redeploy** (nếu cần)

Hoặc push một commit mới lên GitHub để trigger auto-deploy.

## Kiểm Tra

Sau khi cấu hình xong, hãy kiểm tra:

1. **Mở website trên Vercel** (không phải localhost)
2. **Thử đăng nhập bằng Google**
3. **Kiểm tra xem có redirect về đúng domain không**

## Lỗi Thường Gặp

### Lỗi: "redirect_uri_mismatch"
- **Nguyên nhân:** Redirect URL chưa được thêm vào Supabase
- **Giải pháp:** Thêm đúng URL vào Supabase Redirect URLs

### Lỗi: "ERR_CONNECTION_REFUSED" khi redirect về localhost
- **Nguyên nhân:** Supabase đang redirect về localhost thay vì domain Vercel
- **Giải pháp:** Kiểm tra lại Site URL và Redirect URLs trong Supabase

### Chỉ bạn vào được, người khác không vào được
- **Nguyên nhân:** Có thể do:
  1. Supabase Redirect URLs chưa được cấu hình đúng
  2. Environment variables chưa được set trên Vercel
  3. CORS chưa được cấu hình đúng
- **Giải pháp:** Làm theo các bước trên

## Hỗ Trợ

Nếu vẫn gặp vấn đề, hãy kiểm tra:
- Console của browser (F12) để xem lỗi cụ thể
- Network tab để xem request nào bị fail
- Supabase Logs để xem lỗi từ phía backend
