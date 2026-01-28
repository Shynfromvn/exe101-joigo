import { Link } from "react-router-dom";
import { Image, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTours } from "@/contexts/TourContext";
import { t } from "@/lib/i18n_temp";

const PhotoFrameBanner = () => {
  const { language } = useTours();
  return (
    <section className="mb-12">
      <Link to="/photo-frame">
        <Card className="group relative overflow-hidden border border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-lg cursor-pointer">
          <CardContent className="p-0">
            <div className="relative bg-ocean-gradient p-4 md:p-6">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-6">
                {/* Left: Icon and Text */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <Image className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-white/80 animate-pulse" />
                      <Sparkles className="w-3 h-3 text-white/60 animate-pulse delay-75" />
                    </div>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1.5 group-hover:scale-105 transition-transform duration-300">
                    {t(language, "photo_frame_banner_title")}
                  </h2>
                  <p className="text-sm md:text-base text-white/90 mb-3 max-w-xl">
                    {t(language, "photo_frame_banner_desc")}
                  </p>

                  <Button
                    size="sm"
                    className="bg-white text-primary hover:bg-white/90 font-medium text-sm px-4 py-2 group-hover:scale-105 transition-transform duration-300"
                  >
                    {t(language, "photo_frame_banner_cta")}
                    <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>

                {/* Right: Preview Frames - Smaller */}
                <div className="flex-1 grid grid-cols-3 gap-2 max-w-xs mx-auto md:mx-0">
                  {[
                    {
                      color: "bg-blue-400",
                      border: "border-2 border-blue-200",
                      rotate: -2,
                    },
                    {
                      color: "bg-cyan-400",
                      border: "border-2 border-cyan-200",
                      rotate: 1,
                    },
                    {
                      color: "bg-teal-400",
                      border: "border-2 border-teal-200",
                      rotate: -1,
                    },
                    {
                      color: "bg-sky-400",
                      border: "border-2 border-sky-200",
                      rotate: 2,
                    },
                    {
                      color: "bg-indigo-400",
                      border: "border-2 border-indigo-200",
                      rotate: -1,
                    },
                    {
                      color: "bg-blue-500",
                      border: "border-2 border-blue-300",
                      rotate: 1,
                    },
                  ].map((frame, index) => (
                    <div
                      key={index}
                      className={`aspect-square ${frame.color} ${frame.border} rounded-md shadow-md transition-all duration-300 group-hover:scale-105`}
                      style={{
                        transform: `rotate(${frame.rotate}deg)`,
                      }}
                    >
                      <div className="w-full h-full bg-white/20 backdrop-blur-sm rounded flex items-center justify-center">
                        <div className="w-4 h-4 bg-white/40 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </section>
  );
};

export default PhotoFrameBanner;
