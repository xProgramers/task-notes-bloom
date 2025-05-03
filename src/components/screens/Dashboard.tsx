
import { EnhancedDashboardSummary } from "@/components/dashboard/EnhancedDashboardSummary";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TaskList } from "@/components/tasks/TaskList";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { TaskNotification } from "@/components/notifications/TaskNotification";
import useStore from "@/store/useStore";
import { useMemo, useEffect } from "react";
import { Welcome } from "./Welcome";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem 
} from "@/components/ui/carousel";

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

  // Animation variants for staggered entries
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  
  return (
    <>
      <Welcome />
      
      <motion.div 
        className="space-y-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-burgundy">Dashboard</h1>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 500, damping: 10 }}
            >
              <Sparkles className="ml-3 h-6 w-6 text-burgundy" />
            </motion.div>
          </div>
          <TaskNotification />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <EnhancedDashboardSummary />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <QuickActions />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          {todayTasks.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center">
                <h2 className="text-2xl font-bold">Tarefas para Hoje</h2>
                <div className="ml-2 px-2.5 py-0.5 bg-burgundy/20 rounded-full text-xs font-medium text-burgundy">
                  {todayTasks.length}
                </div>
              </div>
              
              <Carousel className="w-full">
                <CarouselContent className="py-4">
                  {todayTasks.map((task) => (
                    <CarouselItem key={task.id} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-1">
                        <TaskList
                          tasks={[task]}
                          showTitle={false}
                          emptyMessage=""
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          ) : (
            <div className="bg-card/30 backdrop-blur-sm rounded-lg p-8 text-center border border-card/50">
              <p className="text-muted-foreground">Nenhuma tarefa para hoje.</p>
            </div>
          )}
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <DashboardStats />
        </motion.div>
      </motion.div>
    </>
  );
}
