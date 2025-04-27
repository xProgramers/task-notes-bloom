
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

// Create and export the Layout component that wraps the content with the Sidebar
export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 ml-0 md:ml-64 bg-[#0A0F0D] text-[#C4CBCA]">
        {children}
      </main>
    </div>
  );
}
