
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, LayoutDashboard, Plus } from "lucide-react";
import useStore from "@/store/useStore";
import { useEffect, useState } from "react";
import { TaskForm } from "../tasks/TaskForm";

export function Sidebar() {
  const activeView = useStore((state) => state.activeView);
  const setActiveView = useStore((state) => state.setActiveView);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    
    // Check on initialization
    checkSize();
    
    // Add listener for size changes
    window.addEventListener("resize", checkSize);
    
    // Clean up listener
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNewTask = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <>
      {/* Toggle button for mobile */}
      <Button 
        variant="outline" 
        size="icon" 
        className={cn(
          "fixed top-4 left-4 z-50 md:hidden transition-all", 
          isOpen ? "left-64" : "left-4"
        )}
        onClick={toggleSidebar}
      >
        {isOpen ? "<" : ">"}
      </Button>
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-card shadow-lg transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold text-burgundy">Bloom</h1>
        </div>
        
        <nav className="flex-1 space-y-1 px-3 py-4">
          <Button
            variant={activeView === "dashboard" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              activeView === "dashboard" && "bg-burgundy text-light-gray"
            )}
            onClick={() => setActiveView("dashboard")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          
          <Button
            variant={activeView === "tasks" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              activeView === "tasks" && "bg-burgundy text-light-gray"
            )}
            onClick={() => setActiveView("tasks")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Tarefas
          </Button>
          
          <Button
            variant={activeView === "notes" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              activeView === "notes" && "bg-burgundy text-light-gray"
            )}
            onClick={() => setActiveView("notes")}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Notas
          </Button>
        </nav>
        
        <div className="border-t p-4">
          <Button 
            className="w-full bg-burgundy text-light-gray hover:bg-burgundy/90"
            onClick={handleNewTask}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>
      </div>
      
      {/* Overlay to close sidebar on mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
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
