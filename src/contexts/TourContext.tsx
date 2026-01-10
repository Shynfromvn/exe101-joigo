import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// --- 1. Giữ nguyên Interface (Cấu trúc dữ liệu) ---
export interface Tour {
  id: string;
  image: string;
  images?: string[];
  title: string;
  titleKey?: string;
  rating: number;
  reviews: number;
  price: number;
  type: string | string[];
  departure: string;
  destination: string;
  transportation: string;
  description: string;
  detailedDescription?: string;
  introduction?: string;
  itinerary?: string;
  regulations?: string;
  additionalInfo?: string;
}

interface TourContextType {
  tours: Tour[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currency: "USD" | "VND";
  setCurrency: (currency: "USD" | "VND") => void;
  language: "EN" | "VI";
  setLanguage: (language: "EN" | "VI") => void;
  filters: {
    tourType: string;
    departure: string;
    destination: string;
    transportation: string;
  };
  setFilters: (filters: any) => void;
  filteredTours: Tour[];
  loading: boolean; // Thêm biến này để hiện vòng quay loading nếu cần
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider = ({ children }: { children: ReactNode }) => {
  // --- 2. Thay dữ liệu cứng bằng State ---
  const [tours, setTours] = useState<Tour[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái đang tải

  const [searchQuery, setSearchQuery] = useState("");
  const [currency, setCurrency] = useState<"USD" | "VND">("USD");
  const [language, setLanguage] = useState<"EN" | "VI">("EN");
  
  const [filters, setFilters] = useState({
    tourType: "all",
    departure: "all",
    destination: "all",
    transportation: "all",
  });

  // --- 3. Gọi API từ Backend Python ---
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        // Gọi đến API bạn vừa viết
        const response = await fetch("http://127.0.0.1:8000/api/tours");
        
        if (!response.ok) {
          throw new Error("Không thể kết nối đến server");
        }

        const data = await response.json();

        // --- 4. Quan trọng: Chuyển đổi dữ liệu ---
        // Backend (Python) trả về: title_key, additional_info...
        // Frontend (React) cần: titleKey, additionalInfo...
        const formattedTours: Tour[] = data.map((item: any) => ({
          ...item,
          // Map các trường bị lệch tên
          titleKey: item.title_key,
          detailedDescription: item.detailed_description,
          additionalInfo: item.additional_info,
          // Đảm bảo type luôn là mảng (nếu backend trả về null thì gán mảng rỗng)
          type: item.type || [],
          images: item.images || []
        }));

        setTours(formattedTours);
      } catch (error) {
        console.error("Lỗi khi tải danh sách tour:", error);
      } finally {
        setLoading(false); // Tắt trạng thái loading dù thành công hay thất bại
      }
    };

    fetchTours();
  }, []); // [] nghĩa là chỉ chạy 1 lần khi web vừa load

  // --- 5. Logic lọc tour (Giữ nguyên như cũ) ---
  const filteredTours = tours.filter((tour) => {
    const matchesSearch =
      searchQuery === "" ||
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.destination.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      filters.tourType === "all" ||
      (Array.isArray(tour.type)
        ? tour.type.includes(filters.tourType)
        : tour.type === filters.tourType);
    
    const matchesDeparture =
      filters.departure === "all" || tour.departure === filters.departure;
    const matchesDestination =
      filters.destination === "all" || tour.destination === filters.destination;
    const matchesTransportation =
      filters.transportation === "all" ||
      tour.transportation === filters.transportation;

    return (
      matchesSearch &&
      matchesType &&
      matchesDeparture &&
      matchesDestination &&
      matchesTransportation
    );
  });

  return (
    <TourContext.Provider
      value={{
        tours,
        searchQuery,
        setSearchQuery,
        currency,
        setCurrency,
        language,
        setLanguage,
        filters,
        setFilters,
        filteredTours,
        loading,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTours = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error("useTours must be used within a TourProvider");
  }
  return context;
};