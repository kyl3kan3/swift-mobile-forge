
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
    const newProjectId = await createProject(name, description, template);
    if (newProjectId) {
      navigate(`/builder/${newProjectId}`);
    }
    setIsNewProjectDialogOpen(false);
  };

  const handleSelectProject = (id: string) => {
    console.log("Navigating to project:", id);
    // Show toast to provide feedback that the action is happening
    toast({
      title: "Opening project",
      description: "Redirecting to project builder...",
    });
    
    // Use a slight delay to ensure the toast is shown before navigation
    setTimeout(() => {
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
