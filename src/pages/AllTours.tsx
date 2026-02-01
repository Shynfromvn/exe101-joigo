import { ChevronRight, Plus } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TourCard from "@/components/TourCard";
import FloatingContact from "@/components/FloatingContact";
import AdminTourManager from "@/components/AdminTourManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hanoiBlogs } from "@/lib/blogs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTours } from "@/contexts/TourContext";
import { useAuth } from "@/contexts/AuthContext";
import { t } from "@/lib/i18n";

// Helper function to check if tour has a specific type
const tourHasType = (tour: any, typeToCheck: string): boolean => {
  return Array.isArray(tour.type) 
    ? tour.type.includes(typeToCheck)
    : tour.type === typeToCheck;
};

const offerInfo: Record<
  string,
  { title: string; description: string; filterFn: (tour: any) => boolean }
> = {
  "early-bird": {
    title: "Early Bird Special",
    description: "Book 30 days in advance and save up to 25%",
    filterFn: (tour) => tourHasType(tour, "cultural") || tour.price < 100,
  },
  "weekend-getaway": {
    title: "Weekend Getaway",
    description: "Perfect weekend tours with special discounts",
    filterFn: (tour) =>
      tourHasType(tour, "cultural") || tour.destination === "vietnam",
  },
  "cultural-heritage": {
    title: "Cultural Heritage",
    description: "Explore ancient temples and historical sites",
    filterFn: (tour) => tourHasType(tour, "cultural"),
  },
};

const AllTours = () => {
  const { filteredTours, filters, setFilters, searchQuery, language, loading, fetchTours } =
    useTours();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const offerId = searchParams.get("offer");
  const [showAdminManager, setShowAdminManager] = useState(false);
  const [editingTour, setEditingTour] = useState<any>(null);

  const offerTours = useMemo(() => {
    if (!offerId || !offerInfo[offerId]) return filteredTours;
    return filteredTours.filter(offerInfo[offerId].filterFn);
  }, [offerId, filteredTours]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const reviews = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment:
        "Absolutely amazing experience! The tour guide was knowledgeable and the itinerary was perfect.",
      tour: "Van Mieu - Quoc Tu Giam",
    },
    {
      name: "Michael Chen",
      rating: 5,
      comment:
        "Best ancient temple ever! Everything was well organized and the destinations were breathtaking.",
      tour: "Hoang Thanh Thang Long",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">
            {t(language, "all_home")}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">
            {t(language, "all_all_tours")}
          </span>
        </div>

        {/* Search Query Display */}
        {searchQuery && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm">
              {t(language, "all_tours_for")}{" "}
              <span className="font-semibold text-primary">
                "{searchQuery}"
              </span>
            </p>
          </div>
        )}

        {/* Offer Display */}
        {offerId && offerInfo[offerId] && (
          <div className="mb-6 p-6 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-2 border-orange-500/30 rounded-lg">
            <h2 className="text-2xl font-bold mb-2 text-orange-600">
              {offerId === "early-bird" && t(language, "idx_offer_early_bird")}
              {offerId === "weekend-getaway" && t(language, "idx_offer_weekend")}
              {offerId === "cultural-heritage" && t(language, "idx_offer_cultural")}
            </h2>
            <p className="text-muted-foreground mb-2">
              {offerId === "early-bird" && t(language, "idx_offer_early_bird_desc")}
              {offerId === "weekend-getaway" && t(language, "idx_offer_weekend_desc")}
              {offerId === "cultural-heritage" && t(language, "idx_offer_cultural_desc")}
            </p>
            <p className="text-sm text-muted-foreground">
              {offerTours.length}{" "}
              {offerTours.length === 1 
                ? t(language, "idx_tour_available")
                : t(language, "idx_tours_available")}{" "}
              {t(language, "idx_with_this_offer")}
            </p>
          </div>
        )}

        {/* Filters */}
        <section className="mb-12">
          <div className="bg-secondary/50 rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">
              {t(language, "all_filter_tours")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t(language, "all_tour_type")}
                </label>
                <Select
                  value={filters.tourType}
                  onValueChange={(value) =>
                    handleFilterChange("tourType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t(language, "all_all_types")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t(language, "all_all_types")}
                    </SelectItem>
                    <SelectItem value="Tour chill cuối tuần">Tour chill cuối tuần</SelectItem>
                    <SelectItem value="Tour gia đình">Tour gia đình</SelectItem>
                    <SelectItem value="Tour trường học">Tour trường học</SelectItem>
                    <SelectItem value="Tour ngày hè">Tour ngày hè</SelectItem>
                    <SelectItem value="Tour đông lạnh">Tour đông lạnh</SelectItem>
                    <SelectItem value="Tour chill thu Hà Nội">Tour chill thu Hà Nội</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t(language, "all_departure")}
                </label>
                <Select
                  value={filters.departure}
                  onValueChange={(value) =>
                    handleFilterChange("departure", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t(language, "all_all_cities")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t(language, "all_all_cities")}
                    </SelectItem>
                    <SelectItem value="hanoi">Hanoi</SelectItem>
                    <SelectItem value="danang">Da Nang</SelectItem>
                    <SelectItem value="bangkok">Bangkok</SelectItem>
                    <SelectItem value="phuket">Phuket</SelectItem>
                    <SelectItem value="siemreap">Siem Reap</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t(language, "all_destination")}
                </label>
                <Select
                  value={filters.destination}
                  onValueChange={(value) =>
                    handleFilterChange("destination", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(language, "all_any_destination")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t(language, "all_any_destination")}
                    </SelectItem>
                    <SelectItem value="vietnam">Vietnam</SelectItem>
                    <SelectItem value="thailand">Thailand</SelectItem>
                    <SelectItem value="cambodia">Cambodia</SelectItem>
                    <SelectItem value="myanmar">Myanmar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t(language, "all_transportation")}
                </label>
                <Select
                  value={filters.transportation}
                  onValueChange={(value) =>
                    handleFilterChange("transportation", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t(language, "all_all_types")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t(language, "all_all_types")}
                    </SelectItem>
                    <SelectItem value="bus">Bus</SelectItem>
                    <SelectItem value="flight">Flight</SelectItem>
                    <SelectItem value="boat">Boat</SelectItem>
                    <SelectItem value="tuk-tuk">Tuk-tuk</SelectItem>
                    <SelectItem value="motorbike">Motorbike</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Tour Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">
              {offerId && offerInfo[offerId]
                ? offerInfo[offerId].title
                : searchQuery
                ? `${t(language, "all_tours_for")} "${searchQuery}"`
                : t(language, "all_all_tours")}
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-muted-foreground">
                {offerTours.length}{" "}
                {offerTours.length === 1
                  ? t(language, "all_found_singular")
                  : t(language, "all_found_plural")}
              </p>
              {user?.role === 'admin' && (
                <Button onClick={() => setShowAdminManager(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {language === "VI" ? "Tạo Tour" : "Create Tour"}
                </Button>
              )}
            </div>
          </div>
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading tours...</p>
            </div>
          ) : offerTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offerTours.map((tour) => (
                <TourCard key={tour.id} {...tour} image={tour.image || tour.images?.[0] || "/placeholder-tour.jpg"} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">
                {t(language, "all_no_tours")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t(language, "all_try_adjust")}
              </p>
            </div>
          )}
        </section>

        {/* Customer Reviews */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">{t(language, "all_customer_reviews")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 shadow-soft"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-ocean-gradient rounded-full flex items-center justify-center text-white font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{review.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {review.tour}
                    </p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-accent text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Travel Blog */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {t(language, "idx_travel_blog")}
              </h2>
              <p className="text-muted-foreground">
                {t(language, "idx_blog_desc")}
              </p>
            </div>
            <Link to="/blogs">
              <Button variant="outline">
                {t(language, "idx_view_all_blog")}
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hanoiBlogs.slice(0, 3).map((blog) => (
              <a
                key={blog.slug}
                href={blog.externalUrl || `/blogs/${blog.slug}`}
                className="group"
                target={blog.externalUrl ? "_blank" : undefined}
                rel={blog.externalUrl ? "noopener noreferrer" : undefined}
              >
                <Card className="h-full overflow-hidden hover:shadow-hover transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {t(
                        language,
                        `blog_${blog.slug.replace(/-/g, "_")}_title` as any
                      ) || blog.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {t(
                        language,
                        `blog_${blog.slug.replace(/-/g, "_")}_excerpt` as any
                      ) || blog.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </section>

        {/* Company Slogan Banner */}
        <section className="mb-16">
          <div className="relative h-64 rounded-2xl overflow-hidden bg-ocean-gradient shadow-hover">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Your Journey Starts Here
                </h2>
                <p className="text-xl md:text-2xl text-white/90">
                  Creating unforgettable memories across Hanoi Vietnam
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingContact />
      
      {showAdminManager && (
        <AdminTourManager
          tour={editingTour}
          mode={editingTour ? "edit" : "create"}
          onClose={() => {
            setShowAdminManager(false);
            setEditingTour(null);
          }}
          onSuccess={() => {
            fetchTours();
          }}
        />
      )}
    </div>
  );
};

export default AllTours;
