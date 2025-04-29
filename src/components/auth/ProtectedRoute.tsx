
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-burgundy" />
      </div>
    );
  }

  if (!user) {
    // Redireciona para o login, mas salva o caminho atual para redirecionar de volta após o login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
