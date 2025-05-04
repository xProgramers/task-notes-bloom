
import { TaskNotification } from "../notifications/TaskNotification";
import { ThemeToggle } from "../theme/ThemeToggle";

export function TopBar() {
  return (
    <div className="fixed top-4 right-4 flex items-center gap-3 z-50">
      <TaskNotification />
      <ThemeToggle />
    </div>
  );
}
