
import { PlusCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onNewProject: () => void;
}

export default function DashboardHeader({ onNewProject }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center pt-4 pb-10 space-y-4 md:space-y-0">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              My Projects
            </h1>
            <div className="ml-4 bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur-sm">
              <span className="inline-flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                Beta
              </span>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-lg max-w-md animate-fade-in">
          Build powerful mobile apps with AI assistance
        </p>
      </div>
      <Button 
        onClick={onNewProject}
        size="lg"
        className="px-5 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden bg-primary hover:bg-primary/90"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-primary via-builder-accent-purple to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
        <PlusCircle className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
        <span className="relative z-10">Create Project</span>
      </Button>
    </header>
  );
}
