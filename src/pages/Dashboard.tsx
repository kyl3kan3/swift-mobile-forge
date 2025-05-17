
import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProjectsSection from "@/components/dashboard/ProjectsSection";
import PromoBanner from "@/components/dashboard/PromoBanner";
import NewProjectDialog from "@/components/builder/NewProjectDialog";
import LoadingIndicator from "@/components/dashboard/LoadingIndicator";
import { useNavigationState } from "@/hooks/useNavigationState";
import { useProjectActions } from "@/hooks/useProjectActions";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const {
    isNavigating,
    loadingProjectId,
    progressValue,
    navigationInProgress,
    setIsNavigating,
    setLoadingProjectId,
    navigateToBuilder
  } = useNavigationState();
  
  const {
    projects,
    isLoading,
    handleCreateProject,
    handleSelectProject,
    handleDeleteProject
  } = useProjectActions({
    navigateToBuilder,
    setIsNavigating,
    setLoadingProjectId,
    navigationInProgress
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <DashboardHeader onNewProject={() => setIsNewProjectDialogOpen(true)} />
        <Separator className="bg-accent/50" />
        
        <ProjectsSection 
          projects={projects}
          isLoading={isLoading}
          onSelectProject={handleSelectProject}
          onDeleteProject={handleDeleteProject}
          onNewProject={() => setIsNewProjectDialogOpen(true)}
          loadingProjectId={loadingProjectId}
        />
        
        <PromoBanner />
      </div>

      <NewProjectDialog
        isOpen={isNewProjectDialogOpen}
        onClose={() => setIsNewProjectDialogOpen(false)}
        onCreateProject={handleCreateProject}
      />
      
      <LoadingIndicator isNavigating={isNavigating} progressValue={progressValue} />
    </DashboardLayout>
  );
}
