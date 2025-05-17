
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onNewProject: () => void;
}

export default function DashboardHeader({ onNewProject }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-4 md:space-y-0">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-gradient">App Builder</h1>
          <span className="bg-primary/15 text-primary rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm">Beta</span>
        </div>
        <p className="text-muted-foreground mt-2 text-lg max-w-md animate-fade-in">
          Build powerful native mobile apps with the power of AI
        </p>
      </div>
      <Button 
        onClick={onNewProject}
        className="px-5 py-6 h-auto shadow-xl hover:shadow-2xl transition-all duration-500 group bg-gradient-to-r from-primary to-builder-accent-purple text-white border-none"
      >
        <PlusCircle className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
        New Project
      </Button>
    </header>
  );
}
