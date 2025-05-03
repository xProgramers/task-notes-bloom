
import { ReactNode, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "../theme/ThemeToggle";
import { motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [bubbles, setBubbles] = useState<{ size: number; top: string; left: string; delay: number }[]>([]);

  // Gerar bolhas decorativas aleatórias para o fundo
  useEffect(() => {
    const newBubbles = Array.from({ length: 8 }, () => ({
      size: Math.floor(Math.random() * 100) + 50,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2
    }));
    setBubbles(newBubbles);
  }, []);
  
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Bolhas decorativas de fundo */}
      {bubbles.map((bubble, index) => (
        <div
          key={index}
          className="bubble opacity-30"
          style={{
            width: bubble.size,
            height: bubble.size,
            top: bubble.top,
            left: bubble.left,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}
      
      <div className="relative z-10 flex min-h-screen">
        <Sidebar />
        <ThemeToggle />
        
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 p-6 ml-0 md:ml-64 overflow-auto"
        >
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
}
