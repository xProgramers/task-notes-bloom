
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TaskList } from "@/components/tasks/TaskList";
import useStore from "@/store/useStore";

export function Dashboard() {
  const todayTasks = useStore((state) => state.getTasksDueToday());
  
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
