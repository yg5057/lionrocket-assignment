import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { storage } from "../services/storage";
import { Button } from "./ui/button";
import { useModal } from "../contexts/ModalContext";
import Breadcrumbs from "./Breadcumbs";
import { Menu } from "lucide-react"; // 햄버거 아이콘
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export default function Header() {
  const navigate = useNavigate();
  const { showConfirm } = useModal();
  const user = storage.getUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    showConfirm("로그아웃", "정말 로그아웃 하시겠습니까?", () => {
      storage.clearUser();
      navigate("/login");
    });
  };

  const handleMobileLink = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <header className="border-b bg-white flex-col sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="text-xl font-bold text-primary flex items-center gap-2"
        >
          AI Chat
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/dashboard" className="hover:text-primary transition">
            대시보드
          </Link>
          <Link to="/characters" className="hover:text-primary transition">
            캐릭터 관리
          </Link>
          <Link to="/profile" className="hover:text-primary transition">
            프로필
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm text-gray-500">
            반가워요,{" "}
            <span className="font-bold text-gray-800">{user?.name}</span>님
          </span>
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={handleLogout}
          >
            로그아웃
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="text-left border-b pb-4 mb-4">
                <SheetTitle>메뉴</SheetTitle>
                <div className="text-sm text-gray-500">
                  반가워요,{" "}
                  <span className="font-bold text-gray-800">{user?.name}</span>
                  님
                </div>
              </SheetHeader>
              <div className="flex flex-col gap-4">
                <Button
                  variant="ghost"
                  className="justify-start text-base cursor-pointer"
                  onClick={() => handleMobileLink("/dashboard")}
                >
                  대시보드
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-base cursor-pointer"
                  onClick={() => handleMobileLink("/characters")}
                >
                  캐릭터 관리
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-base cursor-pointer"
                  onClick={() => handleMobileLink("/profile")}
                >
                  프로필
                </Button>
                <div className="border-t pt-4 mt-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-base cursor-pointer"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="container mx-auto px-4 py-2 bg-gray-50/50 border-t text-sm">
        <Breadcrumbs />
      </div>
    </header>
  );
}
