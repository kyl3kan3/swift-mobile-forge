
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Download, Code, Sparkles } from "lucide-react";
import ComponentLibrary from "@/components/builder/ComponentLibrary";
import ScreensList from "@/components/builder/ScreensList";
import { AppProject, ComponentDefinition, AppScreen } from "@/types/appBuilder";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface BuilderLeftSidebarProps {
  project: AppProject | null;
  setProject: React.Dispatch<React.SetStateAction<AppProject | null>>;
  activeScreenId: string | null;
  setActiveScreenId: React.Dispatch<React.SetStateAction<string | null>>;
  onDragStart: (component: ComponentDefinition) => void;
  onOpenExportDialog: () => void;
  onOpenCodeDialog: () => void;
  components: ComponentDefinition[];
}

export default function BuilderLeftSidebar({
  project,
  setProject,
  activeScreenId,
  setActiveScreenId,
  onDragStart,
  onOpenExportDialog,
  onOpenCodeDialog,
  components
}: BuilderLeftSidebarProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleAddScreen = () => {
    if (!project) return;
    
    const newScreen: AppScreen = {
      id: uuidv4(),
      name: `Screen ${project.screens.length + 1}`,
      components: []
    };
    
    const updatedScreens = [...project.screens, newScreen];
    setProject({
      ...project,
      screens: updatedScreens,
      updatedAt: new Date().toISOString()
    });
    setActiveScreenId(newScreen.id);
    
    toast({
      title: "Screen Added",
      description: `${newScreen.name} has been created.`
    });
  };

  const handleSaveProject = () => {
    if (!project) return;
    
    setIsSaving(true);
    
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Project Saved",
        description: `${project.name} has been saved successfully.`
      });
    }, 1000);
  };

  return (
    <div className="w-64 border-r bg-sidebar p-4 flex flex-col">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold ml-2 truncate">
          {project?.name || 'App Builder'}
        </h2>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="screens">
          <TabsList className="w-full">
            <TabsTrigger value="screens" className="flex-1">Screens</TabsTrigger>
            <TabsTrigger value="components" className="flex-1">Components</TabsTrigger>
          </TabsList>
          
          <TabsContent value="screens" className="mt-4">
            {project && (
              <ScreensList
                screens={project.screens}
                activeScreenId={activeScreenId}
                onSelectScreen={setActiveScreenId}
                onAddScreen={handleAddScreen}
              />
            )}
          </TabsContent>
          
          <TabsContent value="components" className="mt-4">
            <ComponentLibrary
              components={components}
              onDragStart={onDragStart}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-4 pt-4 border-t space-y-2">
        <Button 
          className="w-full"
          onClick={handleSaveProject}
          disabled={isSaving}
        >
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Project
            </>
          )}
        </Button>
        <Button 
          className="w-full" 
          variant="outline"
          onClick={onOpenExportDialog}
        >
          <Download className="mr-2 h-4 w-4" />
          Export App
        </Button>
        <Button 
          className="w-full" 
          variant="secondary"
          onClick={onOpenCodeDialog}
        >
          <Code className="mr-2 h-4 w-4" />
          Generate Code
        </Button>
      </div>
    </div>
  );
}
