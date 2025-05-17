
import { useState, useEffect } from "react";
import { AppProject, AppTemplate } from "@/types/appBuilder";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { mockProjects } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";

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
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      
      if (error) {
        console.error("Error fetching projects:", error);
        // Fall back to mock data
        setProjects(mockProjects);
      } else {
        // Transform Supabase data to match AppProject format
        const formattedProjects: AppProject[] = data.map((project: any) => {
          // Parse the app_config JSON safely and ensure it's an object
          let appConfig: Record<string, any> = {};
          
          if (typeof project.app_config === 'object' && project.app_config !== null) {
            appConfig = project.app_config as Record<string, any>;
          } else if (typeof project.app_config === 'string') {
            try {
              appConfig = JSON.parse(project.app_config);
            } catch (e) {
              console.error("Failed to parse app_config:", e);
            }
          }
          
          // Now safely access properties with type assertions and fallbacks
          const template = ((appConfig as any)?.template as AppTemplate) || "blank";
          const icon = ((appConfig as any)?.icon as string) || "file";
          const screens = ((appConfig as any)?.screens as any[]) || [
            {
              id: uuidv4(),
              name: "Home",
              components: []
            }
          ];
          
          return {
            id: project.id,
            name: project.name,
            description: project.description || "",
            createdAt: project.created_at,
            updatedAt: project.updated_at,
            template,
            icon,
            screens
          };
        });
        
        // If no projects from Supabase, use mock data
        setProjects(formattedProjects.length > 0 ? formattedProjects : mockProjects);
      }
    } catch (error) {
      console.error("Error in fetchProjects:", error);
      setProjects(mockProjects);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (name: string, description: string, template: AppTemplate) => {
    try {
      const newProjectId = uuidv4();
      
      const screens = [
        {
          id: uuidv4(),
          name: "Home",
          components: []
        }
      ];

      const icon = template === 'ecommerce' ? 'shopping-bag' : 
                  template === 'social' ? 'users' :
                  template === 'blog' ? 'book-open' :
                  template === 'business' ? 'briefcase' : 'file';
      
      // Create project in Supabase
      const { data, error } = await supabase
        .from('projects')
        .insert({
          id: newProjectId,
          name: name,
          description: description,
          app_config: {
            template: template,
            icon: icon,
            screens: screens
          }
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating project:", error);
        // Fall back to local creation
        const newProject: AppProject = {
          id: newProjectId,
          name,
          description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          template,
          icon,
          screens
        };
        
        setProjects([newProject, ...projects]);
        
        toast({
          title: "Project Created (Local Only)",
          description: `${name} has been created locally. Database connection failed.`
        });
        
        return newProject.id;
      } else {
        // Success - project created in Supabase
        const newProject: AppProject = {
          id: data.id,
          name: data.name,
          description: data.description || "",
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          template: (data.app_config as any).template as AppTemplate,
          icon: (data.app_config as any).icon as string,
          screens: (data.app_config as any).screens as any[]
        };
        
        setProjects([newProject, ...projects]);
        
        toast({
          title: "Project Created",
          description: `${name} has been created successfully.`
        });
        
        return newProject.id;
      }
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
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error("Error deleting project:", error);
      }
      
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
