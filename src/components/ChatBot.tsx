import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Send, Sparkles, Users, Landmark, Wallet, Palette, Paperclip, Mic, MessageCircle, Lightbulb, ArrowLeft, Plus, History, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useTours } from "@/contexts/TourContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string | null;
  language: string;
  created_at: string;
  updated_at: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Định nghĩa suggested questions với icon và cả 2 ngôn ngữ
const suggestedQuestionsData = [
  { icon: Users, textVI: "Tour nào phù hợp với gia đình?", textEN: "Which tour is suitable for families?" },
  { icon: Landmark, textVI: "Tôi muốn tìm tour văn hóa truyền thống", textEN: "I want to find traditional cultural tours" },
  { icon: Wallet, textVI: "Tour nào có giá rẻ nhất?", textEN: "Which tour has the cheapest price?" },
  { icon: Palette, textVI: "Giới thiệu tour làng nghề", textEN: "Introduce craft village tours" },
];

export const ChatBot = () => {
  const { language } = useTours();
  const { getAccessToken, user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const { toast } = useToast();

  // Hàm loại bỏ markdown formatting
  const removeMarkdown = (text: string): string => {
    return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1");
  };

  // Lấy authorization header
  const getAuthHeaders = () => {
    const token = getAccessToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  // Load chat history từ database
  const loadChatHistory = useCallback(async (sessionIdToLoad: string) => {
    if (!sessionIdToLoad) return;
    
    try {
      setIsLoadingHistory(true);
      const token = getAccessToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/chat/sessions/${sessionIdToLoad}/messages`, {
        method: "GET",
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          const loadedMessages: Message[] = data.messages.map((msg: any) => ({
            id: msg.id,
            role: msg.role as "user" | "assistant",
            content: msg.content,
            timestamp: new Date(msg.created_at),
          }));
          setMessages(loadedMessages);
        } else {
          // Nếu không có tin nhắn, hiển thị welcome message
          setMessages([{
            id: "welcome",
            role: "assistant",
            content: language === "EN"
              ? "Hello! 👋 I'm JOIGO's virtual assistant. I can help you search and get advice about cultural tours in Hanoi. What kind of tour are you looking for?"
              : "Xin chào! 👋 Tôi là trợ lý ảo của JOIGO. Tôi có thể giúp bạn tìm kiếm và tư vấn về các tour du lịch văn hóa tại Hà Nội. Bạn muốn tìm loại tour nào?",
            timestamp: new Date(),
          }]);
        }
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [language, getAccessToken]);

  // Load danh sách chat sessions
  const loadChatSessions = useCallback(async (): Promise<ChatSession[]> => {
    if (!user) return []; // Chỉ load nếu user đã đăng nhập
    
    try {
      const token = getAccessToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/chat/sessions`, {
        method: "GET",
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        const sessions = data.sessions || [];
        setChatSessions(sessions);
        return sessions;
      }
    } catch (error) {
      console.error("Error loading chat sessions:", error);
    }
    return [];
  }, [user, getAccessToken]);

  // Tạo chat session mới
  const createNewChat = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/sessions`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: null,
          language: language,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSessionId(data.session_id);
        localStorage.setItem("chat_session_id", data.session_id);
        setMessages([{
          id: "welcome",
          role: "assistant",
          content: language === "EN"
            ? "Hello! 👋 I'm JOIGO's virtual assistant. I can help you search and get advice about cultural tours in Hanoi. What kind of tour are you looking for?"
            : "Xin chào! 👋 Tôi là trợ lý ảo của JOIGO. Tôi có thể giúp bạn tìm kiếm và tư vấn về các tour du lịch văn hóa tại Hà Nội. Bạn muốn tìm loại tour nào?",
          timestamp: new Date(),
        }]);
        await loadChatSessions();
        setShowSidebar(false);
      }
    } catch (error) {
      console.error("Error creating new chat:", error);
      toast({
        title: language === "EN" ? "Error" : "Lỗi",
        description: language === "EN" ? "Failed to create new chat" : "Không thể tạo chat mới",
        variant: "destructive",
      });
    }
  };

  // Xóa chat session
  const deleteChatSession = async (sessionIdToDelete: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/sessions/${sessionIdToDelete}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        await loadChatSessions();
        if (sessionIdToDelete === sessionId) {
          // Nếu xóa session đang mở, tạo session mới
          await createNewChat();
        }
        toast({
          title: language === "EN" ? "Success" : "Thành công",
          description: language === "EN" ? "Chat deleted" : "Đã xóa chat",
        });
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast({
        title: language === "EN" ? "Error" : "Lỗi",
        description: language === "EN" ? "Failed to delete chat" : "Không thể xóa chat",
        variant: "destructive",
      });
    }
  };

  // Chọn chat session
  const selectChatSession = async (selectedSessionId: string) => {
    setSessionId(selectedSessionId);
    localStorage.setItem("chat_session_id", selectedSessionId);
    await loadChatHistory(selectedSessionId);
    setShowSidebar(false);
  };

  // Khởi tạo: Load session hoặc tạo mới (chỉ chạy 1 lần khi mount hoặc khi user thay đổi từ null -> có giá trị)
  useEffect(() => {
    // Chỉ initialize 1 lần hoặc khi user thay đổi từ null -> có giá trị
    if (initializedRef.current && user) {
      // Nếu đã initialize và user đã đăng nhập, reload chat gần nhất
      const reloadLatestChat = async () => {
        const sessions = await loadChatSessions();
        if (sessions.length > 0) {
          const latestSession = sessions[0];
          setSessionId(latestSession.id);
          localStorage.setItem("chat_session_id", latestSession.id);
          await loadChatHistory(latestSession.id);
        }
      };
      reloadLatestChat();
      return;
    }

    const initializeChat = async () => {
      if (user) {
        // Nếu có user đăng nhập, luôn load chat gần nhất từ database
        const sessions = await loadChatSessions();
        
        if (sessions.length > 0) {
          // Tự động chọn session gần nhất (đã được sắp xếp theo updated_at desc)
          const latestSession = sessions[0];
          setSessionId(latestSession.id);
          localStorage.setItem("chat_session_id", latestSession.id);
          await loadChatHistory(latestSession.id);
        } else {
          // Nếu không có session nào, hiển thị welcome message
          setMessages([{
            id: "welcome",
            role: "assistant",
            content: language === "EN"
              ? "Hello! 👋 I'm JOIGO's virtual assistant. I can help you search and get advice about cultural tours in Hanoi. What kind of tour are you looking for?"
              : "Xin chào! 👋 Tôi là trợ lý ảo của JOIGO. Tôi có thể giúp bạn tìm kiếm và tư vấn về các tour du lịch văn hóa tại Hà Nội. Bạn muốn tìm loại tour nào?",
            timestamp: new Date(),
          }]);
        }
      } else {
        // Nếu không có user, kiểm tra localStorage như fallback
        const storedSessionId = localStorage.getItem("chat_session_id");
        if (storedSessionId) {
          setSessionId(storedSessionId);
          await loadChatHistory(storedSessionId);
        } else {
          // Nếu không có gì, hiển thị welcome message
          setMessages([{
            id: "welcome",
            role: "assistant",
            content: language === "EN"
              ? "Hello! 👋 I'm JOIGO's virtual assistant. I can help you search and get advice about cultural tours in Hanoi. What kind of tour are you looking for?"
              : "Xin chào! 👋 Tôi là trợ lý ảo của JOIGO. Tôi có thể giúp bạn tìm kiếm và tư vấn về các tour du lịch văn hóa tại Hà Nội. Bạn muốn tìm loại tour nào?",
            timestamp: new Date(),
          }]);
        }
      }
      
      initializedRef.current = true;
    };

    initializeChat();
  }, [user?.id]); // Chỉ phụ thuộc vào user.id thay vì toàn bộ user object

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

  // Cập nhật welcome message khi ngôn ngữ thay đổi (chỉ khi đang hiển thị welcome message)
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === "welcome" && !isLoadingHistory) {
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: language === "EN"
          ? "Hello! 👋 I'm JOIGO's virtual assistant. I can help you search and get advice about cultural tours in Hanoi. What kind of tour are you looking for?"
          : "Xin chào! 👋 Tôi là trợ lý ảo của JOIGO. Tôi có thể giúp bạn tìm kiếm và tư vấn về các tour du lịch văn hóa tại Hà Nội. Bạn muốn tìm loại tour nào?",
        timestamp: new Date(),
      }]);
    }
  }, [language, messages.length, isLoadingHistory]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          message: currentInput,
          session_id: sessionId,
          language: language
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from chatbot");
      }

      const data = await response.json();
      const cleanedResponse = removeMarkdown(data.response);

      // Cập nhật session_id từ response (backend có thể tạo mới hoặc trả về session hiện tại)
      if (data.session_id && data.session_id !== sessionId) {
        setSessionId(data.session_id);
        localStorage.setItem("chat_session_id", data.session_id);
        // Chỉ reload sessions list nếu user đã đăng nhập, không reload chat history để tránh nhấp nháy
        if (user) {
          loadChatSessions();
        }
      }

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
    <div className="flex h-full bg-gray-50/50 relative">
      {/* Sidebar - Danh sách chat sessions (chỉ hiển thị khi user đã đăng nhập) */}
      {user && (
        <>
          {showSidebar && (
            <div className="absolute inset-0 bg-black/20 z-40" onClick={() => setShowSidebar(false)} />
          )}
          <div className={`absolute left-0 top-0 bottom-0 w-80 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          }`}>
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{language === "EN" ? "Chat History" : "Lịch sử chat"}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSidebar(false)}
                    className="w-8 h-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  onClick={createNewChat}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {language === "EN" ? "New Chat" : "Chat mới"}
                </Button>
              </div>

              {/* Chat Sessions List */}
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                  {chatSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                        session.id === sessionId
                          ? "bg-orange-50 border border-orange-200"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={() => selectChatSession(session.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0 pr-1">
                          <p className="font-medium text-sm text-gray-900 line-clamp-2 break-words">
                            {session.title || (language === "EN" ? "New Chat" : "Chat mới")}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(session.updated_at).toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChatSession(session.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {chatSessions.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-8">
                      {language === "EN" ? "No chat history" : "Chưa có lịch sử chat"}
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </>
      )}

      {/* Main Chat Area */}
      <div className="flex flex-col h-full flex-1">
        {/* Header với gradient */}
        <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-fuchsia-500 px-6 py-5 rounded-t-3xl">
          <div className="flex items-center gap-4">
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSidebar(!showSidebar)}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 text-white"
              >
                <History className="w-5 h-5" />
              </Button>
            )}
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
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={createNewChat}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 text-white"
              >
                <Plus className="w-5 h-5" />
              </Button>
            )}
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-5 py-4">
          {isLoadingHistory ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          ) : (
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
              {messages.length === 1 && messages[0].id === "welcome" && (
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
          )}
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
    </div>
  );
};
