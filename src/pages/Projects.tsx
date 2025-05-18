
import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Loader2 } from "lucide-react";
import NewProjectDialog from "@/components/builder/NewProjectDialog";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { toast } from "sonner";
import { useNavigationState } from "@/hooks/useNavigationState";
import LoadingIndicator from "@/components/dashboard/LoadingIndicator";

export default function Projects() {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  
  // Direct access to projects via useProjects
  const { projects, isLoading, createProject } = useProjects();
  
  // Use the navigation state hook for reliable navigation
  const {
    isNavigating,
    loadingProjectId,
    progressValue,
    navigateToBuilder
  } = useNavigationState();

  // Handle project creation
  const handleCreateProject = async (name: string, description: string, template: any) => {
    if (isNavigating) {
      toast.error("Navigation in progress. Please wait.");
      return;
    }
    
    try {
      const newProjectId = await createProject(name, description, template);
      
      if (newProjectId) {
        toast.success(`Project "${name}" created successfully`);
        navigateToBuilder(newProjectId);
      } else {
        toast.error("Failed to create project. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleCreateProject:", error);
      toast.error("An error occurred while creating your project.");
    }
  };

  // Handle project selection with direct navigation
  const handleSelectProject = (id: string) => {
    if (isNavigating) {
      toast.error("Navigation already in progress. Please wait.");
      return;
    }
    
    console.log("Project selected:", id);
    navigateToBuilder(id);
  };

  // Determine loading message based on progress
  const getLoadingMessage = () => {
    if (progressValue < 30) return "Preparing project...";
    if (progressValue < 70) return "Loading project...";
    return "Navigating to builder...";
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center pt-4 pb-10 space-y-4 md:space-y-0">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground text-lg">
              Manage your app projects
            </p>
          </div>
          <Button 
            onClick={() => setShowNewProjectDialog(true)}
            size="lg"
            className="px-5 py-6 h-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </header>

        <Separator className="bg-accent/50" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : projects.length > 0 ? (
            projects.map(project => (
              <Card 
                key={project.id}
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => handleSelectProject(project.id)}
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold">{project.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{project.description}</p>
                </CardContent>
                <CardFooter className="bg-accent/20 px-6 py-3">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-sm capitalize">{project.template}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      disabled={loadingProjectId === project.id}
                      className="card-button"
                    >
                      {loadingProjectId === project.id ? (
                        <div className="flex items-center gap-1.5">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span className="text-xs">Opening</span>
                        </div>
                      ) : "Open"}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-muted-foreground">No projects found</p>
              <Button 
                onClick={() => setShowNewProjectDialog(true)} 
                className="mt-4"
              >
                Create your first project
              </Button>
            </div>
          )}
        </div>
      </div>

      <NewProjectDialog
        isOpen={showNewProjectDialog}
        onClose={() => setShowNewProjectDialog(false)}
        onCreateProject={handleCreateProject}
      />
      
      {/* Add explicit LoadingIndicator for navigation */}
      <LoadingIndicator 
        isNavigating={isNavigating} 
        progressValue={progressValue} 
        message={getLoadingMessage()}
      />
    </DashboardLayout>
  );
}
