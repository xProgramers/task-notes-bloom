
import { Task } from "@/types";
import { TaskCard } from "./TaskCard";
import { useState } from "react";
import { TaskForm } from "./TaskForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface TaskListProps {
  tasks: Task[];
  title?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  showTitle?: boolean;
}

export function TaskList({ 
  tasks, 
  title = "Tarefas", 
  emptyMessage = "Nenhuma tarefa encontrada.", 
  isLoading = false,
  showTitle = true 
}: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const filteredTasks = searchQuery.trim()
    ? tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          // Improved tag search - match individual tags
          task.tags.some((tag) =>
            tag.toLowerCase() === searchQuery.toLowerCase() || 
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : tasks;
  
  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setTaskToEdit(undefined);
  };

  // Animation variants for staggered entries
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold">{title}</h2>
            {filteredTasks.length > 0 && (
              <div className="px-2 py-0.5 rounded-full text-xs bg-burgundy/20 text-burgundy">
                {filteredTasks.length}
              </div>
            )}
          </div>
          
          <Button 
            onClick={() => setIsFormOpen(true)} 
            className="bg-burgundy text-light-gray hover:bg-burgundy/90 group"
          >
            <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Nova Tarefa
          </Button>
        </div>
      )}
      
      {tasks.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar tarefas por título, descrição ou tag..."
            className="pl-9 bg-background/30 backdrop-blur-sm border-card/50 focus:border-burgundy"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-lg bg-card/20 backdrop-blur-md border border-card/40">
          <Loader2 className="h-8 w-8 animate-spin text-burgundy" />
          <p className="mt-4 text-muted-foreground">Carregando tarefas...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-lg bg-card/20 backdrop-blur-md border border-card/40">
          <p className="text-muted-foreground">{emptyMessage}</p>
          <Button 
            variant="link" 
            onClick={() => setIsFormOpen(true)}
            className="mt-2 text-burgundy"
          >
            Criar nova tarefa
          </Button>
        </div>
      ) : (
        <motion.div 
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    duration: 0.5,
                    delay: index * 0.1
                  } 
                }
              }}
              style={{
                // Add some random offset to create a more organic, flowing layout
                translateY: `${Math.sin(index * 0.8) * 8}px`
              }}
              className="hover:-translate-y-1 transition-transform duration-300"
            >
              <TaskCard 
                task={task} 
                onEdit={handleEditTask} 
              />
            </motion.div>
          ))}
        </motion.div>
      )}
      
      <TaskForm 
        isOpen={isFormOpen} 
        onClose={handleCloseForm} 
        task={taskToEdit} 
      />
    </div>
  );
}
