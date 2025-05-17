
import { useState } from "react";
import ProjectCard from "@/components/dashboard/ProjectCard";
import NewProjectCard from "@/components/dashboard/NewProjectCard";
import { AppProject } from "@/types/appBuilder";
import ProjectFilters, { ProjectFilters as ProjectFiltersType } from "@/components/dashboard/ProjectFilters";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  return (
    <ScrollArea className="flex-1">
      <div className="mt-6 mb-6 flex items-center gap-3">
        <div className="h-10 w-1.5 bg-gradient-to-b from-primary via-builder-accent-purple to-builder-accent-green rounded-full shadow-lg"></div>
        <h2 className="text-2xl font-semibold tracking-tight">Your Projects</h2>
      </div>

      <ProjectFilters onFilterChange={handleFilterChange} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
        <NewProjectCard onClick={onNewProject} />
        {isLoading ? (
          // Loading placeholders
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-accent/50 rounded-lg h-[260px] animate-pulse"></div>
          ))
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
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
    </ScrollArea>
  );
}
