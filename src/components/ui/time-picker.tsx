
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");

  // Generate time options
  const hourOptions = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0')
  );
  
  const minuteOptions = Array.from({ length: 60 }, (_, i) => 
    i.toString().padStart(2, '0')
  );

  // Update hours and minutes when value changes
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      setHours(h);
      setMinutes(m);
    }
  }, [value]);

  // Update value when hours or minutes change
  const updateTime = (newHours: string, newMinutes: string) => {
    onChange(`${newHours}:${newMinutes}`);
  };

  return (
    <div className={cn("flex flex-col space-y-1.5", className)}>
      <Label htmlFor="time">Horário</Label>
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Clock className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <div className="flex pl-8">
            <Select 
              value={hours}
              onValueChange={(value) => {
                setHours(value);
                updateTime(value, minutes);
              }}
            >
              <SelectTrigger className="w-full rounded-r-none border-r-0">
                <SelectValue placeholder="Hora" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                {hourOptions.map((hour) => (
                  <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center px-1 border-t border-b border-input">:</div>
            <Select 
              value={minutes}
              onValueChange={(value) => {
                setMinutes(value);
                updateTime(hours, value);
              }}
            >
              <SelectTrigger className="w-full rounded-l-none border-l-0">
                <SelectValue placeholder="Minuto" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                {minuteOptions.map((minute) => (
                  <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
