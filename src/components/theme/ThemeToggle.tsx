
import { Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "react-router-dom";
import { TaskNotification } from "../notifications/TaskNotification";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const { signOut, user } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    // Adiciona uma classe temporária para a animação de transição
    document.documentElement.classList.add('theme-transitioning');
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 800);
  };

  return (
    <div className="fixed top-4 right-6 flex gap-2 z-50">
      {!isLoginPage && <TaskNotification />}
      
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="theme-toggle-btn flex items-center justify-center bg-card/50 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all"
        title={theme === "light" ? "Modo escuro" : "Modo claro"}
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5 transition-transform duration-300 hover:rotate-45" />
        ) : (
          <Sun className="h-5 w-5 transition-transform duration-300 hover:rotate-45" />
        )}
      </Button>
      
      {user && !isLoginPage && (
        <Button
          variant="outline"
          size="icon"
          onClick={signOut}
          title="Sair"
          className="hover:bg-destructive/10 flex items-center justify-center bg-card/50 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
