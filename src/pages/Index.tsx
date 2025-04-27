
import { Layout } from "@/components/layout/Layout";
import { Dashboard } from "@/components/screens/Dashboard";
import { Tasks } from "@/components/screens/Tasks";
import { Notes } from "@/components/screens/Notes";
import useStore from "@/store/useStore";

const Index = () => {
  const activeView = useStore((state) => state.activeView);
  
  // Renderiza o componente correto baseado na view ativa
  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "tasks":
        return <Tasks />;
      case "notes":
        return <Notes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderActiveView()}
    </Layout>
  );
};

export default Index;
