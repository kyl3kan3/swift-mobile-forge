
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Download, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

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
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Code has been copied to your clipboard"
    });
    
    setTimeout(() => setCopied(false), 2000);
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
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary"></div>
          <h3 className="text-sm font-medium">{platformLabel} Code</h3>
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={copyToClipboard}
            className="shadow-sm"
          >
            {copied ? (
              <Check className="h-4 w-4 mr-1 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 mr-1" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={downloadCode}
            className="shadow-sm"
          >
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 border rounded-md shadow-inner bg-gradient-to-b from-gray-50 to-white">
        <pre className="p-4 text-xs font-mono">
          <code>{code}</code>
        </pre>
      </ScrollArea>
    </div>
  );
}
