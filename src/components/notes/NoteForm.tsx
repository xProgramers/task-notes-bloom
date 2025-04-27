
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Note } from "@/types";
import { useState, useEffect } from "react";
import useStore from "@/store/useStore";

interface NoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note;
}

export function NoteForm({ isOpen, onClose, note }: NoteFormProps) {
  const addNote = useStore((state) => state.addNote);
  const updateNote = useStore((state) => state.updateNote);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Geral");
  const [tags, setTags] = useState("");
  
  const categories = ["Geral", "Trabalho", "Pessoal", "Ideias", "Recursos"];
  
  // Reseta o form quando o modal fecha
  useEffect(() => {
    if (!isOpen) {
      if (!note) {
        setTitle("");
        setContent("");
        setCategory("Geral");
        setTags("");
      }
    }
  }, [isOpen]);
  
  // Preenche o form quando existe uma nota para editar
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category);
      setTags(note.tags.join(", "));
    }
  }, [note]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tagsList = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    
    if (note) {
      // Atualizar nota existente
      updateNote(note.id, {
        title,
        content,
        category,
        tags: tagsList,
      });
    } else {
      // Criar nova nota
      addNote({
        title,
        content,
        category,
        tags: tagsList,
      });
    }
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {note ? "Editar Nota" : "Nova Nota"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Título da nota"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Conteúdo</Label>
              <Textarea
                id="content"
                placeholder="Escreva sua nota aqui..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="resize-none"
                rows={6}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={category} 
                  onValueChange={setCategory}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="Ex: importante, lembrete, ideia"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-burgundy text-light-gray"
            >
              {note ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
