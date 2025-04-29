
import { NoteList } from "@/components/notes/NoteList";
import useStore from "@/store/useStore";
import { useEffect } from "react";

export function Notes() {
  const notes = useStore((state) => state.notes);
  const fetchNotes = useStore((state) => state.fetchNotes);
  const isLoading = useStore((state) => state.isLoading);
  
  // Busca as notas quando o componente é montado
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-burgundy">Notas</h1>
      
      <NoteList 
        notes={notes} 
        title="Todas as Notas" 
        emptyMessage="Nenhuma nota encontrada. Crie sua primeira nota!"
        isLoading={isLoading}
      />
    </div>
  );
}
