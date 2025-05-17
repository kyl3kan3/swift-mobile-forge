
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
import { Code, FileCode } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { generateCodeForAllPlatforms } from "@/utils/codeGenerationUtils";
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
    
    try {
      // Simulate the AI generation process with progress updates
      const updateProgress = () => {
        const interval = setInterval(() => {
          setGenerationProgress((prev) => {
            const newProgress = prev + Math.random() * 15;
            if (newProgress >= 100) {
              clearInterval(interval);
              return 100;
            }
            return newProgress;
          });
        }, 500);
        
        return interval;
      };
      
      const interval = updateProgress();
      
      // Simulate API call to AI service
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      // Generate code for all platforms
      const sampleCode = generateCodeForAllPlatforms(project);
      
      clearInterval(interval);
      setGenerationProgress(100);
      setGeneratedCode(sampleCode);
      setCodeExplanation("This code implementation includes all the screens and components from your app design. The navigation structure has been set up with the proper routes between screens. Component styling matches your design specifications, and all functionality described in your components has been implemented.");
      
      toast({
        title: "Code Generated",
        description: "Your application code has been generated successfully!"
      });
    } catch (error) {
      console.error("Error generating code:", error);
      toast({
        title: "Error",
        description: "Failed to generate code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
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
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-blue-500" />
            AI Code Generator
          </DialogTitle>
          <DialogDescription>
            Generate production-ready native code for your app design using artificial intelligence.
          </DialogDescription>
        </DialogHeader>

        {!generatedCode[activeTab] ? (
          <CodeGenerationForm 
            isGenerating={isGenerating}
            generationProgress={generationProgress}
            onGenerate={generateCode}
          />
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="react">React Native</TabsTrigger>
                <TabsTrigger value="swift">Swift (iOS)</TabsTrigger>
                <TabsTrigger value="kotlin">Kotlin (Android)</TabsTrigger>
                <TabsTrigger value="flutter">Flutter</TabsTrigger>
              </TabsList>
              
              {Object.entries(generatedCode).map(([platform, code]) => (
                <TabsContent 
                  key={platform} 
                  value={platform}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <div className="bg-gray-50 p-3 rounded-md border mb-4">
                    <p className="text-sm">{codeExplanation}</p>
                  </div>
                  
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
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {generatedCode[activeTab] && (
            <Button 
              onClick={downloadAllCode}
              className="gap-2"
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
