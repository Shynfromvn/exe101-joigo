import { ChatBot } from "@/components/ChatBot";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Chat = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Quay lại trang chủ
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Trợ Lý Ảo JOIGO
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hỏi tôi bất cứ điều gì về các tour du lịch văn hóa tại Hà Nội. 
            Tôi sẽ giúp bạn tìm tour phù hợp nhất!
          </p>
        </div>

        {/* Chat Container */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden" style={{ height: "calc(100vh - 400px)", minHeight: "500px" }}>
            <ChatBot />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Chat;

