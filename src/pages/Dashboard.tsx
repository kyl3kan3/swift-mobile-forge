
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
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const { projects, isLoading, createProject, deleteProject } = useProjects();
  const { toast } = useToast();

  const handleCreateProject = async (name: string, description: string, template: AppTemplate) => {
    if (isNavigating) return; // Prevent multiple navigation attempts
    
    try {
      setIsNavigating(true);
      const newProjectId = await createProject(name, description, template);
      
      if (newProjectId) {
        // Close dialog first before navigation
        setIsNewProjectDialogOpen(false);
        
        // Navigate with a longer delay to ensure state updates
        console.log("Navigating to newly created project:", newProjectId);
        setTimeout(() => {
          navigate(`/builder/${newProjectId}`);
        }, 300);
      } else {
        setIsNavigating(false);
        setIsNewProjectDialogOpen(false);
        toast({
          title: "Error",
          description: "Failed to create project. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in handleCreateProject:", error);
      setIsNavigating(false);
      setIsNewProjectDialogOpen(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSelectProject = (id: string) => {
    if (isNavigating) return; // Prevent multiple navigation attempts
    
    // Set navigating state to prevent multiple clicks
    setIsNavigating(true);
    console.log("Opening project:", id);
    
    // Navigate with a longer delay
    setTimeout(() => {
      console.log("Navigating to:", `/builder/${id}`);
      navigate(`/builder/${id}`);
    }, 300);
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
