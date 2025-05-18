
import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Loader2 } from "lucide-react";
import NewProjectDialog from "@/components/builder/NewProjectDialog";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { toast } from "sonner";
import { useNavigationState } from "@/hooks/useNavigationState";
import LoadingIndicator from "@/components/dashboard/LoadingIndicator";
import ProjectCard from "@/components/dashboard/ProjectCard";

export default function Projects() {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  
  // Direct access to projects via useProjects
  const { projects, isLoading, createProject, deleteProject } = useProjects();
  
  // Use the navigation state hook for reliable navigation
  const {
    isNavigating,
    loadingProjectId,
    progressValue,
    navigateToBuilder
  } = useNavigationState();

  // Handle project creation
  const handleCreateProject = async (name: string, description: string, template: any) => {
    if (isNavigating) {
      toast.error("Navigation in progress. Please wait.");
      return;
    }
    
    try {
      const newProjectId = await createProject(name, description, template);
      
      if (newProjectId) {
        toast.success(`Project "${name}" created successfully`);
        navigateToBuilder(newProjectId);
      } else {
        toast.error("Failed to create project. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleCreateProject:", error);
      toast.error("An error occurred while creating your project.");
    }
  };

  // Handle project selection with React Router navigation
  const handleSelectProject = (id: string) => {
    if (isNavigating) {
      toast.error("Navigation already in progress. Please wait.");
      return;
    }
    
    console.log("Project selected:", id);
    navigateToBuilder(id);
  };

  // Handle project deletion
  const handleDeleteProject = async (id: string) => {
    if (isNavigating) {
      toast.error("Navigation in progress. Please wait.");
      return;
    }
    
    try {
      await deleteProject(id);
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  // Determine loading message based on progress
  const getLoadingMessage = () => {
    if (progressValue < 30) return "Preparing project...";
    if (progressValue < 70) return "Loading project...";
    return "Navigating to builder...";
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center pt-4 pb-10 space-y-4 md:space-y-0">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground text-lg">
              Manage your app projects
            </p>
          </div>
          <Button 
            onClick={() => setShowNewProjectDialog(true)}
            size="lg"
            className="px-5 py-6 h-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </header>

        <Separator className="bg-accent/50" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : projects.length > 0 ? (
            projects.map(project => (
              <ProjectCard 
                key={project.id}
                project={project}
                onSelect={handleSelectProject}
                onDelete={handleDeleteProject}
                isLoading={loadingProjectId === project.id}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-muted-foreground">No projects found</p>
              <Button 
                onClick={() => setShowNewProjectDialog(true)} 
                className="mt-4"
              >
                Create your first project
              </Button>
            </div>
          )}
        </div>
      </div>

      <NewProjectDialog
        isOpen={showNewProjectDialog}
        onClose={() => setShowNewProjectDialog(false)}
        onCreateProject={handleCreateProject}
      />
      
      {/* Add explicit LoadingIndicator for navigation */}
      <LoadingIndicator 
        isNavigating={isNavigating} 
        progressValue={progressValue} 
        message={getLoadingMessage()}
      />
    </DashboardLayout>
  );
}
