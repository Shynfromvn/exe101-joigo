import { ChatBot } from "@/components/ChatBot";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Bot } from "lucide-react";
import { Link } from "react-router-dom";

const Chat = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('/images/bg_HaNoi.jpg')",
            opacity: 0.8  
          }}
        />
        
        {/* Overlay màu trắng */}
        <div className="absolute inset-0 bg-white/70" />

        {/* Nội dung chính */}
        <div className="relative container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link 
              to="/"
              className="inline-flex items-center gap-3 px-6 py-4 bg-white rounded-xl border-2 border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-lg hover:border-orange-300 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-orange-500" />
              <span className="text-orange-500 text-base font-semibold">Quay lại trang chủ</span>
            </Link>
          </div>

          {/* Page Header */}
          <div className="text-center mb-8 flex flex-col items-center gap-4">
            {/* Badge AI-Powered */}
            <div className="inline-flex items-center gap-2.5 px-6 py-3 bg-orange-50 rounded-full">
              <Bot className="w-6 h-6 text-orange-500" />
              <span className="text-orange-600 text-sm font-semibold">AI-Powered Travel Assistant</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Trợ Lý Ảo JOIGO
            </h1>
            
            {/* Subtitle */}
            <p className="text-gray-600 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
              Hỏi tôi bất cứ điều gì về các tour du lịch văn hóa tại Hà Nội. 
              Tôi sẽ giúp bạn tìm tour phù hợp nhất!
            </p>
          </div>

          {/* Chat Container */}
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden" style={{ height: "calc(100vh - 400px)", minHeight: "500px" }}>
              <ChatBot />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Chat;