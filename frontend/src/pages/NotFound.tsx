import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import logoIcon from "../assets/logo.svg";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-9xl font-extrabold text-gray-200 select-none">404</h1>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform space-y-4 flex flex-col items-center">
        <img
          src={logoIcon}
          alt="로고"
          loading="lazy"
          className="w-20 h-20 animate-bounce"
        />
        <h2 className="text-2xl font-bold text-gray-800">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          요청하신 페이지가 삭제되었거나, 잘못된 경로로 접근하였습니다.
        </p>

        <div className="flex items-center justify-center gap-4 mt-8">
          <Button variant="outline" onClick={() => navigate(-1)}>
            이전 페이지로
          </Button>

          <Button onClick={() => navigate("/dashboard")} className="bg-primary">
            대시보드로 가기
          </Button>
        </div>
      </div>
    </div>
  );
}
