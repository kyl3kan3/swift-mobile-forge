
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  AppComponent,
  AppProject,
  AppScreen,
  ComponentDefinition,
  ComponentType,
  PlatformType
} from "@/types/appBuilder";
import { mockProjects, componentLibrary } from "@/data/mockData";
import { v4 as uuidv4 } from 'uuid';
import BuilderLeftSidebar from "@/components/builder/BuilderLeftSidebar";
import BuilderTopToolbar from "@/components/builder/BuilderTopToolbar";
import BuilderPreviewArea from "@/components/builder/BuilderPreviewArea";
import ExportDialog from "@/components/builder/ExportDialog";
import EnhancedCodeGeneration from "@/components/builder/EnhancedCodeGeneration";
import AIDesignAssistant from "@/components/builder/AIDesignAssistant";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function AppBuilder() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [project, setProject] = useState<AppProject | null>(null);
  const [activeScreenId, setActiveScreenId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState<ComponentDefinition | null>(null);
  const [platform, setPlatform] = useState<PlatformType>("both"); // Default to both platforms
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false);
  const [isAIDesignDialogOpen, setIsAIDesignDialogOpen] = useState(false);

  useEffect(() => {
    // Load project data
    if (projectId) {
      const foundProject = mockProjects.find(p => p.id === projectId);
      if (foundProject) {
        setProject(foundProject);
        if (foundProject.screens.length > 0) {
          setActiveScreenId(foundProject.screens[0].id);
        }
      } else {
        navigate('/');
      }
    }
  }, [projectId, navigate]);

  const activeScreen = project?.screens.find(screen => screen.id === activeScreenId) || null;

  const handleDragStart = (component: ComponentDefinition) => {
    setIsDragging(true);
    setDraggedComponent(component);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedComponent || !activeScreenId || !project) return;
    
    const componentType = e.dataTransfer.getData("componentType") as ComponentType;
    if (!componentType) return;

    const newComponent: AppComponent = {
      id: uuidv4(),
      type: componentType,
      props: { ...draggedComponent.defaultProps }
    };

    const updatedScreens = project.screens.map(screen => {
      if (screen.id === activeScreenId) {
        return {
          ...screen,
          components: [...screen.components, newComponent]
        };
      }
      return screen;
    });

    setProject({
      ...project,
      screens: updatedScreens,
      updatedAt: new Date().toISOString()
    });

    toast({
      title: "Component Added",
      description: `${draggedComponent.label} added to ${activeScreen?.name || 'screen'}.`
    });

    setIsDragging(false);
    setDraggedComponent(null);
  };

  const handleUpdateProject = (updatedProject: AppProject) => {
    setProject(updatedProject);
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <BuilderLeftSidebar
        project={project}
        setProject={setProject}
        activeScreenId={activeScreenId}
        setActiveScreenId={setActiveScreenId}
        onDragStart={handleDragStart}
        onOpenExportDialog={() => setIsExportDialogOpen(true)}
        onOpenCodeDialog={() => setIsCodeDialogOpen(true)}
        components={componentLibrary}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <BuilderTopToolbar
            platform={platform}
            setPlatform={setPlatform}
          />
          
          <Button 
            variant="outline"
            size="sm"
            className="mr-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200"
            onClick={() => setIsAIDesignDialogOpen(true)}
          >
            <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
            AI Design
          </Button>
        </div>

        {/* Preview Area */}
        <BuilderPreviewArea
          activeScreen={activeScreen}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          platform={platform}
        />
      </div>

      {/* Dialogs */}
      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        projectName={project?.name || "App"}
      />

      <EnhancedCodeGeneration 
        isOpen={isCodeDialogOpen}
        onClose={() => setIsCodeDialogOpen(false)}
        project={project}
      />
      
      <AIDesignAssistant
        isOpen={isAIDesignDialogOpen}
        onClose={() => setIsAIDesignDialogOpen(false)}
        project={project}
        activeScreenId={activeScreenId}
        onUpdateProject={handleUpdateProject}
      />
    </div>
  );
}
