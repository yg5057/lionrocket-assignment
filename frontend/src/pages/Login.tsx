import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../services/storage";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from "../utils/validators";
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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const user = storage.getUser();
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      showAlert("입력 오류", "모든 정보를 입력해주세요.");
      return;
    }
    if (!validateEmail(email)) {
      showAlert(
        "이메일 오류",
        "유효한 이메일 형식이 아니거나, 30자를 초과했습니다."
      );
      return;
    }
    if (!validatePassword(password)) {
      showAlert(
        "비밀번호 오류",
        "비밀번호는 8~20자 사이여야 하며, 영문, 숫자, 특수문자를 모두 포함해야 합니다."
      );
      return;
    }
    if (!validatePasswordMatch(password, confirmPassword)) {
      showAlert(
        "비밀번호 불일치",
        "비밀번호와 비밀번호 확인이 일치하지 않습니다."
      );
      return;
    }

    const generatedName = email.split("@")[0];

    storage.saveUser({
      id: Date.now().toString(),
      email,
      name: generatedName,
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
                maxLength={30}
                placeholder="example@email.com (최대 30자)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                maxLength={20}
                placeholder="8~20자 (영문,숫자,특수문자를 포함 해야합니다.)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호 재입력"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full text-lg mt-6 cursor-pointer"
            >
              로그인하기
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
