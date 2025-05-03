
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, LayoutDashboard, Plus, Flower, BookOpen as Notes } from "lucide-react";
import useStore from "@/store/useStore";
import { useCallback, useEffect, useState } from "react";
import { TaskForm } from "../tasks/TaskForm";
import { motion } from "framer-motion";

export function Sidebar() {
  const activeView = useStore((state) => state.activeView);
  const setActiveView = useStore((state) => state.setActiveView);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Calculate task completion stats for growth indicator
  const tasks = useStore((state) => state.tasks);
  const completedTasksCount = tasks.filter(task => task.status === "completed").length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;

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

  // Animation variants
  const sidebarVariants = {
    closed: { x: "-100%" },
    open: { x: 0 }
  };
  
  // Create a growth indicator based on task completion
  const flowerGrowthStages = [
    { threshold: 0, size: 16, color: "text-burgundy/30" },
    { threshold: 20, size: 18, color: "text-burgundy/50" },
    { threshold: 40, size: 20, color: "text-burgundy/70" },
    { threshold: 60, size: 22, color: "text-burgundy/90" },
    { threshold: 80, size: 24, color: "text-burgundy" },
    { threshold: 100, size: 28, color: "text-burgundy" }
  ];
  
  const currentGrowthStage = flowerGrowthStages.findLast(
    stage => completionRate >= stage.threshold
  ) || flowerGrowthStages[0];

  return (
    <>
      {/* Toggle button for mobile */}
      <Button 
        variant="outline" 
        size="icon" 
        className={cn(
          "fixed top-4 left-4 z-50 md:hidden transition-all bg-black/40 backdrop-blur-md border-burgundy/50", 
          isOpen ? "left-64" : "left-4"
        )}
        onClick={toggleSidebar}
      >
        {isOpen ? "<" : ">"}
      </Button>
      
      {/* Sidebar */}
      <motion.div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-black/40 backdrop-blur-md border-r border-burgundy/20 shadow-lg"
        )}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-burgundy/20">
          <div className="flex items-center">
            <Flower 
              className={cn(
                "mr-2 transition-all duration-1000",
                currentGrowthStage.color
              )} 
              size={currentGrowthStage.size}
            />
            <h1 className="text-xl font-bold text-burgundy">Bloom</h1>
          </div>
          
          {/* Task completion indicator */}
          <div className="h-2 w-12 bg-burgundy/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-burgundy"
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
        
        <nav className="flex-1 space-y-2 px-3 py-4">
          <Button
            variant={activeView === "dashboard" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start hover:bg-burgundy/10 hover:text-burgundy transition-colors duration-300",
              activeView === "dashboard" ? "bg-burgundy text-light-gray" : "bg-transparent text-light-gray"
            )}
            onClick={() => setActiveView("dashboard")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          
          <Button
            variant={activeView === "tasks" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start hover:bg-burgundy/10 hover:text-burgundy transition-colors duration-300",
              activeView === "tasks" ? "bg-burgundy text-light-gray" : "bg-transparent text-light-gray"
            )}
            onClick={() => setActiveView("tasks")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Tarefas
          </Button>
          
          <Button
            variant={activeView === "notes" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start hover:bg-burgundy/10 hover:text-burgundy transition-colors duration-300",
              activeView === "notes" ? "bg-burgundy text-light-gray" : "bg-transparent text-light-gray"
            )}
            onClick={() => setActiveView("notes")}
          >
            <Notes className="mr-2 h-4 w-4" />
            Notas
          </Button>
        </nav>
        
        <div className="p-4 mt-auto">
          <Button 
            className="w-full bg-gradient-to-r from-burgundy to-burgundy/80 text-light-gray hover:bg-burgundy/90 group overflow-hidden relative"
            onClick={handleNewTask}
          >
            <div className="absolute inset-0 bg-black/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
            <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            <span className="relative z-10">Nova Tarefa</span>
          </Button>
        </div>
      </motion.div>
      
      {/* Overlay to close sidebar on mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
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
