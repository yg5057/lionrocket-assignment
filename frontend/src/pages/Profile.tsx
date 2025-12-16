import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../services/storage";
import type { User } from "../types";
import Header from "../components/Header";
import { useModal } from "../contexts/ModalContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";

export default function Profile() {
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useModal();

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const userData = storage.getUser();
    if (!userData) {
      navigate("/");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(userData);
    setName(userData.name);
    setIsDarkMode(userData.theme === "dark");

    if (userData.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [navigate]);

  const handleSave = () => {
    if (!user) return;
    if (!name.trim()) {
      showAlert("오류", "이름을 입력해주세요.");
      return;
    }

    const updatedUser: User = {
      ...user,
      name: name,
      theme: isDarkMode ? "dark" : "light",
    };

    storage.saveUser(updatedUser);
    setUser(updatedUser);

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    showAlert("성공", "프로필 정보가 저장되었습니다.");
  };

  const handleLogout = () => {
    showConfirm("로그아웃", "정말 로그아웃 하시겠습니까?", () => {
      storage.clearUser();
      navigate("/");
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          프로필 설정
        </h1>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">내 정보 수정</CardTitle>
            <CardDescription className="dark:text-gray-400">
              계정 정보와 앱 설정을 변경할 수 있습니다.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="dark:text-gray-300">이메일</Label>
              <Input
                value={user.email}
                disabled
                className="bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="dark:text-gray-300">
                이름 (닉네임)
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <Label className="text-base dark:text-gray-200">
                  다크 모드
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  어두운 테마를 적용하여 눈의 피로를 줄입니다.
                </p>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button onClick={handleSave} className="w-full text-base">
              저장하기
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:border-gray-600"
            >
              로그아웃
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
