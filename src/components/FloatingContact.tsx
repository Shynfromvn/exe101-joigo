import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Bot, Send, Users, Landmark, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTours } from "@/contexts/TourContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const suggestedQuestionsData = [
  { icon: Users, textVI: "Tour gia đình", textEN: "Family tour" },
  { icon: Landmark, textVI: "Văn hóa", textEN: "Culture" },
];

const FloatingContact = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { language } = useTours();

  // ===== CHAT STATE =====
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        language === "EN"
          ? "Hello! 👋 How can I help you with cultural tours in Hanoi?"
          : "Xin chào! 👋 Tôi có thể giúp gì cho bạn về các tour du lịch văn hóa tại Hà Nội?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Zalo & Messenger config
  const zaloPhone = "0984698782";
  const facebookPageId = "61586357533830";

  const getOrCreateSessionId = (): string => {
    const stored = localStorage.getItem("floating_chat_session_id");
    if (stored) return stored;
    const newSessionId = `floating_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("floating_chat_session_id", newSessionId);
    return newSessionId;
  };

  const [sessionId] = useState<string>(getOrCreateSessionId());

  // Auto scroll khi có tin nhắn mới
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Reset unread khi mở chat
  useEffect(() => {
    if (isChatOpen) setUnreadCount(0);
  }, [isChatOpen]);

  // Cập nhật welcome message khi đổi ngôn ngữ
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === "welcome") {
        return [
          {
            id: "welcome",
            role: "assistant",
            content:
              language === "EN"
                ? "Hello! 👋 How can I help you with cultural tours in Hanoi?"
                : "Xin chào! 👋 Tôi có thể giúp gì cho bạn về các tour du lịch văn hóa tại Hà Nội?",
            timestamp: new Date(),
          },
        ];
      }
      return prev;
    });
  }, [language]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputValue, session_id: sessionId, language }),
      });

      if (!response.ok) throw new Error("Failed");

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (!isChatOpen) setUnreadCount((prev) => prev + 1);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            language === "EN"
              ? "Sorry, an error occurred. Please try again."
              : "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
  };

  const suggestedQuestions = suggestedQuestionsData.map((item) => ({
    icon: item.icon,
    text: language === "EN" ? item.textEN : item.textVI,
  }));

  const handleZaloClick = () => {
    window.open(`https://zalo.me/${zaloPhone}`, "_blank");
  };

  const handleMessengerClick = () => {
    window.open(`https://m.me/${facebookPageId}`, "_blank");
  };

  const handleAIChatClick = () => {
    setIsChatOpen(true);
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* =============== EXPANDED BUTTONS =============== */}
      {isExpanded && !isChatOpen && (
        <div className="flex flex-col gap-3 animate-fade-in">
          {/* AI Chat Button */}
          <button
            onClick={handleAIChatClick}
            className="group relative flex items-center gap-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 pr-4"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-fuchsia-500 flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <span className="font-medium text-gray-700 pr-2">
              {language === "EN" ? "Chat with AI" : "Chat với AI"}
            </span>
            {/* Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-white text-[10px] font-bold">{unreadCount}</span>
              </span>
            )}
          </button>

          {/* Zalo Button */}
          <button
            onClick={handleZaloClick}
            className="group relative flex items-center gap-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 pr-4"
          >
            <div className="w-14 h-14 rounded-full bg-[#0068FF] flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                <path d="M24 4C12.96 4 4 11.92 4 21.76C4 27.2 6.72 32 11.04 35.28L10 42.4L17.6 38.96C19.6 39.6 21.76 40 24 40C35.04 40 44 32.08 44 22.24C44 12.4 35.04 4 24 4Z" fill="white"/>
              </svg>
            </div>
            <span className="font-medium text-gray-700 pr-2">
              {language === "EN" ? "Chat via Zalo" : "Chat qua Zalo"}
            </span>
          </button>

          {/* Messenger Button */}
          <button
            onClick={handleMessengerClick}
            className="group relative flex items-center gap-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 pr-4"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0084FF] to-[#00C6FF] flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                <path d="M24 4C12.4 4 3 12.8 3 24C3 29.2 5.2 34 8.8 37.6L7.2 44.8L14.8 41.6C17.6 43.2 20.8 44 24 44C35.6 44 45 35.2 45 24C45 12.8 35.6 4 24 4Z" fill="white"/>
              </svg>
            </div>
            <span className="font-medium text-gray-700 pr-2">
              {language === "EN" ? "Chat Messenger" : "Chat Messenger"}
            </span>
          </button>
        </div>
      )}

      {/* =============== FLOATING CHAT WIDGET =============== */}
      {isChatOpen && (
        <div className="w-[380px] h-[520px] bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] border border-gray-200 flex flex-col overflow-hidden animate-fade-in">
          {/* ===== HEADER ===== */}
          <div className="bg-gradient-to-r from-orange-500 to-fuchsia-500 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-[42px] h-[42px] bg-white/20 rounded-[14px] flex items-center justify-center border border-white/30">
                <Bot className="w-[22px] h-[22px] text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-[15px]">Joigo Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-[7px] h-[7px] bg-green-400 rounded-full shadow-[0_0_4px_rgba(34,197,94,0.5)]"></span>
                  <span className="text-white/80 text-xs">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="w-8 h-8 bg-white/20 rounded-[10px] flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-[18px] h-[18px] text-white" />
            </button>
          </div>

          {/* ===== MESSAGES AREA ===== */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 bg-gray-50 p-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2.5 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 shrink-0 bg-gradient-to-br from-orange-500 to-orange-400 rounded-[10px] flex items-center justify-center">
                      <Bot className="w-[18px] h-[18px] text-white" />
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <div
                      className={`max-w-[240px] px-3.5 py-3 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-[16px] rounded-br-[4px]"
                          : "bg-white border border-gray-200 text-gray-700 rounded-[16px] rounded-bl-[4px]"
                      }`}
                    >
                      <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <span className={`text-[11px] text-gray-400 ${message.role === "user" ? "text-right" : ""}`}>
                      {message.timestamp.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Loading */}
              {isLoading && (
                <div className="flex gap-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-400 rounded-[10px] flex items-center justify-center">
                    <Bot className="w-[18px] h-[18px] text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-[16px] rounded-bl-[4px] px-3.5 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {messages.length === 1 && (
                <div className="space-y-2 mt-4">
                  <div className="flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-400 font-medium">
                      {language === "EN" ? "Quick suggestions" : "Gợi ý nhanh"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(item.text)}
                        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                          index === 0
                            ? "bg-white border-[1.5px] border-orange-500 text-gray-700"
                            : "bg-white border border-gray-200 text-gray-700 hover:border-orange-300"
                        }`}
                      >
                        <item.icon className={`w-3.5 h-3.5 ${index === 0 ? "text-orange-500" : "text-gray-400"}`} />
                        {item.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* ===== INPUT SECTION ===== */}
          <div className="p-4 border-t border-gray-200 flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2.5 bg-gray-100 rounded-[14px] px-3.5 h-11 border border-gray-200">
              <MessageCircle className="w-[18px] h-[18px] text-gray-400" />
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={language === "EN" ? "Type a message..." : "Nhập tin nhắn..."}
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-[14px] text-gray-700 placeholder:text-gray-400 h-full p-0"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center shadow-[0_3px_8px_rgba(249,115,22,0.25)] hover:shadow-[0_4px_12px_rgba(249,115,22,0.35)] transition-all disabled:opacity-50"
            >
              <Send className="w-[18px] h-[18px] text-white" />
            </button>
          </div>
        </div>
      )}

      {/* =============== MAIN FAB BUTTON =============== */}
      <button
        onClick={() => {
          if (isChatOpen) {
            setIsChatOpen(false);
          } else {
            setIsExpanded(!isExpanded);
          }
        }}
        className={`w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
          isExpanded || isChatOpen
            ? "bg-gray-500 hover:bg-gray-600"
            : "bg-gradient-to-br from-orange-500 to-fuchsia-500 hover:scale-110"
        }`}
      >
        {isExpanded || isChatOpen ? (
          <X className="w-7 h-7 text-white" />
        ) : (
          <>
            <MessageCircle className="w-7 h-7 text-white" />
            {/* Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-[22px] h-[22px] bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-white text-[11px] font-bold">{unreadCount}</span>
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
};

export default FloatingContact;