
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "@/components/dashboard/ProjectCard";
import NewProjectCard from "@/components/dashboard/NewProjectCard";
import NewProjectDialog from "@/components/builder/NewProjectDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle } from "lucide-react";
import { mockProjects } from "@/data/mockData";
import { AppProject, AppTemplate } from "@/types/appBuilder";
import { v4 as uuidv4 } from 'uuid';

export default function Dashboard() {
  const [projects, setProjects] = useState<AppProject[]>(mockProjects);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateProject = (name: string, description: string, template: AppTemplate) => {
    const newProject: AppProject = {
      id: uuidv4(),
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      template,
      icon: template === 'ecommerce' ? 'shopping-bag' : 
            template === 'social' ? 'users' :
            template === 'blog' ? 'book-open' :
            template === 'business' ? 'briefcase' : 'file',
      screens: [
        {
          id: uuidv4(),
          name: "Home",
          components: []
        }
      ]
    };

    setProjects([newProject, ...projects]);
    setIsNewProjectDialogOpen(false);
    
    toast({
      title: "Project Created",
      description: `${name} has been created successfully.`
    });
    
    navigate(`/builder/${newProject.id}`);
  };

  const handleSelectProject = (id: string) => {
    navigate(`/builder/${id}`);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
    toast({
      title: "Project Deleted",
      description: "The project has been deleted successfully."
    });
  };

  return (
    <div className="container max-w-7xl py-10">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-builder-blue-900">App Builder</h1>
          <p className="text-muted-foreground mt-1">
            Build and deploy native mobile apps with ease
          </p>
        </div>
        <Button onClick={() => setIsNewProjectDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NewProjectCard onClick={() => setIsNewProjectDialogOpen(true)} />
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={handleSelectProject}
            onDelete={handleDeleteProject}
          />
        ))}
      </div>

      <NewProjectDialog
        isOpen={isNewProjectDialogOpen}
        onClose={() => setIsNewProjectDialogOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}
