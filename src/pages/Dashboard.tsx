
import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProjectsSection from "@/components/dashboard/ProjectsSection";
import PromoBanner from "@/components/dashboard/PromoBanner";
import NewProjectDialog from "@/components/builder/NewProjectDialog";
import { AppTemplate } from "@/types/appBuilder";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

export default function Dashboard() {
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationInProgress = useRef(false);
  const navigate = useNavigate();
  const { projects, isLoading, createProject, deleteProject } = useProjects();
  const { toast: shadowToast } = useToast();

  // Stable navigation function to prevent multiple calls or race conditions
  const navigateToBuilder = useCallback((projectId: string) => {
    if (navigationInProgress.current) {
      console.log("Navigation already in progress, ignoring additional request");
      return;
    }
    
    navigationInProgress.current = true;
    setIsNavigating(true);
    console.log(`Preparing to navigate to project: ${projectId}`);
    
    // Show loading feedback
    toast.loading(`Opening project...`, { duration: 1500 });
    
    // Use setTimeout with a slightly longer delay to ensure state updates
    setTimeout(() => {
      console.log(`Navigating to: /builder/${projectId}`);
      navigate(`/builder/${projectId}`);
      
      // Reset navigation flags after a delay
      setTimeout(() => {
        navigationInProgress.current = false;
        setIsNavigating(false);
      }, 500);
    }, 300);
  }, [navigate]);

  const handleCreateProject = async (name: string, description: string, template: AppTemplate) => {
    if (navigationInProgress.current) return;
    
    try {
      setIsNavigating(true);
      navigationInProgress.current = true;
      const newProjectId = await createProject(name, description, template);
      
      if (newProjectId) {
        // Close dialog first before navigation
        setIsNewProjectDialogOpen(false);
        
        // Show success message with Sonner toast
        toast.success(`Project "${name}" created successfully`);
        
        // Navigate with a delay to ensure state updates
        console.log("Navigating to newly created project:", newProjectId);
        setTimeout(() => {
          navigate(`/builder/${newProjectId}`);
        }, 500);
      } else {
        navigationInProgress.current = false;
        setIsNavigating(false);
        setIsNewProjectDialogOpen(false);
        shadowToast({
          title: "Error",
          description: "Failed to create project. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in handleCreateProject:", error);
      navigationInProgress.current = false;
      setIsNavigating(false);
      setIsNewProjectDialogOpen(false);
      shadowToast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSelectProject = (id: string) => {
    console.log("Project selected:", id);
    navigateToBuilder(id);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 flex flex-col flex-1 overflow-hidden">
        <DashboardHeader onNewProject={() => setIsNewProjectDialogOpen(true)} />
        
        <ProjectsSection 
          projects={projects}
          isLoading={isLoading}
          onSelectProject={handleSelectProject}
          onDeleteProject={handleDeleteProject}
          onNewProject={() => setIsNewProjectDialogOpen(true)}
        />
        
        <PromoBanner />

        <NewProjectDialog
          isOpen={isNewProjectDialogOpen}
          onClose={() => setIsNewProjectDialogOpen(false)}
          onCreateProject={handleCreateProject}
        />
      </div>
    </div>
  );
}
