import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { storage } from "../services/storage";
import type { Character, Message } from "../types";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useModal } from "../contexts/ModalContext";
import { Loader2, Send } from "lucide-react";

export default function ChatRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert } = useModal();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const chars = storage.getCharacters();
    const targetChar = chars.find((c) => c.id === id);

    if (targetChar) {
      setCharacter(targetChar);
      setMessages(storage.getMessages(id));
    } else {
      showAlert("오류", "존재하지 않는 캐릭터입니다.");
      navigate("/dashboard");
    }
  }, [id, navigate, showAlert]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!input.trim() || isLoading || !id || !character) return;
    if (input.length > 200) {
      showAlert("입력 초과", "메시지는 200자 이내로 입력해주세요.");
      return;
    }

    const userText = input;
    setInput("");

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    storage.addMessage(id, userMsg);

    setIsLoading(true);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          systemPrompt: character.systemPrompt,
        }),
      });

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      storage.addMessage(id, aiMsg);
    } catch (error) {
      console.error(error);
      showAlert(
        "통신 오류",
        "AI 응답을 받아오지 못했습니다. 백엔드 서버를 확인해주세요."
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  if (!character) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <div className="bg-white dark:bg-gray-950 border-b dark:border-gray-800 px-4 py-3 flex items-center shadow-sm shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden border dark:border-gray-700 mr-3">
          <img
            src={character.thumbnail}
            alt={character.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="font-bold text-lg leading-none dark:text-white">
            {character.name}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {character.description}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="text-center text-gray-400 dark:text-gray-500 mt-10">
            <p>대화 내용이 없습니다.</p>
            <p className="text-sm">첫 인사를 건네보세요!</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none"
              }`}
            >
              {msg.content}
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 self-end ml-1 mr-1 mb-1">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-300 px-4 py-3 rounded-2xl rounded-tl-none text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              AI가 생각 중입니다...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-gray-950 border-t dark:border-gray-800 shrink-0">
        <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요 (200자 이내)..."
            maxLength={200}
            disabled={isLoading}
            className="flex-1 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
        <div className="text-right text-xs text-gray-400 mt-1 px-1">
          {input.length} / 200자
        </div>
      </div>
    </div>
  );
}
