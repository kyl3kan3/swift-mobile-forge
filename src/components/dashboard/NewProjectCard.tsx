
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface NewProjectCardProps {
  onClick: () => void;
}

export default function NewProjectCard({ onClick }: NewProjectCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="cursor-pointer border-none bg-gradient-to-br from-accent/80 to-accent/20 flex items-center justify-center h-full min-h-[260px] transition-all duration-500 hover:shadow-2xl group shadow-lg relative overflow-hidden backdrop-blur-sm"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/60 via-builder-accent-purple/60 to-builder-accent-green/60 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-in-out"></div>
      <CardContent className="flex flex-col items-center justify-center p-8 z-10">
        <div className="w-20 h-20 rounded-full bg-primary/10 backdrop-blur-lg flex items-center justify-center mb-7 group-hover:scale-110 transition-transform duration-500 shadow-xl border border-primary/20">
          <Plus className="h-10 w-10 text-primary group-hover:rotate-90 transition-transform duration-700" />
        </div>
        <h3 className="text-2xl font-semibold text-foreground mb-3">Create New Project</h3>
        <p className="text-md text-muted-foreground text-center mt-1 max-w-[18rem] opacity-90 leading-relaxed">
          Start building your next amazing mobile app with AI assistance
        </p>
      </CardContent>
    </Card>
  );
}
