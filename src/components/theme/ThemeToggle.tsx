
import { Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "react-router-dom";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const { signOut, user } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="fixed top-4 right-6 flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Button>
      
      {user && !isLoginPage && (
        <Button
          variant="ghost"
          size="icon"
          onClick={signOut}
          title="Sair"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
