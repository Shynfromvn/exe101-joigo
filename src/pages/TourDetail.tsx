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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import { useTours } from "@/contexts/TourContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tours, currency, language } = useTours();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAllPhotosOpen, setIsAllPhotosOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

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

  const displayTitle = tour.titleKey
    ? t(language, tour.titleKey as any)
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
              <h1 className="text-4xl font-bold mb-4">{displayTitle}</h1>
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
                {tour.detailedDescription || tour.description}
              </p>
            </Card>

            {/* Journey Details - 3 sections */}
            {(tour.introduction || tour.itinerary || tour.regulations) && (
              <Card className="p-6 mb-6">
                <h2 className="text-2xl font-bold mb-6">
                  Về journey
                </h2>
                
                {/* Giới thiệu */}
                {tour.introduction && (
                  <div className="mb-6 pb-6 border-b border-border last:border-b-0 last:mb-0 last:pb-0">
                    <h3 className="text-xl font-semibold mb-3 text-primary">
                      Giới thiệu
                    </h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {tour.introduction}
                    </p>
                  </div>
                )}

                {/* Lịch trình */}
                {tour.itinerary && (
                  <div className="mb-6 pb-6 border-b border-border last:border-b-0 last:mb-0 last:pb-0">
                    <h3 className="text-xl font-semibold mb-3 text-primary">
                      Lịch trình
                    </h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {tour.itinerary}
                    </p>
                  </div>
                )}

                {/* Quy định */}
                {tour.regulations && (
                  <div className="mb-6 pb-6 border-b border-border last:border-b-0 last:mb-0 last:pb-0">
                    <h3 className="text-xl font-semibold mb-3 text-primary">
                      Quy định
                    </h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {tour.regulations}
                    </p>
                  </div>
                )}
              </Card>
            )}

            {/* Tour Details */}
            <Card className="p-6">
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
                  __html: tour.additionalInfo || "Đây là một địa điểm thú vị với nhiều trải nghiệm độc đáo. Tour sẽ đưa bạn khám phá những nét đẹp văn hóa và lịch sử đặc sắc của địa phương."
                }}
              />
            </Card>
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

              <Button className="w-full mb-4" size="lg">
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
    </div>
  );
};

export default TourDetail;
