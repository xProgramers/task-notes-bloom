
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { Task } from "@/types";
import { useState, useEffect } from "react";
import useStore from "@/store/useStore";
import { parse, format } from "date-fns";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
}

export function TaskForm({ isOpen, onClose, task }: TaskFormProps) {
  const addTask = useStore((state) => state.addTask);
  const updateTask = useStore((state) => state.updateTask);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [dueTime, setDueTime] = useState("09:00");
  const [tags, setTags] = useState("");
  
  // Reseta o form quando o modal fecha
  useEffect(() => {
    if (!isOpen) {
      if (!task) {
        setTitle("");
        setDescription("");
        setDueDate(new Date());
        setDueTime("09:00");
        setTags("");
      }
    }
  }, [isOpen]);
  
  // Preenche o form quando existe uma tarefa para editar
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      if (task.dueDate) {
        try {
          const date = parse(task.dueDate, "yyyy-MM-dd", new Date());
          setDueDate(date);
        } catch {
          setDueDate(new Date());
        }
      }
      setDueTime(task.dueTime || "09:00");
      setTags(task.tags.join(", "));
    }
  }, [task]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedDate = dueDate ? format(dueDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
    const tagsList = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    
    if (task) {
      // Atualizar tarefa existente
      updateTask(task.id, {
        title,
        description,
        dueDate: formattedDate,
        dueTime,
        tags: tagsList,
      });
    } else {
      // Criar nova tarefa
      addTask({
        title,
        description,
        dueDate: formattedDate,
        dueTime,
        tags: tagsList,
        status: "pending",
        completed: false,
      });
    }
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {task ? "Editar Tarefa" : "Nova Tarefa"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Nome da tarefa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva a tarefa (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Data</Label>
                <DatePicker
                  date={dueDate}
                  onSelect={setDueDate}
                />
              </div>
              <TimePicker
                value={dueTime}
                onChange={setDueTime}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Ex: trabalho, pessoal, urgente"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Separe as tags com vírgulas
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-burgundy text-light-gray"
            >
              {task ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
