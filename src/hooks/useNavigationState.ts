import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

export function useNavigationState() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  
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

  // Navigation function using React Router properly
  const navigateToBuilder = useCallback((projectId: string) => {
    if (isNavigating) {
      console.log("Navigation already in progress, ignoring request");
      return false;
    }
    
    console.log(`Starting navigation to project: ${projectId}`);
    
    // Set state
    setIsNavigating(true);
    setLoadingProjectId(projectId);
    
    // Use React Router navigation for proper SPA behavior
    // Force a small delay to allow React to update state before navigation
    setTimeout(() => {
      const timestamp = Date.now();
      const path = `/builder/${projectId}`;
      
      console.log(`Navigating to: ${path} with timestamp ${timestamp}`);
      
      // Use React Router navigation with state and replace to prevent back button issues
      navigate(path, { 
        replace: true,
        state: { timestamp }
      });
      
      // Keep navigation state active for a moment to ensure LoadingIndicator stays visible
      setTimeout(() => {
        setIsNavigating(false);
        setLoadingProjectId(null);
        setProgressValue(100);
      }, 1000);
    }, 300);
    
    return true;
  }, [isNavigating, navigate]);

  return {
    isNavigating,
    loadingProjectId,
    progressValue,
    setIsNavigating,
    setLoadingProjectId,
    navigateToBuilder
  };
}
