
import { TaskList } from "@/components/tasks/TaskList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useStore from "@/store/useStore";
import { useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Calendar, Layers } from "lucide-react";

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
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.h1 variants={itemVariants} className="text-3xl font-bold text-burgundy">Tarefas</motion.h1>
      
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-4 p-1 bg-card/30 backdrop-blur-md border border-card/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-burgundy data-[state=active]:text-white">
              <Layers className="h-4 w-4 mr-1" />
              Todas
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-burgundy data-[state=active]:text-white">
              <Clock className="h-4 w-4 mr-1" />
              Pendentes
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-burgundy data-[state=active]:text-white">
              <CheckCircle className="h-4 w-4 mr-1" />
              Concluídas
            </TabsTrigger>
            <TabsTrigger value="rescheduled" className="data-[state=active]:bg-burgundy data-[state=active]:text-white">
              <Calendar className="h-4 w-4 mr-1" />
              Reagendadas
            </TabsTrigger>
          </TabsList>
          
          <motion.div
            variants={itemVariants}
            className="mt-6 bg-gradient-to-br from-[#0A0F0D]/80 to-[#0A0F0D]/90 backdrop-blur-sm rounded-lg p-6 border border-burgundy/10"
          >
            <TabsContent value="all" className="mt-0">
              <TaskList 
                tasks={allTasks} 
                title="Todas as Tarefas" 
                emptyMessage="Nenhuma tarefa encontrada."
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="pending" className="mt-0">
              <TaskList 
                tasks={pendingTasks} 
                title="Tarefas Pendentes" 
                emptyMessage="Nenhuma tarefa pendente."
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="completed" className="mt-0">
              <TaskList 
                tasks={completedTasks} 
                title="Tarefas Concluídas" 
                emptyMessage="Nenhuma tarefa concluída."
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="rescheduled" className="mt-0">
              <TaskList 
                tasks={rescheduledTasks} 
                title="Tarefas Reagendadas" 
                emptyMessage="Nenhuma tarefa reagendada."
                isLoading={isLoading}
              />
            </TabsContent>
          </motion.div>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
