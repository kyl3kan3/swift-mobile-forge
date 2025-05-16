
import { ComponentDefinition } from "@/types/appBuilder";
import { Card } from "@/components/ui/card";
import { getLucideIcon } from "@/utils/iconUtils";

interface ComponentLibraryItemProps {
  component: ComponentDefinition;
  onDragStart: (component: ComponentDefinition) => void;
}

export default function ComponentLibraryItem({ 
  component, 
  onDragStart 
}: ComponentLibraryItemProps) {
  const IconComponent = getLucideIcon(component.icon);

  return (
    <Card 
      className="p-3 cursor-grab drag-item flex items-center gap-3 hover:bg-accent/50 transition-all duration-300 border border-border/50 hover:border-primary/30 group"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("componentType", component.type);
        onDragStart(component);
      }}
    >
      <div className="p-2 rounded-md gradient-bg text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
        <IconComponent className="h-4 w-4" />
      </div>
      <div>
        <h3 className="text-sm font-medium">{component.label}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1">{component.description}</p>
      </div>
    </Card>
  );
}
