
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
  
  const handleCreateProject = useCallback(async (name: string, description: string, template: AppTemplate) => {
    if (navigationInProgress.current) return;
    
    try {
      setIsNavigating(true);
      // Instead of directly modifying the ref, we use the setter
      setLoadingProjectId("");  // Set a temporary non-null value to indicate navigation started
      const newProjectId = await createProject(name, description, template);
      
      if (newProjectId) {
        // Show success message with Sonner toast
        toast.success(`Project "${name}" created successfully`);
        
        // Set loading project ID
        setLoadingProjectId(newProjectId);
        
        // Navigate with a delay to ensure state updates
        console.log("Navigating to newly created project:", newProjectId);
        navigateToBuilder(newProjectId);
      } else {
        // Use the setter functions instead of modifying ref directly
        setIsNavigating(false);
        setLoadingProjectId(null);
        shadowToast({
          title: "Error",
          description: "Failed to create project. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in handleCreateProject:", error);
      // Use the setter functions instead of modifying ref directly
      setIsNavigating(false);
      setLoadingProjectId(null);
      shadowToast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  }, [createProject, navigateToBuilder, navigationInProgress, setIsNavigating, setLoadingProjectId, shadowToast]);

  const handleSelectProject = useCallback((id: string) => {
    console.log("Project selected:", id);
    navigateToBuilder(id);
  }, [navigateToBuilder]);

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
