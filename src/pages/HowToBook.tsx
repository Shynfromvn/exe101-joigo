import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import { useTours } from "@/contexts/TourContext";
import { t } from "@/lib/i18n";
import { Search, User, Calendar, CreditCard, CheckCircle, Mail, Phone, MessageCircle, ArrowRight } from "lucide-react";
import ScrollAnimation from "@/components/ScrollAnimation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HowToBook = () => {
  const { language } = useTours();
  const navigate = useNavigate();

  const handleBookOnlineClick = () => {
    navigate("/#book-tour");
    // Scroll to section after navigation
    setTimeout(() => {
      const element = document.getElementById("book-tour");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleViewToursClick = () => {
    navigate("/tours");
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const steps = [
    {
      icon: Search,
      titleKey: "howto_step1_title",
      descKey: "howto_step1_desc",
      detailsKey: "howto_step1_details",
    },
    {
      icon: User,
      titleKey: "howto_step2_title",
      descKey: "howto_step2_desc",
      detailsKey: "howto_step2_details",
    },
    {
      icon: Calendar,
      titleKey: "howto_step3_title",
      descKey: "howto_step3_desc",
      detailsKey: "howto_step3_details",
    },
    {
      icon: Mail,
      titleKey: "howto_step4_title",
      descKey: "howto_step4_desc",
      detailsKey: "howto_step4_details",
    },
    {
      icon: CheckCircle,
      titleKey: "howto_step5_title",
      descKey: "howto_step5_desc",
      detailsKey: "howto_step5_details",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary-hover/10 border-b border-border">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <ScrollAnimation direction="up" threshold={0.2}>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t(language, "howto_hero_title")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                {t(language, "howto_hero_subtitle")}
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        {/* Booking Steps */}
        <section className="mb-20">
          <ScrollAnimation direction="up" threshold={0.15}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t(language, "howto_steps_title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t(language, "howto_steps_subtitle")}
              </p>
            </div>
          </ScrollAnimation>

          <div className="space-y-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <ScrollAnimation
                  key={index}
                  direction="up"
                  threshold={0.15}
                  stagger={true}
                  staggerIndex={index}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <div className="relative">
                              <IconComponent className="w-8 h-8 text-primary" />
                              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                                {index + 1}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2">
                            {t(language, step.titleKey)}
                          </CardTitle>
                          <p className="text-muted-foreground mb-4">
                            {t(language, step.descKey)}
                          </p>
                          <div className="bg-muted/50 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                              {t(language, step.detailsKey)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </ScrollAnimation>
              );
            })}
          </div>
        </section>

        {/* Booking Methods */}
        <section className="mb-20">
          <ScrollAnimation direction="up" threshold={0.15}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t(language, "howto_methods_title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t(language, "howto_methods_subtitle")}
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid md:grid-cols-2 gap-8">
            <ScrollAnimation direction="up" threshold={0.15} stagger={true} staggerIndex={0}>
              <Card className="h-full border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-4">
                    {t(language, "howto_method1_title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {t(language, "howto_method1_desc")}
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span>{t(language, "howto_method1_item1")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span>{t(language, "howto_method1_item2")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span>{t(language, "howto_method1_item3")}</span>
                    </li>
                  </ul>
                  <Button className="w-full" onClick={handleBookOnlineClick}>
                    {t(language, "howto_method1_button")}
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation direction="up" threshold={0.15} stagger={true} staggerIndex={1}>
              <Card className="h-full border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Phone className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-4">
                    {t(language, "howto_method2_title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {t(language, "howto_method2_desc")}
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span>{t(language, "howto_method2_item1")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span>{t(language, "howto_method2_item2")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span>{t(language, "howto_method2_item3")}</span>
                    </li>
                  </ul>
                  <a href="#contact">
                    <Button variant="outline" className="w-full">
                      {t(language, "howto_method2_button")}
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </div>
        </section>

        {/* Important Information */}
        <section className="mb-20">
          <ScrollAnimation direction="up" threshold={0.15}>
            <Card className="bg-gradient-to-r from-primary/5 to-primary-hover/5 border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl mb-4">
                  {t(language, "howto_important_title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">
                        {t(language, "howto_important_item1_title")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t(language, "howto_important_item1_desc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">
                        {t(language, "howto_important_item2_title")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t(language, "howto_important_item2_desc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">
                        {t(language, "howto_important_item3_title")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t(language, "howto_important_item3_desc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">
                        {t(language, "howto_important_item4_title")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t(language, "howto_important_item4_desc")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>
        </section>

        {/* CTA Section */}
        <section className="mb-20">
          <ScrollAnimation direction="up" threshold={0.15}>
            <Card className="bg-gradient-to-r from-primary/10 to-primary-hover/10 border-2 border-primary/20">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t(language, "howto_cta_title")}
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  {t(language, "howto_cta_subtitle")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="w-full sm:w-auto" onClick={handleViewToursClick}>
                    {t(language, "howto_cta_button_tours")}
                  </Button>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={handleBookOnlineClick}>
                    {t(language, "howto_cta_button_book")}
                  </Button>
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

export default HowToBook;
