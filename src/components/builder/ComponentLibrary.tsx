
import { ComponentDefinition } from "@/types/appBuilder";
import { ScrollArea } from "@/components/ui/scroll-area";
import ComponentLibraryItem from "./ComponentLibraryItem";

interface ComponentLibraryProps {
  components: ComponentDefinition[];
  onDragStart: (component: ComponentDefinition) => void;
}

export default function ComponentLibrary({ 
  components, 
  onDragStart 
}: ComponentLibraryProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Components</h3>
      <ScrollArea className="h-[calc(100vh-240px)]">
        <div className="space-y-3 pr-4">
          {components.map((component) => (
            <ComponentLibraryItem
              key={component.type}
              component={component}
              onDragStart={onDragStart}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
