
import { TaskList } from "@/components/tasks/TaskList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useStore from "@/store/useStore";

export function Tasks() {
  const allTasks = useStore((state) => state.tasks);
  const pendingTasks = useStore((state) => state.getTasksByStatus("pending"));
  const completedTasks = useStore((state) => state.getTasksByStatus("completed"));
  const rescheduledTasks = useStore((state) => state.getTasksByStatus("rescheduled"));
  
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
          />
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          <TaskList 
            tasks={pendingTasks} 
            title="Tarefas Pendentes" 
            emptyMessage="Nenhuma tarefa pendente."
          />
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          <TaskList 
            tasks={completedTasks} 
            title="Tarefas Concluídas" 
            emptyMessage="Nenhuma tarefa concluída."
          />
        </TabsContent>
        <TabsContent value="rescheduled" className="mt-6">
          <TaskList 
            tasks={rescheduledTasks} 
            title="Tarefas Reagendadas" 
            emptyMessage="Nenhuma tarefa reagendada."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
