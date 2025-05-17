
import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProjectsSection from "@/components/dashboard/ProjectsSection";
import PromoBanner from "@/components/dashboard/PromoBanner";
import NewProjectDialog from "@/components/builder/NewProjectDialog";
import { AppTemplate } from "@/types/appBuilder";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState(0);
  const navigationInProgress = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { projects, isLoading, createProject, deleteProject } = useProjects();
  const { toast: shadowToast } = useToast();
  
  // Reset navigation state on mount and clean up on unmount
  useEffect(() => {
    // Clear any potential stuck states
    const resetNavigationState = () => {
      navigationInProgress.current = false;
      setIsNavigating(false);
      setLoadingProjectId(null);
      setProgressValue(0);
    };

    // Reset on mount
    resetNavigationState();

    return () => {
      // Clean up any pending navigation states when component unmounts
      resetNavigationState();
    };
  }, []);
  
  // Detect if we're on the dashboard route
  useEffect(() => {
    if (location.pathname === '/dashboard' && isNavigating) {
      // If we came back to dashboard while a navigation was in progress,
      // it means the navigation failed or was canceled
      console.log('Back to dashboard while navigation in progress, resetting navigation state');
      navigationInProgress.current = false;
      setIsNavigating(false);
      setLoadingProjectId(null);
      setProgressValue(0);
    }
  }, [location.pathname, isNavigating]);
  
  // Progress animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isNavigating && loadingProjectId) {
      // Reset progress
      setProgressValue(0);
      
      // Animate progress from 0 to 90% over 1.5 seconds
      interval = setInterval(() => {
        setProgressValue(prev => {
          const newValue = prev + 5;
          return newValue < 90 ? newValue : 90;
        });
      }, 100);
    } else {
      setProgressValue(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isNavigating, loadingProjectId]);
  
  // Clear loading state if we're still on Dashboard after a delay
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isNavigating) {
      // If we're still on the Dashboard after 3 seconds, clear the loading state
      timeout = setTimeout(() => {
        if (location.pathname.includes('dashboard')) {
          console.log("Still on dashboard after timeout, clearing navigation state");
          navigationInProgress.current = false;
          setIsNavigating(false);
          setLoadingProjectId(null);
          toast.error("Navigation failed. Please try again.");
        }
      }, 3000);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isNavigating, location.pathname]);

  // Stable navigation function with decisive push navigation
  const navigateToBuilder = useCallback((projectId: string) => {
    if (navigationInProgress.current) {
      console.log("Navigation already in progress, ignoring additional request");
      return;
    }
    
    navigationInProgress.current = true;
    setIsNavigating(true);
    setLoadingProjectId(projectId);
    console.log(`Preparing to navigate to project: ${projectId}`);
    
    // Show loading feedback
    toast.loading(`Opening project...`, { duration: 3000 });
    
    // Use a shorter delay for more responsive navigation
    setTimeout(() => {
      console.log(`Navigating to: /builder/${projectId}`);
      // Use replace to prevent back button from returning to a potentially broken state
      navigate(`/builder/${projectId}`, { replace: true });
    }, 200);
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
        setLoadingProjectId(newProjectId);
        
        // Show success message with Sonner toast
        toast.success(`Project "${name}" created successfully`);
        
        // Navigate with a delay to ensure state updates
        console.log("Navigating to newly created project:", newProjectId);
        setTimeout(() => {
          // Use replace to prevent back button from returning to a potentially broken state
          navigate(`/builder/${newProjectId}`, { replace: true });
        }, 500);
      } else {
        navigationInProgress.current = false;
        setIsNavigating(false);
        setLoadingProjectId(null);
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
      setLoadingProjectId(null);
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
          loadingProjectId={loadingProjectId}
        />
        
        <PromoBanner />

        <NewProjectDialog
          isOpen={isNewProjectDialogOpen}
          onClose={() => setIsNewProjectDialogOpen(false)}
          onCreateProject={handleCreateProject}
        />
        
        {isNavigating && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-sm border-t border-border z-50 shadow-lg">
            <div className="container max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 mr-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-r-transparent"></div>
                  <p className="text-sm font-medium">Opening project...</p>
                </div>
                <Progress value={progressValue} className="w-1/3 h-2" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
