
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppProject } from "@/types/appBuilder";
import { FileCode, Code } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CodePreviewPanel from "./code-generation/CodePreviewPanel";
import CodeGenerationForm from "./code-generation/CodeGenerationForm";

interface EnhancedCodeGenerationProps {
  isOpen: boolean;
  onClose: () => void;
  project: AppProject | null;
}

export default function EnhancedCodeGeneration({ 
  isOpen, 
  onClose, 
  project 
}: EnhancedCodeGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedCode, setGeneratedCode] = useState<Record<string, string>>({});
  const [codeExplanation, setCodeExplanation] = useState("");
  const [activeTab, setActiveTab] = useState("react");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const platformLabels = {
    react: "React Native",
    swift: "iOS (Swift)",
    kotlin: "Android (Kotlin)",
    flutter: "Flutter"
  };

  const generateCode = async (prompt: string) => {
    if (!project) return;
    
    setIsGenerating(true);
    setGeneratedCode({});
    setGenerationProgress(0);
    setError(null);
    
    try {
      // Start progress animation
      const interval = setInterval(() => {
        setGenerationProgress((prev) => {
          const newProgress = prev + Math.random() * 5;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 300);
      
      // Create project data for API request
      const projectData = {
        name: project.name,
        description: project.description || "",
        screens: project.screens.map(screen => ({
          name: screen.name,
          components: screen.components.map(comp => ({
            type: comp.type,
            props: comp.props
          }))
        }))
      };
      
      // Call the OpenAI code generation edge function
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          project: projectData,
          platform: activeTab
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate code');
      }
      
      const result = await response.json();
      
      clearInterval(interval);
      setGenerationProgress(100);
      
      // Set generated code from the API response
      const codeResponse: Record<string, string> = {};
      codeResponse[activeTab] = result.generatedCode;
      
      setGeneratedCode(codeResponse);
      setCodeExplanation(result.explanation || "Code has been generated based on your app design and requirements. The implementation includes all screens and components from your design with proper navigation and styling.");
      
      toast({
        title: "Code Generated",
        description: "Your application code has been generated successfully!"
      });
    } catch (error) {
      console.error("Error generating code:", error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to generate code. Please try again.',
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(100);
    }
  };

  const downloadAllCode = () => {
    if (generatedCode[activeTab]) {
      const platform = activeTab;
      const code = generatedCode[platform];
      
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project?.name.toLowerCase().replace(/\s+/g, '-')}_${platform}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Code Downloaded",
        description: `${platformLabels[platform as keyof typeof platformLabels]} code has been downloaded.`
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] flex flex-col bg-gradient-subtle shadow-glow">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-gradient">
            <Code className="h-5 w-5 text-primary" />
            AI Code Generator
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Generate production-ready native code for your app design using OpenAI.
          </DialogDescription>
        </DialogHeader>

        {!generatedCode[activeTab] ? (
          <CodeGenerationForm 
            isGenerating={isGenerating}
            generationProgress={generationProgress}
            onGenerate={generateCode}
            error={error}
            platform={activeTab}
            onPlatformChange={setActiveTab}
          />
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-accent/50 p-3 rounded-lg border border-accent mb-4">
              <p className="text-sm">{codeExplanation}</p>
            </div>
            
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-4 mb-4 bg-background/70 backdrop-blur-sm shadow-sm">
                <TabsTrigger value="react" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">React Native</TabsTrigger>
                <TabsTrigger value="swift" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Swift (iOS)</TabsTrigger>
                <TabsTrigger value="kotlin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Kotlin (Android)</TabsTrigger>
                <TabsTrigger value="flutter" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Flutter</TabsTrigger>
              </TabsList>
              
              {Object.entries(generatedCode).map(([platform, code]) => (
                <TabsContent 
                  key={platform} 
                  value={platform}
                  className="flex-1 flex flex-col overflow-hidden m-0 border-none"
                >
                  <CodePreviewPanel
                    code={code}
                    platform={platform}
                    platformLabel={platformLabels[platform as keyof typeof platformLabels]}
                    projectName={project?.name || "app"}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} className="shadow-sm">
            Close
          </Button>
          {generatedCode[activeTab] && (
            <Button 
              onClick={downloadAllCode}
              className="gap-2 btn-hover-lift bg-primary"
            >
              <FileCode className="h-4 w-4" />
              Export All Code
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
