
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/components/tasks/TaskForm";
import { NoteForm } from "@/components/notes/NoteForm";
import { useState } from "react";
import { Plus, ListCheck, BookText } from "lucide-react";
import useStore from "@/store/useStore";
import { cn } from "@/lib/utils";

export function QuickActions() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const setActiveView = useStore((state) => state.setActiveView);
  
  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-bold">Ações Rápidas</h2>
      
      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle>Adicionar Nova Tarefa</CardTitle>
            <CardDescription>
              Crie uma nova tarefa com data e horário de lembrete
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsTaskFormOpen(true)} 
                className="bg-burgundy text-light-gray flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Tarefa
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setActiveView("tasks")}
              >
                <ListCheck className="h-4 w-4 mr-2" />
                Ver Tarefas
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle>Adicionar Nova Nota</CardTitle>
            <CardDescription>
              Registre uma nova anotação rápida para consulta futura
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsNoteFormOpen(true)} 
                className="bg-burgundy text-light-gray flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Nota
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setActiveView("notes")}
              >
                <BookText className="h-4 w-4 mr-2" />
                Ver Notas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <TaskForm isOpen={isTaskFormOpen} onClose={() => setIsTaskFormOpen(false)} />
      <NoteForm isOpen={isNoteFormOpen} onClose={() => setIsNoteFormOpen(false)} />
    </div>
  );
}
