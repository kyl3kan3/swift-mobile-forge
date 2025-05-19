
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export function useNavigationState() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState(0);
  
  // Clear navigation state when component unmounts or when navigation completes
  useEffect(() => {
    return () => {
      console.log("Navigation state cleanup");
      setIsNavigating(false);
      setLoadingProjectId(null);
      setProgressValue(0);
    };
  }, []);
  
  // Handle progress animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isNavigating) {
      // Reset progress
      setProgressValue(0);
      
      // Animate progress from 0 to 90% gradually
      interval = setInterval(() => {
        setProgressValue(prev => {
          if (prev >= 90) return 90; // Cap at 90% until actual navigation
          const increment = prev < 60 ? 5 : (prev < 80 ? 3 : 1);
          return Math.min(prev + increment, 90);
        });
      }, 200);
    } else {
      // When navigation stops, complete progress to 100%
      setProgressValue(100);
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

  // Navigation function using direct URL change for reliable navigation
  const navigateToBuilder = useCallback((projectId: string) => {
    if (isNavigating) {
      console.log("Navigation already in progress, ignoring request");
      return false;
    }
    
    console.log(`Starting navigation to project: ${projectId}`);
    
    // Set state
    setIsNavigating(true);
    setLoadingProjectId(projectId);
    
    // Use direct URL change for more reliable navigation
    setTimeout(() => {
      // Force a full page reload to ensure proper component mounting
      window.location.href = `/builder/${projectId}`;
      
      // Note: The cleanup will happen when component unmounts
      // No need to reset state here as the page will reload
    }, 500);
    
    return true;
  }, [isNavigating]);

  return {
    isNavigating,
    loadingProjectId,
    progressValue,
    setIsNavigating,
    setLoadingProjectId,
    navigateToBuilder
  };
}
