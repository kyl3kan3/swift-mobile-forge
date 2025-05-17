
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

export function useNavigationState() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState(0);
  const navigationInProgress = useRef(false);
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
      console.log("Initial dashboard load, resetting navigation state");
    }
  }, [location.pathname, isNavigating]);
  
  // Handle failed navigation cases
  useEffect(() => {
    // Only run if we attempted navigation but ended up back at dashboard
    if (location.pathname === '/dashboard' && navigationInProgress.current) {
      console.log('Possible navigation failure detected');
      
      // Delay to ensure we're not resetting during an active navigation
      const timeout = setTimeout(() => {
        if (location.pathname === '/dashboard' && navigationInProgress.current) {
          console.log('Navigation failed - still on dashboard after timeout');
          setIsNavigating(false);
          setLoadingProjectId(null);
          setProgressValue(0);
          navigationInProgress.current = false;
          toast.error("Could not open project. Please try again.");
        }
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [location.pathname]);
  
  // Progress animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isNavigating && loadingProjectId) {
      // Reset progress
      setProgressValue(0);
      
      // Animate progress from 0 to 95% more quickly (1 second)
      interval = setInterval(() => {
        setProgressValue(prev => {
          const newValue = prev + 10;
          return newValue < 95 ? newValue : 95;
        });
      }, 100);
    } else if (!isNavigating) {
      setProgressValue(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isNavigating, loadingProjectId]);
  
  // Clear loading state if navigation takes too long
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isNavigating) {
      // If we're still on the Dashboard after 5 seconds, clear the loading state
      timeout = setTimeout(() => {
        if (location.pathname.includes('dashboard') && isNavigating) {
          console.log("Navigation timeout - still on dashboard after 5 seconds");
          setIsNavigating(false);
          setLoadingProjectId(null);
          navigationInProgress.current = false;
          toast.error("Navigation failed. Please try again.");
        }
      }, 5000);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isNavigating, location.pathname]);

  // Decisive navigation function with multiple safeguards
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
    
    // Complete the progress immediately
    setProgressValue(100);
    
    // Force hard navigation without any history manipulation
    setTimeout(() => {
      console.log(`Executing navigation to: /builder/${projectId}`);
      
      // Hard reload approach - most reliable way to ensure navigation works
      window.location.href = `/builder/${projectId}`;
      
      // Backup approach in case the above doesn't trigger immediately
      setTimeout(() => {
        if (navigationInProgress.current) {
          navigate(`/builder/${projectId}`, { replace: true });
        }
      }, 100);
    }, 200);
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
