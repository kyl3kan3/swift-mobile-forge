
import { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { AppTemplate } from "@/types/appBuilder";

interface ProjectFiltersProps {
  onFilterChange: (filters: ProjectFilters) => void;
}

export interface ProjectFilters {
  searchQuery: string;
  sortBy: "name" | "date" | "template";
  sortOrder: "asc" | "desc";
  templateFilter: AppTemplate | "all";
}

export default function ProjectFilters({ onFilterChange }: ProjectFiltersProps) {
  const [filters, setFilters] = useState<ProjectFilters>({
    searchQuery: "",
    sortBy: "date",
    sortOrder: "desc",
    templateFilter: "all"
  });

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: e.target.value
    }));
  };

  // Handle sort selection change
  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-') as [
      "name" | "date" | "template", 
      "asc" | "desc"
    ];
    
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder
    }));
  };

  // Handle template filter change
  const handleTemplateChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      templateFilter: value as AppTemplate | "all"
    }));
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-10"
          value={filters.searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="flex gap-2">
        <Select 
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="date-desc">Newest first</SelectItem>
            <SelectItem value="date-asc">Oldest first</SelectItem>
            <SelectItem value="template-asc">Template (A-Z)</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.templateFilter} 
          onValueChange={handleTemplateChange}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by Template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Templates</SelectItem>
            <SelectItem value="blank">Blank</SelectItem>
            <SelectItem value="ecommerce">eCommerce</SelectItem>
            <SelectItem value="social">Social</SelectItem>
            <SelectItem value="blog">Blog</SelectItem>
            <SelectItem value="business">Business</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
