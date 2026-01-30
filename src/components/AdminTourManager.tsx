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
  const [formData, setFormData] = useState({
    title: tour?.title || "",
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
    detailedDescription: tour?.detailedDescription || "",
    introduction: tour?.introduction || "",
    itinerary: tour?.itinerary || "",
    regulations: tour?.regulations || "",
    additionalInfo: tour?.additionalInfo || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error("Vui lòng đăng nhập");
      }

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
        body: JSON.stringify(formData),
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

  const handleImagesChange = (value: string) => {
    const imagesArray = value.split("\n").filter(url => url.trim() !== "");
    setFormData({ ...formData, images: imagesArray });
  };

  const handleTypeChange = (value: string) => {
    const typeArray = value.split(",").map(t => t.trim()).filter(t => t !== "");
    setFormData({ ...formData, type: typeArray });
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
                value={formData.type?.join(", ")}
                onChange={(e) => handleTypeChange(e.target.value)}
                placeholder="Văn hóa, Ẩm thực, Nghỉ dưỡng"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <Label htmlFor="images">Ảnh phụ (mỗi URL một dòng)</Label>
            <Textarea
              id="images"
              value={formData.images?.join("\n")}
              onChange={(e) => handleImagesChange(e.target.value)}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              rows={3}
            />
          </div>

          {/* Descriptions */}
          <div>
            <Label htmlFor="description">Mô tả ngắn</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="introduction">Giới thiệu</Label>
            <Textarea
              id="introduction"
              value={formData.introduction}
              onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="detailed_description">Mô tả chi tiết</Label>
            <Textarea
              id="detailed_description"
              value={formData.detailedDescription}
              onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="itinerary">Lịch trình</Label>
            <Textarea
              id="itinerary"
              value={formData.itinerary}
              onChange={(e) => setFormData({ ...formData, itinerary: e.target.value })}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="regulations">Quy định</Label>
            <Textarea
              id="regulations"
              value={formData.regulations}
              onChange={(e) => setFormData({ ...formData, regulations: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="additional_info">Thông tin bổ sung</Label>
            <Textarea
              id="additional_info"
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              rows={2}
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
