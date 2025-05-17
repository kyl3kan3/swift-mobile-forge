
import { useCallback } from "react";
import { useProjects } from "@/hooks/useProjects";
import { AppTemplate } from "@/types/appBuilder";
import { toast } from "sonner";

interface UseProjectActionsProps {
  navigateToBuilder: (projectId: string) => void;
  setIsNavigating: (isNavigating: boolean) => void;
  setLoadingProjectId: (projectId: string | null) => void;
  navigationStarted: boolean;
}

export function useProjectActions({
  navigateToBuilder,
  navigationStarted
}: UseProjectActionsProps) {
  const { projects, isLoading, createProject, deleteProject } = useProjects();
  
  // Handle project creation
  const handleCreateProject = useCallback(async (name: string, description: string, template: AppTemplate) => {
    if (navigationStarted) {
      console.log("Navigation in progress, ignoring create project request");
      return;
    }
    
    try {
      // Create the project
      const newProjectId = await createProject(name, description, template);
      
      if (newProjectId) {
        // Show success toast
        toast.success(`Project "${name}" created successfully`);
        
        // Navigate to the new project
        console.log("Navigating to newly created project:", newProjectId);
        navigateToBuilder(newProjectId);
      } else {
        // Handle creation failure
        toast.error("Failed to create project. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleCreateProject:", error);
      toast.error("An error occurred while creating your project.");
    }
  }, [createProject, navigateToBuilder, navigationStarted]);

  // Handle project selection
  const handleSelectProject = useCallback((id: string) => {
    if (navigationStarted) {
      console.log("Navigation in progress, ignoring project selection");
      return;
    }
    
    console.log("Project selected:", id);
    navigateToBuilder(id);
  }, [navigateToBuilder, navigationStarted]);

  // Handle project deletion
  const handleDeleteProject = useCallback(async (id: string) => {
    try {
      await deleteProject(id);
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  }, [deleteProject]);

  return {
    projects,
    isLoading,
    handleCreateProject,
    handleSelectProject,
    handleDeleteProject
  };
}
