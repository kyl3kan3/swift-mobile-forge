
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

export function useNavigationState() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState(0);
  const navigationInProgress = useRef(false);
  const navigationStartTime = useRef<number | null>(null);
  const navigationAttempts = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Reset navigation state only when first arriving at dashboard
  useEffect(() => {
    const isInitialDashboardLoad = 
      location.pathname === '/dashboard' && 
      !navigationInProgress.current && 
      !isNavigating;
      
    if (isInitialDashboardLoad) {
      setIsNavigating(false);
      setLoadingProjectId(null);
      setProgressValue(0);
      navigationInProgress.current = false;
      navigationStartTime.current = null;
      navigationAttempts.current = 0;
      console.log("Initial dashboard load, resetting navigation state");
    }
  }, [location.pathname, isNavigating]);
  
  // Progress animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isNavigating && loadingProjectId) {
      // Reset progress
      setProgressValue(0);
      
      // Animate progress from 0 to 95% more gradually
      interval = setInterval(() => {
        setProgressValue(prev => {
          const newValue = prev + 5;
          return newValue < 95 ? newValue : 95;
        });
      }, 150); // Slower progression
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isNavigating, loadingProjectId]);
  
  // Clear loading state if navigation takes too long
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isNavigating) {
      // Extended timeout - if we're still on the Dashboard after 10 seconds, clear the loading state
      timeout = setTimeout(() => {
        if (location.pathname.includes('dashboard') && isNavigating) {
          console.log("Navigation timeout - still on dashboard after 10 seconds");
          setIsNavigating(false);
          setLoadingProjectId(null);
          navigationInProgress.current = false;
          navigationStartTime.current = null;
          navigationAttempts.current = 0;
          toast.error("Navigation failed. Please try again.");
        }
      }, 10000);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isNavigating, location.pathname]);

  // More reliable navigation function
  const navigateToBuilder = (projectId: string) => {
    if (navigationInProgress.current) {
      console.log("Navigation already in progress, ignoring additional request");
      return;
    }
    
    console.log(`Starting navigation to project: ${projectId}`);
    
    // Set state variables
    setIsNavigating(true);
    setLoadingProjectId(projectId);
    navigationInProgress.current = true;
    navigationStartTime.current = Date.now();
    navigationAttempts.current = 0;
    
    // Complete the progress immediately
    setProgressValue(100);
    
    // Use direct browser navigation which is more reliable
    setTimeout(() => {
      // Use window.location.href for most reliable navigation
      window.location.href = `/builder/${projectId}`;
    }, 500);
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
