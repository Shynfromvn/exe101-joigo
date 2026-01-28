import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import vanMieu from "@/assets/van-mieu.jpg";
import langluaVanPhuc from "@/assets/lang-lua-van-phuc.jpeg";
import langtrePhuVinh from "@/assets/lang-nghe-may-tre-dan-phu-vinh.jpg";
import chuonchuontre from "@/assets/chuon-chuon-tre.jpg";
import game from "@/assets/Game.jpg";
import { useTours } from "@/contexts/TourContext";
import { t } from "@/lib/i18n";

const slides = [
  {
    image: vanMieu,
    titleKey: "hero_slide_0_title" as const,
    subtitleKey: "hero_slide_0_subtitle" as const,
  },
  {
    image: langluaVanPhuc,
    titleKey: "hero_slide_1_title" as const,
    subtitleKey: "hero_slide_1_subtitle" as const,
  },
  {
    image: langtrePhuVinh,
    titleKey: "hero_slide_2_title" as const,
    subtitleKey: "hero_slide_2_subtitle" as const,
  },
  {
    image: chuonchuontre,
    titleKey: "hero_slide_3_title" as const,
    subtitleKey: "hero_slide_3_subtitle" as const,
  },
  {
    image: game,
    titleKey: "hero_slide_4_title" as const,
    subtitleKey: "hero_slide_4_subtitle" as const,
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { language } = useTours();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="group relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={t(language, slide.titleKey)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <h2 className="text-4xl md:text-6xl font-bold mb-3">
              {t(language, slide.titleKey)}
            </h2>
            <p className="text-lg md:text-xl text-white/90">
              {t(language, slide.subtitleKey)}
            </p>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100 duration-300"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100 duration-300"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
