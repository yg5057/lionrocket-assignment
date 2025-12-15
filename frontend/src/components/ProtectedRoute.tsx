import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { storage } from "../services/storage";

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  const user = storage.getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
