
import { AppProject } from "@/types/appBuilder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MessageSquare, MoreVertical, Trash2, CalendarDays, Calendar, Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: AppProject;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export default function ProjectCard({ project, onSelect, onDelete, isLoading = false }: ProjectCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Simple click handler without unnecessary event prevention
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't handle clicks when loading
    if (isLoading) return;
    
    // Don't handle card clicks from dropdown or button
    if (e.target instanceof Element) {
      const target = e.target as HTMLElement;
      if (target.closest('.dropdown-trigger') || target.closest('.card-button')) {
        return;
      }
    }
    
    onSelect(project.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(project.id);
  };

  // Get template color based on template type
  const getTemplateColor = () => {
    switch (project.template) {
      case 'ecommerce':
        return 'bg-builder-accent-purple/10 text-builder-accent-purple border-builder-accent-purple/20';
      case 'social':
        return 'bg-builder-accent-green/10 text-builder-accent-green border-builder-accent-green/20';
      case 'blog':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'business':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 h-full ${
        isHovering && !isLoading ? 'shadow-xl translate-y-[-4px]' : 'shadow-md'
      } group relative ${isLoading ? 'opacity-80 cursor-wait' : 'cursor-pointer'}`}
      onMouseEnter={() => !isLoading && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleCardClick}
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-builder-accent-purple to-builder-accent-green"></div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight line-clamp-1">{project.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">{project.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 dropdown-trigger rounded-full"
                onClick={(e) => e.stopPropagation()}
                disabled={isLoading}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="shadow-xl border-border/50 z-50">
              <DropdownMenuItem onClick={handleDeleteClick} className="text-destructive cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex gap-2 items-center mt-5">
          <Badge variant="outline" className={`px-2 py-0.5 text-xs font-medium ${getTemplateColor()}`}>
            {project.template.charAt(0).toUpperCase() + project.template.slice(1)}
          </Badge>
          <div className="flex items-center text-xs px-2 py-0.5 rounded-full bg-accent/50">
            <MessageSquare className="mr-1 h-3 w-3" />
            {project.screens.length} screen{project.screens.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
      
      <div className="border-t border-border/50 p-6 bg-accent/20">
        <div className="flex justify-between items-center">
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-center text-xs cursor-default text-muted-foreground">
                <CalendarDays className="mr-1.5 h-3 w-3" />
                <span>Updated {formatDate(project.updatedAt)}</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto p-3 shadow-xl bg-card/95 backdrop-blur-md z-50">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <p className="text-xs">Created: {formatDate(project.createdAt)}</p>
              </div>
            </HoverCardContent>
          </HoverCard>
          
          <Button 
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              !isLoading && onSelect(project.id);
            }}
            className="card-button text-primary hover:text-primary/90 hover:bg-accent p-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="text-xs">Opening</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 group">
                <span className="text-xs">Open</span>
                <ArrowRight className="h-3 w-3 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
