
import { EnhancedDashboardSummary } from "@/components/dashboard/EnhancedDashboardSummary";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TaskList } from "@/components/tasks/TaskList";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import useStore from "@/store/useStore";
import { useMemo, useEffect } from "react";
import { Welcome } from "./Welcome";

export function Dashboard() {
  // Get all tasks first
  const tasks = useStore(state => state.tasks);
  const fetchTasks = useStore(state => state.fetchTasks);
  const fetchNotes = useStore(state => state.fetchNotes);
  
  // Fetch data when component mounts
  useEffect(() => {
    fetchTasks();
    fetchNotes();
  }, [fetchTasks, fetchNotes]);
  
  // Then filter with useMemo
  const todayTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === today);
  }, [tasks]);
  
  return (
    <>
      <Welcome />
      
      <div className="space-y-10 fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-burgundy">Dashboard</h1>
        </div>
        
        <EnhancedDashboardSummary />
        
        <QuickActions />
        
        <TaskList
          tasks={todayTasks}
          title="Tarefas para Hoje"
          emptyMessage="Nenhuma tarefa para hoje."
        />
        
        <DashboardStats />
      </div>
    </>
  );
}
