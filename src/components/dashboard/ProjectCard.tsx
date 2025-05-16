
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
      className={`cursor-pointer transition-all duration-200 ${
        isHovering ? 'shadow-md transform translate-y-[-4px]' : 'shadow-sm'
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => onSelect(project.id)}
    >
      <CardHeader className="relative pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{project.name}</CardTitle>
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
              }} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground">{project.description}</p>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex gap-2 text-xs text-muted-foreground">
          <div className="flex items-center">
            <MessageSquare className="mr-1 h-3 w-3" />
            {project.screens.length} screens
          </div>
          <div className="flex items-center">
            <Smartphone className="mr-1 h-3 w-3" />
            Last updated {formatDate(project.updatedAt)}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(project.id);
          }} 
          className="w-full bg-builder-blue-500 hover:bg-builder-blue-600"
        >
          Open Project
        </Button>
      </CardFooter>
    </Card>
  );
}
