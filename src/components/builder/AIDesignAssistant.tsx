
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
import { Loader2, Sparkles, Check, Zap } from "lucide-react";
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
  const [generationProgress, setGenerationProgress] = useState(0);
  const { toast } = useToast();

  const handleGenerateDesign = async () => {
    if (!project || !activeScreenId) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Create a progress updater
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 600);
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate components based on user's input
      const newComponents = generateCustomComponents(appPurpose, prompt);
      
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
      
      // Complete the progress
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      setTimeout(() => {
        onUpdateProject(updatedProject);
        
        toast({
          title: "Design Generated Successfully",
          description: `Created ${newComponents.length} new components based on your description.`,
          variant: "default"
        });
        
        setPrompt("");
        setAppPurpose("");
        onClose();
      }, 500);
      
    } catch (error) {
      console.error("Error generating design:", error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your design. Please try again.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        clearInterval(progressInterval);
        setIsGenerating(false);
      }, 500);
    }
  };

  // Enhanced function to generate more tailored components based on input
  const generateCustomComponents = (purpose: string, description: string) => {
    const components = [];
    const lowercaseDesc = description.toLowerCase();
    const lowercasePurpose = purpose.toLowerCase();
    
    // Add a navbar with contextual title
    const navbarTitle = purpose || 
                        (description.length > 15 ? description.substring(0, 15) + "..." : "My App");
    components.push({
      id: uuidv4(),
      type: "navbar" as ComponentType,
      props: {
        title: navbarTitle,
        showBackButton: lowercaseDesc.includes("back") || Math.random() > 0.5,
        rightIcon: lowercaseDesc.includes("shop") || lowercasePurpose.includes("commerce") ? 
                  "shopping-cart" : lowercaseDesc.includes("menu") ? "menu" : "notifications"
      }
    });
    
    // Generate a relevant heading
    const headerText = getRelevantTitle(purpose, description);
    components.push({
      id: uuidv4(),
      type: "text" as ComponentType,
      props: {
        content: headerText,
        variant: "h1"
      }
    });
    
    // Generate relevant subheading if description is substantive
    if (description.length > 30) {
      const subheaderText = getRelevantSubtitle(purpose, description);
      components.push({
        id: uuidv4(),
        type: "text" as ComponentType,
        props: {
          content: subheaderText,
          variant: "h2"
        }
      });
    }
    
    // Add image if relevant
    if (lowercaseDesc.includes("image") || lowercaseDesc.includes("picture") || 
        lowercaseDesc.includes("photo") || Math.random() > 0.6) {
      components.push({
        id: uuidv4(),
        type: "image" as ComponentType,
        props: {
          src: "https://via.placeholder.com/400x200",
          alt: "Feature image",
          height: 200
        }
      });
    }
    
    // Add descriptive text paragraph
    components.push({
      id: uuidv4(),
      type: "text" as ComponentType,
      props: {
        content: generateParagraphText(purpose, description),
        variant: "p"
      }
    });
    
    // Add buttons with relevant labels
    if (lowercaseDesc.includes("button") || Math.random() > 0.3) {
      components.push({
        id: uuidv4(),
        type: "button" as ComponentType,
        props: {
          label: generateButtonLabel(purpose, description, "primary"),
          variant: "primary",
          size: "default"
        }
      });
      
      // Add secondary button if warranted
      if (lowercaseDesc.includes("buttons") || lowercaseDesc.includes("options") || Math.random() > 0.6) {
        components.push({
          id: uuidv4(),
          type: "button" as ComponentType,
          props: {
            label: generateButtonLabel(purpose, description, "secondary"),
            variant: "secondary",
            size: "default"
          }
        });
      }
    }
    
    // Add a list component if mentioned or for certain app types
    if (lowercaseDesc.includes("list") || lowercaseDesc.includes("items") || 
        lowercasePurpose.includes("shop") || lowercasePurpose.includes("commerce") || 
        lowercasePurpose.includes("todo") || Math.random() > 0.4) {
      
      const listItems = generateListItems(purpose, description);
      components.push({
        id: uuidv4(),
        type: "list" as ComponentType,
        props: {
          items: listItems
        }
      });
    }
    
    // Add a card component if relevant
    if (lowercaseDesc.includes("card") || lowercaseDesc.includes("display") || Math.random() > 0.7) {
      components.push({
        id: uuidv4(),
        type: "card" as ComponentType,
        props: {
          title: generateCardTitle(purpose, description),
          content: generateCardContent(purpose, description),
          imageSrc: Math.random() > 0.5 ? "https://via.placeholder.com/300x150" : undefined
        }
      });
    }
    
    // Add a final call to action if appropriate
    if (lowercaseDesc.includes("cta") || lowercasePurpose.includes("marketing") || Math.random() > 0.7) {
      components.push({
        id: uuidv4(),
        type: "text" as ComponentType,
        props: {
          content: generateCtaText(purpose, description),
          variant: "p"
        }
      });
    }
    
    return components;
  };

  // Helper functions to generate more intelligent content
  const getRelevantTitle = (purpose: string, description: string) => {
    const lowercasePurpose = purpose.toLowerCase();
    const lowercaseDesc = description.toLowerCase();
    
    if (lowercaseDesc.includes("welcome") || lowercaseDesc.includes("home")) {
      return `Welcome to ${purpose || "Your App"}`;
    } else if (lowercasePurpose.includes("shop") || lowercasePurpose.includes("commerce")) {
      return lowercaseDesc.includes("product") ? "Product Details" : "Shop Collection";
    } else if (lowercaseDesc.includes("profile")) {
      return "User Profile";
    } else if (lowercaseDesc.includes("settings")) {
      return "App Settings";
    } else if (lowercasePurpose.includes("social")) {
      return "Your Feed";
    } else if (lowercaseDesc.includes("contact")) {
      return "Contact Us";
    } else if (description.length > 10) {
      // Extract first 3-5 words for a title
      const words = description.split(" ");
      return words.slice(0, Math.min(4, words.length)).join(" ") + 
             (words.length > 4 ? "..." : "");
    }
    
    return purpose || "New Screen";
  };
  
  const getRelevantSubtitle = (purpose: string, description: string) => {
    const lowercasePurpose = purpose.toLowerCase();
    
    if (lowercasePurpose.includes("shop") || lowercasePurpose.includes("commerce")) {
      return "Browse our latest collection of premium items";
    } else if (lowercasePurpose.includes("social")) {
      return "Connect with friends and share your moments";
    } else if (lowercasePurpose.includes("task") || lowercasePurpose.includes("todo")) {
      return "Stay organized and boost your productivity";
    } else if (description.length > 50) {
      return description.substring(0, 50) + "...";
    }
    
    return "Discover the features designed for you";
  };
  
  const generateParagraphText = (purpose: string, description: string) => {
    if (description.length > 30) {
      return description;
    }
    
    const lowercasePurpose = purpose.toLowerCase();
    
    if (lowercasePurpose.includes("shop") || lowercasePurpose.includes("commerce")) {
      return "Browse our curated selection of products designed with quality and sustainability in mind. Each item is carefully selected to ensure the best experience for our customers.";
    } else if (lowercasePurpose.includes("social")) {
      return "Connect with friends, share your moments, and discover content from people around the world. Our platform is designed to bring people together.";
    } else if (lowercasePurpose.includes("task") || lowercasePurpose.includes("todo")) {
      return "Keep track of your tasks, set priorities, and never miss a deadline again. Our intuitive interface makes managing your to-dos effortless.";
    }
    
    return "This application is designed to provide you with the best user experience. Explore the features and discover what makes this app special.";
  };
  
  const generateButtonLabel = (purpose: string, description: string, type: string) => {
    const lowercasePurpose = purpose.toLowerCase();
    const lowercaseDesc = description.toLowerCase();
    
    if (type === "primary") {
      if (lowercaseDesc.includes("login") || lowercaseDesc.includes("signin")) {
        return "Sign In";
      } else if (lowercaseDesc.includes("signup") || lowercaseDesc.includes("register")) {
        return "Create Account";
      } else if (lowercasePurpose.includes("shop") || lowercasePurpose.includes("commerce")) {
        return "Shop Now";
      } else if (lowercaseDesc.includes("submit")) {
        return "Submit";
      } else if (lowercaseDesc.includes("contact")) {
        return "Send Message";
      } else if (lowercaseDesc.includes("learn")) {
        return "Learn More";
      }
      return "Get Started";
      
    } else { // Secondary button
      if (lowercaseDesc.includes("login") || lowercaseDesc.includes("signin")) {
        return "Create Account";
      } else if (lowercaseDesc.includes("signup") || lowercaseDesc.includes("register")) {
        return "Learn More";
      } else if (lowercasePurpose.includes("shop") || lowercasePurpose.includes("commerce")) {
        return "View Details";
      } else if (lowercaseDesc.includes("cancel")) {
        return "Cancel";
      }
      return "Learn More";
    }
  };
  
  const generateListItems = (purpose: string, description: string) => {
    const lowercasePurpose = purpose.toLowerCase();
    
    if (lowercasePurpose.includes("shop") || lowercasePurpose.includes("commerce")) {
      return [
        { id: "1", title: "Premium T-Shirt", price: "$29.99" },
        { id: "2", title: "Designer Jeans", price: "$89.99" },
        { id: "3", title: "Casual Sneakers", price: "$59.99" },
        { id: "4", title: "Leather Wallet", price: "$39.99" }
      ];
    } else if (lowercasePurpose.includes("task") || lowercasePurpose.includes("todo")) {
      return [
        { id: "1", title: "Complete project proposal", subtitle: "Due tomorrow" },
        { id: "2", title: "Schedule team meeting", subtitle: "High priority" },
        { id: "3", title: "Review quarterly results", subtitle: "In progress" },
        { id: "4", title: "Update client documentation", subtitle: "Not started" }
      ];
    } else if (lowercasePurpose.includes("social")) {
      return [
        { id: "1", title: "Sarah Johnson", subtitle: "Posted a new photo" },
        { id: "2", title: "Mike Williams", subtitle: "Commented on your post" },
        { id: "3", title: "Emily Davis", subtitle: "Sent you a message" },
        { id: "4", title: "David Brown", subtitle: "Tagged you in a post" }
      ];
    }
    
    return [
      { id: "1", title: "Item 1", subtitle: "Description for item 1" },
      { id: "2", title: "Item 2", subtitle: "Description for item 2" },
      { id: "3", title: "Item 3", subtitle: "Description for item 3" },
      { id: "4", title: "Item 4", subtitle: "Description for item 4" }
    ];
  };
  
  const generateCardTitle = (purpose: string, description: string) => {
    const lowercasePurpose = purpose.toLowerCase();
    
    if (lowercasePurpose.includes("shop") || lowercasePurpose.includes("commerce")) {
      return "Featured Product";
    } else if (lowercasePurpose.includes("social")) {
      return "Featured Post";
    } else if (lowercasePurpose.includes("news")) {
      return "Latest Article";
    }
    
    return "Featured Content";
  };
  
  const generateCardContent = (purpose: string, description: string) => {
    const lowercasePurpose = purpose.toLowerCase();
    
    if (lowercasePurpose.includes("shop") || lowercasePurpose.includes("commerce")) {
      return "Our most popular item, highly rated by customers for its quality and design.";
    } else if (lowercasePurpose.includes("social")) {
      return "This trending post has been engaging users across our platform with meaningful conversations.";
    } else if (lowercasePurpose.includes("news")) {
      return "Breaking news and analysis on the latest developments in technology and business.";
    }
    
    return "Discover more about our featured content and learn how it can benefit you.";
  };
  
  const generateCtaText = (purpose: string, description: string) => {
    const lowercasePurpose = purpose.toLowerCase();
    
    if (lowercasePurpose.includes("shop") || lowercasePurpose.includes("commerce")) {
      return "Sign up today and get 10% off your first purchase!";
    } else if (lowercasePurpose.includes("social")) {
      return "Join thousands of users and start sharing your experiences today!";
    } else if (lowercasePurpose.includes("news") || lowercasePurpose.includes("blog")) {
      return "Subscribe to our newsletter for weekly updates and exclusive content!";
    }
    
    return "Don't miss out! Take action now and experience the difference.";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] backdrop-blur-xl bg-gradient-to-br from-background/95 to-background/80 border-primary/20 shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gradient">
            <Sparkles className="h-5 w-5 text-primary/80" />
            AI Design Assistant
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/90">
            Describe what you want to build and our AI will generate a design for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/90">App Purpose</label>
            <Input
              placeholder="E-commerce, Social Media, Task Manager, etc."
              value={appPurpose}
              onChange={(e) => setAppPurpose(e.target.value)}
              className="border-primary/20 focus-visible:ring-primary/30 bg-background/50"
              disabled={isGenerating}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/90">Describe Your Screen</label>
            <Textarea
              placeholder="Describe the screen you want to create in detail..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] border-primary/20 focus-visible:ring-primary/30 bg-background/50"
              disabled={isGenerating}
            />
          </div>
          
          {isGenerating && (
            <div className="space-y-3 p-4 bg-primary/5 rounded-xl backdrop-blur-sm border border-primary/10">
              <div className="flex justify-between items-center">
                <span className="font-medium text-primary/90 flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 animate-pulse" />
                  Generating design
                </span>
                <span className="font-medium text-sm">{Math.round(generationProgress)}%</span>
              </div>
              <div className="h-1.5 bg-secondary/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary/60 to-accent/80 transition-all duration-300 ease-out"
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                AI is analyzing your input and generating a custom design...
              </p>
            </div>
          )}
          
          <div className="bg-yellow-50/90 p-4 rounded-md border border-yellow-200/70 text-sm text-yellow-800">
            <p className="font-medium">AI Design Tips:</p>
            <ul className="list-disc pl-5 mt-1.5 space-y-1">
              <li>Be specific about layout (e.g., "a list of products with images")</li>
              <li>Mention content types you want (e.g., "login form with email and password")</li>
              <li>Describe the purpose (e.g., "product detail page for an e-commerce app")</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isGenerating} className="border-primary/20">
            Cancel
          </Button>
          <Button 
            onClick={handleGenerateDesign} 
            disabled={isGenerating || !prompt.trim()}
            className="min-w-[160px] bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground shadow-lg"
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
