import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Track visitor
export const useVisitorTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        await fetch(`${API_BASE_URL}/api/tracking/visitor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page_path: location.pathname,
          }),
        });
      } catch (error) {
        // Silently fail - tracking should not break the app
        console.debug("Visitor tracking failed:", error);
      }
    };

    trackVisitor();
  }, [location.pathname]);
};

// Track tour view
export const useTourViewTracking = (tourId: string | undefined) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!tourId) return;

    const trackTourView = async () => {
      try {
        await fetch(`${API_BASE_URL}/api/tracking/tour-view`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tour_id: tourId,
            user_id: user?.id || null,
          }),
        });
      } catch (error) {
        // Silently fail - tracking should not break the app
        console.debug("Tour view tracking failed:", error);
      }
    };

    trackTourView();
  }, [tourId, user?.id]);
};
