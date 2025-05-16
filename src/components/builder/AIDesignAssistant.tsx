
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AppProject, AppScreen, ComponentType } from "@/types/appBuilder";
import { Loader2, Sparkles, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface AIDesignAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  project: AppProject | null;
  activeScreenId: string | null;
  onUpdateProject: (updatedProject: AppProject) => void;
}

export default function AIDesignAssistant({
  isOpen,
  onClose,
  project,
  activeScreenId,
  onUpdateProject
}: AIDesignAssistantProps) {
  const [prompt, setPrompt] = useState("");
  const [appPurpose, setAppPurpose] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateDesign = async () => {
    if (!project || !activeScreenId) return;
    
    setIsGenerating(true);
    
    try {
      // In a real implementation, this would call an AI service
      // For now, we'll simulate the AI response
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const newComponents = generateSampleComponents(appPurpose, prompt);
      
      // Update the project with new components
      const updatedScreens = project.screens.map(screen => {
        if (screen.id === activeScreenId) {
          return {
            ...screen,
            components: [...screen.components, ...newComponents]
          };
        }
        return screen;
      });
      
      const updatedProject = {
        ...project,
        screens: updatedScreens,
        updatedAt: new Date().toISOString()
      };
      
      onUpdateProject(updatedProject);
      
      toast({
        title: "Design Generated",
        description: "AI has created new components based on your description."
      });
      
      setPrompt("");
      setAppPurpose("");
      onClose();
    } catch (error) {
      console.error("Error generating design:", error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your design. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Sample function to generate components based on prompt
  const generateSampleComponents = (purpose: string, description: string) => {
    const components = [];
    
    // Generate a navbar
    components.push({
      id: uuidv4(),
      type: "navbar" as ComponentType,
      props: {
        title: purpose || "My App",
        showBackButton: true,
        rightIcon: description.includes("shopping") ? "shopping-cart" : "menu"
      }
    });
    
    // Generate a heading
    components.push({
      id: uuidv4(),
      type: "text" as ComponentType,
      props: {
        content: description.split(" ").slice(0, 3).join(" ") + "...",
        variant: "h1"
      }
    });
    
    // Generate some text content based on description
    components.push({
      id: uuidv4(),
      type: "text" as ComponentType,
      props: {
        content: description.length > 30 ? description : "This is an app for " + (purpose || "users"),
        variant: "p"
      }
    });
    
    // Add a button
    components.push({
      id: uuidv4(),
      type: "button" as ComponentType,
      props: {
        label: description.includes("signup") ? "Sign Up" : "Continue",
        variant: "primary",
        size: "default"
      }
    });
    
    // If the description mentions a list, add a list component
    if (description.includes("list") || Math.random() > 0.5) {
      components.push({
        id: uuidv4(),
        type: "list" as ComponentType,
        props: {
          items: [
            { id: "1", title: "Item 1", price: "$19.99" },
            { id: "2", title: "Item 2", price: "$29.99" },
            { id: "3", title: "Item 3", price: "$39.99" }
          ]
        }
      });
    }
    
    return components;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            AI Design Assistant
          </DialogTitle>
          <DialogDescription>
            Describe what you want to build and our AI will generate a design for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">App Purpose</label>
            <Input
              placeholder="E-commerce, Social Media, Task Manager, etc."
              value={appPurpose}
              onChange={(e) => setAppPurpose(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Describe Your Screen</label>
            <Textarea
              placeholder="Describe the screen you want to create in detail..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 text-sm text-yellow-800">
            <p className="font-medium">AI Design Tips:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Be specific about layout (e.g., "a list of products with images")</li>
              <li>Mention color schemes if you have preferences</li>
              <li>Describe user interactions you want (e.g., "when user taps the button")</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isGenerating}>
            Cancel
          </Button>
          <Button 
            onClick={handleGenerateDesign} 
            disabled={isGenerating || !prompt.trim()}
            className="min-w-[120px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Design
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
