import { useLocation, Link } from "react-router-dom";
import { storage } from "../services/storage";

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const routeNameMap: Record<string, string> = {
    dashboard: "대시보드",
    characters: "캐릭터 관리",
    profile: "프로필",
    chat: "채팅방",
    login: "로그인",
  };

  const getReadableName = (value: string, index: number) => {
    if (routeNameMap[value]) return routeNameMap[value];
    if (pathnames[index - 1] === "chat") {
      const chars = storage.getCharacters();
      const character = chars.find((c) => c.id === value);
      return character ? character.name : "알 수 없는 캐릭터";
    }
    return value;
  };

  return (
    <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex">
        <li className="flex items-center">
          <Link
            to="/dashboard"
            className="hover:text-blue-600 transition-colors"
          >
            Home
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const name = getReadableName(value, index);
          return (
            <li key={to} className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              {isLast ? (
                <span className="font-medium text-gray-800">{name}</span>
              ) : (
                <Link to={to} className="hover:text-blue-600 transition-colors">
                  {name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
