import { useState } from "react";
import { Upload, Wand2, Film } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const ImageEditor = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMultipleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const readers = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((images) => {
      setSelectedImages(images);
    });
  };

  const handleStyleTransfer = () => {
    if (!selectedImage || !imagePrompt) {
      toast.error("Please upload an image and enter a prompt");
      return;
    }
    toast.success("Style transfer applied! (Demo)");
  };

  const handleCreateVideo = () => {
    if (selectedImages.length < 2) {
      toast.error("Please upload at least 2 images");
      return;
    }
    toast.success("Video creation started! (Demo)");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-3 text-center">Quick Image Editor</h1>
          <p className="text-muted-foreground text-center mb-12">
            Transform your travel photos with AI-powered editing tools
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Style Transfer */}
            <div className="bg-card border border-border rounded-2xl p-8 shadow-soft">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-ocean-gradient rounded-lg flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Image Style Transfer</h2>
                  <p className="text-sm text-muted-foreground">Apply artistic styles to your photos</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Upload Image</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                    >
                      {selectedImage ? (
                        <img src={selectedImage} alt="Preview" className="h-full object-contain" />
                      ) : (
                        <div className="text-center">
                          <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click to upload image</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Style Prompt</label>
                  <Textarea
                    placeholder="E.g., 'make it look like a watercolor painting'"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="min-h-24 resize-none"
                  />
                </div>

                <Button onClick={handleStyleTransfer} variant="hero" className="w-full">
                  Apply Style
                </Button>
              </div>
            </div>

            {/* Short Video Creation */}
            <div className="bg-card border border-border rounded-2xl p-8 shadow-soft">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-sunset-gradient rounded-lg flex items-center justify-center">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Video Creation</h2>
                  <p className="text-sm text-muted-foreground">Create videos from your photos</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Upload Images</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleImageUpload}
                      className="hidden"
                      id="multiple-image-upload"
                    />
                    <label
                      htmlFor="multiple-image-upload"
                      className="flex items-center justify-center h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                    >
                      {selectedImages.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2 p-4">
                          {selectedImages.slice(0, 6).map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click to upload images</p>
                        </div>
                      )}
                    </label>
                  </div>
                  {selectedImages.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {selectedImages.length} images selected
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Background Music</label>
                  <Input type="text" placeholder="Select or upload music" />
                </div>

                <Button onClick={handleCreateVideo} variant="accent" className="w-full">
                  Generate Video
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ImageEditor;
