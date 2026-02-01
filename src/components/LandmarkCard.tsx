import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useTours } from "@/contexts/TourContext";

interface LandmarkCardProps {
  image: string;
  name: string;
  name_en?: string; // Optional English name
  destination: string;
  tourId?: string; // Optional tour ID to navigate to specific tour detail
}

const LandmarkCard = ({
  image,
  name,
  name_en,
  destination,
  tourId,
}: LandmarkCardProps) => {
  const navigate = useNavigate();
  const { language } = useTours();
  
  // Chọn name_en khi language là EN, ngược lại dùng name (VI)
  const displayName = language === "EN" && name_en ? name_en : name;

  const handleClick = () => {
    if (tourId) {
      // Navigate to specific tour detail page
      navigate(`/tours/${tourId}`);
      // Scroll to top after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } else {
      // Fallback: navigate to tours page with destination filter
      navigate("/tours");
    }
  };

  return (
    <Card
      onClick={handleClick}
      className="group overflow-hidden border-border hover:shadow-hover transition-all duration-300 cursor-pointer hover:-translate-y-2"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-white text-2xl font-bold group-hover:scale-105 transition-transform">
            {displayName}
          </h3>
        </div>
      </div>
    </Card>
  );
};

export default LandmarkCard;
