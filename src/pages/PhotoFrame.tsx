import PhotoFrameEditor from "@/components/PhotoFrameEditor";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PhotoFrame = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-12">
        <PhotoFrameEditor />
      </main>
      <Footer />
    </div>
  );
};

export default PhotoFrame;
