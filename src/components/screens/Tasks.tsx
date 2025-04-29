
import { TaskList } from "@/components/tasks/TaskList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useStore from "@/store/useStore";
import { useMemo, useEffect } from "react";
import { Task } from "@/types";

export function Tasks() {
  // Get all tasks and load function
  const tasks = useStore((state) => state.tasks);
  const fetchTasks = useStore((state) => state.fetchTasks);
  const isLoading = useStore((state) => state.isLoading);
  
  // Busca as tarefas quando o componente é montado
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  
  // Memoize filtered tasks
  const allTasks = useMemo(() => tasks, [tasks]);
  
  const pendingTasks = useMemo(() => 
    tasks.filter(task => task.status === "pending"),
  [tasks]);
  
  const completedTasks = useMemo(() => 
    tasks.filter(task => task.status === "completed"),
  [tasks]);
  
  const rescheduledTasks = useMemo(() => 
    tasks.filter(task => task.status === "rescheduled"),
  [tasks]);
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-burgundy">Tarefas</h1>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
          <TabsTrigger value="rescheduled">Reagendadas</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <TaskList 
            tasks={allTasks} 
            title="Todas as Tarefas" 
            emptyMessage="Nenhuma tarefa encontrada."
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          <TaskList 
            tasks={pendingTasks} 
            title="Tarefas Pendentes" 
            emptyMessage="Nenhuma tarefa pendente."
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          <TaskList 
            tasks={completedTasks} 
            title="Tarefas Concluídas" 
            emptyMessage="Nenhuma tarefa concluída."
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="rescheduled" className="mt-6">
          <TaskList 
            tasks={rescheduledTasks} 
            title="Tarefas Reagendadas" 
            emptyMessage="Nenhuma tarefa reagendada."
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
