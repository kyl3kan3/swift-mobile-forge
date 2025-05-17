
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface NewProjectCardProps {
  onClick: () => void;
}

export default function NewProjectCard({ onClick }: NewProjectCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="cursor-pointer border-none bg-gradient-to-br from-accent to-accent/40 flex items-center justify-center h-full min-h-[220px] transition-all duration-300 hover:shadow-xl group shadow-md relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardContent className="flex flex-col items-center justify-center p-6 z-10">
        <div className="w-16 h-16 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
          <Plus className="h-8 w-8 text-primary group-hover:rotate-90 transition-transform duration-500" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Create New Project</h3>
        <p className="text-sm text-muted-foreground text-center mt-3 max-w-[16rem] opacity-90">
          Start building your next amazing mobile app
        </p>
      </CardContent>
    </Card>
  );
}
