
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Loader2, Code, Sparkles } from "lucide-react";

interface CodeGenerationFormProps {
  isGenerating: boolean;
  generationProgress: number;
  onGenerate: (prompt: string) => void;
}

export default function CodeGenerationForm({
  isGenerating,
  generationProgress,
  onGenerate
}: CodeGenerationFormProps) {
  const [generationPrompt, setGenerationPrompt] = useState("");

  return (
    <div className="space-y-4 my-4">
      <div className="p-4 bg-primary/5 backdrop-blur-sm rounded-lg border border-primary/10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h4 className="font-medium">AI Code Generator</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Add specific instructions to customize the generated code. Mention frameworks, libraries, or styling preferences.
        </p>
      </div>
      
      <Textarea 
        placeholder="Add specific instructions or requirements for the code generation..."
        className="min-h-[120px] text-sm shadow-sm border-muted-foreground/20 focus:border-primary/50 resize-none bg-card/50"
        value={generationPrompt}
        onChange={(e) => setGenerationPrompt(e.target.value)}
        disabled={isGenerating}
      />
      
      {isGenerating && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-primary">Generating code</span>
            <span className="font-semibold">{Math.round(generationProgress)}%</span>
          </div>
          <Progress value={generationProgress} className="h-1.5 bg-secondary" />
          <p className="text-xs text-muted-foreground animate-pulse flex items-center gap-1.5">
            <Loader2 className="h-3 w-3 animate-spin" />
            AI is analyzing your app design and generating code...
          </p>
        </div>
      )}
      
      <Button 
        onClick={() => onGenerate(generationPrompt)} 
        disabled={isGenerating}
        className="w-full btn-hover-lift transition-all duration-300"
        variant={isGenerating ? "outline" : "default"}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating code...
          </>
        ) : (
          <>
            <Code className="mr-2 h-4 w-4" />
            Generate Code
          </>
        )}
      </Button>
    </div>
  );
}
