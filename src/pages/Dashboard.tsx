
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

// Import components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProjectsSection from "@/components/dashboard/ProjectsSection";
import PromoBanner from "@/components/dashboard/PromoBanner";
import NewProjectDialog from "@/components/builder/NewProjectDialog";
import LoadingIndicator from "@/components/dashboard/LoadingIndicator";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

// Import hooks
import { useNavigationState } from "@/hooks/useNavigationState";
import { useProjectActions } from "@/hooks/useProjectActions";

export default function Dashboard() {
  // Define all state hooks first
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  
  // Initialize navigation state
  const {
    isNavigating,
    loadingProjectId,
    progressValue,
    navigateToBuilder
  } = useNavigationState();
  
  // Initialize project data and actions
  const {
    projects,
    isLoading,
    handleCreateProject,
    handleSelectProject,
    handleDeleteProject
  } = useProjectActions({
    navigateToBuilder,
    setIsNavigating: () => {}, // Navigation state is handled internally in useNavigationState
    setLoadingProjectId: () => {}, // Navigation state is handled internally in useNavigationState
    navigationStarted: isNavigating
  });

  // Determine loading message based on progress
  const getLoadingMessage = () => {
    if (progressValue < 30) return "Preparing project...";
    if (progressValue < 70) return "Loading project...";
    return "Navigating to builder...";
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <DashboardHeader onNewProject={() => setShowNewProjectDialog(true)} />
        <Separator className="bg-accent/50" />
        
        <ProjectsSection 
          projects={projects}
          isLoading={isLoading}
          onSelectProject={handleSelectProject}
          onDeleteProject={handleDeleteProject}
          onNewProject={() => setShowNewProjectDialog(true)}
          loadingProjectId={loadingProjectId}
        />
        
        <PromoBanner />
      </div>

      {/* Project creation dialog */}
      <NewProjectDialog
        isOpen={showNewProjectDialog}
        onClose={() => setShowNewProjectDialog(false)}
        onCreateProject={handleCreateProject}
      />
      
      {/* Loading overlay */}
      <LoadingIndicator 
        isNavigating={isNavigating} 
        progressValue={progressValue} 
        message={getLoadingMessage()}
      />
    </DashboardLayout>
  );
}
