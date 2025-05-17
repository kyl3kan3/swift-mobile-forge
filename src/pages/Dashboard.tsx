
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "@/components/dashboard/ProjectCard";
import NewProjectCard from "@/components/dashboard/NewProjectCard";
import NewProjectDialog from "@/components/builder/NewProjectDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, Sparkles, Zap } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 py-12">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-4 md:space-y-0">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-gradient">App Builder</h1>
              <span className="bg-primary/15 text-primary rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm">Beta</span>
            </div>
            <p className="text-muted-foreground mt-2 text-lg max-w-md animate-fade-in">
              Build powerful native mobile apps with the power of AI
            </p>
          </div>
          <Button 
            onClick={() => setIsNewProjectDialogOpen(true)}
            className="px-5 py-6 h-auto shadow-xl hover:shadow-2xl transition-all duration-500 group bg-gradient-to-r from-primary to-builder-accent-purple text-white border-none"
          >
            <PlusCircle className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            New Project
          </Button>
        </header>

        <div className="mt-6 mb-10 flex items-center gap-3">
          <div className="h-10 w-1.5 bg-gradient-to-b from-primary via-builder-accent-purple to-builder-accent-green rounded-full shadow-lg"></div>
          <h2 className="text-2xl font-semibold tracking-tight">Your Projects</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
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
        
        <div className="flex items-center gap-4 py-5 px-8 bg-gradient-to-r from-accent/80 to-accent/20 rounded-2xl backdrop-blur-md border border-accent/40 mb-8 shadow-lg animate-fade-in">
          <Zap className="h-6 w-6 text-primary" />
          <div className="flex-1">
            <h3 className="font-medium text-lg mb-0.5">Upgrade to Pro</h3>
            <p className="text-sm text-muted-foreground/90">Access advanced AI features and unlimited projects.</p>
          </div>
          <Button className="bg-white shadow-lg text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300">
            Learn More
          </Button>
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
