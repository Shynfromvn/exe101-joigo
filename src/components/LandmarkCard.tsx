import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useTours } from "@/contexts/TourContext";
import { t } from "@/lib/i18n_temp";

interface LandmarkCardProps {
  image: string;
  name: string;
  nameKey?: string;
  destination: string;
}

const LandmarkCard = ({
  image,
  name,
  nameKey,
  destination,
}: LandmarkCardProps) => {
  const navigate = useNavigate();
  const { setFilters, setSearchQuery, language } = useTours();

  const handleClick = () => {
    setSearchQuery("");
    setFilters({
      tourType: "all",
      departure: "all",
      destination: destination,
      transportation: "all",
    });
    navigate("/tours");
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
            {nameKey ? t(language, nameKey as any) : name}
          </h3>
        </div>
      </div>
    </Card>
  );
};

export default LandmarkCard;
