
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { mockProjects } from "@/data/mockData";
import NewProjectDialog from "@/components/builder/NewProjectDialog";

export default function SimpleProjects() {
  const [projects, setProjects] = useState(mockProjects);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const navigate = useNavigate();

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateProject = (name: string, description: string, template: any) => {
    try {
      // Simply navigate to the builder with a fixed ID for testing
      toast.success(`Project "${name}" created successfully`);
      navigate(`/builder/mock-project-id`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    }
  };

  const handleSelectProject = (id: string) => {
    console.log("Project selected:", id);
    navigate(`/builder/${id}`, { replace: true });
  };

  return (
    <div className="container max-w-7xl py-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center pt-4 pb-10 space-y-4 md:space-y-0">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Simple Projects</h1>
          <p className="text-muted-foreground text-lg">
            A simpler way to access your projects
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
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </CardContent>
              <CardFooter className="bg-accent/20 px-6 py-3">
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm capitalize">{project.template}</span>
                  <Button variant="ghost" size="sm">Open</Button>
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

      <NewProjectDialog
        isOpen={showNewProjectDialog}
        onClose={() => setShowNewProjectDialog(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}
