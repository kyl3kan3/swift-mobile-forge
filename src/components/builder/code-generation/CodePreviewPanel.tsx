
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Download, Copy, Code } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [currentView, setCurrentView] = useState<"code" | "preview">("code");

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
        
        <Tabs
          value={currentView}
          onValueChange={(value) => setCurrentView(value as "code" | "preview")}
          className="border-b-0"
        >
          <TabsList className="h-8 bg-muted/60">
            <TabsTrigger value="code" className="h-7 text-xs px-3">
              <Code className="h-3.5 w-3.5 mr-1" />
              Code
            </TabsTrigger>
            <TabsTrigger value="preview" className="h-7 text-xs px-3">
              Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
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
      
      <Tabs value={currentView} className="flex-1">
        <TabsContent value="code" className="m-0 flex-1 h-full">
          <ScrollArea className="h-full border rounded-md shadow-inner bg-gradient-to-b from-gray-50 to-white">
            <pre className="p-4 text-xs font-mono">
              <code>{code}</code>
            </pre>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="preview" className="m-0 flex-1 h-full">
          <div className="h-full border rounded-md shadow-inner bg-white overflow-hidden">
            {platform === 'react' && (
              <div className="flex items-center justify-center h-full p-4">
                <div className="w-80 h-[500px] bg-gray-100 overflow-hidden rounded-xl border-4 border-gray-800 shadow-xl flex flex-col">
                  <div className="h-6 bg-gray-800 flex items-center justify-center">
                    <div className="w-20 h-1 bg-gray-600 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white p-2 text-xs overflow-auto">
                    <div className="opacity-50 flex items-center justify-center h-full">
                      Preview available in simulator
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {platform !== 'react' && (
              <div className="flex items-center justify-center h-full p-4">
                <p className="text-sm text-muted-foreground">
                  Preview not available for {platformLabel} code
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
