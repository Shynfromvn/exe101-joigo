import { useState, useRef, useEffect } from "react";
import {
  Upload,
  Download,
  Image as ImageIcon,
  X,
  Sparkles,
  Flower2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useTours } from "@/contexts/TourContext";
import { t, type Language } from "@/lib/i18n";

interface FrameConfig {
  id: string;
  nameKey:
  | "photo_frame_frame_classic"
  | "photo_frame_frame_modern"
  | "photo_frame_frame_elegant"
  | "photo_frame_frame_minimal"
  | "photo_frame_frame_vintage"
  | "photo_frame_frame_bold"
  | "photo_frame_frame_ornamental"
  | "photo_frame_simple"
  | "photo_frame_frame_floral"
  | "photo_frame_banh_keo"
  | "photo_frame_banh_keo_1"
  | "photo_frame_cung_hy_phat_tai"
  | "photo_frame_vui_tet_2026";
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  padding: number;
  shadow: boolean;
  style: "solid" | "dashed" | "double" | "ornate" | "svg";
  svgPath?: string;
}

const frameConfigs: FrameConfig[] = [
  {
    id: "classic",
    nameKey: "photo_frame_frame_classic",
    borderWidth: 20,
    borderColor: "#8B4513",
    borderRadius: 8,
    padding: 15,
    shadow: true,
    style: "solid",
  },
  {
    id: "modern",
    nameKey: "photo_frame_frame_modern",
    borderWidth: 15,
    borderColor: "#2C3E50",
    borderRadius: 0,
    padding: 20,
    shadow: true,
    style: "solid",
  },
  {
    id: "elegant",
    nameKey: "photo_frame_frame_elegant",
    borderWidth: 25,
    borderColor: "#D4AF37",
    borderRadius: 12,
    padding: 18,
    shadow: true,
    style: "double",
  },
  {
    id: "minimal",
    nameKey: "photo_frame_frame_minimal",
    borderWidth: 10,
    borderColor: "#FFFFFF",
    borderRadius: 4,
    padding: 25,
    shadow: false,
    style: "solid",
  },
  {
    id: "vintage",
    nameKey: "photo_frame_frame_vintage",
    borderWidth: 30,
    borderColor: "#8B7355",
    borderRadius: 20,
    padding: 12,
    shadow: true,
    style: "ornate",
  },
  {
    id: "bold",
    nameKey: "photo_frame_frame_bold",
    borderWidth: 20,
    borderColor: "#E74C3C",
    borderRadius: 0,
    padding: 15,
    shadow: true,
    style: "solid",
  },
  {
    id: "ornamental",
    nameKey: "photo_frame_frame_ornamental",
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 0,
    padding: 50,
    shadow: false,
    style: "svg",
    svgPath: "/frames/ornamental-frame.svg",
  },
  {
    id: "floral",
    nameKey: "photo_frame_frame_floral",
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 0,
    padding: 50,
    shadow: false,
    style: "svg",
    svgPath: "/frames/floral-frame.svg",
  },
  {
    id: "simple",
    nameKey: "photo_frame_simple",
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 0,
    padding: 50,
    shadow: false,
    style: "svg",
    svgPath: "/frames/simple.svg",
  },
  {
    id: "banh_keo",
    nameKey: "photo_frame_banh_keo",
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 0,
    padding: 50,
    shadow: false,
    style: "svg",
    svgPath: "/frames/banh_keo.svg",
  },
  {
    id: "banh_keo_1",
    nameKey: "photo_frame_banh_keo_1",
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 0,
    padding: 50,
    shadow: false,
    style: "svg",
    svgPath: "/frames/banh_keo_1.svg",
  },
  {
    id: "cung_hy_phat_tai",
    nameKey: "photo_frame_cung_hy_phat_tai",
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 0,
    padding: 50,
    shadow: false,
    style: "svg",
    svgPath: "/frames/cung_hy_phat_tai.svg",
  },
  {
    id: "vui_tet_2026",
    nameKey: "photo_frame_vui_tet_2026",
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 0,
    padding: 50,
    shadow: false,
    style: "svg",
    svgPath: "/frames/vui_tet_2026.svg",
  }
];

const PhotoFrameEditor = () => {
  const { language } = useTours();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<FrameConfig>(
    frameConfigs[0]
  );
  const [framedImageUrl, setFramedImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setFramedImageUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const drawFrame = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frame: FrameConfig,
    shadowOffset: number = 0
  ) => {
    const totalWidth = width + frame.padding * 2 + frame.borderWidth * 2;
    const totalHeight = height + frame.padding * 2 + frame.borderWidth * 2;
    const offsetX = shadowOffset;
    const offsetY = shadowOffset;

    // Draw background (padding area)
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(offsetX, offsetY, totalWidth, totalHeight);

    // Draw frame border
    if (frame.style === "double") {
      // Double border - outer
      ctx.fillStyle = frame.borderColor;
      ctx.fillRect(offsetX, offsetY, totalWidth, totalHeight);
      // Inner border (white space)
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(
        offsetX + frame.borderWidth * 0.3,
        offsetY + frame.borderWidth * 0.3,
        totalWidth - frame.borderWidth * 0.6,
        totalHeight - frame.borderWidth * 0.6
      );
      // Inner border line
      ctx.strokeStyle = frame.borderColor;
      ctx.lineWidth = frame.borderWidth * 0.2;
      ctx.strokeRect(
        offsetX + frame.borderWidth * 0.5,
        offsetY + frame.borderWidth * 0.5,
        totalWidth - frame.borderWidth,
        totalHeight - frame.borderWidth
      );
    } else if (frame.style === "dashed") {
      // Dashed border
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(offsetX, offsetY, totalWidth, totalHeight);
      ctx.setLineDash([10, 5]);
      ctx.strokeStyle = frame.borderColor;
      ctx.lineWidth = frame.borderWidth;
      ctx.strokeRect(
        offsetX + frame.borderWidth / 2,
        offsetY + frame.borderWidth / 2,
        totalWidth - frame.borderWidth,
        totalHeight - frame.borderWidth
      );
      ctx.setLineDash([]);
    } else if (frame.style === "ornate") {
      // Ornate border with corners
      ctx.fillStyle = frame.borderColor;
      ctx.fillRect(offsetX, offsetY, totalWidth, totalHeight);
      // Draw corner decorations
      const cornerSize = 30;
      ctx.fillStyle = "#FFFFFF";
      // Top-left corner
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + cornerSize);
      ctx.lineTo(offsetX + cornerSize, offsetY);
      ctx.lineTo(offsetX, offsetY);
      ctx.closePath();
      ctx.fill();
      // Top-right corner
      ctx.beginPath();
      ctx.moveTo(offsetX + totalWidth - cornerSize, offsetY);
      ctx.lineTo(offsetX + totalWidth, offsetY + cornerSize);
      ctx.lineTo(offsetX + totalWidth, offsetY);
      ctx.closePath();
      ctx.fill();
      // Bottom-left corner
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + totalHeight - cornerSize);
      ctx.lineTo(offsetX + cornerSize, offsetY + totalHeight);
      ctx.lineTo(offsetX, offsetY + totalHeight);
      ctx.closePath();
      ctx.fill();
      // Bottom-right corner
      ctx.beginPath();
      ctx.moveTo(offsetX + totalWidth - cornerSize, offsetY + totalHeight);
      ctx.lineTo(offsetX + totalWidth, offsetY + totalHeight - cornerSize);
      ctx.lineTo(offsetX + totalWidth, offsetY + totalHeight);
      ctx.closePath();
      ctx.fill();
    } else {
      // Solid border
      ctx.fillStyle = frame.borderColor;
      ctx.fillRect(offsetX, offsetY, totalWidth, totalHeight);
    }
  };

  // Helper function to draw rounded rectangle path
  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  // Helper function to load SVG and convert to Image
  const loadSVGFrame = (svgPath: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      fetch(svgPath)
        .then((response) => response.text())
        .then((svgText) => {
          const img = new Image();
          const blob = new Blob([svgText], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);

          img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
          };
          img.onerror = reject;
          img.src = url;
        })
        .catch(reject);
    });
  };

  // Helper function to draw SVG frame
  const drawSVGFrame = async (
    ctx: CanvasRenderingContext2D,
    imageWidth: number,
    imageHeight: number,
    svgPath: string,
    padding: number
  ) => {
    try {
      const svgImage = await loadSVGFrame(svgPath);
      const totalWidth = imageWidth + padding * 2;
      const totalHeight = imageHeight + padding * 2;

      // Draw SVG frame scaled to fit the total dimensions
      ctx.drawImage(svgImage, 0, 0, totalWidth, totalHeight);
    } catch (error) {
      console.error("Error loading SVG frame:", error);
      toast.error("Failed to load SVG frame");
    }
  };

  const applyFrame = async () => {
    if (!selectedImage || !canvasRef.current) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const frame = selectedFrame;
      const padding = frame.padding;
      const borderWidth = frame.borderWidth;

      // Limit image size to prevent canvas from being too large
      const maxDimension = 2000;
      let imageWidth = img.width;
      let imageHeight = img.height;

      if (imageWidth > maxDimension || imageHeight > maxDimension) {
        const ratio = Math.min(
          maxDimension / imageWidth,
          maxDimension / imageHeight
        );
        imageWidth = imageWidth * ratio;
        imageHeight = imageHeight * ratio;
      }

      // Calculate canvas size (add extra space for shadow if needed)
      const shadowOffset = frame.shadow ? 8 : 0;
      // For SVG frames, use padding; for canvas frames, use borderWidth + padding
      const frameSpace = frame.style === "svg" ? padding * 2 : padding * 2 + borderWidth * 2;
      const totalWidth = imageWidth + frameSpace + shadowOffset;
      const totalHeight = imageHeight + frameSpace + shadowOffset;

      canvas.width = totalWidth;
      canvas.height = totalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, totalWidth, totalHeight);

      // Set image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Draw shadow first if enabled
      if (frame.shadow) {
        ctx.save();
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = "#000000";
        // Draw shadow with blur effect (multiple layers for blur)
        for (let i = 0; i < 3; i++) {
          ctx.fillRect(
            shadowOffset - i,
            shadowOffset - i,
            imageWidth + padding * 2 + borderWidth * 2 + i * 2,
            imageHeight + padding * 2 + borderWidth * 2 + i * 2
          );
        }
        ctx.globalAlpha = 1.0;
        ctx.restore();
      }


      // For SVG frames, draw image first (no frame yet)
      // For canvas frames, draw frame first
      if (frame.style !== "svg" || !frame.svgPath) {
        drawFrame(ctx, imageWidth, imageHeight, frame, shadowOffset);
      }

      // Draw image in the center
      const imageX = frame.style === "svg" ? 0 : shadowOffset + borderWidth + padding;
      const imageY = frame.style === "svg" ? 0 : shadowOffset + borderWidth + padding;

      // Clip to rounded rectangle if needed
      if (frame.borderRadius > 0) {
        ctx.save();
        drawRoundedRect(
          ctx,
          imageX,
          imageY,
          imageWidth,
          imageHeight,
          frame.borderRadius
        );
        ctx.clip();
      }

      ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);

      if (frame.borderRadius > 0) {
        ctx.restore();
      }

      // For SVG frames, draw SVG overlay on top of the image
      if (frame.style === "svg" && frame.svgPath) {
        await drawSVGFrame(ctx, imageWidth, imageHeight, frame.svgPath, padding);
      }

      // Convert to blob and create URL
      canvas.toBlob((blob) => {
        if (blob) {
          // Clean up old URL if exists
          if (framedImageUrl) {
            URL.revokeObjectURL(framedImageUrl);
          }
          const url = URL.createObjectURL(blob);
          setFramedImageUrl(url);
          toast.success(t(language, "photo_frame_success"));
        }
      }, "image/png");
    };

    img.src = selectedImage;
    imageRef.current = img;
  };

  useEffect(() => {
    if (selectedImage) {
      applyFrame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFrame, selectedImage]);

  const handleDownload = () => {
    if (!framedImageUrl) {
      toast.error(t(language, "photo_frame_download_error"));
      return;
    }

    const link = document.createElement("a");
    link.href = framedImageUrl;
    link.download = `framed-photo-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(t(language, "photo_frame_download_success"));
  };

  const handleClear = () => {
    if (framedImageUrl) {
      URL.revokeObjectURL(framedImageUrl);
    }
    setSelectedImage(null);
    setFramedImageUrl(null);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (framedImageUrl) {
        URL.revokeObjectURL(framedImageUrl);
      }
    };
  }, [framedImageUrl]);

  return (
    <div>
      {/* Decorative Green Banner with Title */}
      <div className="relative mb-12 w-full overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500"></div>

        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-15">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(255,255,255,.15) 15px, rgba(255,255,255,.15) 30px),
              repeating-linear-gradient(-45deg, transparent, transparent 15px, rgba(255,255,255,.15) 15px, rgba(255,255,255,.15) 30px)
            `,
            }}
          ></div>
        </div>

        {/* Additional decorative dots */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-8 left-8 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute top-12 right-16 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute bottom-10 left-20 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute bottom-8 right-12 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-12 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-1/2 right-20 w-1 h-1 bg-white rounded-full"></div>
        </div>

        {/* Decorative elements - SVG patterns */}
        <div className="absolute top-4 left-4 w-24 h-24 opacity-25">
          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <circle
              cx="50"
              cy="50"
              r="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="50" cy="50" r="8" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute top-2 right-4 w-32 h-32 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
            <path
              d="M50,10 L58,35 L85,35 L65,52 L75,85 L50,68 L25,85 L35,52 L15,35 L42,35 Z"
              fill="currentColor"
              opacity="0.8"
            />
            <circle cx="50" cy="50" r="5" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-4 left-1/4 w-28 h-28 opacity-22">
          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
            <path
              d="M25,50 Q50,25 75,50 Q50,75 25,50"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
            />
            <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.9" />
          </svg>
        </div>
        <div className="absolute bottom-2 right-1/4 w-24 h-24 opacity-25">
          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
            <rect
              x="28"
              y="28"
              width="44"
              height="44"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              rx="4"
            />
            <rect
              x="35"
              y="35"
              width="30"
              height="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              rx="3"
            />
            <circle cx="50" cy="50" r="4" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute top-1/3 left-1/6 w-20 h-20 opacity-18">
          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
            <polygon
              points="50,15 65,45 95,45 72,65 80,95 50,75 20,95 28,65 5,45 35,45"
              fill="currentColor"
              opacity="0.7"
            />
          </svg>
        </div>

        {/* Small decorative flowers/icons */}
        <div className="absolute top-4 left-1/4 text-white/30">
          <Flower2 className="w-6 h-6 animate-pulse" />
        </div>
        <div className="absolute top-6 right-1/3 text-white/25">
          <Sparkles className="w-5 h-5 animate-pulse delay-75" />
        </div>
        <div className="absolute bottom-4 left-1/3 text-white/30">
          <Sparkles className="w-4 h-4 animate-pulse delay-150" />
        </div>
        <div className="absolute bottom-6 right-1/4 text-white/25">
          <Flower2 className="w-5 h-5 animate-pulse delay-200" />
        </div>

        {/* Border decoration */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

        {/* Decorative border pattern */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/20"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20"></div>
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

        {/* Content */}
        <div className="relative z-10 px-8 py-10 md:py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
              {t(language, "photo_frame_title")}
            </h1>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
          </div>
          <p className="text-base md:text-lg lg:text-xl text-white/95 max-w-2xl mx-auto drop-shadow-md px-4">
            {t(language, "photo_frame_subtitle")}
          </p>
        </div>

        {/* Bottom decorative separator */}
        <div className="absolute -bottom-px left-0 right-0 h-12 bg-background/50 backdrop-blur-sm"></div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Upload and Frame Selection */}
          <div className="space-y-6">
            {/* Image Upload */}
            <Card>
              <CardContent className="p-6">
                <label className="block text-sm font-medium mb-4">
                  {t(language, "photo_frame_upload")}
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                  >
                    {selectedImage ? (
                      <div className="relative w-full h-full">
                        <img
                          src={selectedImage}
                          alt="Preview"
                          className="w-full h-full object-contain rounded"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleClear();
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {t(language, "photo_frame_upload_click")}
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Frame Selection */}
            <Card>
              <CardContent className="p-6">
                <label className="block text-sm font-medium mb-4">
                  {t(language, "photo_frame_select_frame")}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {frameConfigs.map((frame) => (
                    <button
                      key={frame.id}
                      onClick={() => setSelectedFrame(frame)}
                      className={`p-4 border-2 rounded-lg transition-all ${selectedFrame.id === frame.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                        }`}
                    >
                      {frame.style === "svg" && frame.svgPath ? (
                        <div className="w-full h-24 mb-2 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                          <img
                            src={frame.svgPath}
                            alt={t(language, frame.nameKey)}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-full h-24 mb-2 rounded"
                          style={{
                            backgroundColor: frame.borderColor,
                            borderWidth: `${frame.borderWidth / 3}px`,
                            borderStyle: "solid",
                            borderColor: frame.borderColor,
                          }}
                        />
                      )}
                      <p className="text-sm font-medium text-center">
                        {t(language, frame.nameKey)}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={applyFrame}
                disabled={!selectedImage}
                className="flex-1"
                variant="default"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                {t(language, "photo_frame_apply")}
              </Button>
              <Button
                onClick={handleDownload}
                disabled={!framedImageUrl}
                className="flex-1"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                {t(language, "photo_frame_download")}
              </Button>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <label className="block text-sm font-medium mb-4">
                  {t(language, "photo_frame_preview")}
                </label>
                <div className="flex items-center justify-center min-h-[400px] bg-muted/50 rounded-lg p-4">
                  {framedImageUrl ? (
                    <img
                      src={framedImageUrl}
                      alt="Framed preview"
                      className="max-w-full max-h-[500px] rounded-lg shadow-lg"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                      <p>{t(language, "photo_frame_preview_placeholder")}</p>
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoFrameEditor;
