
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface LoadingIndicatorProps {
  isNavigating: boolean;
  progressValue: number;
}

export default function LoadingIndicator({ isNavigating, progressValue }: LoadingIndicatorProps) {
  // Local state for visibility control
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Show immediately when navigation starts
    if (isNavigating) {
      setIsVisible(true);
      console.log("Navigation started, showing loading indicator");
    }
    
    // Delay hiding when navigation completes
    if (!isNavigating && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        console.log("Navigation complete, hiding loading indicator");
      }, 2000); // Just 2 seconds delay - we'll keep it visible while navigating
      
      return () => clearTimeout(timer);
    }
  }, [isNavigating, isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
      <div className="container max-w-md mx-auto p-6 bg-background rounded-lg shadow-2xl border border-border">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 w-full">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-r-transparent"></div>
            <p className="text-base font-medium">
              {progressValue < 100 ? "Opening project..." : "Navigating to builder..."}
            </p>
          </div>
          
          <Progress value={progressValue} className="w-full h-2" />
          
          <div className="text-sm text-muted-foreground text-center">
            <p className="mb-1">We're preparing your project environment.</p>
            <p>This may take a few moments...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
