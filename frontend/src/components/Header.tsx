import { useNavigate, Link } from "react-router-dom";
import { storage } from "../services/storage";
import { Button } from "./ui/button";
import { useModal } from "../contexts/ModalContext";
import Breadcrumbs from "./Breadcumbs";

export default function Header() {
  const navigate = useNavigate();
  const { showConfirm } = useModal();
  const user = storage.getUser();

  const handleLogout = () => {
    showConfirm("로그아웃", "정말 로그아웃 하시겠습니까?", () => {
      storage.clearUser();
      navigate("/login");
    });
  };

  return (
    <header className="border-b bg-white flex-col">
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
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden sm:inline">
            반가워요,{" "}
            <span className="font-bold text-gray-800">{user?.name}</span>님
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-2 bg-gray-50/50 border-t text-sm">
        <Breadcrumbs />
      </div>
    </header>
  );
}
