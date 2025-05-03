
import { Layout } from "@/components/layout/Layout";
import { Dashboard } from "@/components/screens/Dashboard";
import { Tasks } from "@/components/screens/Tasks";
import { Notes } from "@/components/screens/Notes";
import useStore from "@/store/useStore";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

const Index = () => {
  const activeView = useStore((state) => state.activeView);
  const fetchTasks = useStore((state) => state.fetchTasks);
  const fetchNotes = useStore((state) => state.fetchNotes);
  
  // Carrega dados iniciais quando o app é montado
  useEffect(() => {
    fetchTasks();
    fetchNotes();
  }, [fetchTasks, fetchNotes]);
  
  // Renderiza o componente correto baseado na view ativa
  const renderActiveView = () => {
    const variants = {
      hidden: { opacity: 0, x: 20 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 }
    };
    
    switch (activeView) {
      case "dashboard":
        return (
          <motion.div
            key="dashboard"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Dashboard />
          </motion.div>
        );
      case "tasks":
        return (
          <motion.div
            key="tasks"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Tasks />
          </motion.div>
        );
      case "notes":
        return (
          <motion.div
            key="notes"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Notes />
          </motion.div>
        );
      default:
        return (
          <motion.div
            key="default-dashboard"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Dashboard />
          </motion.div>
        );
    }
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {renderActiveView()}
      </AnimatePresence>
    </Layout>
  );
};

export default Index;
