import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import {
  ChevronLeft,
  Star,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  ChevronRight,
  Heart,
  Edit2,
  Trash2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import AdminTourManager from "@/components/AdminTourManager";
import { useTours } from "@/contexts/TourContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast as sonnerToast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { QRCodeSVG } from "qrcode.react";

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tours, currency, language, fetchTours } = useTours();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user, getAccessToken } = useAuth();
  const { toast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAllPhotosOpen, setIsAllPhotosOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showAdminManager, setShowAdminManager] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Booking Modal States
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  const tour = tours.find((t) => t.id === id);
  
  // Check if tour is in wishlist
  const inWishlist = tour ? isInWishlist(tour.id) : false;

  const handleWishlistToggle = () => {
    if (tour) {
      if (inWishlist) {
        removeFromWishlist(tour.id);
      } else {
        addToWishlist(tour);
      }
    }
  };

  // Handle Booking Form Submit
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBooking(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: bookingFormData.name,
          email: bookingFormData.email,
          phone: bookingFormData.phone,
          message: bookingFormData.message || null,
          user_id: user?.id || null,
          tour_id: tour?.id || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to submit booking");
      }

      sonnerToast.success(
        language === "VI" 
          ? "Đặt tour thành công! Chúng tôi sẽ liên hệ sớm."
          : "Booking submitted! We will contact you soon."
      );
      setBookingFormData({ name: "", email: "", phone: "", message: "" });
      setShowBookingModal(false);
    } catch (error) {
      console.error("Error submitting booking:", error);
      sonnerToast.error(
        language === "VI"
          ? "Có lỗi xảy ra. Vui lòng thử lại."
          : "An error occurred. Please try again."
      );
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleDelete = async () => {
    if (!tour) return;
    
    setIsDeleting(true);
    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error("Vui lòng đăng nhập");
      }

      const response = await fetch(`http://localhost:8000/api/tours/${tour.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Lỗi khi xóa tour");
      }

      toast({
        title: "Xóa tour thành công",
        variant: "default",
      });

      navigate("/tours");
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Get images array, fallback to single image if images array doesn't exist
  const tourImages = tour?.images || (tour?.image ? [tour.image] : []);
  const hasMultipleImages = tourImages.length > 1;

  // Get thumbnails (show 4 thumbnails, excluding the currently selected one)
  // If selectedImageIndex is 0, show images 1-4
  // Otherwise, show images around the selected one
  const getThumbnails = () => {
    if (tourImages.length <= 1) return [];
    if (selectedImageIndex === 0) {
      return tourImages.slice(1, 5).map((img, idx) => ({
        img,
        index: idx + 1,
      }));
    }
    // Show 4 thumbnails that don't include the selected one
    const otherImages = tourImages
      .map((img, idx) => ({ img, index: idx }))
      .filter((_, idx) => idx !== selectedImageIndex)
      .slice(0, 4);
    return otherImages;
  };
  const thumbnails = getThumbnails();

  if (!tour) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-10">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">
              {t(language, "td_tour_not_found")}
            </h1>
            <p className="text-muted-foreground mb-6">
              {t(language, "td_tour_not_found_desc")}
            </p>
            <Button onClick={() => navigate(-1)} variant="outline">
              {t(language, "td_go_back")}
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedPrice =
    currency === "VND"
      ? `${(tour.price * 23000).toLocaleString()}₫`
      : `$${tour.price}`;

  const displayTitle = tour.title_key
    ? t(language, tour.title_key as any)
    : tour.title;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">
            {t(language, "td_home")}
          </Link>
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <Link to="/tours" className="hover:text-primary transition-colors">
            {t(language, "td_tours")}
          </Link>
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span className="text-foreground font-medium line-clamp-1">
            {displayTitle}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-6">
              {/* Main Image */}
              <div className="relative rounded-xl overflow-hidden shadow-hover mb-4 group">
                {hasMultipleImages ? (
                  <button
                    onClick={() => {
                      setCurrentPhotoIndex(selectedImageIndex);
                      setIsAllPhotosOpen(true);
                    }}
                    className="w-full h-[500px] relative block cursor-pointer"
                  >
                    <img
                      src={tourImages[selectedImageIndex]}
                      alt={displayTitle}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                    <div className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 text-white px-4 py-2 rounded-lg font-medium transition-all backdrop-blur-sm">
                      {t(language, "td_see_all_photos")} ({tourImages.length})
                    </div>
                  </button>
                ) : (
                  <div className="w-full h-[500px] relative">
                    <img
                      src={tourImages[selectedImageIndex]}
                      alt={displayTitle}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {hasMultipleImages && thumbnails.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {thumbnails.map((thumbnail, index) => {
                    const actualIndex = thumbnail.index;
                    const isSelected = selectedImageIndex === actualIndex;
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(actualIndex)}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                          isSelected
                            ? "border-primary shadow-lg"
                            : "border-transparent hover:border-primary/50"
                        }`}
                      >
                        <img
                          src={thumbnail.img}
                          alt={`${displayTitle} ${actualIndex + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Title & Rating */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl font-bold flex-1">{displayTitle}</h1>
                {user?.role === 'admin' && (
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAdminManager(true)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      {language === "VI" ? "Sửa" : "Edit"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {language === "VI" ? "Xóa" : "Delete"}
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(tour.rating)
                            ? "fill-accent text-accent"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{tour.rating}</span>
                  <span className="text-muted-foreground">
                    ({tour.reviews} {t(language, "td_reviews")})
                  </span>
                </div>
              </div>
            </div>

            {/* Tour Introduction */}
            <Card className="p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">
                {t(language, "td_about_tour")}
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {tour.description || "Thông tin tour sẽ được cập nhật sớm."}
              </p>
            </Card>

            {/* Additional Info - Thông tin bổ sung */}
            {tour.additional_info && (
              <Card className="p-6 mb-6">
                <h2 className="text-2xl font-bold mb-6">
                  {t(language, "td_tour_details")}
                </h2>
                <div 
                  className="text-muted-foreground leading-relaxed whitespace-pre-line prose prose-sm max-w-none
                    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mb-3 [&_h3]:mt-4
                    [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-foreground [&_h4]:mb-2 [&_h4]:mt-3
                    [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-2 [&_ul]:my-3
                    [&_li]:text-muted-foreground
                    [&_p]:my-2
                    [&_hr]:my-6 [&_hr]:border-border
                    [&_b]:font-semibold [&_b]:text-foreground"
                  dangerouslySetInnerHTML={{ 
                    __html: tour.additional_info
                  }}
                />
              </Card>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-6">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-primary">
                    {formattedPrice}
                  </span>
                  <span className="text-muted-foreground">
                    {t(language, "td_per_person")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t(language, "td_price_includes")}
                </p>
              </div>

              <Button 
                className="w-full mb-4" 
                size="lg"
                onClick={() => setShowBookingModal(true)}
              >
                {t(language, "td_book_now")}
              </Button>

              <Button 
                variant={inWishlist ? "default" : "outline"} 
                className="w-full" 
                size="lg"
                onClick={handleWishlistToggle}
              >
                <Heart 
                  className={`w-5 h-5 mr-2 ${inWishlist ? "fill-current" : ""}`}
                />
                {inWishlist 
                  ? (language === "VI" ? "Đã yêu thích" : "In Wishlist")
                  : t(language, "td_add_wishlist")
                }
              </Button>

              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-semibold mb-4">
                  {t(language, "td_whats_included")}
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    {t(language, "td_guide")}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    {t(language, "td_transport")}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    {t(language, "td_tickets")}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    {t(language, "td_insurance")}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    {t(language, "td_meals")}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    {t(language, "td_support")}
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingContact />

      {/* All Photos Modal */}
      <Dialog open={isAllPhotosOpen} onOpenChange={setIsAllPhotosOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>
              {t(language, "td_all_photos")} ({tourImages.length}{" "}
              {tourImages.length === 1
                ? t(language, "td_photo_of")
                : t(language, "td_photos_of")}
              )
            </DialogTitle>
          </DialogHeader>
          <div className="relative flex-1 px-6 pb-6">
            {/* Main Photo Display */}
            <div className="relative w-full h-[calc(90vh-200px)] mb-4 rounded-lg overflow-hidden bg-background">
              <img
                src={tourImages[currentPhotoIndex]}
                alt={`${displayTitle} ${currentPhotoIndex + 1}`}
                className="w-full h-full object-contain"
              />

              {/* Navigation Buttons */}
              {tourImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentPhotoIndex(
                        currentPhotoIndex === 0
                          ? tourImages.length - 1
                          : currentPhotoIndex - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPhotoIndex(
                        currentPhotoIndex === tourImages.length - 1
                          ? 0
                          : currentPhotoIndex + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Photo Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-sm">
                {currentPhotoIndex + 1} / {tourImages.length}
              </div>
            </div>

            {/* Thumbnail Grid */}
            {tourImages.length > 1 && (
              <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                {tourImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                      currentPhotoIndex === index
                        ? "border-primary shadow-lg"
                        : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${displayTitle} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                    {currentPhotoIndex === index && (
                      <div className="absolute inset-0 bg-primary/20" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Admin Tour Manager Dialog */}
      {showAdminManager && (
        <AdminTourManager
          tour={tour}
          mode="edit"
          onClose={() => setShowAdminManager(false)}
          onSuccess={() => {
            fetchTours();
            setShowAdminManager(false);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "VI" ? "Xác nhận xóa tour" : "Confirm Delete Tour"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "VI" 
                ? "Bạn có chắc chắn muốn xóa tour này? Hành động này không thể hoàn tác."
                : "Are you sure you want to delete this tour? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {language === "VI" ? "Hủy" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting 
                ? (language === "VI" ? "Đang xóa..." : "Deleting...")
                : (language === "VI" ? "Xóa" : "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {language === "VI" ? "Đặt Tour Ngay" : "Book Your Tour Now"}
            </DialogTitle>
            <p className="text-muted-foreground text-sm mt-1">
              {language === "VI" 
                ? "Để lại thông tin liên hệ, chúng tôi sẽ hỗ trợ bạn lên kế hoạch chuyến đi hoàn hảo"
                : "Leave your contact information and we'll help you plan your perfect adventure"}
            </p>
          </DialogHeader>
          
          <div className="grid md:grid-cols-[1fr,auto] gap-6">
            {/* Left side - Form */}
            <div>
              {/* Tour Info Summary */}
              <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                <p className="font-semibold text-sm mb-1">
                  {language === "VI" ? "Tour đã chọn:" : "Selected Tour:"}
                </p>
                <p className="text-primary font-medium">{displayTitle}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === "VI" ? "Giá:" : "Price:"} {formattedPrice}/{language === "VI" ? "người" : "person"}
                </p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === "VI" ? "Họ và tên" : "Full Name"} *
              </label>
              <Input
                type="text"
                placeholder={language === "VI" ? "Nhập họ và tên" : "Enter your full name"}
                value={bookingFormData.name}
                onChange={(e) =>
                  setBookingFormData({ ...bookingFormData, name: e.target.value })
                }
                required
                className="h-11"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Email *
                </label>
                <Input
                  type="email"
                  placeholder={language === "VI" ? "email@example.com" : "email@example.com"}
                  value={bookingFormData.email}
                  onChange={(e) =>
                    setBookingFormData({ ...bookingFormData, email: e.target.value })
                  }
                  required
                  className="h-11"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {language === "VI" ? "Số điện thoại" : "Phone"} *
                </label>
                <Input
                  type="tel"
                  placeholder={language === "VI" ? "0123456789" : "0123456789"}
                  value={bookingFormData.phone}
                  onChange={(e) =>
                    setBookingFormData({ ...bookingFormData, phone: e.target.value })
                  }
                  required
                  className="h-11"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === "VI" ? "Ghi chú (tùy chọn)" : "Message (optional)"}
              </label>
              <Textarea
                placeholder={language === "VI" 
                  ? "Nhập yêu cầu đặc biệt, số người tham gia, ngày khởi hành mong muốn..." 
                  : "Enter special requests, number of participants, preferred departure date..."}
                value={bookingFormData.message}
                onChange={(e) =>
                  setBookingFormData({ ...bookingFormData, message: e.target.value })
                }
                className="min-h-24 resize-none"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isSubmittingBooking}
            >
              {isSubmittingBooking
                ? (language === "VI" ? "Đang gửi..." : "Submitting...")
                : (language === "VI" ? "Gửi yêu cầu đặt tour" : "Submit Booking Request")}
            </Button>
              </form>
            </div>

            {/* Right side - QR Code */}
            <div className="flex flex-col items-center justify-center md:border-l md:pl-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <QRCodeSVG
                  value="https://zalo.me/0971769862"
                  size={150}
                  level="H"
                  includeMargin={false}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>
              <p className="text-center text-sm font-medium text-muted-foreground mt-3 max-w-[150px]">
                {language === "VI" 
                  ? "Quét mã QR để nhắn tin trực tiếp với nhân viên" 
                  : "Scan QR to chat directly with our staff"}
              </p>
              <p className="text-xs text-primary mt-1 font-medium">Zalo</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TourDetail;
