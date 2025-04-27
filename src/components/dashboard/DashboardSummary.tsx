
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressCircle } from "@/components/ui/progress-circle";
import useStore from "@/store/useStore";
import { CalendarIcon, CheckIcon, ClockIcon, ListIcon } from "lucide-react";
import { useMemo } from "react";

export function DashboardSummary() {
  // Use useMemo to cache the stats calculation
  const stats = useMemo(() => {
    return useStore.getState().getTaskStats();
  }, []);
  
  // Use useMemo to cache the today's tasks
  const todayTasksCount = useMemo(() => {
    return useStore.getState().getTasksDueToday().length;
  }, []);
  
  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-bold">Visão Geral</h2>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tarefas Totais"
          value={stats.total}
          icon={<ListIcon className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Concluídas"
          value={stats.completed}
          icon={<CheckIcon className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Pendentes"
          value={stats.pending}
          icon={<ClockIcon className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Para Hoje"
          value={todayTasksCount}
          icon={<CalendarIcon className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progresso</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <ProgressCircle
              value={stats.completionRate}
              size={140}
              color="var(--burgundy)"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Status</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-burgundy" />
                  <span>Concluídas</span>
                </div>
                <span>{stats.completed}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-light-gray/30" />
                  <span>Pendentes</span>
                </div>
                <span>{stats.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-600" />
                  <span>Reagendadas</span>
                </div>
                <span>{stats.rescheduled}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
