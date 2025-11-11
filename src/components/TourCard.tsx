import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useTours } from "@/contexts/TourContext";
import { t } from "@/lib/i18n";

interface TourCardProps {
  id: string;
  image: string;
  title: string;
  titleKey?: string;
  rating: number;
  reviews: number;
  price: number;
}

const TourCard = ({
  id,
  image,
  title,
  titleKey,
  rating,
  reviews,
  price,
}: TourCardProps) => {
  const { currency, language } = useTours();
  const navigate = useNavigate();
  const formattedPrice =
    currency === "VND" ? `${(price * 23000).toLocaleString()}₫` : `$${price}`;

  const displayTitle = titleKey ? t(language, titleKey as any) : title;

  const handleClick = () => {
    navigate(`/tours/${id}`);
  };

  return (
    <Card
      className="group overflow-hidden border-border hover:shadow-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={displayTitle}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {displayTitle}
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? "fill-accent text-accent"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {rating} ({reviews} {t(language, "td_reviews")})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">
              {formattedPrice}
            </span>
            <span className="text-sm text-muted-foreground ml-1">
              {t(language, "td_per_person")}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TourCard;
