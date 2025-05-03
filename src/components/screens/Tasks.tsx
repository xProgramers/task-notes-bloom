
import { TaskList } from "@/components/tasks/TaskList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useStore from "@/store/useStore";
import { useMemo, useEffect } from "react";
import { motion } from "framer-motion";

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
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };
  
  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className="text-3xl font-bold bg-gradient-to-r from-soft-teal to-bright-coral bg-clip-text text-transparent"
        variants={itemVariants}
      >
        Tarefas
      </motion.h1>
      
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-4 rounded-xl bg-muted/30 p-1">
            <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-md">Todas</TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-md">Pendentes</TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-md">Concluídas</TabsTrigger>
            <TabsTrigger value="rescheduled" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-md">Reagendadas</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <TaskList 
              tasks={allTasks} 
              title="Todas as Tarefas" 
              emptyMessage="Nenhuma tarefa encontrada."
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="pending" className="mt-6">
            <TaskList 
              tasks={pendingTasks} 
              title="Tarefas Pendentes" 
              emptyMessage="Nenhuma tarefa pendente."
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="completed" className="mt-6">
            <TaskList 
              tasks={completedTasks} 
              title="Tarefas Concluídas" 
              emptyMessage="Nenhuma tarefa concluída."
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="rescheduled" className="mt-6">
            <TaskList 
              tasks={rescheduledTasks} 
              title="Tarefas Reagendadas" 
              emptyMessage="Nenhuma tarefa reagendada."
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
