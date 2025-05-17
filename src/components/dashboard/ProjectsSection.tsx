
import { useState } from "react";
import ProjectCard from "@/components/dashboard/ProjectCard";
import NewProjectCard from "@/components/dashboard/NewProjectCard";
import { AppProject } from "@/types/appBuilder";
import ProjectFilters, { ProjectFilters as ProjectFiltersType } from "@/components/dashboard/ProjectFilters";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProjectsSectionProps {
  projects: AppProject[];
  isLoading: boolean;
  onSelectProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onNewProject: () => void;
  loadingProjectId?: string | null;
}

export default function ProjectsSection({
  projects,
  isLoading,
  onSelectProject,
  onDeleteProject,
  onNewProject,
  loadingProjectId
}: ProjectsSectionProps) {
  const [filters, setFilters] = useState<ProjectFiltersType>({
    searchQuery: "",
    sortBy: "date",
    sortOrder: "desc",
    templateFilter: "all"
  });
  
  // Apply filters and sorting
  const filteredProjects = projects
    .filter(project => {
      // Apply search filter
      if (filters.searchQuery && !project.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) && 
          !project.description?.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
      
      // Apply template filter
      if (filters.templateFilter !== "all" && project.template !== filters.templateFilter) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      const isAsc = filters.sortOrder === "asc" ? 1 : -1;
      
      switch (filters.sortBy) {
        case "name":
          return a.name.localeCompare(b.name) * isAsc;
        case "template":
          return a.template.localeCompare(b.template) * isAsc;
        case "date":
        default:
          return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * isAsc;
      }
    });

  // Handle filter changes
  const handleFilterChange = (newFilters: ProjectFiltersType) => {
    setFilters(newFilters);
  };

  // Get projects by template type
  const getProjectsByTemplate = (template: string) => {
    if (template === 'all') return filteredProjects;
    return projects.filter(p => p.template === template);
  };

  // Get templates that have at least one project
  const availableTemplates = ['all', ...Array.from(new Set(projects.map(p => p.template)))];
  
  const renderProjects = (projectsList: AppProject[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projectsList.length > 0 ? (
        projectsList.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={onSelectProject}
            onDelete={onDeleteProject}
            isLoading={loadingProjectId === project.id}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">No matching projects found.</p>
        </div>
      )}
    </div>
  );

  return (
    <ScrollArea className="flex-1 pr-4">
      <div className="space-y-8 pb-16">
        <ProjectFilters onFilterChange={handleFilterChange} />
        
        <Tabs defaultValue="all" className="w-full">
          <div className="mb-6 -mt-2">
            <TabsList className="bg-accent/50">
              {availableTemplates.map(template => (
                <TabsTrigger 
                  key={template} 
                  value={template}
                  className="capitalize"
                >
                  {template === 'all' ? 'All Projects' : template}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {availableTemplates.map(template => (
            <TabsContent key={template} value={template} className="m-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {template === 'all' && <NewProjectCard onClick={onNewProject} />}
                {isLoading ? (
                  // Loading placeholders
                  Array(3).fill(0).map((_, index) => (
                    <div key={index} className="bg-accent/50 rounded-lg h-[250px] animate-pulse"></div>
                  ))
                ) : (
                  renderProjects(getProjectsByTemplate(template))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </ScrollArea>
  );
}
