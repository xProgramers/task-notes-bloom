
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import useStore from "@/store/useStore";
import { CalendarDays, CheckCircle, Clock, ListChecks, TagIcon } from "lucide-react";
import { useMemo } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export function EnhancedDashboardSummary() {
  // Use separate primitive selectors instead of derived data to avoid unnecessary re-renders
  const tasks = useStore(state => state.tasks);
  const notes = useStore(state => state.notes);
  
  // Memoize the computation of derived state
  const stats = useMemo(() => {
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    const rescheduled = tasks.filter(task => task.status === 'rescheduled').length;
    const total = tasks.length;
    
    // Calcular progresso dos últimos 7 dias
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    const dailyProgress = last7Days.map(date => {
      const dayTasks = tasks.filter(task => task.dueDate === date);
      const dayCompleted = dayTasks.filter(task => task.status === 'completed').length;
      return {
        name: new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' }),
        total: dayTasks.length,
        completed: dayCompleted,
      };
    });
    
    // Extrair todas as tags únicas e contar ocorrências
    const allTags = tasks.flatMap(task => task.tags);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const tagStats = Object.entries(tagCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    
    return {
      completed,
      pending,
      rescheduled,
      total,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      dailyProgress,
      tagStats,
    };
  }, [tasks]);
  
  // Calculate todayTasksCount separately
  const todayTasksCount = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === today).length;
  }, [tasks]);
  
  // Data for pie chart
  const pieData = [
    { name: "Concluídas", value: stats.completed, color: "#7C293A" },
    { name: "Pendentes", value: stats.pending, color: "#C4CBCA" },
    { name: "Reagendadas", value: stats.rescheduled, color: "#D97706" },
  ].filter(item => item.value > 0);
  
  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-bold">Visão Geral</h2>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tarefas Totais"
          value={stats.total}
          icon={<ListChecks className="h-4 w-4 text-muted-foreground" />}
          className="fade-in"
        />
        <StatCard
          title="Concluídas"
          value={stats.completed}
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
          className="fade-in"
        />
        <StatCard
          title="Pendentes"
          value={stats.pending}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          className="fade-in"
        />
        <StatCard
          title="Para Hoje"
          value={todayTasksCount}
          icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
          description={todayTasksCount > 0 ? `${Math.round((todayTasksCount / stats.total) * 100)}% das suas tarefas` : "Nenhuma tarefa para hoje"}
          className="fade-in"
        />
      </div>
    </div>
  );
}
