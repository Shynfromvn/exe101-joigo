import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, ArrowLeft, Users, MessageSquare, CalendarCheck, 
  Eye, TrendingUp, CheckCircle, Clock, XCircle, Edit
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useTours } from "@/contexts/TourContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

interface DashboardStats {
  consultations: {
    total: number;
    pending: number;
    completed: number;
  };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
  };
  visitors: {
    total: number;
    today: number;
  };
  tour_views: {
    total: number;
    top_tours: Array<{
      tour_id: string;
      title: string;
      image: string;
      views: number;
    }>;
  };
}

interface Consultation {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  message: string | null;
  status: string;
  created_at: string;
  tour_id: string | null;
}

interface Booking {
  id: string;
  user_id: string;
  tour_id: string;
  full_name: string;
  email: string;
  phone: string;
  message: string | null;
  status: string;
  booking_date: string;
  tours: {
    title: string;
    image: string;
    price: number;
    location: string;
  } | null;
  profiles: {
    email: string;
    name: string;
  } | null;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { language } = useTours();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'consultations' | 'bookings'>('consultations');

  // Kiểm tra quyền admin
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== 'admin') {
      toast.error(language === "VI" ? "Bạn không có quyền truy cập" : "You don't have permission");
      navigate("/");
      return;
    }
  }, [user, navigate, language]);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user || user.role !== 'admin') return;
      
      try {
        const token = localStorage.getItem('sb-access-token') || 
                     (await import('@/lib/supabase')).supabase.auth.getSession().then(r => r.data.session?.access_token);
        
        const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
          headers: {
            "Authorization": `Bearer ${typeof token === 'string' ? token : await token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error(language === "VI" ? "Không thể tải thống kê" : "Failed to load stats");
      }
    };

    fetchStats();
  }, [user, language]);

  // Fetch consultations
  const fetchConsultations = async () => {
    if (!user || user.role !== 'admin') return;
    
    try {
      const session = await (await import('@/lib/supabase')).supabase.auth.getSession();
      const token = session.data.session?.access_token;
      
      if (!token) {
        toast.error(language === "VI" ? "Vui lòng đăng nhập lại" : "Please login again");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/consultations`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch consultations");
      }

      const data = await response.json();
      setConsultations(data.data || []);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      toast.error(language === "VI" ? "Không thể tải consultations" : "Failed to load consultations");
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings
  const fetchBookings = async () => {
    if (!user || user.role !== 'admin') return;
    
    try {
      const session = await (await import('@/lib/supabase')).supabase.auth.getSession();
      const token = session.data.session?.access_token;
      
      if (!token) {
        toast.error(language === "VI" ? "Vui lòng đăng nhập lại" : "Please login again");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/bookings`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error(language === "VI" ? "Không thể tải bookings" : "Failed to load bookings");
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchConsultations();
      fetchBookings();
    }
  }, [user, activeTab]);

  // Update consultation status
  const updateConsultationStatus = async (id: string, status: string) => {
    try {
      const session = await (await import('@/lib/supabase')).supabase.auth.getSession();
      const token = session.data.session?.access_token;
      
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/admin/consultations/${id}/status`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      toast.success(language === "VI" ? "Đã cập nhật trạng thái" : "Status updated");
      fetchConsultations();
      if (stats) {
        // Refresh stats
        const statsResponse = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(language === "VI" ? "Không thể cập nhật trạng thái" : "Failed to update status");
    }
  };

  // Update booking status
  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const session = await (await import('@/lib/supabase')).supabase.auth.getSession();
      const token = session.data.session?.access_token;
      
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/admin/bookings/${id}/status`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      toast.success(language === "VI" ? "Đã cập nhật trạng thái" : "Status updated");
      fetchBookings();
      if (stats) {
        // Refresh stats
        const statsResponse = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(language === "VI" ? "Không thể cập nhật trạng thái" : "Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", text: string, className: string }> = {
      pending: {
        variant: "secondary",
        text: language === "VI" ? "Chờ xử lý" : "Pending",
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      },
      processing: {
        variant: "default",
        text: language === "VI" ? "Đang xử lý" : "Processing",
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      },
      completed: {
        variant: "default",
        text: language === "VI" ? "Hoàn thành" : "Completed",
        className: "bg-green-100 text-green-800 hover:bg-green-100",
      },
      confirmed: {
        variant: "default",
        text: language === "VI" ? "Đã xác nhận" : "Confirmed",
        className: "bg-green-100 text-green-800 hover:bg-green-100",
      },
      cancelled: {
        variant: "destructive",
        text: language === "VI" ? "Đã hủy" : "Cancelled",
        className: "bg-red-100 text-red-800 hover:bg-red-100",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.text}
      </Badge>
    );
  };

  if (!user || user.role !== 'admin') {
    return null;
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
            {language === "VI" ? "Dashboard" : "Dashboard"}
          </span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
              <LayoutDashboard className="text-primary" />
              {language === "VI" ? "Admin Dashboard" : "Admin Dashboard"}
            </h1>
            <p className="text-muted-foreground">
              {language === "VI" ? "Quản lý và theo dõi hệ thống" : "Manage and monitor the system"}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === "VI" ? "Tổng Consultations" : "Total Consultations"}
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.consultations.total}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.consultations.pending} {language === "VI" ? "chờ xử lý" : "pending"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === "VI" ? "Tổng Bookings" : "Total Bookings"}
                </CardTitle>
                <CalendarCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.bookings.total}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.bookings.pending} {language === "VI" ? "chờ xử lý" : "pending"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === "VI" ? "Tổng Visitors" : "Total Visitors"}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.visitors.total}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.visitors.today} {language === "VI" ? "hôm nay" : "today"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === "VI" ? "Tổng lượt xem" : "Total Views"}
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.tour_views.total}</div>
                <p className="text-xs text-muted-foreground">
                  {language === "VI" ? "lượt xem tours" : "tour views"}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top Tours */}
        {stats && stats.tour_views.top_tours.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{language === "VI" ? "Top Tours được xem nhiều nhất" : "Top Viewed Tours"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.tour_views.top_tours.map((tour) => (
                  <div key={tour.tour_id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {tour.image && (
                        <img src={tour.image} alt={tour.title} className="w-16 h-16 object-cover rounded" />
                      )}
                      <div>
                        <p className="font-medium">{tour.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {tour.views} {language === "VI" ? "lượt xem" : "views"}
                        </p>
                      </div>
                    </div>
                    <Link to={`/tours/${tour.tour_id}`}>
                      <Button variant="outline" size="sm">
                        {language === "VI" ? "Xem" : "View"}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeTab === 'consultations' ? 'default' : 'outline'}
            onClick={() => setActiveTab('consultations')}
          >
            {language === "VI" ? "Consultations" : "Consultations"}
          </Button>
          <Button
            variant={activeTab === 'bookings' ? 'default' : 'outline'}
            onClick={() => setActiveTab('bookings')}
          >
            {language === "VI" ? "Bookings" : "Bookings"}
          </Button>
        </div>

        {/* Consultations Table */}
        {activeTab === 'consultations' && (
          <Card>
            <CardHeader>
              <CardTitle>{language === "VI" ? "Danh sách Consultations" : "Consultations List"}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : consultations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {language === "VI" ? "Không có consultations nào" : "No consultations"}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === "VI" ? "Tên" : "Name"}</TableHead>
                        <TableHead>{language === "VI" ? "Email" : "Email"}</TableHead>
                        <TableHead>{language === "VI" ? "Số điện thoại" : "Phone"}</TableHead>
                        <TableHead>{language === "VI" ? "Ngày tạo" : "Created"}</TableHead>
                        <TableHead>{language === "VI" ? "Trạng thái" : "Status"}</TableHead>
                        <TableHead>{language === "VI" ? "Thao tác" : "Actions"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {consultations.map((consultation) => (
                        <TableRow key={consultation.id}>
                          <TableCell>{consultation.full_name}</TableCell>
                          <TableCell>{consultation.email}</TableCell>
                          <TableCell>{consultation.phone}</TableCell>
                          <TableCell>
                            {format(new Date(consultation.created_at), "PPP", { 
                              locale: language === "VI" ? vi : enUS 
                            })}
                          </TableCell>
                          <TableCell>{getStatusBadge(consultation.status)}</TableCell>
                          <TableCell>
                            <Select
                              value={consultation.status}
                              onValueChange={(value) => updateConsultationStatus(consultation.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">{language === "VI" ? "Chờ xử lý" : "Pending"}</SelectItem>
                                <SelectItem value="processing">{language === "VI" ? "Đang xử lý" : "Processing"}</SelectItem>
                                <SelectItem value="completed">{language === "VI" ? "Hoàn thành" : "Completed"}</SelectItem>
                                <SelectItem value="cancelled">{language === "VI" ? "Đã hủy" : "Cancelled"}</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Bookings Table */}
        {activeTab === 'bookings' && (
          <Card>
            <CardHeader>
              <CardTitle>{language === "VI" ? "Danh sách Bookings" : "Bookings List"}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {language === "VI" ? "Không có bookings nào" : "No bookings"}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === "VI" ? "Tour" : "Tour"}</TableHead>
                        <TableHead>{language === "VI" ? "Khách hàng" : "Customer"}</TableHead>
                        <TableHead>{language === "VI" ? "Email" : "Email"}</TableHead>
                        <TableHead>{language === "VI" ? "Ngày đặt" : "Booking Date"}</TableHead>
                        <TableHead>{language === "VI" ? "Trạng thái" : "Status"}</TableHead>
                        <TableHead>{language === "VI" ? "Thao tác" : "Actions"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            {booking.tours ? (
                              <div className="flex items-center gap-2">
                                {booking.tours.image && (
                                  <img src={booking.tours.image} alt={booking.tours.title} className="w-10 h-10 object-cover rounded" />
                                )}
                                <span className="font-medium">{booking.tours.title}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>{booking.full_name}</TableCell>
                          <TableCell>{booking.email}</TableCell>
                          <TableCell>
                            {format(new Date(booking.booking_date), "PPP", { 
                              locale: language === "VI" ? vi : enUS 
                            })}
                          </TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>
                            <Select
                              value={booking.status}
                              onValueChange={(value) => updateBookingStatus(booking.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">{language === "VI" ? "Chờ xử lý" : "Pending"}</SelectItem>
                                <SelectItem value="confirmed">{language === "VI" ? "Đã xác nhận" : "Confirmed"}</SelectItem>
                                <SelectItem value="completed">{language === "VI" ? "Hoàn thành" : "Completed"}</SelectItem>
                                <SelectItem value="cancelled">{language === "VI" ? "Đã hủy" : "Cancelled"}</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
