import { useState, useRef, useEffect } from "react";
import { Send, Bot, User as UserIcon, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useTours } from "@/contexts/TourContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const API_BASE_URL = "http://127.0.0.1:8000";

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
    // Loại bỏ **bold** và *italic*
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

      // Loại bỏ markdown formatting từ response
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
        title: "Lỗi kết nối",
        description:
          "Không thể kết nối với chatbot. Vui lòng thử lại sau.",
        variant: "destructive",
      });

      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau hoặc liên hệ hotline để được hỗ trợ.",
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

  const suggestedQuestions =
    language === "EN"
      ? [
          "Which tour is suitable for families?",
          "I want to find traditional cultural tours",
          "Which tour has the cheapest price?",
          "Introduce craft village tours",
        ]
      : [
          "Tour nào phù hợp với gia đình?",
          "Tôi muốn tìm tour văn hóa truyền thống",
          "Tour nào có giá rẻ nhất?",
          "Giới thiệu tour làng nghề",
        ];

  const handleSuggestionClick = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-full">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              JOIGO AI Assistant
              <Sparkles className="w-4 h-4" />
            </h2>
            <p className="text-sm text-white/80">
              Trợ lý ảo tư vấn tour du lịch
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 bg-gray-50">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className="bg-primary text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <Card
                className={`p-4 max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-white"
                    : "bg-white border-gray-200"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
                <p
                  className={`text-xs mt-2 ${
                    message.role === "user"
                      ? "text-white/70"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </Card>

              {message.role === "user" && (
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className="bg-secondary text-white">
                    <UserIcon className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8 mt-1">
                <AvatarFallback className="bg-primary text-white">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="p-4 bg-white border-gray-200">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p className="text-sm text-gray-600">
                    {language === "EN" ? "Thinking..." : "Đang suy nghĩ..."}
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && !isLoading && (
          <div className="mt-6 max-w-3xl mx-auto">
            <p className="text-sm text-gray-600 mb-3 font-medium">
              💡 {language === "EN" ? "Suggested questions:" : "Gợi ý câu hỏi:"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left h-auto py-3 px-4 hover:bg-primary/5 hover:border-primary/50"
                  onClick={() => handleSuggestionClick(question)}
                >
                  <span className="text-sm">{question}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              language === "EN"
                ? "Enter your question..."
                : "Nhập câu hỏi của bạn..."
            }
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          {language === "EN"
            ? "Chatbot"
            : "Chatbot"}
        </p>
      </div>
    </div>
  );
};

