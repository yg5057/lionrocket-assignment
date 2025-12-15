import { useState, useEffect } from "react";
import { storage } from "../services/storage";
import type { Character } from "../types";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export default function StorageTester() {
  const [chars, setChars] = useState<Character[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadData();
  }, []);

  const loadData = () => {
    const data = storage.getCharacters();
    setChars(data);
  };

  const handleAdd = () => {
    const newChar: Character = {
      id: Date.now().toString(),
      name: `테스트 캐릭터 ${chars.length + 1}`,
      description: "shadcn/ui로 만든 버튼으로 추가됨",
      systemPrompt: "테스트",
      isDefault: false,
    };
    storage.addCharacter(newChar);
    loadData();
  };

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🛠 Storage & UI 테스트</h1>
        <div className="space-x-2">
          <Button onClick={handleAdd}>캐릭터 추가 (+)</Button>
          <Button variant="destructive" onClick={handleReset}>
            전체 초기화
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chars.map((char) => (
          <Card
            key={char.id}
            className={char.isDefault ? "border-blue-500" : ""}
          >
            <CardHeader>
              <CardTitle className="flex justify-between">
                {char.name}
                {char.isDefault && (
                  <span className="text-xs text-blue-500 border border-blue-500 px-1 rounded">
                    기본
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{char.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
