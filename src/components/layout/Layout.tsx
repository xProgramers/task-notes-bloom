
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import useStore from "@/store/useStore";
import { useNotifications } from "@/hooks/useNotifications";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const activeView = useStore((state) => state.activeView);
  const { isSupported, permission, requestPermission } = useNotifications();
  
  useEffect(() => {
    // Verificar permissão de notificações ao montar o componente
    if (isSupported && permission === 'default') {
      toast({
        title: "Notificações",
        description: "Habilite as notificações para receber alertas de tarefas.",
        action: (
          <Button 
            onClick={() => {
              requestPermission().then((granted) => {
                if (granted) {
                  toast({
                    title: "Notificações ativadas",
                    description: "Você receberá alertas para suas tarefas.",
                  });
                } else {
                  toast({
                    title: "Notificações bloqueadas",
                    description: "Você não receberá alertas para suas tarefas.",
                    variant: "destructive",
                  });
                }
              });
            }}
            variant="outline"
            size="sm"
          >
            {permission === 'granted' ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            Ativar
          </Button>
        ),
      });
    }
  }, [isSupported, permission]);

  return (
    <div className="h-screen flex bg-deep-black text-light-gray">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto transition-all md:pl-64">
        <div className="container py-8 px-4 md:px-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
