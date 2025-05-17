
import { Progress } from "@/components/ui/progress";

interface LoadingIndicatorProps {
  isNavigating: boolean;
  progressValue: number;
}

export default function LoadingIndicator({ isNavigating, progressValue }: LoadingIndicatorProps) {
  if (!isNavigating) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-sm border-t border-border z-50 shadow-lg">
      <div className="container max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 mr-4">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-r-transparent"></div>
            <p className="text-sm font-medium">Opening project...</p>
          </div>
          <Progress value={progressValue} className="w-1/3 h-2" />
        </div>
      </div>
    </div>
  );
}
