
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

export function useNavigationState() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState(0);
  const navigationInProgress = useRef(false);
  const navigationStartTime = useRef<number | null>(null);
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
      console.log("Initial dashboard load, resetting navigation state");
    }
  }, [location.pathname, isNavigating]);
  
  // Handle failed navigation cases
  useEffect(() => {
    // Only run if we attempted navigation but ended up back at dashboard
    if (location.pathname === '/dashboard' && navigationInProgress.current) {
      console.log('Possible navigation failure detected');
      
      // Make sure we've been navigating for at least 2 seconds before considering it a failure
      // This prevents prematurely resetting if we're just starting navigation
      const timeElapsed = navigationStartTime.current ? Date.now() - navigationStartTime.current : 0;
      if (timeElapsed < 2000) {
        console.log(`Navigation too recent (${timeElapsed}ms), not considering as failure yet`);
        return;
      }
      
      // Delay to ensure we're not resetting during an active navigation
      const timeout = setTimeout(() => {
        if (location.pathname === '/dashboard' && navigationInProgress.current) {
          console.log('Navigation failed - still on dashboard after timeout');
          setIsNavigating(false);
          setLoadingProjectId(null);
          setProgressValue(0);
          navigationInProgress.current = false;
          navigationStartTime.current = null;
          toast.error("Could not open project. Please try again.");
        }
      }, 3000); // Increased timeout
      
      return () => clearTimeout(timeout);
    }
  }, [location.pathname]);
  
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
      // Extended timeout - if we're still on the Dashboard after 8 seconds, clear the loading state
      timeout = setTimeout(() => {
        if (location.pathname.includes('dashboard') && isNavigating) {
          console.log("Navigation timeout - still on dashboard after 8 seconds");
          setIsNavigating(false);
          setLoadingProjectId(null);
          navigationInProgress.current = false;
          navigationStartTime.current = null;
          toast.error("Navigation failed. Please try again.");
        }
      }, 8000);
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
    
    // Complete the progress immediately
    setProgressValue(100);
    
    // Use a multi-step navigation approach
    setTimeout(() => {
      console.log(`Executing navigation to: /builder/${projectId}`);
      
      // First attempt: window.location.assign preserves history but is more reliable than navigate()
      window.location.assign(`/builder/${projectId}`);
      
      // Second attempt as fallback
      const fallbackTimer = setTimeout(() => {
        if (document.location.pathname === '/dashboard') {
          console.log("First navigation attempt failed, trying hard redirect");
          // Hard redirect if we're still on dashboard
          window.location.href = `/builder/${projectId}`;
        }
      }, 1200);
      
      // Third attempt as final fallback
      const finalFallbackTimer = setTimeout(() => {
        if (document.location.pathname === '/dashboard') {
          console.log("Second navigation attempt failed, trying React Router navigate");
          // If we're still here, try React Router navigate with replace
          navigate(`/builder/${projectId}`, { replace: true });
        }
      }, 2500);
      
      return () => {
        clearTimeout(fallbackTimer);
        clearTimeout(finalFallbackTimer);
      };
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
