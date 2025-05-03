
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import useStore from '@/store/useStore';
import { Task } from '@/types';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission | 'default'>('default');
  const tasks = useStore((state) => state.tasks);
  
  // Verifica se a API de notificações é suportada
  const isSupported = () => {
    return 'Notification' in window;
  };
  
  // Solicita permissão para enviar notificações
  const requestPermission = useCallback(async () => {
    if (!isSupported()) {
      return false;
    }
    
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificação:', error);
      return false;
    }
  }, []);
  
  // Envia uma notificação
  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!isSupported() || permission !== 'granted') {
      // Fallback para toast se a notificação não for suportada
      toast({
        title,
        description: options?.body,
        duration: 5000,
      });
      return null;
    }
    
    try {
      const notification = new Notification(title, options);
      
      // Add click handler to focus the window when notification is clicked
      notification.onclick = (event) => {
        event.preventDefault();
        
        // Focus the window
        window.focus();
        
        // If the notification has a URL in its data, navigate to it
        if (options?.data?.url) {
          window.location.href = options.data.url;
        }
        
        // Close the notification
        notification.close();
      };
      
      return notification;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      toast({
        title,
        description: options?.body,
        duration: 5000,
      });
      return null;
    }
  }, [permission]);
  
  // Verifica se há tarefas agendadas para enviar notificações
  const checkScheduledTasks = useCallback(() => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    tasks.forEach((task: Task) => {
      if (task.status === 'pending' && task.dueDate === currentDate) {
        const [taskHour, taskMinute] = task.dueTime.split(':').map(Number);
        
        if (taskHour === currentHour && taskMinute === currentMinute) {
          sendNotification(`Tarefa: ${task.title}`, {
            body: task.description,
            icon: '/favicon.ico',
            requireInteraction: true,
            tag: `task-${task.id}`,
            data: {
              taskId: task.id,
              url: window.location.href,
            },
          });
        }
      }
    });
  }, [tasks, sendNotification]);
  
  // Inicializa o sistema de notificações
  useEffect(() => {
    if (isSupported()) {
      setPermission(Notification.permission);
    }
    
    // Setup service worker if available for better notification support
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log('Service Worker ready');
      });
    }
  }, []);
  
  // Verifica tarefas a cada minuto
  useEffect(() => {
    const intervalId = setInterval(checkScheduledTasks, 60000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [checkScheduledTasks]);
  
  return {
    isSupported: isSupported(),
    permission,
    requestPermission,
    sendNotification,
  };
}
