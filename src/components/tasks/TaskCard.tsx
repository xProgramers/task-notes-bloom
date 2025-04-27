
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, Edit, Trash2 } from "lucide-react";
import useStore from "@/store/useStore";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const toggleTaskCompletion = useStore((state) => state.toggleTaskCompletion);
  const deleteTask = useStore((state) => state.deleteTask);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    // Simular um breve atraso para a animação
    setTimeout(() => {
      deleteTask(task.id);
    }, 300);
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 card-hover",
        task.completed && "opacity-75",
        isDeleting && "scale-95 opacity-0"
      )}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleTaskCompletion(task.id)}
              className="data-[state=checked]:bg-burgundy data-[state=checked]:border-burgundy"
            />
            <CardTitle 
              className={cn(
                "text-md font-medium line-clamp-1",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </CardTitle>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => onEdit(task)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive hover:text-destructive/90" 
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {task.description || "Sem descrição"}
        </p>
        <div className="mt-3 flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 flex justify-between items-center text-xs text-muted-foreground border-t">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{task.dueDate}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{task.dueTime}</span>
          </div>
        </div>
        <div>
          {formatDistanceToNow(new Date(task.createdAt), { 
            addSuffix: true,
            locale: ptBR 
          })}
        </div>
      </CardFooter>
    </Card>
  );
}
