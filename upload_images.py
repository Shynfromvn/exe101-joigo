import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv
load_dotenv()

# --- 1. CẤU HÌNH (Điền thông tin của bạn vào đây) ---
cloudinary.config(
  cloud_name = "dczdnu2ba",        # Tên Cloud của bạn (đã điền sẵn theo ảnh)
  api_key = os.getenv("API_KEY"),     # <--- PASTE API KEY VÀO ĐÂY (dãy số)
  api_secret = os.getenv("API_SECRET"), # <--- PASTE API SECRET VÀO ĐÂY (dãy ký tự dài)
  secure = True
)

# --- 2. Đường dẫn đến folder ảnh ---
# Vì file này nằm ở root, nên đường dẫn vào assets là ./src/assets
folder_path = "./src/assets" 

print(f"--- Đang quét ảnh trong thư mục: {folder_path} ---")

# Dict để lưu kết quả: tên file -> link online
image_map = {}

# Kiểm tra xem thư mục có tồn tại không
if not os.path.exists(folder_path):
    print(f"❌ Lỗi: Không tìm thấy thư mục {folder_path}")
    exit()

# --- 3. Duyệt file và Upload ---
count = 0
for filename in os.listdir(folder_path):
    # Chỉ lấy các file ảnh
    if filename.lower().endswith((".jpg", ".png", ".jpeg", ".webp")):
        file_path = os.path.join(folder_path, filename)
        
        try:
            print(f"Đang upload: {filename}...")
            
            # Upload lên Cloudinary
            # use_filename=True: giữ tên file gốc (ví dụ: van-mieu.jpg)
            # unique_filename=False: không thêm ký tự ngẫu nhiên vào tên
            response = cloudinary.uploader.upload(file_path, use_filename=True, unique_filename=False)
            
            url = response['secure_url']
            image_map[filename] = url
            count += 1
            print(f"✅ Xong: {url}")
            
        except Exception as e:
            print(f"❌ Lỗi file {filename}: {e}")

# --- 4. In kết quả để copy vào SQL ---
print("\n" + "="*50)
print(f"ĐÃ UPLOAD THÀNH CÔNG {count} ẢNH")
print("Copy đoạn dưới đây để thay vào file SQL Insert:")
print("="*50 + "\n")

for name, url in image_map.items():
    print(f"'{name}': '{url}',")

print("\n" + "="*50)