import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, ArrowLeft, MapPin, Clock, Calendar, Phone, Mail, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useTours } from "@/contexts/TourContext";

// Booking interface matching the backend response
interface Booking {
  id: string;
  user_id: string;
  tour_id: string;
  full_name: string;
  email: string;
  phone: string;
  message: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  booking_date: string;
  tours: {
    title: string;
    image: string;
    price: number;
    duration: string | null;
    location: string;
    departure?: string;
    destination?: string;
  } | null;
}

const MyBookings = () => {
  const { user } = useAuth();
  const { language, currency } = useTours();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookings when user is available
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) {
        console.log("No user ID, skipping fetch");
        setLoading(false);
        setBookings([]);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Sử dụng URL đúng với fallback
        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
        const url = `${apiUrl}/api/bookings/my-bookings?user_id=${user.id}`;
        
        console.log("🔍 Fetching bookings from:", url);
        console.log("👤 User ID:", user.id);
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).catch((networkError) => {
          // Xử lý lỗi network (backend không chạy, CORS, etc.)
          console.error("❌ Network error:", networkError);
          throw new Error(
            language === "VI" 
              ? "Không thể kết nối đến server. Vui lòng kiểm tra xem backend có đang chạy không."
              : "Cannot connect to server. Please check if the backend is running."
          );
        });
        
        console.log("📡 Response status:", response.status, response.statusText);
        
        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            errorData = { detail: `HTTP ${response.status}: ${response.statusText}` };
          }
          console.error("❌ API Error:", errorData);
          throw new Error(
            errorData.detail || 
            (language === "VI" 
              ? `Lỗi từ server: ${response.status} ${response.statusText}`
              : `Server error: ${response.status} ${response.statusText}`)
          );
        }
        
        const data = await response.json();
        console.log("✅ Bookings data received:", data);
        
        // Đảm bảo data là một mảng
        const bookingsArray = Array.isArray(data) ? data : [];
        console.log(`📋 Found ${bookingsArray.length} bookings`);
        setBookings(bookingsArray);
      } catch (err) {
        console.error("❌ Error fetching bookings:", err);
        let errorMessage: string;
        
        if (err instanceof TypeError && err.message.includes("fetch")) {
          // Network error
          errorMessage = language === "VI" 
            ? "Không thể kết nối đến server. Vui lòng kiểm tra xem backend có đang chạy tại http://127.0.0.1:8000 không."
            : "Cannot connect to server. Please check if the backend is running at http://127.0.0.1:8000";
        } else if (err instanceof Error) {
          errorMessage = err.message;
        } else {
          errorMessage = language === "VI" 
            ? "Không thể tải lịch sử đặt tour. Vui lòng thử lại sau." 
            : "Failed to load booking history. Please try again later.";
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.id, language]);

  // Status badge color and text
  const getStatusBadge = (status: Booking["status"]) => {
    const statusConfig = {
      pending: {
        variant: "secondary" as const,
        text: language === "VI" ? "Chờ xác nhận" : "Pending",
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      },
      confirmed: {
        variant: "default" as const,
        text: language === "VI" ? "Đã xác nhận" : "Confirmed",
        className: "bg-green-100 text-green-800 hover:bg-green-100",
      },
      cancelled: {
        variant: "destructive" as const,
        text: language === "VI" ? "Đã hủy" : "Cancelled",
        className: "bg-red-100 text-red-800 hover:bg-red-100",
      },
      completed: {
        variant: "outline" as const,
        text: language === "VI" ? "Hoàn thành" : "Completed",
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.text}
      </Badge>
    );
  };

  // Format price
  const formatPrice = (price: number) => {
    return currency === "VND" 
      ? `${(price * 23000).toLocaleString()}₫` 
      : `$${price}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "PPP", { locale: language === "VI" ? vi : enUS });
  };

  // If not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <CalendarCheck className="w-24 h-24 mx-auto text-muted-foreground/30 mb-4" />
            <h1 className="text-3xl font-bold mb-4">
              {language === "VI" ? "Đăng nhập để xem lịch sử đặt tour" : "Login to View Your Bookings"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {language === "VI" 
                ? "Bạn cần đăng nhập để xem danh sách các tour đã đặt."
                : "You need to login to view your booking history."}
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/login">
                <Button size="lg">
                  {language === "VI" ? "Đăng nhập" : "Login"}
                </Button>
              </Link>
              <Link to="/tours">
                <Button variant="outline" size="lg">
                  {language === "VI" ? "Xem Tours" : "Browse Tours"}
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">
            {language === "VI" ? "Trang chủ" : "Home"}
          </Link>
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <span className="text-foreground font-medium">
            {language === "VI" ? "Lịch sử đặt tour" : "My Bookings"}
          </span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
              <CalendarCheck className="text-primary" />
              {language === "VI" ? "Lịch sử đặt tour" : "My Bookings"}
            </h1>
            <p className="text-muted-foreground">
              {loading 
                ? (language === "VI" ? "Đang tải..." : "Loading...")
                : `${bookings.length} ${language === "VI" ? "đơn đặt tour" : bookings.length === 1 ? "booking" : "bookings"}`
              }
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">
              {language === "VI" ? "Đang tải lịch sử đặt tour..." : "Loading your bookings..."}
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <CalendarCheck className="w-24 h-24 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-destructive">
              {language === "VI" ? "Có lỗi xảy ra" : "Something went wrong"}
            </h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={async () => {
                setError(null);
                setLoading(true);
                
                if (!user?.id) {
                  setError(language === "VI" 
                    ? "Bạn chưa đăng nhập. Vui lòng đăng nhập để xem lịch sử đặt tour."
                    : "You are not logged in. Please login to view your booking history.");
                  setLoading(false);
                  return;
                }
                
                try {
                  const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
                  const url = `${apiUrl}/api/bookings/my-bookings?user_id=${user.id}`;
                  
                  console.log("🔄 Retrying fetch from:", url);
                  
                  const response = await fetch(url, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }).catch((networkError) => {
                    console.error("❌ Network error on retry:", networkError);
                    throw new Error(
                      language === "VI" 
                        ? "Không thể kết nối đến server. Vui lòng kiểm tra xem backend có đang chạy không."
                        : "Cannot connect to server. Please check if the backend is running."
                    );
                  });
                  
                  if (!response.ok) {
                    let errorData;
                    try {
                      errorData = await response.json();
                    } catch {
                      errorData = { detail: `HTTP ${response.status}: ${response.statusText}` };
                    }
                    throw new Error(
                      errorData.detail || 
                      (language === "VI" 
                        ? `Lỗi từ server: ${response.status}`
                        : `Server error: ${response.status}`)
                    );
                  }
                  
                  const data = await response.json();
                  const bookingsArray = Array.isArray(data) ? data : [];
                  setBookings(bookingsArray);
                  setError(null);
                } catch (err) {
                  console.error("❌ Error on retry:", err);
                  let errorMessage: string;
                  
                  if (err instanceof TypeError && err.message.includes("fetch")) {
                    errorMessage = language === "VI" 
                      ? "Không thể kết nối đến server. Vui lòng kiểm tra xem backend có đang chạy tại http://127.0.0.1:8000 không."
                      : "Cannot connect to server. Please check if the backend is running at http://127.0.0.1:8000";
                  } else if (err instanceof Error) {
                    errorMessage = err.message;
                  } else {
                    errorMessage = language === "VI" 
                      ? "Không thể tải lịch sử đặt tour. Vui lòng thử lại sau." 
                      : "Failed to load booking history. Please try again later.";
                  }
                  
                  setError(errorMessage);
                } finally {
                  setLoading(false);
                }
              }}>
                {language === "VI" ? "Thử lại" : "Try Again"}
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                {language === "VI" ? "Tải lại trang" : "Reload Page"}
              </Button>
            </div>
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row">
                  {/* Tour Image */}
                  {booking.tours && (
                    <div className="md:w-72 h-48 md:h-auto flex-shrink-0">
                      <Link to={`/tours/${booking.tour_id}`}>
                        <img
                          src={booking.tours.image}
                          alt={booking.tours.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    </div>
                  )}
                  
                  {/* Booking Details */}
                  <div className="flex-1 p-6">
                    <CardHeader className="p-0 mb-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          {booking.tours ? (
                            <Link 
                              to={`/tours/${booking.tour_id}`}
                              className="text-xl font-bold hover:text-primary transition-colors"
                            >
                              {booking.tours.title}
                            </Link>
                          ) : (
                            <span className="text-xl font-bold text-muted-foreground">
                              {language === "VI" ? "Tour không còn tồn tại" : "Tour no longer available"}
                            </span>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            {language === "VI" ? "Mã đơn:" : "Booking ID:"} {booking.id.slice(0, 8)}...
                          </p>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-0">
                      {/* Tour Info */}
                      {booking.tours && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 pb-4 border-b">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground">{booking.tours.location}</span>
                          </div>
                          {booking.tours.duration && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-muted-foreground">{booking.tours.duration}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <span className="text-primary">{formatPrice(booking.tours.price)}</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Contact Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span>
                            {language === "VI" ? "Ngày đặt:" : "Booked on:"} {formatDate(booking.booking_date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span>{booking.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span>{booking.email}</span>
                        </div>
                        {booking.message && (
                          <div className="flex items-start gap-2 text-sm sm:col-span-2">
                            <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground italic">"{booking.message}"</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {booking.tours && (
                          <Link to={`/tours/${booking.tour_id}`}>
                            <Button variant="outline" size="sm">
                              {language === "VI" ? "Xem chi tiết tour" : "View Tour Details"}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <CalendarCheck className="w-24 h-24 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {language === "VI" ? "Chưa có đơn đặt tour nào" : "No Bookings Yet"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === "VI"
                ? "Khám phá và đặt những tour tuyệt vời ngay hôm nay!"
                : "Explore and book amazing tours today!"}
            </p>
            <Link to="/tours">
              <Button size="lg">
                {language === "VI" ? "Khám phá tours" : "Browse Tours"}
              </Button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyBookings;
