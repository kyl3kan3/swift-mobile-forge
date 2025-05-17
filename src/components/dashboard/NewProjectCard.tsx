
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface NewProjectCardProps {
  onClick: () => void;
}

export default function NewProjectCard({ onClick }: NewProjectCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="cursor-pointer border-dashed border-2 flex items-center justify-center h-full min-h-[200px] transition-all duration-300 hover:border-primary/70 hover:bg-accent/50 group card-hover"
    >
      <CardContent className="flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
          <Plus className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
        </div>
        <h3 className="text-lg font-medium">Create New Project</h3>
        <p className="text-sm text-muted-foreground text-center mt-2 max-w-[14rem]">
          Start building your next amazing mobile app
        </p>
      </CardContent>
    </Card>
  );
}
