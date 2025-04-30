
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import useStore from "@/store/useStore";
import { motion } from "framer-motion";

interface Step {
  title: string;
  description: string;
  image: string;
  color: string;
}

export function Welcome() {
  const [currentStep, setCurrentStep] = useState(0);
  const setActiveView = useStore(state => state.setActiveView);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  
  const steps: Step[] = [
    {
      title: "Bem-vindo ao Bloom",
      description: "Organize suas tarefas e floresça! Gerencie seu tempo com eficiência.",
      image: "🌱",
      color: "from-green-600 to-emerald-700",
    },
    {
      title: "Crie suas tarefas",
      description: "Adicione, edite e organize suas tarefas com facilidade e acompanhe seu progresso.",
      image: "📝",
      color: "from-burgundy to-pink-800",
    },
    {
      title: "Capture suas ideias",
      description: "Mantenha notas importantes sempre à mão para consultar quando precisar.",
      image: "💡",
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Monitore seu progresso",
      description: "Visualize seu progresso com estatísticas e gráficos personalizados.",
      image: "📊",
      color: "from-blue-600 to-indigo-700",
    },
  ];

  useEffect(() => {
    const welcomeSeen = localStorage.getItem("bloomWelcomeSeen");
    setHasSeenWelcome(!!welcomeSeen);
    
    if (!welcomeSeen) {
      localStorage.setItem("bloomWelcomeSeen", "true");
    }
  }, []);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Último passo, vamos para o dashboard
      setActiveView("dashboard");
    }
  };

  const skipWelcome = () => {
    setActiveView("dashboard");
  };
  
  if (hasSeenWelcome) {
    // Se já viu o welcome, vai direto para o dashboard
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="overflow-hidden">
          <div className={`bg-gradient-to-r ${steps[currentStep].color} p-8 flex flex-col items-center justify-center text-white`}>
            <motion.div
              key={currentStep}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-7xl mb-4"
            >
              {steps[currentStep].image}
            </motion.div>
            <h1 className="text-2xl font-bold text-center">{steps[currentStep].title}</h1>
          </div>
          
          <CardContent className="p-6">
            <p className="text-center mb-8">{steps[currentStep].description}</p>
            
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={skipWelcome}>
                Pular
              </Button>
              
              <div className="flex items-center space-x-1">
                {steps.map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-2 h-2 rounded-full ${
                      currentStep === index ? "bg-burgundy" : "bg-gray-200 dark:bg-gray-700"
                    }`} 
                  />
                ))}
              </div>
              
              <Button onClick={nextStep} className="bg-burgundy hover:bg-burgundy/90">
                {currentStep < steps.length - 1 ? "Próximo" : "Começar"}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
