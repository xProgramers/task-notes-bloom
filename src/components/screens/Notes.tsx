
import { NoteList } from "@/components/notes/NoteList";
import useStore from "@/store/useStore";
import { useEffect } from "react";
import { motion } from "framer-motion";

export function Notes() {
  const notes = useStore((state) => state.notes);
  const fetchNotes = useStore((state) => state.fetchNotes);
  const isLoading = useStore((state) => state.isLoading);
  
  // Busca as notas quando o componente é montado
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);
  
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
        Notas
      </motion.h1>
      
      <motion.div variants={itemVariants}>
        <NoteList 
          notes={notes} 
          title="Todas as Notas" 
          emptyMessage="Nenhuma nota encontrada. Crie sua primeira nota!"
          isLoading={isLoading}
        />
      </motion.div>
    </motion.div>
  );
}
