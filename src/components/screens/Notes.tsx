
import { NoteList } from "@/components/notes/NoteList";
import useStore from "@/store/useStore";

export function Notes() {
  const notes = useStore((state) => state.notes);
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-burgundy">Notas</h1>
      
      <NoteList 
        notes={notes} 
        title="Todas as Notas" 
        emptyMessage="Nenhuma nota encontrada. Crie sua primeira nota!"
      />
    </div>
  );
}
