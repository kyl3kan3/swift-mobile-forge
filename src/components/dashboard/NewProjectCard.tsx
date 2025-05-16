
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

interface NewProjectCardProps {
  onClick: () => void;
}

export default function NewProjectCard({ onClick }: NewProjectCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="cursor-pointer border-dashed border-2 flex items-center justify-center h-full min-h-[200px] transition-colors hover:border-primary hover:bg-primary/5"
    >
      <CardContent className="flex flex-col items-center justify-center p-6">
        <PlusCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Create New Project</h3>
        <p className="text-sm text-muted-foreground text-center mt-2">
          Start building a new mobile app
        </p>
      </CardContent>
    </Card>
  );
}
