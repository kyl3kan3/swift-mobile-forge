import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface LoadingIndicatorProps {
  isNavigating: boolean;
  progressValue: number;
}

export default function LoadingIndicator({ isNavigating, progressValue }: LoadingIndicatorProps) {
  // Add local state to prevent premature unmounting
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (isNavigating) {
      setIsVisible(true);
      console.log("Navigation started, showing loading indicator");
    }
    
    // Only hide the indicator if navigation is complete AND we were previously navigating
    // This prevents the indicator from disappearing too soon
    if (!isNavigating && isVisible) {
      // Add a longer delay before hiding to ensure the navigation completes
      const timer = setTimeout(() => {
        setIsVisible(false);
        console.log("Navigation complete, hiding loading indicator");
      }, 5000); // 5 second delay for more reliable navigation
      
      return () => clearTimeout(timer);
    }
  }, [isNavigating, isVisible]);
  
  // Use local state for visibility instead of prop
  if (!isVisible) return null;
  
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
