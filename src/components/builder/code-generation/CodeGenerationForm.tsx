
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Loader2, Code, Sparkles, Zap, Lightbulb } from "lucide-react";

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
    <div className="space-y-5 my-6">
      <div className="p-5 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-md rounded-xl border border-primary/15 shadow-md">
        <div className="flex items-center gap-3 mb-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shadow-inner">
            <Lightbulb className="h-4 w-4 text-primary" />
          </div>
          <h4 className="font-semibold tracking-tight">AI Code Generation</h4>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Add specific instructions to customize the generated code. Mention frameworks, libraries, design preferences, and any other features you want implemented.
        </p>
      </div>
      
      <Textarea 
        placeholder="Describe your app requirements and preferences in detail..."
        className="min-h-[140px] text-sm shadow-md border-muted-foreground/20 focus:border-primary/50 resize-none bg-card/80 backdrop-blur-sm rounded-xl p-4"
        value={generationPrompt}
        onChange={(e) => setGenerationPrompt(e.target.value)}
        disabled={isGenerating}
      />
      
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
            AI is analyzing your app design and generating optimized code...
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
            Generate Code
          </>
        )}
      </Button>
    </div>
  );
}
