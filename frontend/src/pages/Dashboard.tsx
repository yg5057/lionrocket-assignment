import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { storage } from "../services/storage";
import type { Character } from "../types";
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

  useEffect(() => {
    const data = storage.getCharacters();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCharacters(data);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">대시보드</h1>
        <p className="text-gray-500 mb-8">
          대화하고 싶은 AI 캐릭터를 선택하세요.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((char) => (
            <Card
              key={char.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{char.name}</span>
                  {char.isDefault && (
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-full border border-blue-200">
                      Official
                    </span>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 text-sm line-clamp-3 h-10">
                  {char.description}
                </p>
              </CardContent>

              <CardFooter>
                <Link to={`/chat/${char.id}`} className="w-full">
                  <Button className="w-full">대화 시작하기</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
