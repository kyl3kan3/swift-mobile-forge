
import { useState } from "react";
import { PlatformType } from "@/types/appBuilder";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Download, Smartphone, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
}

export default function ExportDialog({ isOpen, onClose, projectName }: ExportDialogProps) {
  const [platform, setPlatform] = useState<PlatformType>("both");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Export Successful",
        description: `Your ${projectName} app has been exported for ${platform === "both" ? "iOS and Android" : platform}.`,
      });
      onClose();
    }, 2500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export App</DialogTitle>
          <DialogDescription>
            Configure export settings for your app and choose platforms.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="platform" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="platform">Platform</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="platform" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Select Target Platform</h3>
              
              <RadioGroup
                value={platform}
                onValueChange={(value) => setPlatform(value as PlatformType)}
                className="grid gap-4 grid-cols-3 pt-2"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative">
                    <div className="p-4 rounded-md border-2 border-muted bg-background">
                      <Smartphone className="h-8 w-8 text-builder-blue-500" />
                    </div>
                    <RadioGroupItem
                      value="ios"
                      id="ios"
                      className="absolute top-0 right-0"
                    />
                  </div>
                  <Label htmlFor="ios">iOS</Label>
                </div>
                
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative">
                    <div className="p-4 rounded-md border-2 border-muted bg-background">
                      <Smartphone className="h-8 w-8 text-builder-accent-green" />
                    </div>
                    <RadioGroupItem
                      value="android"
                      id="android"
                      className="absolute top-0 right-0"
                    />
                  </div>
                  <Label htmlFor="android">Android</Label>
                </div>
                
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative">
                    <div className="p-4 rounded-md border-2 border-muted bg-background">
                      <div className="relative">
                        <Smartphone className="h-8 w-8 text-builder-blue-500" />
                        <Smartphone className="h-8 w-8 text-builder-accent-green absolute top-0 left-0 transform translate-x-2 translate-y-1 opacity-60" />
                      </div>
                    </div>
                    <RadioGroupItem
                      value="both"
                      id="both"
                      className="absolute top-0 right-0"
                    />
                  </div>
                  <Label htmlFor="both">Both</Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
          
          <TabsContent value="options" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Version</Label>
                  <div className="p-2 border rounded-md text-sm bg-muted/50">1.0.0</div>
                </div>
                <div className="space-y-2">
                  <Label>Build number</Label>
                  <div className="p-2 border rounded-md text-sm bg-muted/50">1</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Package name</Label>
                <div className="p-2 border rounded-md text-sm bg-muted/50">
                  com.appbuilder.{projectName.toLowerCase().replace(/\s+/g, '')}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="min-w-[100px]"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
