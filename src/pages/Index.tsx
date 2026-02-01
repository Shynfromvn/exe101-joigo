import { useState } from "react";
import {
  Search,
  ShieldCheck,
  Award,
  Headphones,
  MapPin,
  Calendar as CalendarIcon,
  CalendarDays,
  Users,
  Landmark,
} from "lucide-react";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider";
import TourCard from "@/components/TourCard";
import LandmarkCard from "@/components/LandmarkCard";
import ContactForm from "@/components/ContactForm";
import PhotoFrameBanner from "@/components/PhotoFrameBanner";
import ScrollAnimation from "@/components/ScrollAnimation";
import FloatingContact from "@/components/FloatingContact";
import { useVisitorTracking } from "@/hooks/use-tracking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTours } from "@/contexts/TourContext";
import { t } from "@/lib/i18n.ts";
import { hanoiBlogs } from "@/lib/blogs.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [heroSearch, setHeroSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { tours, setSearchQuery, language } = useTours();
  // Track visitor
  useVisitorTracking();
  const navigate = useNavigate();

  // Featured tours: Chùa Thanh Âm (ID: 9), Làng Hương Quảng Phú Cầu (ID: 8), Thạch Thất (ID: 7)
  const featuredTourIds = ["9", "8", "7"];
  const featuredTours = featuredTourIds
    .map((id) => tours.find((tour) => tour.id === id))
    .filter((tour) => tour !== undefined);

  const popularSearches = [
    "Tour chill cuối tuần",
    "Tour gia đình",
    "Tour trường học",
    "Tour ngày hè",
    "Tour đông lạnh",
    "Tour chill thu Hà Nội",
  ];

  // Landmarks: Get data from tours in database
  const landmarkTourIds = ["4", "5", "7", "1"]; // Tour IDs: Làng nón Chuông, Thung lũng Bản xôi, Thạch Thất, Văn Miếu
  const landmarks = landmarkTourIds
    .map((id) => {
      const tour = tours.find((tour) => tour.id === id);
      if (!tour) return null;
      
      return {
        image: tour.image || "",
        name: tour.title || "",
        name_en: tour.title_en || undefined,
        destination: tour.destination || "vietnam",
        tourId: id,
      };
    })
    .filter((landmark): landmark is NonNullable<typeof landmark> => landmark !== null);

  const offers = [
    {
      id: "early-bird",
      title: "Early Bird Special",
      description:
        "Book 30 days in advance and save up to 25% on selected tours",
      titleKey: "idx_offer_early_bird" as const,
      descKey: "idx_offer_early_bird_desc" as const,
      gradient: "from-amber-400 via-orange-500 to-red-500",
      icon: CalendarDays,
      iconColor: "text-yellow-200",
    },
    {
      id: "weekend-getaway",
      title: "Weekend Getaway",
      description: "Perfect weekend tours with special discounts for groups",
      titleKey: "idx_offer_weekend" as const,
      descKey: "idx_offer_weekend_desc" as const,
      gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      icon: Users,
      iconColor: "text-emerald-200",
    },
    {
      id: "cultural-heritage",
      title: "Cultural Heritage",
      description:
        "Explore ancient temples and historical sites with exclusive offers",
      titleKey: "idx_offer_cultural" as const,
      descKey: "idx_offer_cultural_desc" as const,
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      icon: Landmark,
      iconColor: "text-purple-200",
    },
  ];

  const handleHeroSearch = () => {
    if (heroSearch.trim()) {
      setSearchQuery(heroSearch);
      navigate("/tours");
    }
  };

  const handleLocationSearch = (query: string) => {
    setHeroSearch(query);
    setIsSearchOpen(false);
  };

  return (
    <div id="home" className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Slider - Full Width, no margin/padding */}
      <HeroSlider />

      <main className="container mx-auto px-4 py-8">
        {/* Large Search Bar - 3 Sections */}
        <section className="mb-16">
          <ScrollAnimation direction="up" threshold={0.2}>
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-2 bg-card border-2 border-orange-500 rounded-xl shadow-soft p-2">
                {/* Section 1: Location Search (Largest) */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder={
                      t(language, "nav_search_placeholder") ||
                      "Tìm kiếm địa điểm..."
                    }
                    className="h-14 pl-12 pr-4 text-base font-semibold border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                    onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && heroSearch.trim()) {
                        handleHeroSearch();
                      }
                    }}
                  />
                  {isSearchOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-4 z-50 animate-fade-in">
                      <p className="text-xs text-muted-foreground mb-2">
                        {t(language, "nav_popular_searches") ||
                          "Tìm kiếm phổ biến"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((search) => (
                          <button
                            key={search}
                            onClick={() => handleLocationSearch(search)}
                            className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-10 w-px bg-orange-500" />

                {/* Section 2: Date Picker */}
                <div className="w-64">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full h-14 justify-start text-left font-semibold border-0 hover:bg-transparent"
                      >
                        <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                        {selectedDate ? (
                          <span className="font-semibold">
                            {format(selectedDate, "PPP")}
                          </span>
                        ) : (
                          <span className="text-muted-foreground font-semibold">
                            {t(language, "idx_select_date")}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Divider */}
                <div className="h-10 w-px bg-orange-500" />

                {/* Section 3: Search Button (Smallest) */}
                <div className="w-32">
                  <Button
                    onClick={handleHeroSearch}
                    variant="default"
                    size="lg"
                    className="w-full h-14 text-base font-semibold"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    {t(language, "idx_search") || "Tìm"}
                  </Button>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </section>

        {/* Special Offers */}
        <section id="special-offers" className="mb-16 scroll-mt-24">
          <ScrollAnimation direction="up" threshold={0.15}>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {t(language, "idx_special_offers")}
              </h2>
              <p className="text-muted-foreground">
                {t(language, "idx_offers_desc")}
              </p>
            </div>
          </ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((offer, index) => {
              const IconComponent = offer.icon;
              return (
                <ScrollAnimation
                  key={offer.id}
                  direction="scale"
                  stagger={true}
                  staggerIndex={index}
                  threshold={0.15}
                >
                  <div
                    className="group cursor-pointer"
                    onClick={() => navigate(`/tours?offer=${offer.id}`)}
                  >
                    <div
                      className={`relative h-64 rounded-xl overflow-visible bg-gradient-to-br ${offer.gradient} shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105`}
                      style={{
                        border: '6px solid #DC2626',
                        boxShadow: '0 0 0 2px #FCD34D, 0 0 0 4px #DC2626',
                      }}
                    >
                      {/* Tet Border Decoration - Hoa mai và hoa đào ở các góc */}
                      <div className="absolute inset-0 pointer-events-none overflow-visible">
                        {/* Hoa mai (Top Left) - Yellow */}
                        <div className="absolute -top-4 -left-4 w-20 h-20 opacity-80 group-hover:opacity-100 transition-opacity z-10">
                          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-lg">
                            {/* Branch */}
                            <path d="M 10 50 Q 25 35, 40 40 Q 55 45, 65 50" stroke="#8B4513" strokeWidth="3" fill="none" strokeLinecap="round"/>
                            {/* Flowers */}
                            <g>
                              <circle cx="25" cy="40" r="8" fill="#FCD34D"/>
                              <circle cx="25" cy="40" r="4" fill="#FBBF24"/>
                              <path d="M 25 32 L 23 28 L 25 26 L 27 28 Z" fill="#FCD34D"/>
                              <path d="M 25 48 L 23 52 L 25 54 L 27 52 Z" fill="#FCD34D"/>
                              <path d="M 17 40 L 13 40 L 15 38 L 15 42 Z" fill="#FCD34D"/>
                              <path d="M 33 40 L 37 40 L 35 38 L 35 42 Z" fill="#FCD34D"/>
                            </g>
                            <g>
                              <circle cx="45" cy="45" r="7" fill="#FCD34D"/>
                              <circle cx="45" cy="45" r="3.5" fill="#FBBF24"/>
                            </g>
                            {/* Leaves */}
                            <ellipse cx="20" cy="35" rx="3" ry="6" fill="#22C55E" transform="rotate(-25 20 35)"/>
                            <ellipse cx="30" cy="38" rx="3" ry="6" fill="#22C55E" transform="rotate(20 30 38)"/>
                          </svg>
                        </div>
                        
                        {/* Hoa đào (Top Right) - Pink */}
                        <div className="absolute -top-4 -right-4 w-20 h-20 opacity-80 group-hover:opacity-100 transition-opacity z-10">
                          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-lg">
                            {/* Branch */}
                            <path d="M 70 50 Q 55 35, 40 40 Q 25 45, 15 50" stroke="#8B4513" strokeWidth="3" fill="none" strokeLinecap="round"/>
                            {/* Flowers */}
                            <g>
                              <circle cx="55" cy="40" r="8" fill="#F9A8D4"/>
                              <circle cx="55" cy="40" r="4" fill="#EC4899"/>
                              <path d="M 55 32 L 53 28 L 55 26 L 57 28 Z" fill="#F9A8D4"/>
                              <path d="M 55 48 L 53 52 L 55 54 L 57 52 Z" fill="#F9A8D4"/>
                              <path d="M 47 40 L 43 40 L 45 38 L 45 42 Z" fill="#F9A8D4"/>
                              <path d="M 63 40 L 67 40 L 65 38 L 65 42 Z" fill="#F9A8D4"/>
                            </g>
                            <g>
                              <circle cx="35" cy="45" r="7" fill="#F9A8D4"/>
                              <circle cx="35" cy="45" r="3.5" fill="#EC4899"/>
                            </g>
                            {/* Leaves */}
                            <ellipse cx="60" cy="35" rx="3" ry="6" fill="#22C55E" transform="rotate(25 60 35)"/>
                            <ellipse cx="50" cy="38" rx="3" ry="6" fill="#22C55E" transform="rotate(-20 50 38)"/>
                          </svg>
                        </div>
                        
                        {/* Hoa mai (Bottom Right) - Yellow */}
                        <div className="absolute -bottom-4 -right-4 w-20 h-20 opacity-80 group-hover:opacity-100 transition-opacity z-10">
                          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-lg">
                            {/* Branch */}
                            <path d="M 70 30 Q 55 45, 40 40 Q 25 35, 15 30" stroke="#8B4513" strokeWidth="3" fill="none" strokeLinecap="round"/>
                            {/* Flowers */}
                            <g>
                              <circle cx="55" cy="40" r="8" fill="#FCD34D"/>
                              <circle cx="55" cy="40" r="4" fill="#FBBF24"/>
                            </g>
                            <g>
                              <circle cx="35" cy="35" r="7" fill="#FCD34D"/>
                              <circle cx="35" cy="35" r="3.5" fill="#FBBF24"/>
                            </g>
                            {/* Leaves */}
                            <ellipse cx="60" cy="45" rx="3" ry="6" fill="#22C55E" transform="rotate(25 60 45)"/>
                          </svg>
                        </div>
                        
                        {/* Hoa đào (Bottom Left) - Pink */}
                        <div className="absolute -bottom-4 -left-4 w-20 h-20 opacity-80 group-hover:opacity-100 transition-opacity z-10">
                          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-lg">
                            {/* Branch */}
                            <path d="M 10 30 Q 25 45, 40 40 Q 55 35, 65 30" stroke="#8B4513" strokeWidth="3" fill="none" strokeLinecap="round"/>
                            {/* Flowers */}
                            <g>
                              <circle cx="25" cy="40" r="8" fill="#F9A8D4"/>
                              <circle cx="25" cy="40" r="4" fill="#EC4899"/>
                            </g>
                            <g>
                              <circle cx="45" cy="35" r="7" fill="#F9A8D4"/>
                              <circle cx="45" cy="35" r="3.5" fill="#EC4899"/>
                            </g>
                            {/* Leaves */}
                            <ellipse cx="20" cy="45" rx="3" ry="6" fill="#22C55E" transform="rotate(-25 20 45)"/>
                          </svg>
                        </div>
                        
                        {/* Đèn lồng đỏ (Top Right) */}
                        <div className="absolute top-1 right-1 w-10 h-14 opacity-85 group-hover:opacity-100 transition-opacity z-10">
                          <svg viewBox="0 0 40 56" className="w-full h-full drop-shadow-lg">
                            <ellipse cx="20" cy="28" rx="12" ry="20" fill="#DC2626" stroke="#B91C1C" strokeWidth="2"/>
                            <ellipse cx="20" cy="28" rx="7" ry="12" fill="#EF4444" opacity="0.6"/>
                            <rect x="6" y="6" width="28" height="4" fill="#991B1B" rx="2"/>
                            <rect x="6" y="46" width="28" height="4" fill="#991B1B" rx="2"/>
                            <line x1="20" y1="50" x2="20" y2="56" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="20" cy="56" r="2" fill="#FCD34D"/>
                            {/* Decorative lines */}
                            <line x1="20" y1="10" x2="20" y2="44" stroke="#FCD34D" strokeWidth="1" opacity="0.3"/>
                          </svg>
                        </div>
                        
                        {/* Đèn lồng đỏ (Bottom Left) */}
                        <div className="absolute bottom-1 left-1 w-10 h-14 opacity-85 group-hover:opacity-100 transition-opacity z-10">
                          <svg viewBox="0 0 40 56" className="w-full h-full drop-shadow-lg">
                            <ellipse cx="20" cy="28" rx="12" ry="20" fill="#DC2626" stroke="#B91C1C" strokeWidth="2"/>
                            <ellipse cx="20" cy="28" rx="7" ry="12" fill="#EF4444" opacity="0.6"/>
                            <rect x="6" y="6" width="28" height="4" fill="#991B1B" rx="2"/>
                            <rect x="6" y="46" width="28" height="4" fill="#991B1B" rx="2"/>
                            <line x1="20" y1="50" x2="20" y2="56" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="20" cy="56" r="2" fill="#FCD34D"/>
                            {/* Decorative lines */}
                            <line x1="20" y1="10" x2="20" y2="44" stroke="#FCD34D" strokeWidth="1" opacity="0.3"/>
                          </svg>
                        </div>
                      </div>
                      
                      {/* Gradient overlay để text dễ đọc */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent rounded-xl" />

                      {/* Icon */}
                      <div className="absolute top-4 right-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <IconComponent
                            className={`w-8 h-8 ${offer.iconColor}`}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                          {t(language, offer.titleKey)}
                        </h3>
                        <p className="text-sm text-white/95 mb-4 leading-relaxed">
                          {t(language, offer.descKey)}
                        </p>
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-white text-gray-800 hover:bg-white/95 font-semibold w-fit group-hover:scale-105 transition-transform duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tours?offer=${offer.id}`);
                          }}
                        >
                          {t(language, "idx_view_offer")}
                        </Button>
                      </div>

                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    </div>
                  </div>
                </ScrollAnimation>
              );
            })}
          </div>
        </section>

        {/* Featured Tours */}
        <section id="featured-tours" className="mb-16 scroll-mt-24">
          <ScrollAnimation direction="up" threshold={0.15}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {t(language, "idx_featured_tours")}
                </h2>
                <p className="text-muted-foreground">
                  {t(language, "idx_featured_sub")}
                </p>
              </div>
              <Link to="/tours">
                <Button variant="outline">{t(language, "idx_view_all")}</Button>
              </Link>
            </div>
          </ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTours.map((tour, index) => (
              <ScrollAnimation
                key={index}
                direction="up"
                stagger={true}
                staggerIndex={index}
                threshold={0.15}
              >
                <TourCard {...tour} />
              </ScrollAnimation>
            ))}
          </div>
        </section>

        {/* Famous Landmarks */}
        <section className="mb-16">
          <ScrollAnimation direction="up" threshold={0.15}>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {t(language, "idx_landmarks")}
              </h2>
              <p className="text-muted-foreground">
                {t(language, "idx_landmarks_sub")}
              </p>
            </div>
          </ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {landmarks.map((landmark, index) => (
              <ScrollAnimation
                key={index}
                direction={index % 2 === 0 ? "left" : "right"}
                stagger={true}
                staggerIndex={index}
                threshold={0.15}
              >
                <LandmarkCard {...landmark} />
              </ScrollAnimation>
            ))}
          </div>
        </section>

        {/* Travel Blog */}
        <section className="mb-16">
          <ScrollAnimation direction="up" threshold={0.15}>
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
          </ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hanoiBlogs.slice(0, 3).map((blog, index) => (
              <ScrollAnimation
                key={blog.slug}
                direction="up"
                stagger={true}
                staggerIndex={index}
                threshold={0.15}
              >
                <a 
                  href={blog.externalUrl || `/blogs/${blog.slug}`}
                  className="group block"
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
              </ScrollAnimation>
            ))}
          </div>
        </section>

        {/* Photo Frame Banner */}
        <section id="photo-frame" className="scroll-mt-24">
          <ScrollAnimation direction="scale" threshold={0.2}>
            <PhotoFrameBanner />
          </ScrollAnimation>
        </section>

        {/* Why Choose Joigo */}
        <section className="mb-16">
          <ScrollAnimation direction="up" threshold={0.15}>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {t(language, "idx_why_joigo")}
              </h2>
              <p className="text-muted-foreground">
                {t(language, "idx_why_joigo_desc")}
              </p>
            </div>
          </ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                titleKey: "idx_trust",
                descKey: "idx_trust_desc",
              },
              {
                icon: Award,
                titleKey: "idx_experience",
                descKey: "idx_experience_desc",
              },
              {
                icon: Headphones,
                titleKey: "idx_support_247",
                descKey: "idx_support_247_desc",
              },
              {
                icon: MapPin,
                titleKey: "idx_local",
                descKey: "idx_local_desc",
              },
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <ScrollAnimation
                  key={index}
                  direction="scale"
                  stagger={true}
                  staggerIndex={index}
                  threshold={0.15}
                >
                  <div className="p-6 rounded-xl border border-border bg-card/50 hover:shadow-hover transition-shadow">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                      {t(language, item.titleKey)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t(language, item.descKey)}
                    </p>
                  </div>
                </ScrollAnimation>
              );
            })}
          </div>
        </section>

        {/* Contact Form */}
        <section id="book-tour" className="mb-16 scroll-mt-24">
          <ScrollAnimation direction="up" threshold={0.15}>
            <ContactForm />
          </ScrollAnimation>
        </section>
      </main>

      <Footer />
      <FloatingContact />
    </div>
  );
};

export default Index;
