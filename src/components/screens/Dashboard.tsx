
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TaskList } from "@/components/tasks/TaskList";
import useStore from "@/store/useStore";
import { useMemo } from "react";

export function Dashboard() {
  // Use useMemo to cache the tasks due today
  const todayTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return useStore.getState().tasks.filter(task => task.dueDate === today);
  }, []);
  
  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-burgundy">Dashboard</h1>
      
      <DashboardSummary />
      
      <QuickActions />
      
      <TaskList
        tasks={todayTasks}
        title="Tarefas para Hoje"
        emptyMessage="Nenhuma tarefa para hoje."
      />
    </div>
  );
}
