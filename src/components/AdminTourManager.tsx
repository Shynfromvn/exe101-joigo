import { useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTours } from "@/contexts/TourContext";
import type { Tour } from "@/contexts/TourContext";

interface AdminTourManagerProps {
  tour?: Tour;
  onClose: () => void;
  onSuccess: () => void;
  mode: "create" | "edit";
}

const AdminTourManager = ({ tour, onClose, onSuccess, mode }: AdminTourManagerProps) => {
  const { toast } = useToast();
  const { getAccessToken } = useAuth();
  const { language } = useTours();
  const [loading, setLoading] = useState(false);
  
  // State riêng cho images và type text input
  const [imagesText, setImagesText] = useState(
    tour?.images?.join("\n") || ""
  );
  const [typeText, setTypeText] = useState(
    Array.isArray(tour?.type) ? tour.type.join(", ") : tour?.type || ""
  );
  
  const [formData, setFormData] = useState({
    title: tour?.title || "",
    title_en: tour?.title_en || "",
    image: tour?.image || "",
    images: tour?.images || [],
    price: tour?.price || 0,
    rating: tour?.rating || 0,
    reviews: tour?.reviews || 0,
    departure: tour?.departure || "",
    destination: tour?.destination || "",
    transportation: tour?.transportation || "",
    type: (Array.isArray(tour?.type) ? tour.type : tour?.type ? [tour.type] : []) as string[],
    description: tour?.description || "",
    additional_info: tour?.additional_info || "",
    description_en: tour?.description_en || "",
    additional_info_en: tour?.additional_info_en || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error("Vui lòng đăng nhập");
      }

      // Parse images và type từ text thành array
      const imagesArray = imagesText
        .split(/[\n,]+/)
        .map(url => url.trim())
        .filter(url => url !== "");
      
      const typeArray = typeText
        .split(",")
        .map(t => t.trim())
        .filter(t => t !== "");

      const dataToSubmit = {
        ...formData,
        images: imagesArray,
        type: typeArray,
      };

      const url = mode === "create" 
        ? "http://localhost:8000/api/tours" 
        : `http://localhost:8000/api/tours/${tour?.id}`;
      
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Lỗi khi lưu tour");
      }

      toast({
        title: mode === "create" ? "Tạo tour thành công" : "Cập nhật tour thành công",
        variant: "default",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" 
              ? (language === "VI" ? "Tạo Tour Mới" : "Create New Tour")
              : (language === "VI" ? "Chỉnh Sửa Tour" : "Edit Tour")}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Tiêu đề *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="title_en">Tiêu đề (Tiếng Anh)</Label>
              <Input
                id="title_en"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                placeholder="Enter tour title in English..."
              />
            </div>

            <div>
              <Label htmlFor="image">Ảnh đại diện (URL)</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="price">Giá (VNĐ)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="rating">Đánh giá (0-5)</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="reviews">Số lượt đánh giá</Label>
              <Input
                id="reviews"
                type="number"
                min="0"
                value={formData.reviews}
                onChange={(e) => setFormData({ ...formData, reviews: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="departure">Điểm khởi hành</Label>
              <Input
                id="departure"
                value={formData.departure}
                onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="destination">Điểm đến</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="transportation">Phương tiện</Label>
              <Input
                id="transportation"
                value={formData.transportation}
                onChange={(e) => setFormData({ ...formData, transportation: e.target.value })}
                placeholder="Ô tô, Máy bay, Tàu hỏa..."
              />
            </div>

            <div>
              <Label htmlFor="type">Loại hình (ngăn cách bởi dấu phẩy)</Label>
              <Input
                id="type"
                value={typeText}
                onChange={(e) => setTypeText(e.target.value)}
                placeholder="Văn hóa, Ẩm thực, Nghỉ dưỡng"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <Label htmlFor="images">Ảnh phụ (mỗi URL một dòng hoặc cách nhau bởi dấu phẩy)</Label>
            <Textarea
              id="images"
              value={imagesText}
              onChange={(e) => setImagesText(e.target.value)}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;hoặc&#10;https://example.com/image1.jpg, https://example.com/image2.jpg"
              rows={3}
            />
          </div>

          {/* Descriptions */}
          <div>
            <Label htmlFor="description">Mô tả (Tiếng Việt)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Nhập mô tả tour bằng tiếng Việt..."
            />
          </div>

          <div>
            <Label htmlFor="description_en">Mô tả (Tiếng Anh)</Label>
            <Textarea
              id="description_en"
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              rows={4}
              placeholder="Enter tour description in English..."
            />
          </div>

          <div>
            <Label htmlFor="additional_info">Thông tin bổ sung (Tiếng Việt)</Label>
            <Textarea
              id="additional_info"
              value={formData.additional_info}
              onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
              rows={3}
              placeholder="Các thông tin bổ sung về tour (lịch trình, quy định, ghi chú...)"
            />
          </div>

          <div>
            <Label htmlFor="additional_info_en">Thông tin bổ sung (Tiếng Anh)</Label>
            <Textarea
              id="additional_info_en"
              value={formData.additional_info_en}
              onChange={(e) => setFormData({ ...formData, additional_info_en: e.target.value })}
              rows={3}
              placeholder="Additional information about the tour (itinerary, regulations, notes...)"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              {language === "VI" ? "Hủy" : "Cancel"}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading 
                ? (language === "VI" ? "Đang lưu..." : "Saving...")
                : mode === "create"
                ? (language === "VI" ? "Tạo Tour" : "Create Tour")
                : (language === "VI" ? "Cập nhật" : "Update")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminTourManager;
