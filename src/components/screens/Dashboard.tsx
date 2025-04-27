
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TaskList } from "@/components/tasks/TaskList";
import useStore from "@/store/useStore";

export function Dashboard() {
  // Use the selector pattern to subscribe to tasks due today
  const todayTasks = useStore((state) => {
    const today = new Date().toISOString().split('T')[0];
    return state.tasks.filter(task => task.dueDate === today);
  });
  
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
