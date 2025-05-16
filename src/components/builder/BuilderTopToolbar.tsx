
import { Button } from "@/components/ui/button";
import { PhoneIcon, Smartphone, Tablet, Settings } from "lucide-react";
import { PlatformType } from "@/types/appBuilder";

interface BuilderTopToolbarProps {
  platform: PlatformType;
  setPlatform: React.Dispatch<React.SetStateAction<PlatformType>>;
}

export default function BuilderTopToolbar({
  platform,
  setPlatform
}: BuilderTopToolbarProps) {
  return (
    <div className="bg-white border-b p-4">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button
            variant={platform === "ios" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setPlatform("ios")}
          >
            <PhoneIcon className="h-4 w-4 mr-2" />
            iOS
          </Button>
          <Button
            variant={platform === "android" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setPlatform("android")}
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Android
          </Button>
          <Button
            variant={platform === "both" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setPlatform("both")}
          >
            <Tablet className="h-4 w-4 mr-2" />
            Both
          </Button>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
}
