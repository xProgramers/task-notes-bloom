
import { Badge, BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ColorVariant = "red" | "blue" | "green" | "purple" | "amber" | "default";

interface ColoredBadgeProps extends BadgeProps {
  color?: ColorVariant;
}

export function ColoredBadge({ 
  children, 
  color = "default",
  className,
  ...props 
}: ColoredBadgeProps) {
  const colorClassMap: Record<ColorVariant, string> = {
    default: "",
    red: "bg-red-500/20 hover:bg-red-500/30 text-red-700 dark:text-red-400 border-red-300",
    blue: "bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 dark:text-blue-400 border-blue-300",
    green: "bg-green-500/20 hover:bg-green-500/30 text-green-700 dark:text-green-400 border-green-300",
    purple: "bg-purple-500/20 hover:bg-purple-500/30 text-purple-700 dark:text-purple-400 border-purple-300",
    amber: "bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-400 border-amber-300",
  };
  
  return (
    <Badge 
      variant="outline"
      className={cn(
        "transition-colors",
        color !== "default" && colorClassMap[color],
        className
      )}
      {...props}
    >
      {children}
    </Badge>
  );
}
