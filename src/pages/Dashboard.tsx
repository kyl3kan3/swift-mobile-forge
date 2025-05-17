
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "@/components/dashboard/ProjectCard";
import NewProjectCard from "@/components/dashboard/NewProjectCard";
import NewProjectDialog from "@/components/builder/NewProjectDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-background to-background py-10">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 space-y-4 md:space-y-0">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">App Builder</h1>
              <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">Beta</span>
            </div>
            <p className="text-muted-foreground mt-1.5 text-lg">
              Build and deploy native mobile apps with ease
            </p>
          </div>
          <Button 
            onClick={() => setIsNewProjectDialogOpen(true)}
            className="px-5 py-6 h-auto shadow-md hover:shadow-lg transition-shadow group"
          >
            <PlusCircle className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            New Project
          </Button>
        </header>

        <div className="mt-6 mb-8 flex items-center gap-2">
          <div className="h-10 w-1.5 bg-primary rounded-full"></div>
          <h2 className="text-2xl font-semibold">Your Projects</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
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
        
        <div className="flex items-center gap-4 py-3 px-6 bg-accent/50 rounded-lg backdrop-blur-sm border border-accent/40 mb-8">
          <Sparkles className="h-5 w-5 text-primary" />
          <p className="text-sm font-medium">Upgrade to Pro to access advanced AI features and unlimited projects.</p>
        </div>

        <NewProjectDialog
          isOpen={isNewProjectDialogOpen}
          onClose={() => setIsNewProjectDialogOpen(false)}
          onCreateProject={handleCreateProject}
        />
      </div>
    </div>
  );
}
