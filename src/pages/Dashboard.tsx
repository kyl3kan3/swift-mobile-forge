
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProjectsSection from "@/components/dashboard/ProjectsSection";
import PromoBanner from "@/components/dashboard/PromoBanner";
import NewProjectDialog from "@/components/builder/NewProjectDialog";
import { AppTemplate } from "@/types/appBuilder";
import { useToast } from "@/components/ui/use-toast";

export default function Dashboard() {
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { projects, isLoading, createProject, deleteProject } = useProjects();
  const { toast } = useToast();

  const handleCreateProject = async (name: string, description: string, template: AppTemplate) => {
    try {
      const newProjectId = await createProject(name, description, template);
      if (newProjectId) {
        // Close dialog first before navigation
        setIsNewProjectDialogOpen(false);
        
        // Ensure the state is updated before navigating
        setTimeout(() => {
          console.log("Navigating to newly created project:", newProjectId);
          navigate(`/builder/${newProjectId}`);
        }, 100);
      } else {
        setIsNewProjectDialogOpen(false);
        toast({
          title: "Error",
          description: "Failed to create project. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in handleCreateProject:", error);
      setIsNewProjectDialogOpen(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSelectProject = (id: string) => {
    // Log and use a small timeout to ensure UI state is settled before navigation
    console.log("Opening project:", id);
    
    // Add a small delay to ensure state updates before navigation
    setTimeout(() => {
      console.log("Navigating to:", `/builder/${id}`);
      navigate(`/builder/${id}`);
    }, 100);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 flex flex-col flex-1 overflow-hidden">
        <DashboardHeader onNewProject={() => setIsNewProjectDialogOpen(true)} />
        
        <ProjectsSection 
          projects={projects}
          isLoading={isLoading}
          onSelectProject={handleSelectProject}
          onDeleteProject={deleteProject}
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
