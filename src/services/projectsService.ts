
import { supabase } from "@/integrations/supabase/client";
import { AppProject, AppTemplate } from "@/types/appBuilder";
import { v4 as uuidv4 } from 'uuid';

export async function fetchProjectsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*');
    
    if (error) {
      console.error("Error fetching projects:", error);
      return { data: null, error };
    }
    
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
    
    return { data: formattedProjects, error: null };
  } catch (error) {
    console.error("Error in fetchProjectsFromSupabase:", error);
    return { data: null, error };
  }
}

export async function createProjectInSupabase(name: string, description: string, template: AppTemplate) {
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
      return { data: null, error };
    }
    
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
    
    return { data: newProject, error: null };
  } catch (error) {
    console.error("Error in createProjectInSupabase:", error);
    return { data: null, error: error as Error };
  }
}

export async function deleteProjectFromSupabase(id: string) {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting project:", error);
      return { success: false, error };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Error in deleteProjectFromSupabase:", error);
    return { success: false, error: error as Error };
  }
}
