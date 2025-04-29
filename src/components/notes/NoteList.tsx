
import { Note } from "@/types";
import { NoteCard } from "./NoteCard";
import { useState } from "react";
import { NoteForm } from "./NoteForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2 } from "lucide-react";

interface NoteListProps {
  notes: Note[];
  title?: string;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function NoteList({ notes, title = "Notas", emptyMessage = "Nenhuma nota encontrada.", isLoading = false }: NoteListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [noteToEdit, setNoteToEdit] = useState<Note | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const filteredNotes = searchQuery.trim()
    ? notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : notes;
  
  const handleEditNote = (note: Note) => {
    setNoteToEdit(note);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setNoteToEdit(undefined);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button 
          onClick={() => setIsFormOpen(true)} 
          className="bg-burgundy text-light-gray"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Nota
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar notas..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-8 bg-card rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-burgundy" />
          <p className="mt-4 text-muted-foreground">Carregando notas...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-card rounded-lg">
          <p className="text-muted-foreground">{emptyMessage}</p>
          <Button 
            variant="link" 
            onClick={() => setIsFormOpen(true)}
            className="mt-2 text-burgundy"
          >
            Criar nova nota
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onEdit={handleEditNote} 
            />
          ))}
        </div>
      )}
      
      <NoteForm 
        isOpen={isFormOpen} 
        onClose={handleCloseForm} 
        note={noteToEdit} 
      />
    </div>
  );
}
