
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Settings,
  Smartphone,
  PhoneIcon,
  Tablet,
  Download,
  Save
} from "lucide-react";
import ComponentLibrary from "@/components/builder/ComponentLibrary";
import ScreensList from "@/components/builder/ScreensList";
import PhonePreview from "@/components/builder/PhonePreview";
import ExportDialog from "@/components/builder/ExportDialog";
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
  const [isSaving, setIsSaving] = useState(false);

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
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-64 border-r bg-sidebar p-4 flex flex-col">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
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
                components={componentLibrary}
                onDragStart={handleDragStart}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button 
            className="w-full mb-2"
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
            onClick={() => setIsExportDialogOpen(true)}
          >
            <Download className="mr-2 h-4 w-4" />
            Export App
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b p-4">
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <Button
                variant={platform === "ios" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPlatform("ios")}
              >
                <PhoneIcon className="h-4 w-4 mr-2" />
                iOS
              </Button>
              <Button
                variant={platform === "android" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPlatform("android")}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Android
              </Button>
              <Button
                variant={platform === "both" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPlatform("both")}
              >
                <Tablet className="h-4 w-4 mr-2" />
                Both
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center p-8">
          <PhonePreview
            activeScreen={activeScreen}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            platform={platform === "both" ? "ios" : platform}
          />
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        projectName={project?.name || "App"}
      />
    </div>
  );
}
