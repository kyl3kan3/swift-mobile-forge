
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TemplateCard from "@/components/templates/TemplateCard";
import { appTemplates } from "@/data/mockData";
import { ArrowLeft } from "lucide-react";

export default function TemplateGallery() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const handleSelectTemplate = (templateId: string) => {
    navigate(`/builder/${projectId || 'new'}`);
  };

  return (
    <div className="container max-w-7xl py-10">
      <header className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-builder-blue-900">Choose a Template</h1>
          <p className="text-muted-foreground mt-1">
            Select a template to start building your mobile app
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {appTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            id={template.id}
            name={template.name}
            description={template.description}
            icon={template.icon}
            preview={template.preview}
            onSelect={handleSelectTemplate}
          />
        ))}
      </div>
    </div>
  );
}
