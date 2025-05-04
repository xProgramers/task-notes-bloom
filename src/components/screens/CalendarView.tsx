
import { useState } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import useStore from "@/store/useStore";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Note, Task } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const notes = useStore((state) => state.notes);
  const tasks = useStore((state) => state.tasks);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState<"notes" | "tasks">("notes");
  
  // Function to get notes for a specific date
  const getNotesForDay = (date: Date): Note[] => {
    const dateStr = format(date, "yyyy-MM-dd");
    return notes.filter((note) => {
      // Comparing note's creation date with the given date
      const noteDate = parseISO(note.createdAt.split("T")[0]);
      return format(noteDate, "yyyy-MM-dd") === dateStr;
    });
  };
  
  // Function to get tasks for a specific date
  const getTasksForDay = (date: Date): Task[] => {
    const dateStr = format(date, "yyyy-MM-dd");
    return tasks.filter((task) => {
      return task.dueDate === dateStr;
    });
  };
  
  // Calculate if a date has notes or tasks
  const hasItems = (date: Date): boolean => {
    return getNotesForDay(date).length > 0 || getTasksForDay(date).length > 0;
  };
  
  const selectedDateNotes = selectedDate ? getNotesForDay(selectedDate) : [];
  const selectedDateTasks = selectedDate ? getTasksForDay(selectedDate) : [];
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Calendário</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setCurrentMonth(new Date())}
          >
            <CalendarIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-4 shadow-md">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="rounded-md border"
            locale={ptBR}
            modifiers={{
              hasItems: (date) => hasItems(date)
            }}
            modifiersStyles={{
              hasItems: { backgroundColor: "hsl(var(--primary) / 0.2)" }
            }}
          />
        </Card>
        
        <Card className="p-4 shadow-md overflow-auto max-h-[400px]">
          <Tabs 
            defaultValue="notes" 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "notes" | "tasks")}
          >
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="notes" className="flex-1">Notas</TabsTrigger>
              <TabsTrigger value="tasks" className="flex-1">Tarefas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="notes" className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">
                Notas para {selectedDate ? format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR }) : "Selecione uma data"}
              </h2>
              
              {selectedDateNotes.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma nota para esta data.
                </p>
              ) : (
                <div className="space-y-4">
                  {selectedDateNotes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-muted/30 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-primary" />
                          <h3 className="font-medium">{note.title}</h3>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(note.createdAt), "HH:mm")}
                        </span>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-sm line-clamp-2">{note.content}</p>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {note.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="tasks" className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">
                Tarefas para {selectedDate ? format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR }) : "Selecione uma data"}
              </h2>
              
              {selectedDateTasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma tarefa para esta data.
                </p>
              ) : (
                <div className="space-y-4">
                  {selectedDateTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg ${task.completed ? 'bg-primary/10' : 'bg-muted/30'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-primary" />
                          <h3 className={`font-medium ${task.completed ? 'line-through opacity-70' : ''}`}>
                            {task.title}
                          </h3>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {task.dueTime}
                        </span>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-sm line-clamp-2">{task.description}</p>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {task.tags.map((tag) => (
                            <span key={tag} className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          task.completed ? 'bg-green-500/20 text-green-600' : 
                          task.status === 'rescheduled' ? 'bg-amber-500/20 text-amber-600' : 
                          'bg-blue-500/20 text-blue-600'
                        }`}>
                          {task.completed ? 'Concluída' : task.status === 'rescheduled' ? 'Reagendada' : 'Pendente'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
