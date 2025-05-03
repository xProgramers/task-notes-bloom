
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import useStore from "@/store/useStore";
import { Task } from "@/types";
import { useNotifications } from "@/hooks/useNotifications";

export function TaskNotification() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const tasks = useStore((state) => state.tasks);
  const { isSupported, permission, requestPermission, sendNotification } = useNotifications();
  
  // Verificar permissão atual
  useEffect(() => {
    setNotificationsEnabled(permission === "granted");
  }, [permission]);
  
  // Ativa notificações quando permitido
  const enableNotifications = async () => {
    const granted = await requestPermission();
    setNotificationsEnabled(granted);
    
    if (granted) {
      toast.success("Notificações ativadas", {
        description: "Você receberá alertas para tarefas próximas do prazo."
      });
      
      // Envia uma notificação de teste
      sendNotification("Notificações Ativadas", {
        body: "Você será notificado sobre tarefas mesmo quando o navegador estiver minimizado",
        icon: "/favicon.ico",
        requireInteraction: true,
        data: {
          url: window.location.href,
        },
      });
    } else {
      toast.error("Permissão negada", {
        description: "Por favor, habilite notificações no seu navegador para não perder tarefas."
      });
    }
  };
  
  // Checar tarefas com prazo próximo (hoje)
  useEffect(() => {
    if (!notificationsEnabled) return;
    
    const today = new Date().toISOString().split('T')[0];
    const tasksToday = tasks.filter((task: Task) => 
      task.status === 'pending' && task.dueDate === today
    );
    
    if (tasksToday.length > 0) {
      const taskNames = tasksToday.map(t => t.title).join(", ");
      const message = tasksToday.length === 1 
        ? `Você tem 1 tarefa para hoje: ${taskNames}` 
        : `Você tem ${tasksToday.length} tarefas para hoje, incluindo ${taskNames}`;
      
      sendNotification("Tarefas para hoje", { 
        body: message,
        requireInteraction: false, // This can be a brief notification
        data: {
          url: window.location.href,
        },
      });
    }
  }, [tasks, notificationsEnabled, sendNotification]);
  
  if (!isSupported) return null;
  
  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={enableNotifications}
      disabled={notificationsEnabled}
      className="hover:bg-burgundy/10"
      title={notificationsEnabled ? "Notificações ativadas" : "Ativar notificações"}
    >
      {notificationsEnabled ? (
        <Bell className="h-5 w-5 text-burgundy animate-pulse" />
      ) : (
        <BellOff className="h-5 w-5" />
      )}
    </Button>
  );
}
