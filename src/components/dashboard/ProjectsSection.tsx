
import { useState } from "react";
import ProjectCard from "@/components/dashboard/ProjectCard";
import NewProjectCard from "@/components/dashboard/NewProjectCard";
import { AppProject } from "@/types/appBuilder";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectsSectionProps {
  projects: AppProject[];
  isLoading: boolean;
  onSelectProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onNewProject: () => void;
}

export default function ProjectsSection({
  projects,
  isLoading,
  onSelectProject,
  onDeleteProject,
  onNewProject
}: ProjectsSectionProps) {
  return (
    <>
      <div className="mt-6 mb-10 flex items-center gap-3">
        <div className="h-10 w-1.5 bg-gradient-to-b from-primary via-builder-accent-purple to-builder-accent-green rounded-full shadow-lg"></div>
        <h2 className="text-2xl font-semibold tracking-tight">Your Projects</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
        <NewProjectCard onClick={onNewProject} />
        {isLoading ? (
          // Loading placeholders
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-accent/50 rounded-lg h-[260px] animate-pulse"></div>
          ))
        ) : (
          projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={onSelectProject}
              onDelete={onDeleteProject}
            />
          ))
        )}
      </div>
    </>
  );
}
