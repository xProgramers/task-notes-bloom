
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useStore from "@/store/useStore";
import { TagIcon } from "lucide-react";
import { useMemo } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export function DashboardStats() {
  // Use separate primitive selectors instead of derived data to avoid unnecessary re-renders
  const tasks = useStore(state => state.tasks);
  
  // Memoize the computation of derived state
  const stats = useMemo(() => {
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    const rescheduled = tasks.filter(task => task.status === 'rescheduled').length;
    const total = tasks.length;
    
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
      tagStats,
    };
  }, [tasks]);
  
  // Data for pie chart
  const pieData = [
    { name: "Concluídas", value: stats.completed, color: "#7C293A" },
    { name: "Pendentes", value: stats.pending, color: "#C4CBCA" },
    { name: "Reagendadas", value: stats.rescheduled, color: "#D97706" },
  ].filter(item => item.value > 0);
  
  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-bold">Estatísticas</h2>
      
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
