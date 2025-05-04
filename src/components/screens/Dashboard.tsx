
import { EnhancedDashboardSummary } from "@/components/dashboard/EnhancedDashboardSummary";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TaskList } from "@/components/tasks/TaskList";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import useStore from "@/store/useStore";
import { useMemo, useEffect } from "react";
import { Welcome } from "./Welcome";
import { format } from "date-fns";
import { motion } from "framer-motion";

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
    const today = format(new Date(), "yyyy-MM-dd");
    return tasks.filter(task => task.dueDate === today);
  }, [tasks]);
  
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
    <>
      <Welcome />
      
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-3xl font-bold bg-gradient-to-r from-soft-teal to-bright-coral bg-clip-text text-transparent"
          variants={itemVariants}
        >
          Dashboard
        </motion.h1>
        
        <motion.div variants={itemVariants}>
          <EnhancedDashboardSummary />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <QuickActions />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <TaskList
            tasks={todayTasks}
            title="Tarefas para Hoje"
            emptyMessage="Nenhuma tarefa para hoje."
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <DashboardStats />
        </motion.div>
      </motion.div>
    </>
  );
}
