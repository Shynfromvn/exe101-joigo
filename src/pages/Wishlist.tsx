import { Link } from "react-router-dom";
import { Heart, Trash2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TourCard from "@/components/TourCard";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useTours } from "@/contexts/TourContext";
import { useAuth } from "@/contexts/AuthContext";

const Wishlist = () => {
  const { wishlist, loading } = useWishlist();
  const { language } = useTours();
  const { user } = useAuth();

  // If not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <Heart className="w-24 h-24 mx-auto text-muted-foreground/30 mb-4" />
            <h1 className="text-3xl font-bold mb-4">
              {language === "VI" ? "Đăng nhập để xem yêu thích" : "Login to View Wishlist"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {language === "VI" 
                ? "Bạn cần đăng nhập để xem danh sách tour yêu thích của mình."
                : "You need to login to view your favorite tours."}
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
            {language === "VI" ? "Danh sách yêu thích" : "Wishlist"}
          </span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
              <Heart className="fill-red-500 text-red-500" />
              {language === "VI" ? "Danh sách yêu thích" : "My Wishlist"}
            </h1>
            <p className="text-muted-foreground">
              {loading 
                ? (language === "VI" ? "Đang tải..." : "Loading...")
                : `${wishlist.length} ${language === "VI" ? "tour yêu thích" : wishlist.length === 1 ? "tour" : "tours"}`
              }
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">
              {language === "VI" ? "Đang tải..." : "Loading..."}
            </p>
          </div>
        ) : wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((tour) => (
              <TourCard key={tour.id} {...tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {language === "VI" ? "Chưa có tour yêu thích" : "No Favorite Tours Yet"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === "VI"
                ? "Khám phá và thêm những tour bạn thích vào danh sách!"
                : "Explore and add tours you like to your wishlist!"}
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

export default Wishlist;

