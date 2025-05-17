
import { Progress } from "@/components/ui/progress";
import { useEffect } from "react";

interface LoadingIndicatorProps {
  isNavigating: boolean;
  progressValue: number;
}

export default function LoadingIndicator({ isNavigating, progressValue }: LoadingIndicatorProps) {
  useEffect(() => {
    if (progressValue === 100) {
      console.log("Navigation in progress, showing full progress bar");
    }
  }, [progressValue]);
  
  // Exit early if not navigating
  if (!isNavigating) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
      <div className="container max-w-md mx-auto p-6 bg-background rounded-lg shadow-2xl border border-border">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 w-full">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-r-transparent"></div>
            <p className="text-base font-medium">
              {progressValue < 100 ? "Opening project..." : "Navigating to project..."}
            </p>
          </div>
          <Progress value={progressValue} className="w-full h-2" />
        </div>
      </div>
    </div>
  );
}
