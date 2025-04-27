
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Note } from "@/types";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit, Trash2 } from "lucide-react";
import useStore from "@/store/useStore";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
}

export function NoteCard({ note, onEdit }: NoteCardProps) {
  const deleteNote = useStore((state) => state.deleteNote);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    // Simular um breve atraso para a animação
    setTimeout(() => {
      deleteNote(note.id);
    }, 300);
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 card-hover",
        isDeleting && "scale-95 opacity-0"
      )}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-md font-medium line-clamp-1">
            {note.title}
          </CardTitle>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => onEdit(note)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive hover:text-destructive/90" 
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Badge className="w-fit text-xs mt-1">{note.category}</Badge>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-line">
          {note.content || "Sem conteúdo"}
        </p>
        <div className="mt-3 flex flex-wrap gap-1">
          {note.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 flex justify-end items-center text-xs text-muted-foreground border-t">
        <div>
          {formatDistanceToNow(new Date(note.createdAt), { 
            addSuffix: true,
            locale: ptBR 
          })}
        </div>
      </CardFooter>
    </Card>
  );
}
