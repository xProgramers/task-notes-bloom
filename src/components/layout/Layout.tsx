
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "../theme/ThemeToggle";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <ThemeToggle />
      <main className="flex-1 p-6 ml-0 md:ml-64 dark:bg-[#0A0F0D] bg-[#F1F0FB] dark:text-[#C4CBCA] text-gray-800">
        {children}
      </main>
    </div>
  );
}
