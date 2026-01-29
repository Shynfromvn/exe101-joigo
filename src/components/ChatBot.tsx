import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, Users, Landmark, Wallet, Palette, Paperclip, Mic, MessageCircle, Lightbulb, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useTours } from "@/contexts/TourContext";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const API_BASE_URL = "http://127.0.0.1:8000";

// Định nghĩa suggested questions với icon và cả 2 ngôn ngữ
const suggestedQuestionsData = [
  { icon: Users, textVI: "Tour nào phù hợp với gia đình?", textEN: "Which tour is suitable for families?" },
  { icon: Landmark, textVI: "Tôi muốn tìm tour văn hóa truyền thống", textEN: "I want to find traditional cultural tours" },
  { icon: Wallet, textVI: "Tour nào có giá rẻ nhất?", textEN: "Which tour has the cheapest price?" },
  { icon: Palette, textVI: "Giới thiệu tour làng nghề", textEN: "Introduce craft village tours" },
];

export const ChatBot = () => {
  // Lấy hoặc tạo session_id từ localStorage
  const getOrCreateSessionId = (): string => {
    const stored = localStorage.getItem("chat_session_id");
    if (stored) {
      return stored;
    }
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("chat_session_id", newSessionId);
    return newSessionId;
  };

  const [sessionId] = useState<string>(getOrCreateSessionId());
  const { language } = useTours();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        language === "EN"
          ? "Hello! 👋 I'm JOIGO's virtual assistant. I can help you search and get advice about cultural tours in Hanoi. What kind of tour are you looking for?"
          : "Xin chào! 👋 Tôi là trợ lý ảo của JOIGO. Tôi có thể giúp bạn tìm kiếm và tư vấn về các tour du lịch văn hóa tại Hà Nội. Bạn muốn tìm loại tour nào?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Hàm loại bỏ markdown formatting
  const removeMarkdown = (text: string): string => {
    return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1");
  };

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Cập nhật welcome message khi ngôn ngữ thay đổi
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === "welcome") {
        return [
          {
            id: "welcome",
            role: "assistant",
            content:
              language === "EN"
                ? "Hello! 👋 I'm JOIGO's virtual assistant. I can help you search and get advice about cultural tours in Hanoi. What kind of tour are you looking for?"
                : "Xin chào! 👋 Tôi là trợ lý ảo của JOIGO. Tôi có thể giúp bạn tìm kiếm và tư vấn về các tour du lịch văn hóa tại Hà Nội. Bạn muốn tìm loại tour nào?",
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: inputValue,
          session_id: sessionId,
          language: language
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from chatbot");
      }

      const data = await response.json();
      const cleanedResponse = removeMarkdown(data.response);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: cleanedResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: language === "EN" ? "Connection Error" : "Lỗi kết nối",
        description: language === "EN" 
          ? "Cannot connect to chatbot. Please try again later."
          : "Không thể kết nối với chatbot. Vui lòng thử lại sau.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: language === "EN"
          ? "Sorry, I'm experiencing technical issues. Please try again later or contact our hotline for support."
          : "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau hoặc liên hệ hotline để được hỗ trợ.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Tạo suggestedQuestions dựa trên ngôn ngữ hiện tại
  const suggestedQuestions = suggestedQuestionsData.map(item => ({
    icon: item.icon,
    text: language === "EN" ? item.textEN : item.textVI
  }));

  const handleSuggestionClick = (question: string) => {
    setInputValue(question);
  };

  return (

    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Header với gradient */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-fuchsia-500 px-6 py-5 rounded-t-3xl">
        <div className="flex items-center gap-4">
          <div className="w-[52px] h-[52px] bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-white font-semibold text-lg">Joigo AI Assistant</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
              </span>
              <span className="text-white/90 text-sm">
                {language === "EN" ? "Online" : "Đang hoạt động"}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-5 py-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <Avatar className="w-9 h-9 shrink-0 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl">
                  <AvatarFallback className="bg-transparent">
                    <Bot className="w-5 h-5 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[75%] px-4 py-3 ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-[20px] rounded-br-md"
                    : "bg-white border border-gray-100 text-gray-700 rounded-[20px] rounded-bl-md shadow-sm"
                }`}
              >
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{removeMarkdown(message.content)}</p>
                <p className={`text-xs mt-2 ${message.role === "user" ? "text-white/70" : "text-gray-400"}`}>
                  {message.timestamp.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {message.role === "user" && (
                <Avatar className="w-9 h-9 shrink-0 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl">
                  <AvatarFallback className="bg-transparent text-white text-sm font-medium">B</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-9 h-9 shrink-0 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl">
                <AvatarFallback className="bg-transparent">
                  <Bot className="w-5 h-5 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border border-gray-100 rounded-[20px] rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-500 font-medium">
                  {language === "EN" ? "Suggestions for you" : "Gợi ý cho bạn"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {suggestedQuestions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(item.text)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-left transition-all duration-200 ${
                      index === 0
                        ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-200"
                        : "bg-white border border-gray-100 text-gray-700 hover:border-orange-200 hover:shadow-md"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${index === 0 ? "text-white" : "text-orange-500"}`} />
                    <span className="text-sm font-medium">{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Section */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-2">
          <MessageCircle className="w-5 h-5 text-gray-400" />
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={language === "EN" ? "Type a message..." : "Nhập tin nhắn..."}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-700 placeholder:text-gray-400"
            disabled={isLoading}
          />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200">
              <Paperclip className="w-4 h-4 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200">
              <Mic className="w-4 h-4 text-gray-500" />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 shadow-lg shadow-orange-200 disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}