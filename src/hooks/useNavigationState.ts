
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

export function useNavigationState() {
  // State hooks
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState(0);
  
  // Reference values to track across renders
  const navigationInProgress = useRef(false);
  const navigationStartTime = useRef<number | null>(null);
  const navigationAttempts = useRef(0);
  
  // Router hooks
  const location = useLocation();
  
  // Reset state when arriving at dashboard
  useEffect(() => {
    const isInitialDashboardLoad = 
      location.pathname === '/dashboard' && 
      !navigationInProgress.current && 
      !isNavigating;
      
    if (isInitialDashboardLoad) {
      console.log("Initial dashboard load, resetting navigation state");
      setIsNavigating(false);
      setLoadingProjectId(null);
      setProgressValue(0);
      navigationInProgress.current = false;
      navigationStartTime.current = null;
      navigationAttempts.current = 0;
    }
  }, [location.pathname, isNavigating]);
  
  // Handle progress animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isNavigating) {
      // Reset progress
      setProgressValue(0);
      
      // Animate progress from 0 to 95% more gradually
      interval = setInterval(() => {
        setProgressValue(prev => {
          // Slow down as we get closer to 95%
          const increment = prev < 50 ? 8 : (prev < 80 ? 4 : 1);
          const newValue = prev + increment;
          return newValue < 95 ? newValue : 95;
        });
      }, 250);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isNavigating]);
  
  // Auto-clear loading state after timeout
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isNavigating) {
      timeout = setTimeout(() => {
        if (location.pathname.includes('dashboard') && isNavigating) {
          console.log("Navigation timeout - cleaning up stale navigation state");
          setIsNavigating(false);
          setLoadingProjectId(null);
          navigationInProgress.current = false;
          
          toast.error("Navigation timed out. Please try again.");
        }
      }, 30000); // 30 second timeout
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isNavigating, location.pathname]);

  // Main navigation function
  const navigateToBuilder = (projectId: string) => {
    if (navigationInProgress.current) {
      console.log("Navigation already in progress, ignoring request");
      return;
    }
    
    console.log(`Starting navigation to project: ${projectId}`);
    
    // Set state
    setIsNavigating(true);
    setLoadingProjectId(projectId);
    navigationInProgress.current = true;
    navigationStartTime.current = Date.now();
    navigationAttempts.current += 1;
    
    // Finish progress animation
    setProgressValue(100);
    
    // Use direct URL navigation for maximum reliability
    setTimeout(() => {
      const timestamp = Date.now();
      const url = `/builder/${projectId}?t=${timestamp}`;
      
      console.log(`Navigating to: ${url}`);
      window.location.href = url;
    }, 800);
  };

  return {
    isNavigating,
    loadingProjectId,
    progressValue,
    navigationInProgress,
    setIsNavigating,
    setLoadingProjectId,
    navigateToBuilder
  };
}
