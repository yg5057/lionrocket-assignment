import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../services/storage";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "../components/ui/card";
import { useModal } from "../contexts/ModalContext";

export default function Login() {
  const navigate = useNavigate();
  const { showAlert } = useModal();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const user = storage.getUser();
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !name) {
      showAlert("입력 오류", "이메일과 이름을 모두 입력해주세요.");
      return;
    }

    storage.saveUser({
      id: Date.now().toString(),
      email,
      name,
      theme: "light",
    });

    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            AI Chat Service
          </CardTitle>
          <CardDescription>
            서비스를 이용하려면 로그인이 필요합니다.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">이름 (닉네임)</Label>
              <Input
                id="name"
                type="text"
                placeholder="사용할 이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full text-lg">
              로그인하기
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
