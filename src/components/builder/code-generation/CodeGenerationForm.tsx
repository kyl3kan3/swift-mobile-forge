
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Loader2, Code, Sparkles, Zap, Lightbulb, AlertCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CodeGenerationFormProps {
  isGenerating: boolean;
  generationProgress: number;
  onGenerate: (prompt: string) => void;
  error: string | null;
  platform: string;
  onPlatformChange: (platform: string) => void;
}

export default function CodeGenerationForm({
  isGenerating,
  generationProgress,
  onGenerate,
  error,
  platform,
  onPlatformChange
}: CodeGenerationFormProps) {
  const [generationPrompt, setGenerationPrompt] = useState("");

  return (
    <div className="space-y-5 my-6">
      <div className="p-5 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-md rounded-xl border border-primary/15 shadow-md">
        <div className="flex items-center gap-3 mb-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shadow-inner">
            <Lightbulb className="h-4 w-4 text-primary" />
          </div>
          <h4 className="font-semibold tracking-tight">OpenAI Code Generation</h4>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Add specific instructions to customize the generated code. Mention frameworks, libraries, design preferences, and any other features you want implemented.
        </p>
      </div>

      <div className="mb-4">
        <Tabs 
          value={platform} 
          onValueChange={onPlatformChange}
        >
          <TabsList className="grid w-full grid-cols-4 mb-4 bg-background/70 backdrop-blur-sm shadow-sm">
            <TabsTrigger value="react" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">React Native</TabsTrigger>
            <TabsTrigger value="swift" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Swift (iOS)</TabsTrigger>
            <TabsTrigger value="kotlin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Kotlin (Android)</TabsTrigger>
            <TabsTrigger value="flutter" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Flutter</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <Textarea 
        placeholder={`Describe your code requirements for the selected platform...\n\nExamples:\n- Use Redux for state management\n- Implement authentication flow\n- Include dark mode support\n- Add localization for multiple languages`}
        className="min-h-[160px] text-sm shadow-md border-muted-foreground/20 focus:border-primary/50 resize-none bg-card/80 backdrop-blur-sm rounded-xl p-4"
        value={generationPrompt}
        onChange={(e) => setGenerationPrompt(e.target.value)}
        disabled={isGenerating}
      />
      
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <div className="flex gap-2 items-center">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="font-medium text-destructive">Error</p>
          </div>
          <p className="mt-1 text-sm text-destructive/90">{error}</p>
        </div>
      )}
      
      {isGenerating && (
        <div className="space-y-3 p-4 bg-accent/20 rounded-xl backdrop-blur-sm border border-accent/30 shadow-md">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-primary flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generating code
            </span>
            <span className="font-semibold">{Math.round(generationProgress)}%</span>
          </div>
          <Progress value={generationProgress} className="h-2 bg-secondary" />
          <p className="text-sm text-muted-foreground animate-pulse flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            OpenAI is analyzing your app design and generating optimized code...
          </p>
        </div>
      )}
      
      <Button 
        onClick={() => onGenerate(generationPrompt)} 
        disabled={isGenerating}
        className="w-full group shadow-lg hover:shadow-xl transition-all duration-500"
        variant={isGenerating ? "outline" : "default"}
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating code...
          </>
        ) : (
          <>
            <Zap className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            Generate Code with OpenAI
          </>
        )}
      </Button>
    </div>
  );
}
