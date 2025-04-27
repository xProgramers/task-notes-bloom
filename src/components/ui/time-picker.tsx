
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5", className)}>
      <Label htmlFor="time">Horário</Label>
      <div className="relative">
        <Input
          id="time"
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-8"
        />
        <Clock className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
}
