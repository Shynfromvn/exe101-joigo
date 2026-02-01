import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import { useTours } from "@/contexts/TourContext";
import { t } from "@/lib/i18n";
import { Users, Target, Heart, BookOpen, MapPin, Award } from "lucide-react";
import ScrollAnimation from "@/components/ScrollAnimation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AboutUs = () => {
  const { language, tours } = useTours();
  
  // Featured tours: Văn Miếu (ID: 1), Làng lụa Vạn Phúc (ID: 2), Làng mây tre Phú Vinh (ID: 3), Thung lũng Bản xôi (ID: 5)
  const featuredTourIds = ["1", "2", "3", "5"];
  const featuredTours = featuredTourIds
    .map((id) => tours.find((tour) => tour.id === id))
    .filter((tour) => tour !== undefined);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Banner */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-hover/90 z-10">
          <div className="absolute inset-0 bg-[url('/images/bg_HaNoi.jpg')] bg-cover bg-center opacity-20"></div>
        </div>
        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-white">
            <ScrollAnimation direction="up" threshold={0.2}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {t(language, "about_hero_title")}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto text-white/90">
                {t(language, "about_hero_subtitle")}
              </p>
            </ScrollAnimation>
          </div>
        </div>
        {/* Curved bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 100L60 90C120 80 240 60 360 50C480 40 600 40 720 45C840 50 960 60 1080 65C1200 70 1320 70 1380 70L1440 70V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        {/* Our Story Section */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollAnimation direction="left" threshold={0.15}>
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {t(language, "about_story_title")}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t(language, "about_story_p1")}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t(language, "about_story_p2")}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t(language, "about_story_p3")}
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation direction="right" threshold={0.15}>
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://res.cloudinary.com/dczdnu2ba/image/upload/v1768056781/van-mieu.jpg"
                  alt="Cultural Heritage"
                  className="w-full h-full object-cover"
                />
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-20">
          <ScrollAnimation direction="up" threshold={0.15}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t(language, "about_mission_title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t(language, "about_mission_subtitle")}
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid md:grid-cols-2 gap-8">
            <ScrollAnimation direction="up" threshold={0.15} stagger={true} staggerIndex={0}>
              <Card className="h-full border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-4">
                    {t(language, "about_mission_card_title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(language, "about_mission_card_content")}
                  </p>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation direction="up" threshold={0.15} stagger={true} staggerIndex={1}>
              <Card className="h-full border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-4">
                    {t(language, "about_vision_card_title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(language, "about_vision_card_content")}
                  </p>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </div>
        </section>

        {/* What We Offer */}
        <section className="mb-20">
          <ScrollAnimation direction="up" threshold={0.15}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t(language, "about_offer_title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t(language, "about_offer_subtitle")}
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                titleKey: "about_offer_1_title",
                descKey: "about_offer_1_desc",
              },
              {
                icon: MapPin,
                titleKey: "about_offer_2_title",
                descKey: "about_offer_2_desc",
              },
              {
                icon: Award,
                titleKey: "about_offer_3_title",
                descKey: "about_offer_3_desc",
              },
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <ScrollAnimation
                  key={index}
                  direction="scale"
                  threshold={0.15}
                  stagger={true}
                  staggerIndex={index}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl mb-2">
                        {t(language, item.titleKey)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {t(language, item.descKey)}
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimation>
              );
            })}
          </div>
        </section>

        {/* Our Tours Highlights */}
        <section className="mb-20">
          <ScrollAnimation direction="up" threshold={0.15}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t(language, "about_tours_title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t(language, "about_tours_subtitle")}
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTours.map((tour, index) => {
              // Chọn title và description theo ngôn ngữ
              const displayTitle = language === "EN" && tour.title_en ? tour.title_en : tour.title;
              const displayDescription = language === "EN" && tour.description_en 
                ? tour.description_en.substring(0, 150) + (tour.description_en.length > 150 ? "..." : "")
                : tour.description 
                ? tour.description.substring(0, 150) + (tour.description.length > 150 ? "..." : "")
                : "";
              
              return (
                <ScrollAnimation
                  key={tour.id}
                  direction="up"
                  threshold={0.15}
                  stagger={true}
                  staggerIndex={index}
                >
                  <Link to={`/tours/${tour.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={tour.image || tour.images?.[0] || ""}
                          alt={displayTitle}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {displayTitle}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {displayDescription}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollAnimation>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-20">
          <ScrollAnimation direction="up" threshold={0.15}>
            <Card className="bg-gradient-to-r from-primary/10 to-primary-hover/10 border-2 border-primary/20">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t(language, "about_cta_title")}
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  {t(language, "about_cta_subtitle")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/tours">
                    <Button size="lg" className="w-full sm:w-auto">
                      {t(language, "about_cta_button_tours")}
                    </Button>
                  </Link>
                  <a href="#contact">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      {t(language, "about_cta_button_contact")}
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>
        </section>
      </main>

      <Footer />
      <FloatingContact />
    </div>
  );
};

export default AboutUs;
