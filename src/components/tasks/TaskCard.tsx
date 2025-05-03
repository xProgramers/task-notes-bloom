
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, Edit, Trash2, Tag } from "lucide-react";
import useStore from "@/store/useStore";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const toggleTaskCompletion = useStore((state) => state.toggleTaskCompletion);
  const deleteTask = useStore((state) => state.deleteTask);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    // Simular um breve atraso para a animação
    setTimeout(() => {
      deleteTask(task.id);
    }, 300);
  };

  // Determine card gradient based on task status
  const getCardGradient = () => {
    if (task.completed || task.status === "completed") {
      return "from-green-900/20 to-burgundy/10";
    }
    
    if (task.status === "rescheduled") {
      return "from-amber-900/20 to-burgundy/10";
    }
    
    return "from-burgundy/20 to-transparent";
  };
  
  // Subtle animation for the card when completed
  const completedAnimation = {
    scale: [1, 1.05, 1],
    rotate: [0, 2, 0],
    transition: { duration: 0.5 }
  };
  
  return (
    <motion.div
      whileHover={{ translateY: -5 }}
      whileTap={{ scale: 0.98 }}
      animate={isDeleting ? { opacity: 0, scale: 0.8, y: 10 } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className={cn(
          "overflow-hidden transition-all duration-300 h-full backdrop-blur-sm border-card/40 shadow-xl",
          `bg-gradient-to-br ${getCardGradient()}`,
          task.completed && "opacity-75",
        )}
      >
        <CardHeader className="p-4 pb-2 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 bg-burgundy/10 rounded-full blur-xl" />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-start gap-2">
              <div>
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => {
                    toggleTaskCompletion(task.id);
                  }}
                  className="data-[state=checked]:bg-burgundy data-[state=checked]:border-burgundy mt-1"
                />
              </div>
              <div>
                <h3 
                  className={cn(
                    "text-md font-medium line-clamp-1",
                    task.completed && "line-through text-muted-foreground"
                  )}
                >
                  {task.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {task.description || "Sem descrição"}
                </p>
              </div>
            </div>
            
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 opacity-70 hover:opacity-100 hover:bg-burgundy/20" 
                onClick={() => onEdit(task)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive hover:text-destructive/90 opacity-70 hover:opacity-100 hover:bg-destructive/20" 
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-4 py-2">
          {task.tags.length > 0 && (
            <motion.div 
              className="mt-3 flex flex-wrap gap-1"
              animate={isHovered ? { y: 0, opacity: 1 } : { y: 5, opacity: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {task.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="text-xs bg-burgundy/20 hover:bg-burgundy/30 text-burgundy border border-burgundy/30"
                >
                  {tag}
                </Badge>
              ))}
            </motion.div>
          )}
        </CardContent>
        
        <CardFooter className="px-4 py-3 flex flex-col gap-2 items-start text-xs border-t border-card/30">
          <div className="flex w-full justify-between">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{task.dueDate}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>{task.dueTime}</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground italic">
            Criado {formatDistanceToNow(new Date(task.createdAt), { 
              addSuffix: true,
              locale: ptBR 
            })}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
