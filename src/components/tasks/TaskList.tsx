
import { Task } from "@/types";
import { TaskCard } from "./TaskCard";
import { useState } from "react";
import { TaskForm } from "./TaskForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2 } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  title?: string;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function TaskList({ tasks, title = "Tarefas", emptyMessage = "Nenhuma tarefa encontrada.", isLoading = false }: TaskListProps) {
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
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button 
          onClick={() => setIsFormOpen(true)} 
          className="bg-burgundy text-light-gray"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar tarefas por título, descrição ou tag..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-8 bg-card rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-burgundy" />
          <p className="mt-4 text-muted-foreground">Carregando tarefas...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-card rounded-lg">
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={handleEditTask} 
            />
          ))}
        </div>
      )}
      
      <TaskForm 
        isOpen={isFormOpen} 
        onClose={handleCloseForm} 
        task={taskToEdit} 
      />
    </div>
  );
}
