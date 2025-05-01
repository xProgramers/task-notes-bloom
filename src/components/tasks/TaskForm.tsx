
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
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  
  // Initialize dueTime with current time
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  const [dueTime, setDueTime] = useState(getCurrentTime());
  
  const [tags, setTags] = useState("");
  const [recurrence, setRecurrence] = useState<"none" | "daily" | "weekly" | "yearly">("none");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reseta o form quando o modal fecha
  useEffect(() => {
    if (!isOpen) {
      if (!task) {
        setTitle("");
        setDescription("");
        setDueDate(new Date());
        setDueTime(getCurrentTime());
        setTags("");
        setRecurrence("none");
      }
      setIsSubmitting(false);
    }
  }, [isOpen, task]);
  
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
      setDueTime(task.dueTime || getCurrentTime());
      setTags(task.tags.join(", "));
      setRecurrence(task.recurrence || "none");
    }
  }, [task]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Por favor, informe um título para a tarefa");
      return;
    }
    
    setIsSubmitting(true);
    
    const formattedDate = dueDate ? format(dueDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
    const tagsList = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    
    try {
      if (task) {
        // Atualizar tarefa existente
        await updateTask(task.id, {
          title,
          description,
          dueDate: formattedDate,
          dueTime,
          tags: tagsList,
          recurrence,
        });
        toast.success("Tarefa atualizada com sucesso!");
      } else {
        // Criar nova tarefa
        await addTask({
          title,
          description,
          dueDate: formattedDate,
          dueTime,
          tags: tagsList,
          status: "pending",
          completed: false,
          recurrence,
        });
        toast.success("Tarefa criada com sucesso!");
      }
      
      onClose();
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      toast.error("Ocorreu um erro ao salvar a tarefa. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] z-50">
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
              <Label htmlFor="recurrence">Recorrência</Label>
              <Select 
                value={recurrence}
                onValueChange={(value) => setRecurrence(value as "none" | "daily" | "weekly" | "yearly")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar recorrência" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="none">Nenhuma</SelectItem>
                  <SelectItem value="daily">Diária</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
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
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-burgundy text-light-gray"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? "Salvando..." 
                : task ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
