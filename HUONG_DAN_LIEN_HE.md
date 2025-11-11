# Hướng dẫn cấu hình Floating Contact (Nút liên hệ nổi)

## 📍 Vị trí file cần chỉnh sửa
`src/components/FloatingContact.tsx`

## 🔧 Cách cấu hình

### 1️⃣ Cấu hình Zalo

Mở file `FloatingContact.tsx` và tìm dòng:
```typescript
const zaloPhone = "0987654321"; // Số điện thoại Zalo
```

Thay số điện thoại bằng số Zalo của bạn (VD: "0912345678")

**Lưu ý:** 
- Phải là số điện thoại đã đăng ký Zalo
- Không cần dấu cách hoặc ký tự đặc biệt
- Giữ nguyên dấu ngoặc kép

---

### 2️⃣ Cấu hình Messenger

#### Cách 1: Sử dụng Username của Facebook Page

Nếu page của bạn có username (VD: facebook.com/joigotravel), sử dụng:
```typescript
const facebookPageId = "joigotravel";
```

#### Cách 2: Sử dụng Page ID

**Bước 1:** Lấy Facebook Page ID
1. Vào trang Facebook Page của bạn
2. Click vào "About" (Giới thiệu)
3. Cuộn xuống phần "More Info" (Thông tin khác)
4. Tìm "Page ID" (ID trang) - sẽ là một dãy số (VD: 100063549876543)

**Bước 2:** Thay vào code
```typescript
const facebookPageId = "100063549876543"; // Thay bằng Page ID thực tế
```

---

## 📱 Kiểm tra hoạt động

Sau khi thay đổi:
1. Save file (Ctrl + S)
2. Reload trang web
3. Click vào nút liên hệ ở góc phải màn hình
4. Thử click vào nút Zalo và Messenger để kiểm tra

---

## 🎨 Tùy chỉnh thêm (Optional)

### Thay đổi vị trí nút
Tìm class trong file:
```typescript
<div className="fixed bottom-6 right-6 z-50...">
```

- `bottom-6`: Khoảng cách từ đáy (thay bằng bottom-4, bottom-8, etc.)
- `right-6`: Khoảng cách từ phải (thay bằng right-4, right-8, etc.)
- Muốn đặt bên trái: đổi `right-6` → `left-6`

### Thay đổi màu nút chính
Tìm class:
```typescript
bg-gradient-to-br from-primary to-primary-hover
```

Có thể đổi thành:
- `bg-green-500` (màu xanh lá)
- `bg-blue-500` (màu xanh dương)
- `bg-purple-500` (màu tím)

---

## ❓ Câu hỏi thường gặp

**Q: Làm sao biết link Zalo/Messenger có hoạt động?**
A: Click vào nút và kiểm tra xem có mở đúng trang chat không.

**Q: Tôi không có Facebook Page?**
A: Bạn có thể tạo trang Facebook Business miễn phí tại: https://www.facebook.com/pages/create

**Q: Có thể thêm nút WhatsApp/Telegram không?**
A: Có! Liên hệ để được hướng dẫn thêm.

---

## 📞 Hỗ trợ
Nếu gặp khó khăn, hãy liên hệ để được hỗ trợ!
