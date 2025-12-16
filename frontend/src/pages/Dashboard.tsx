import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { storage } from "../services/storage";
import type { Character, Message } from "../types";
import Header from "../components/Header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function Dashboard() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [lastMessages, setLastMessages] = useState<
    Record<string, Message | null>
  >({});

  useEffect(() => {
    const data = storage.getCharacters();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCharacters(data);

    const messagesMap: Record<string, Message | null> = {};
    data.forEach((char) => {
      const msgs = storage.getMessages(char.id);
      if (msgs.length > 0) {
        messagesMap[char.id] = msgs[msgs.length - 1];
      } else {
        messagesMap[char.id] = null;
      }
    });
    setLastMessages(messagesMap);
  }, []);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">대시보드</h1>
          <p className="text-gray-500">대화하고 싶은 AI 캐릭터를 선택하세요.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((char) => {
            const lastMsg = lastMessages[char.id];
            return (
              <Card
                key={char.id}
                className="hover:shadow-lg transition-shadow duration-200 flex flex-col"
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200 bg-white shadow-sm shrink-0">
                    <img
                      src={char.thumbnail || "https://via.placeholder.com/100"}
                      alt={char.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="flex flex-col flex-1 gap-1">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <span className="truncate">{char.name}</span>
                      {char.isDefault && (
                        <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-full border border-blue-200 font-normal shrink-0 ml-2">
                          Official
                        </span>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-400 font-normal line-clamp-1 break-all">
                      {char.description}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 py-4">
                  <div className="bg-gray-100/80 p-4 rounded-lg text-sm h-28 overflow-hidden relative border border-gray-100">
                    {lastMsg ? (
                      <>
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200/60">
                          <span
                            className={`font-bold ${
                              lastMsg.role === "user"
                                ? "text-blue-600"
                                : "text-purple-600"
                            }`}
                          >
                            {lastMsg.role === "user" ? "나" : char.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatTime(lastMsg.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-600 line-clamp-3 leading-relaxed">
                          {lastMsg.content}
                        </p>
                      </>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center space-y-2">
                        <span className="text-2xl">👋</span>
                        <span className="text-xs">
                          아직 대화 내역이 없어요.
                          <br />첫 인사를 건네보세요!
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/chat/${char.id}`} className="w-full">
                    <Button
                      className={`w-full ${
                        lastMsg ? "bg-primary" : "bg-gray-800 hover:bg-gray-700"
                      }`}
                    >
                      {lastMsg ? "대화 이어하기 💬" : "새 대화 시작하기 ✨"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
