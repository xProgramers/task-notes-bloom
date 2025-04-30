
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressCircle } from "@/components/ui/progress-circle";
import useStore from "@/store/useStore";
import { CalendarDays, CheckCircle, Clock, ListChecks, TagIcon } from "lucide-react";
import { useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell 
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
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span>Progresso</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <div className="relative">
              <ProgressCircle
                value={stats.completionRate}
                size={140}
                color="#7C293A"
                strokeWidth={12}
                className="text-burgundy/20"
              />
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-burgundy">{Math.round(stats.completionRate)}%</span>
                <span className="text-xs text-muted-foreground">Concluído</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 card-hover">
          <CardHeader>
            <CardTitle>Progresso nos Últimos 7 Dias</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.dailyProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)', 
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)' 
                  }}
                />
                <Bar dataKey="total" stackId="a" fill="#C4CBCA" name="Total" />
                <Bar dataKey="completed" stackId="b" fill="#7C293A" name="Concluídas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TagIcon className="h-5 w-5 mr-2" />
              <span>Tags Mais Usadas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {stats.tagStats.length > 0 ? (
              <div className="space-y-4">
                {stats.tagStats.map((tag, index) => (
                  <div key={tag.name} className="flex items-center">
                    <span className="w-24 truncate">{tag.name}</span>
                    <div className="flex-1 h-2 bg-muted ml-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-burgundy" 
                        style={{ 
                          width: `${(tag.value / stats.tagStats[0].value) * 100}%`,
                          transition: "width 1s ease-in-out"
                        }}
                      />
                    </div>
                    <span className="ml-2 text-muted-foreground">{tag.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <p>Nenhuma tag encontrada</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Distribuição de Status</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {stats.total > 0 ? (
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} tarefas`, '']}
                      contentStyle={{ 
                        backgroundColor: 'var(--background)', 
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)' 
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <p>Nenhuma tarefa encontrada</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
