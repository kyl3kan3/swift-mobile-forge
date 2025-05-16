
import { ComponentDefinition } from "@/types/appBuilder";
import { Card } from "@/components/ui/card";
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ComponentLibraryItemProps {
  component: ComponentDefinition;
  onDragStart: (component: ComponentDefinition) => void;
}

export default function ComponentLibraryItem({ 
  component, 
  onDragStart 
}: ComponentLibraryItemProps) {
  const IconComponent = (LucideIcons as Record<string, LucideIcon>)[
    component.icon.charAt(0).toUpperCase() + component.icon.slice(1)
  ] || LucideIcons.Square;

  return (
    <Card 
      className="p-3 cursor-grab drag-item flex items-center gap-3"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("componentType", component.type);
        onDragStart(component);
      }}
    >
      <div className="p-2 rounded-md bg-builder-blue-100 text-builder-blue-500">
        <IconComponent className="h-4 w-4" />
      </div>
      <div>
        <h3 className="text-sm font-medium">{component.label}</h3>
        <p className="text-xs text-muted-foreground">{component.description}</p>
      </div>
    </Card>
  );
}
