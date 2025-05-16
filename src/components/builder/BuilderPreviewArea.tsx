
import { AppScreen, PlatformType } from "@/types/appBuilder";
import PhonePreview from "@/components/builder/PhonePreview";

interface BuilderPreviewAreaProps {
  activeScreen: AppScreen | null;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  platform: PlatformType;
}

export default function BuilderPreviewArea({
  activeScreen,
  onDragOver,
  onDrop,
  platform
}: BuilderPreviewAreaProps) {
  return (
    <div className="flex-1 bg-gray-100 flex items-center justify-center p-8">
      <PhonePreview
        activeScreen={activeScreen}
        onDragOver={onDragOver}
        onDrop={onDrop}
        platform={platform === "both" ? "ios" : platform}
      />
    </div>
  );
}
