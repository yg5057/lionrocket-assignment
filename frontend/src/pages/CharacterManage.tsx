import { useState, useEffect } from "react";
import { storage } from "../services/storage";
import type { Character } from "../types";
import Header from "../components/Header";
import { useModal } from "../contexts/ModalContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../components/ui/dialog";

export default function CharacterManage() {
  const { showConfirm, showAlert } = useModal();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Character>({
    id: "",
    name: "",
    description: "",
    systemPrompt: "",
    thumbnail: "",
    isDefault: false,
  });

  const loadData = () => {
    setCharacters(storage.getCharacters());
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.systemPrompt.trim()) {
      showAlert("입력 오류", "캐릭터 이름과 프롬프트(성격)는 필수 항목입니다.");
      return;
    }

    if (isEditing) {
      storage.updateCharacter(formData);
    } else {
      const newChar: Character = {
        ...formData,
        id: Date.now().toString(),
        isDefault: false,
        thumbnail:
          formData.thumbnail ||
          `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`,
      };
      storage.addCharacter(newChar);
    }

    setIsDialogOpen(false);
    loadData();
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({
      id: "",
      name: "",
      description: "",
      systemPrompt: "",
      thumbnail: "",
      isDefault: false,
    });
    setIsDialogOpen(true);
  };

  const openEditModal = (char: Character) => {
    if (char.isDefault) {
      showAlert("수정 불가", "기본 제공 캐릭터는 수정할 수 없습니다.");
      return;
    }
    setIsEditing(true);
    setFormData(char);
    setIsDialogOpen(true);
  };

  const handleDelete = (char: Character) => {
    if (char.isDefault) {
      showAlert("삭제 불가", "기본 제공 캐릭터는 삭제할 수 없습니다.");
      return;
    }
    showConfirm(
      "캐릭터 삭제",
      `'${char.name}' 캐릭터를 영구적으로 삭제하시겠습니까?\n대화 내역도 함께 사라집니다.`,
      () => {
        storage.deleteCharacter(char.id);
        loadData();
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">캐릭터 관리</h1>
            <p className="text-gray-500 mt-2">
              AI 캐릭터의 성격(프롬프트)을 설정하여 나만의 대화 상대를
              만들어보세요.
            </p>
          </div>
          <Button
            onClick={openCreateModal}
            size="lg"
            className="shadow-md cursor-pointer"
          >
            + 캐릭터 만들기
          </Button>
        </div>
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-20 text-center">이미지</TableHead>
                <TableHead className="w-50">이름 / 타입</TableHead>
                <TableHead>설명</TableHead>
                <TableHead className="text-right w-37.5">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {characters.map((char) => (
                <TableRow key={char.id} className="hover:bg-gray-50/50">
                  <TableCell className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-full overflow-hidden border bg-gray-50">
                      <img
                        src={char.thumbnail || "https://via.placeholder.com/50"}
                        alt={char.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-base">{char.name}</span>
                      <span className="mt-1">
                        {char.isDefault ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            🔒 기본 제공
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            👤 사용자 정의
                          </span>
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    <div className="line-clamp-2">{char.description}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {!char.isDefault ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(char)}
                            className="cursor-pointer"
                          >
                            수정
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(char)}
                            className="cursor-pointer"
                          >
                            삭제
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 py-2 px-2">
                          기본 캐릭터
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {isEditing ? "캐릭터 수정" : "새 캐릭터 만들기"}
            </DialogTitle>
            <DialogDescription>
              AI에게 부여할 역할과 성격을 상세하게 설정해주세요.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름 (필수)</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="예: 셜록 홈즈"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnail">썸네일 URL</Label>
                <Input
                  id="thumbnail"
                  name="thumbnail"
                  value={formData.thumbnail || ""}
                  onChange={handleChange}
                  placeholder="이미지 주소 (https://...)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">간단한 설명</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="목록에 표시될 짧은 소개글입니다."
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="systemPrompt">
                  시스템 프롬프트 / 성격 (필수)
                </Label>
                <span className="text-xs text-blue-600 font-medium">
                  * Claude AI에 전달되는 핵심 설정입니다.
                </span>
              </div>
              <Textarea
                id="systemPrompt"
                name="systemPrompt"
                value={formData.systemPrompt}
                onChange={handleChange}
                className="min-h-37.5 font-mono text-sm leading-relaxed"
                placeholder="AI에게 역할을 부여하세요.&#13;&#10;예시:&#13;&#10;- 너는 5살 아이야. 어려운 말은 쓰지 말고 귀엽게 말해줘.&#13;&#10;- 너는 냉철한 번역기야. 감정 없이 정확하게 번역만 수행해."
              />
              <p className="text-xs text-gray-500">
                구체적으로 적을수록 AI가 더 연기를 잘합니다.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setIsDialogOpen(false)}
            >
              취소
            </Button>
            <Button onClick={handleSave} className="bg-primary cursor-pointer">
              {isEditing ? "변경사항 저장" : "캐릭터 생성"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
