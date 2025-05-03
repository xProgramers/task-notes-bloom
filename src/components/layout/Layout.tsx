
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "../theme/ThemeToggle";
import { FloatingTaskAlert } from "../notifications/FloatingTaskAlert";
import { motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0F0D]">
      {/* Ambient background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-[10%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-burgundy opacity-20 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[20%] left-[15%] w-[25vw] h-[25vw] rounded-full bg-burgundy opacity-15 blur-[120px] animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>
      </div>
      
      {/* Main content container with floating effect */}
      <div className="relative z-10 flex min-h-screen">
        <Sidebar />
        
        <motion.main 
          className="flex-1 p-6 ml-0 md:ml-64 text-[#C4CBCA] overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <ThemeToggle />
          
          {/* Content with subtle float animation */}
          <motion.div 
            className="pt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {children}
          </motion.div>
        </motion.main>
      </div>
      
      {/* Task alert that appears when tasks are due */}
      <FloatingTaskAlert />
    </div>
  );
}
