import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade" | "scale";
  stagger?: boolean;
  staggerIndex?: number;
  threshold?: number;
}

const ScrollAnimation = ({
  children,
  className,
  delay = 0,
  direction = "up",
  stagger = false,
  staggerIndex = 0,
  threshold = 0.1,
}: ScrollAnimationProps) => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: threshold ?? 0.15,
    rootMargin: "0px 0px -80px 0px",
    triggerOnce: false,
  });

  const calculatedDelay = stagger ? staggerIndex * 100 : delay;

  const getAnimationClasses = () => {
    const baseClasses = "transition-all duration-700 ease-out";

    if (!isVisible) {
      switch (direction) {
        case "up":
          return cn(baseClasses, "opacity-0 translate-y-12");
        case "down":
          return cn(baseClasses, "opacity-0 -translate-y-12");
        case "left":
          return cn(baseClasses, "opacity-0 -translate-x-12");
        case "right":
          return cn(baseClasses, "opacity-0 translate-x-12");
        case "scale":
          return cn(baseClasses, "opacity-0 scale-90");
        case "fade":
        default:
          return cn(baseClasses, "opacity-0");
      }
    }

    switch (direction) {
      case "up":
        return cn(baseClasses, "opacity-100 translate-y-0");
      case "down":
        return cn(baseClasses, "opacity-100 translate-y-0");
      case "left":
        return cn(baseClasses, "opacity-100 translate-x-0");
      case "right":
        return cn(baseClasses, "opacity-100 translate-x-0");
      case "scale":
        return cn(baseClasses, "opacity-100 scale-100");
      case "fade":
      default:
        return cn(baseClasses, "opacity-100");
    }
  };

  return (
    <div
      ref={elementRef}
      className={cn(getAnimationClasses(), className)}
      style={{
        transitionDelay:
          calculatedDelay > 0 ? `${calculatedDelay}ms` : undefined,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollAnimation;
