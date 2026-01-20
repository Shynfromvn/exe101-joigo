import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Tour } from "./TourContext";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface WishlistContextType {
  wishlist: Tour[];
  loading: boolean;
  addToWishlist: (tour: Tour) => Promise<void>;
  removeFromWishlist: (tourId: string) => Promise<void>;
  isInWishlist: (tourId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const API_BASE_URL = "http://127.0.0.1:8000";

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, getAccessToken } = useAuth();

  // Load wishlist từ backend khi user đăng nhập
  const refreshWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);
      const token = getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/api/favorites`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Cannot fetch wishlist");

      const result = await response.json();
      
      // Format dữ liệu
      const formattedTours: Tour[] = (result.favorites || []).map((item: any) => ({
        ...item,
        titleKey: item.title_key,
        detailedDescription: item.detailed_description,
        additionalInfo: item.additional_info,
        type: item.type || [],
        images: item.images || []
      }));

      setWishlist(formattedTours);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load wishlist khi user login
  useEffect(() => {
    refreshWishlist();
  }, [user]);

  const addToWishlist = async (tour: Tour) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm tour yêu thích");
      return;
    }

    try {
      const token = getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/api/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ tour_id: tour.id }),
      });

      if (!response.ok) throw new Error("Cannot add to wishlist");

      const result = await response.json();
      
      // Refresh wishlist
      await refreshWishlist();
      
      toast.success(`Đã thêm "${tour.title}" vào danh sách yêu thích! ❤️`);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const removeFromWishlist = async (tourId: string) => {
    if (!user) return;

    try {
      const token = getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/api/favorites/${tourId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Cannot remove from wishlist");

      // Refresh wishlist
      await refreshWishlist();
      
      toast.success("Đã xóa khỏi danh sách yêu thích");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const isInWishlist = (tourId: string) => {
    return wishlist.some((tour) => tour.id === tourId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};