
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface NewProjectCardProps {
  onClick: () => void;
}

export default function NewProjectCard({ onClick }: NewProjectCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="cursor-pointer h-full min-h-[250px] flex items-center justify-center transition-all duration-300 hover:shadow-xl group relative overflow-hidden bg-accent/40 backdrop-blur-sm border-dashed border-primary/20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-builder-accent-purple to-builder-accent-green transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-in-out"></div>
      <div className="flex flex-col items-center justify-center p-8 z-10">
        <div className="w-16 h-16 rounded-full bg-primary/10 backdrop-blur-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
          <Plus className="h-8 w-8 text-primary group-hover:rotate-90 transition-transform duration-500" />
        </div>
        <h3 className="text-xl font-medium text-foreground mb-2">New Project</h3>
        <p className="text-sm text-muted-foreground text-center mt-1 max-w-[16rem] leading-relaxed">
          Start building your next app with AI assistance
        </p>
      </div>
    </Card>
  );
}
