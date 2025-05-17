
import { AppProject } from "@/types/appBuilder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, MessageSquare, MoreVertical, Smartphone, Trash2 } from "lucide-react";
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

  return (
    <Card 
      className={`overflow-hidden border-none transition-all duration-300 ${
        isHovering ? 'shadow-xl translate-y-[-4px]' : 'shadow-md'
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => onSelect(project.id)}
    >
      <div className="h-2 bg-gradient-to-r from-builder-accent-purple via-primary to-builder-accent-green"></div>
      <CardHeader className="relative pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
      </CardHeader>
      <CardContent className="pb-4 pt-0">
        <div className="flex gap-3 text-xs text-muted-foreground mt-3">
          <div className="flex items-center px-2 py-1 rounded-full bg-accent/50">
            <MessageSquare className="mr-1 h-3 w-3" />
            {project.screens.length} screens
          </div>
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-center px-2 py-1 rounded-full bg-accent/50 cursor-default">
                <Smartphone className="mr-1 h-3 w-3" />
                Updated {formatDate(project.updatedAt)}
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto p-2">
              <p className="text-xs">Created: {formatDate(project.createdAt)}</p>
            </HoverCardContent>
          </HoverCard>
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(project.id);
          }} 
          className="w-full bg-gradient-to-r from-builder-blue-600 to-builder-blue-700 hover:from-builder-blue-700 hover:to-builder-blue-800 border-none transition-all duration-300"
        >
          Open Project
        </Button>
      </CardFooter>
    </Card>
  );
}
