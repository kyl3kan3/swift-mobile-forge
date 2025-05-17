
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useNavigationState() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState(0);
  
  // Handle progress animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isNavigating) {
      // Reset progress
      setProgressValue(0);
      
      // Animate progress from 0 to 90% gradually
      interval = setInterval(() => {
        setProgressValue(prev => {
          const increment = prev < 60 ? 5 : (prev < 80 ? 3 : 1);
          return Math.min(prev + increment, 90);
        });
      }, 200);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isNavigating]);
  
  // Navigation timeout safety
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isNavigating) {
      timeout = setTimeout(() => {
        console.log("Navigation timeout safety triggered");
        setIsNavigating(false);
        setLoadingProjectId(null);
        toast.error("Navigation timed out. Please try again.");
      }, 15000); // 15-second safety timeout
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isNavigating]);

  // Navigation function with direct location change
  const navigateToBuilder = (projectId: string) => {
    if (isNavigating) {
      console.log("Navigation already in progress, ignoring request");
      return;
    }
    
    console.log(`Starting navigation to project: ${projectId}`);
    
    // Set state
    setIsNavigating(true);
    setLoadingProjectId(projectId);
    setProgressValue(0);
    
    // Use a short timeout to allow state updates to render
    setTimeout(() => {
      setProgressValue(100);
      
      // Direct navigation via window.location for maximum reliability
      setTimeout(() => {
        const timestamp = Date.now();
        const url = `/builder/${projectId}?t=${timestamp}`;
        
        console.log(`Navigating to: ${url}`);
        window.location.href = url;
      }, 800);
    }, 200);
  };

  return {
    isNavigating,
    loadingProjectId,
    progressValue,
    setIsNavigating,
    setLoadingProjectId,
    navigateToBuilder
  };
}
