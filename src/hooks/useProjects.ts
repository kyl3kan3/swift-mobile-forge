
import { useState, useEffect } from "react";
import { AppProject, AppTemplate } from "@/types/appBuilder";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { 
  fetchProjectsFromSupabase,
  createProjectInSupabase,
  deleteProjectFromSupabase
} from "@/services/projectsService";
import { getIconForTemplate, createDefaultScreen } from "@/utils/projectUtils";

export function useProjects() {
  const [projects, setProjects] = useState<AppProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await fetchProjectsFromSupabase();
      
      if (error || !data) {
        // No fallback to mock data, just set empty array
        setProjects([]);
      } else {
        // Use only data from Supabase, no fallback to mock data
        setProjects(data);
      }
    } catch (error) {
      console.error("Error in fetchProjects:", error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (name: string, description: string, template: AppTemplate) => {
    try {
      const { data: newProject, error } = await createProjectInSupabase(name, description, template);
      
      if (error) {
        // Create project locally without mock data fallback
        const localProject: AppProject = {
          id: uuidv4(),
          name,
          description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          template,
          icon: getIconForTemplate(template),
          screens: [createDefaultScreen()]
        };
        
        setProjects([localProject, ...projects]);
        
        toast({
          title: "Project Created (Local Only)",
          description: `${name} has been created locally. Database connection failed.`
        });
        
        return localProject.id;
      } else if (newProject) {
        // Success - project created in Supabase
        setProjects([newProject, ...projects]);
        
        toast({
          title: "Project Created",
          description: `${name} has been created successfully.`
        });
        
        return newProject.id;
      }
      return null;
    } catch (error) {
      console.error("Error in createProject:", error);
      toast({
        title: "Error",
        description: "An error occurred while creating the project.",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      // Try to delete from Supabase first
      await deleteProjectFromSupabase(id);
      
      // Always update local state
      setProjects(projects.filter(project => project.id !== id));
      
      toast({
        title: "Project Deleted",
        description: "The project has been deleted successfully."
      });

      return true;
    } catch (error) {
      console.error("Error in deleteProject:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the project.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    projects,
    isLoading,
    createProject,
    deleteProject,
    refreshProjects: fetchProjects
  };
}
