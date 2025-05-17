
import { useCallback } from "react";
import { useProjects } from "@/hooks/useProjects";
import { AppTemplate } from "@/types/appBuilder";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

interface UseProjectActionsProps {
  navigateToBuilder: (projectId: string) => void;
  setIsNavigating: (isNavigating: boolean) => void;
  setLoadingProjectId: (projectId: string | null) => void;
  navigationInProgress: React.RefObject<boolean>;
}

export function useProjectActions({
  navigateToBuilder,
  setIsNavigating,
  setLoadingProjectId,
  navigationInProgress
}: UseProjectActionsProps) {
  const { projects, isLoading, createProject, deleteProject } = useProjects();
  const { toast: shadowToast } = useToast();
  
  // Handle project creation
  const handleCreateProject = useCallback(async (name: string, description: string, template: AppTemplate) => {
    if (navigationInProgress.current) {
      console.log("Navigation in progress, ignoring create project request");
      return;
    }
    
    try {
      // Set loading state first
      setIsNavigating(true);
      setLoadingProjectId("creating");
      
      // Create the project
      const newProjectId = await createProject(name, description, template);
      
      if (newProjectId) {
        // Show success toast
        toast.success(`Project "${name}" created successfully`);
        
        // Navigate to the new project
        console.log("Navigating to newly created project:", newProjectId);
        setLoadingProjectId(newProjectId);
        navigateToBuilder(newProjectId);
      } else {
        // Handle creation failure
        setIsNavigating(false);
        setLoadingProjectId(null);
        toast.error("Failed to create project. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleCreateProject:", error);
      setIsNavigating(false);
      setLoadingProjectId(null);
      toast.error("An error occurred while creating your project.");
    }
  }, [createProject, navigateToBuilder, navigationInProgress, setIsNavigating, setLoadingProjectId, shadowToast]);

  // Handle project selection
  const handleSelectProject = useCallback((id: string) => {
    if (navigationInProgress.current) {
      console.log("Navigation in progress, ignoring project selection");
      return;
    }
    
    console.log("Project selected:", id);
    navigateToBuilder(id);
  }, [navigateToBuilder, navigationInProgress]);

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
