
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLucideIcon } from "@/utils/iconUtils";

interface TemplateCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  preview: string;
  onSelect: (id: string) => void;
}

export default function TemplateCard({ 
  id, 
  name, 
  description, 
  icon, 
  preview, 
  onSelect 
}: TemplateCardProps) {
  const IconComponent = getLucideIcon(icon);

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={preview} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="flex items-center gap-3 pt-4 flex-1">
        <div className="p-2 rounded-md bg-builder-blue-100 text-builder-blue-600">
          <IconComponent className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4">
        <Button 
          className="w-full"
          onClick={() => onSelect(id)}
        >
          Use This Template
        </Button>
      </CardFooter>
    </Card>
  );
}
