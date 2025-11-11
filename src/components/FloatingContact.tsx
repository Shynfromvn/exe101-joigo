import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const FloatingContact = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // HƯỚNG DẪN: Thay đổi các thông tin sau theo thông tin thực tế của bạn
  // 1. Zalo: Nhập số điện thoại Zalo (VD: "0987654321")
  // 2. Messenger: Nhập Facebook Page ID hoặc Username (VD: "joigotravel" hoặc "100063...")
  const zaloPhone = "0987654321"; // Số điện thoại Zalo
  const facebookPageId = "joigotravel"; // Facebook Page ID hoặc Username

  const handleZaloClick = () => {
    // Mở Zalo chat
    window.open(`https://zalo.me/${zaloPhone}`, "_blank");
  };

  const handleMessengerClick = () => {
    // Mở Messenger chat
    window.open(`https://m.me/${facebookPageId}`, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded buttons */}
      {isExpanded && (
        <div className="flex flex-col gap-3 animate-fade-in">
          {/* Zalo Button */}
          <button
            onClick={handleZaloClick}
            className="group relative flex items-center gap-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 pr-4"
            aria-label="Chat qua Zalo"
          >
            <div className="w-14 h-14 rounded-full bg-[#0068FF] flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 4C12.96 4 4 11.92 4 21.76C4 27.2 6.72 32 11.04 35.28L10 42.4L17.6 38.96C19.6 39.6 21.76 40 24 40C35.04 40 44 32.08 44 22.24C44 12.4 35.04 4 24 4Z"
                  fill="white"
                />
                <path
                  d="M16.8 28.4C16.4 28.4 16 28.24 15.76 27.92L12.4 23.6C12.08 23.2 12.08 22.56 12.4 22.16L15.76 17.84C16.24 17.28 17.12 17.2 17.68 17.68C18.24 18.16 18.32 19.04 17.84 19.6L15.36 22.88L17.84 26.16C18.32 26.72 18.24 27.6 17.68 28.08C17.44 28.32 17.12 28.4 16.8 28.4Z"
                  fill="#0068FF"
                />
                <path
                  d="M31.2 28.4C30.88 28.4 30.56 28.32 30.32 28.08C29.76 27.6 29.68 26.72 30.16 26.16L32.64 22.88L30.16 19.6C29.68 19.04 29.76 18.16 30.32 17.68C30.88 17.2 31.76 17.28 32.24 17.84L35.6 22.16C35.92 22.56 35.92 23.2 35.6 23.6L32.24 27.92C32 28.24 31.6 28.4 31.2 28.4Z"
                  fill="#0068FF"
                />
                <path
                  d="M21.6 28.4C21.12 28.4 20.64 28.08 20.48 27.6L18.08 19.6C17.84 18.88 18.24 18.16 18.96 17.92C19.68 17.68 20.4 18.08 20.64 18.8L22.4 24.64L24.16 18.8C24.4 18.08 25.12 17.68 25.84 17.92C26.56 18.16 26.96 18.88 26.72 19.6L24.32 27.6C24.16 28.08 23.68 28.4 23.2 28.4H21.6Z"
                  fill="#0068FF"
                />
                <path
                  d="M27.2 28.4C26.64 28.4 26.16 27.92 26.16 27.36V18.8C26.16 18.24 26.64 17.76 27.2 17.76C27.76 17.76 28.24 18.24 28.24 18.8V27.36C28.24 27.92 27.76 28.4 27.2 28.4Z"
                  fill="#0068FF"
                />
              </svg>
            </div>
            <span className="font-medium text-gray-700 pr-2">Chat qua Zalo</span>
          </button>

          {/* Messenger Button */}
          <button
            onClick={handleMessengerClick}
            className="group relative flex items-center gap-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 pr-4"
            aria-label="Chat qua Messenger"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0084FF] via-[#0084FF] to-[#00C6FF] flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 4C12.4 4 3 12.8 3 24C3 29.2 5.2 34 8.8 37.6L7.2 44.8L14.8 41.6C17.6 43.2 20.8 44 24 44C35.6 44 45 35.2 45 24C45 12.8 35.6 4 24 4Z"
                  fill="white"
                />
                <path
                  d="M24 8C14.6 8 7 15.2 7 24C7 28.4 8.8 32.4 11.6 35.2L10.4 40.8L16.4 38.4C18.8 39.6 21.4 40.4 24 40.4C33.4 40.4 41 33.2 41 24C41 14.8 33.4 8 24 8ZM32.4 20L26 26.4L20 22.8L13.6 26.4L20.8 18.4L27.2 21.6L33.2 18L32.4 20Z"
                  fill="url(#messenger-gradient)"
                />
                <defs>
                  <linearGradient
                    id="messenger-gradient"
                    x1="13.6"
                    y1="8"
                    x2="13.6"
                    y2="40.8"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#0084FF" />
                    <stop offset="1" stopColor="#00C6FF" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="font-medium text-gray-700 pr-2">Chat Messenger</span>
          </button>
        </div>
      )}

      {/* Main toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-20 h-20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
          isExpanded
            ? "bg-gray-500 hover:bg-gray-600"
            : "bg-gradient-to-br from-primary to-primary-hover hover:scale-110"
        }`}
        aria-label={isExpanded ? "Đóng" : "Liên hệ"}
      >
        {isExpanded ? (
          <X className="w-8 h-8 text-white" />
        ) : (
          <MessageCircle className="w-8 h-8 text-white" />
        )}
      </button>
    </div>
  );
};

export default FloatingContact;
