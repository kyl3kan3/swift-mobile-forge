
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CodePreviewPanelProps {
  code: string;
  platform: string;
  platformLabel: string;
  projectName: string;
}

export default function CodePreviewPanel({
  code,
  platform,
  platformLabel,
  projectName
}: CodePreviewPanelProps) {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: "Code has been copied to your clipboard"
    });
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName?.toLowerCase().replace(/\s+/g, '-')}_${platform}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Code Downloaded",
      description: `${platformLabel} code has been downloaded.`
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">{platformLabel} Code</h3>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={copyToClipboard}
          >
            <Check className="h-4 w-4 mr-1" /> Copy
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={downloadCode}
          >
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 border rounded-md">
        <pre className="p-4 text-xs">
          <code>{code}</code>
        </pre>
      </ScrollArea>
    </div>
  );
}
