
import React, { useState, useEffect } from "react";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import useStore from "@/store/useStore";
import { format, parse } from "date-fns";
import { Calendar, Clock, Tag, BellRing } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/useNotifications";

export function FloatingTaskAlert() {
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const tasks = useStore((state) => state.tasks);
  const toggleTaskCompletion = useStore((state) => state.toggleTaskCompletion);
  const rescheduleTask = useStore((state) => state.rescheduleTask);
  const { toast } = useToast();
  const { sendNotification, requestPermission, permission } = useNotifications();

  // Request notification permission on component mount
  useEffect(() => {
    if (permission === 'default') {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    // Function to check for due tasks
    const checkDueTasks = () => {
      const now = new Date();
      const currentDate = format(now, "yyyy-MM-dd");
      const currentTime = format(now, "HH:mm");
      
      // Find tasks that are due now
      const dueTasks = tasks.filter((task) => {
        return (
          !task.completed && 
          task.dueDate === currentDate && 
          task.dueTime === currentTime
        );
      });
      
      if (dueTasks.length > 0 && !currentTask) {
        const taskToShow = dueTasks[0];
        setCurrentTask(taskToShow);
        
        // Show in-app toast notification
        toast({
          title: "Tarefa devido agora!",
          description: taskToShow.title,
        });
        
        // Send system notification when browser might be minimized
        sendNotification(`Tarefa: ${taskToShow.title}`, {
          body: taskToShow.description,
          icon: '/favicon.ico',
          requireInteraction: true, // Keep the notification until user interacts with it
          tag: `task-${taskToShow.id}`, // Unique tag to prevent duplicate notifications
          data: {
            taskId: taskToShow.id,
            url: window.location.href, // Current URL to open when notification is clicked
          },
        });
      }
    };

    // Check immediately and then set interval
    checkDueTasks();
    const intervalId = setInterval(checkDueTasks, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [tasks, currentTask, toast, sendNotification]);
  
  const handleCompleteTask = async () => {
    if (currentTask) {
      await toggleTaskCompletion(currentTask.id);
      toast({
        title: "Tarefa concluída",
        description: "A tarefa foi marcada como concluída com sucesso!",
      });
      setCurrentTask(null);
    }
  };
  
  const handleSnoozeTask = async () => {
    if (currentTask) {
      // Postpone by 5 minutes
      const currentTime = parse(currentTask.dueTime, "HH:mm", new Date());
      currentTime.setMinutes(currentTime.getMinutes() + 5);
      const newTime = format(currentTime, "HH:mm");
      
      await rescheduleTask(currentTask.id, currentTask.dueDate, newTime);
      toast({
        title: "Tarefa adiada",
        description: `A tarefa foi adiada para ${newTime}`,
      });
      setCurrentTask(null);
    }
  };

  if (!currentTask) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => null}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="max-w-lg w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="border-2 border-bright-coral shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-soft-teal/20 to-bright-coral/20 backdrop-blur-md">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <BellRing className="h-5 w-5 text-bright-coral animate-ping mr-1" />
                {currentTask.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="bg-muted/20 p-4 rounded-xl whitespace-pre-wrap">
                {currentTask.description}
              </div>
              
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-soft-teal" />
                  <span className="text-sm">Data: {currentTask.dueDate}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-soft-teal" />
                  <span className="text-sm">Horário: {currentTask.dueTime}</span>
                </div>
                
                {currentTask.tags && currentTask.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-soft-teal" />
                    <div className="flex flex-wrap gap-1">
                      {currentTask.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tag-blue"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="complete-task" 
                  checked={false}
                  onCheckedChange={handleCompleteTask}
                />
                <label
                  htmlFor="complete-task"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Marcar como concluída
                </label>
              </div>
              <Button 
                variant="outline" 
                onClick={handleSnoozeTask}
                className="bg-card hover:bg-muted/20"
              >
                Adiar 5 minutos
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
