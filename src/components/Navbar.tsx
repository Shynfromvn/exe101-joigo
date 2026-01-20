import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X, Heart, User, LogOut, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTours } from "@/contexts/TourContext";
import { t } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const { currency, setCurrency, setSearchQuery, language, setLanguage } =
    useTours();
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  const popularSearches = [
    "Van Mieu - Quoc Tu Giam",
    "Ho Chi Minh Museum",
    "National Military Museum",
    "Hoa Lo Prison",
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setLocalSearch("");
    setIsSearchOpen(false);
    navigate("/tours");
  };

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handleLanguageToggle = () => {
    const newLanguage = language === "EN" ? "VI" : "EN";
    setLanguage(newLanguage);
    // Optional: sync currency with language for user convenience
    setCurrency(newLanguage === "VI" ? "VND" : "USD");
  };

  const scrollToSection = (sectionId: string) => {
    if (!isHomePage) {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { label: language === "VI" ? "Trang chủ" : "Home", sectionId: "home" },
    { label: language === "VI" ? "Khuyến mãi" : "Promotions", sectionId: "special-offers" },
    { label: language === "VI" ? "Tour nổi bật" : "Featured Tours", sectionId: "featured-tours" },
    { label: language === "VI" ? "Chụp ảnh" : "Photo Frame", sectionId: "photo-frame" },
    { label: language === "VI" ? "Đặt tour" : "Book Tour", sectionId: "book-tour" },
    { label: language === "VI" ? "Liên hệ" : "Contact", sectionId: "contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <nav className="container mx-auto px-4">
        {/* First Row: Logo + Navigation Menu + Auth */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" onClick={() => scrollToSection("home")} className="flex items-center gap-3 group">
            <div className="w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <img
                src="/icon_joigo.svg"
                alt="Joigo Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-bold bg-ocean-gradient bg-clip-text text-transparent hidden sm:block">
              Joigo
            </span>
          </Link>

          {/* Navigation Menu - Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => (
              <button
                key={item.sectionId}
                onClick={() => scrollToSection(item.sectionId)}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors"
              >
                {item.label}
              </button>
            ))}
            <Link
              to="/chat"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <Bot className="w-4 h-4" />
              {language === "VI" ? "AI Trợ Lý" : "AI Assistant"}
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={handleLanguageToggle}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <span className="text-xl">{language === "EN" ? "🇺🇸" : "🇻🇳"}</span>
              <span className="text-sm font-medium">{language}</span>
            </button>

            {/* Auth Area - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 group outline-none">
                      <Avatar className="w-8 h-8 ring-1 ring-border group-hover:ring-2 group-hover:ring-primary transition-all">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">
                        {user.name}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>{language === "VI" ? "Hồ sơ" : "Profile"}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/wishlist" className="flex items-center cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>{language === "VI" ? "Yêu thích" : "Wishlist"}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={async () => {
                        await signOut();
                        navigate("/");
                      }}
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{language === "VI" ? "Đăng xuất" : "Log out"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      {t(language, "nav_login")}
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="default" size="sm">
                      {t(language, "nav_signup")}
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Second Row: Search Bar - Desktop */}
        <div className="hidden lg:block pb-3">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder={t(language, "nav_search_placeholder")}
              className="pl-10 pr-4 h-11 rounded-lg border-border focus:ring-2 focus:ring-primary"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && localSearch.trim()) {
                  handleSearch(localSearch);
                }
              }}
            />
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-hover p-4 animate-fade-in z-50">
                <p className="text-xs text-muted-foreground mb-2">
                  {t(language, "nav_popular_searches")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-border pt-4 animate-slide-in">
            <div className="flex flex-col gap-3">
              {/* Mobile Navigation Menu */}
              <div className="flex flex-col gap-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.sectionId}
                    onClick={() => scrollToSection(item.sectionId)}
                    className="px-4 py-2 text-left text-sm font-medium text-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <Link
                  to="/chat"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-primary/80 rounded-lg transition-all"
                >
                  <Bot className="w-4 h-4" />
                  {language === "VI" ? "AI Trợ Lý" : "AI Assistant"}
                </Link>
              </div>
              
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder={t(language, "nav_search_mobile_placeholder")}
                  className="h-11 pl-10"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && localSearch.trim()) {
                      handleSearch(localSearch);
                    }
                  }}
                />
              </div>
              
              {/* Mobile Auth Buttons */}
              <div className="flex gap-2">
                {loading ? (
                  <div className="w-full h-10 rounded-lg bg-secondary animate-pulse" />
                ) : user ? (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        navigate("/profile");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {language === "VI" ? "Hồ sơ" : "Profile"}
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={async () => {
                        await signOut();
                        setIsMobileMenuOpen(false);
                        navigate("/");
                      }}
                    >
                      {language === "VI" ? "Đăng xuất" : "Log out"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        {t(language, "nav_login")}
                      </Button>
                    </Link>
                    <Link to="/signup" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="default" className="w-full">
                        {t(language, "nav_signup")}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
