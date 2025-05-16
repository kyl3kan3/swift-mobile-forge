
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
import CodeGenerationDialog from "@/components/builder/CodeGenerationDialog";

export default function AppBuilder() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [project, setProject] = useState<AppProject | null>(null);
  const [activeScreenId, setActiveScreenId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState<ComponentDefinition | null>(null);
  const [platform, setPlatform] = useState<PlatformType>("ios");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false);

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
        <BuilderTopToolbar
          platform={platform}
          setPlatform={setPlatform}
        />

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

      <CodeGenerationDialog 
        isOpen={isCodeDialogOpen}
        onClose={() => setIsCodeDialogOpen(false)}
        project={project}
      />
    </div>
  );
}
