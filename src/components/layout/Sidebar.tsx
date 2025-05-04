
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  Plus,
  Leaf,
  Sparkles,
  CalendarDays 
} from "lucide-react";
import useStore from "@/store/useStore";
import { useCallback, useEffect, useState } from "react";
import { TaskForm } from "../tasks/TaskForm";
import { motion } from "framer-motion";

export function Sidebar() {
  const activeView = useStore((state) => state.activeView);
  const setActiveView = useStore((state) => state.setActiveView);
  const tasks = useStore((state) => state.tasks);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Calcular progresso
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Use useCallback to memoize these functions
  const checkSize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleNewTask = useCallback(() => {
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  useEffect(() => {
    // Check on initialization
    checkSize();
    
    // Add listener for size changes
    window.addEventListener("resize", checkSize);
    
    // Clean up listener
    return () => window.removeEventListener("resize", checkSize);
  }, [checkSize]);

  return (
    <>
      {/* Toggle button for mobile */}
      <Button 
        variant="outline" 
        size="icon" 
        className={cn(
          "fixed top-4 left-4 z-50 md:hidden transition-all rounded-full shadow-md", 
          isOpen ? "left-64" : "left-4"
        )}
        onClick={toggleSidebar}
      >
        {isOpen ? "<" : ">"}
      </Button>
      
      {/* Sidebar */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-card shadow-xl"
      >
        {/* App Title with animation */}
        <div className="flex h-20 items-center border-b px-6">
          <div className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <Leaf className="h-8 w-8 text-primary absolute animate-pulse-gentle" />
              <Sparkles className="h-8 w-8 text-secondary absolute opacity-70" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Bloom
            </h1>
          </div>
        </div>
        
        {/* Progress circle */}
        <div className="mt-6 flex justify-center">
          <div className="relative w-24 h-24">
            {/* Background circle */}
            <div className="absolute inset-0 rounded-full border-4 border-muted/30"></div>
            {/* Progress circle with gradient */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-muted/20"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
              />
              <circle
                className="text-primary"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
              />
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1 px-3 py-4 mt-4">
          <Button
            variant={activeView === "dashboard" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start rounded-xl mb-2 hover:bg-primary/10 transition-all",
              activeView === "dashboard" && "bg-primary/20 text-primary"
            )}
            onClick={() => setActiveView("dashboard")}
          >
            <LayoutDashboard className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
          
          <Button
            variant={activeView === "tasks" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start rounded-xl mb-2 hover:bg-primary/10 transition-all",
              activeView === "tasks" && "bg-primary/20 text-primary"
            )}
            onClick={() => setActiveView("tasks")}
          >
            <Calendar className="mr-2 h-5 w-5" />
            Tarefas
          </Button>
          
          <Button
            variant={activeView === "notes" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start rounded-xl mb-2 hover:bg-primary/10 transition-all",
              activeView === "notes" && "bg-primary/20 text-primary"
            )}
            onClick={() => setActiveView("notes")}
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Notas
          </Button>
          
          <Button
            variant={activeView === "calendar" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start rounded-xl mb-2 hover:bg-primary/10 transition-all",
              activeView === "calendar" && "bg-primary/20 text-primary"
            )}
            onClick={() => setActiveView("calendar")}
          >
            <CalendarDays className="mr-2 h-5 w-5" />
            Calendário
          </Button>
        </nav>
        
        <div className="border-t p-4">
          <Button 
            className="w-full rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md"
            onClick={handleNewTask}
          >
            <Plus className="mr-2 h-5 w-5" />
            Nova Tarefa
          </Button>
        </div>
      </motion.div>
      
      {/* Overlay to close sidebar on mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Task form modal */}
      <TaskForm 
        isOpen={isFormOpen} 
        onClose={handleCloseForm} 
        task={undefined}
      />
    </>
  );
}
