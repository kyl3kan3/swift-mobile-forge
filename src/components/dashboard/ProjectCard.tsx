
import { AppProject } from "@/types/appBuilder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, MessageSquare, MoreVertical, Trash2, CalendarDays, Calendar } from "lucide-react";
import { useState } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface ProjectCardProps {
  project: AppProject;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onSelect, onDelete }: ProjectCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Single handler function to prevent event conflicts
  const handleSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(project.id);
  };

  return (
    <Card 
      className={`overflow-hidden border-none transition-all duration-500 ${
        isHovering ? 'shadow-2xl translate-y-[-8px]' : 'shadow-lg'
      } group backdrop-blur-sm bg-card/90 cursor-pointer`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleSelect}
    >
      <div className="h-1.5 bg-gradient-to-r from-primary via-builder-accent-purple to-builder-accent-green"></div>
      <CardHeader className="relative pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold tracking-tight">{project.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="shadow-xl bg-card/95 backdrop-blur-sm border-primary/5">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }} className="text-destructive cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5 max-w-[90%] leading-relaxed">{project.description}</p>
      </CardHeader>
      <CardContent className="pb-4 pt-0">
        <div className="flex gap-3 text-xs mt-4">
          <div className="flex items-center px-3 py-1.5 rounded-full bg-accent/80 shadow-sm backdrop-blur-sm">
            <MessageSquare className="mr-1.5 h-3 w-3" />
            {project.screens.length} screens
          </div>
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-center px-3 py-1.5 rounded-full bg-accent/80 cursor-default shadow-sm backdrop-blur-sm">
                <CalendarDays className="mr-1.5 h-3 w-3" />
                <span className="whitespace-nowrap">Updated {formatDate(project.updatedAt)}</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto p-3 shadow-xl bg-card/95 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <p className="text-xs">Created: {formatDate(project.createdAt)}</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </CardContent>
      <CardFooter className="pt-3 pb-5">
        <Button 
          onClick={handleSelect}
          className="w-full bg-gradient-to-r from-builder-blue-600 to-builder-blue-700 hover:from-builder-blue-700 hover:to-builder-blue-800 border-none transition-all duration-500 shadow-md group-hover:shadow-lg py-6"
        >
          Open Project
        </Button>
      </CardFooter>
    </Card>
  );
}
