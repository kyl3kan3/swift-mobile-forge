
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface LoadingIndicatorProps {
  isNavigating: boolean;
  progressValue: number;
  message?: string;
}

export default function LoadingIndicator({ 
  isNavigating, 
  progressValue, 
  message = "Opening project..." 
}: LoadingIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Show and hide the indicator based on navigation state
  useEffect(() => {
    if (isNavigating && !isVisible) {
      setIsVisible(true);
      console.log("Loading indicator displayed");
    } 
    else if (!isNavigating && isVisible) {
      // Add a small delay before hiding the indicator to avoid flashing
      const timer = setTimeout(() => {
        setIsVisible(false);
        console.log("Loading indicator hidden");
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isNavigating, isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <div 
      className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center"
      role="dialog"
      aria-label="Loading indicator"
      aria-modal="true"
    >
      <div className="container max-w-md mx-auto p-6 bg-background rounded-lg shadow-2xl border border-border">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 w-full">
            <div 
              className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-r-transparent"
              aria-hidden="true"
            ></div>
            <p className="text-base font-medium">{message}</p>
          </div>
          
          <Progress 
            value={progressValue} 
            className="w-full h-2"
            aria-label={`Loading progress: ${Math.round(progressValue)}%`}
          />
          
          <div className="text-sm text-muted-foreground text-center">
            <p>This may take a moment...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
