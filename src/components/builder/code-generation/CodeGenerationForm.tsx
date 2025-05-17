
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Loader2, Code } from "lucide-react";

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
      <Textarea 
        placeholder="Add specific instructions or requirements for the code generation..."
        className="min-h-[100px]"
        value={generationPrompt}
        onChange={(e) => setGenerationPrompt(e.target.value)}
        disabled={isGenerating}
      />
      
      {isGenerating && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>Generating code</span>
            <span>{Math.round(generationProgress)}%</span>
          </div>
          <Progress value={generationProgress} className="h-2" />
          <p className="text-xs text-muted-foreground animate-pulse">
            AI is analyzing your app design and generating code...
          </p>
        </div>
      )}
      
      <Button 
        onClick={() => onGenerate(generationPrompt)} 
        disabled={isGenerating}
        className="w-full"
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
