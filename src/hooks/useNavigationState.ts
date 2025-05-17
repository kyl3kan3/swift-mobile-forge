
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
  
  // Reset navigation state on mount and clean up on unmount
  useEffect(() => {
    // Clear any potential stuck states
    const resetNavigationState = () => {
      // Use state setters instead of manipulating the ref directly
      setIsNavigating(false);
      setLoadingProjectId(null);
      setProgressValue(0);
    };

    // Reset on mount
    resetNavigationState();

    return () => {
      // Clean up any pending navigation states when component unmounts
      resetNavigationState();
    };
  }, []);
  
  // Detect if we're on the dashboard route
  useEffect(() => {
    if (location.pathname === '/dashboard' && isNavigating) {
      // If we came back to dashboard while a navigation was in progress,
      // it means the navigation failed or was canceled
      console.log('Back to dashboard while navigation in progress, resetting navigation state');
      setIsNavigating(false);
      setLoadingProjectId(null);
      setProgressValue(0);
    }
  }, [location.pathname, isNavigating]);
  
  // Progress animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isNavigating && loadingProjectId) {
      // Reset progress
      setProgressValue(0);
      
      // Animate progress from 0 to 90% over 1.5 seconds
      interval = setInterval(() => {
        setProgressValue(prev => {
          const newValue = prev + 5;
          return newValue < 90 ? newValue : 90;
        });
      }, 100);
    } else {
      setProgressValue(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isNavigating, loadingProjectId]);
  
  // Clear loading state if we're still on Dashboard after a delay
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isNavigating) {
      // If we're still on the Dashboard after 3 seconds, clear the loading state
      timeout = setTimeout(() => {
        if (location.pathname.includes('dashboard')) {
          console.log("Still on dashboard after timeout, clearing navigation state");
          setIsNavigating(false);
          setLoadingProjectId(null);
          toast.error("Navigation failed. Please try again.");
        }
      }, 3000);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isNavigating, location.pathname]);

  // Stable navigation function with decisive push navigation
  const navigateToBuilder = (projectId: string) => {
    if (navigationInProgress.current) {
      console.log("Navigation already in progress, ignoring additional request");
      return;
    }
    
    // Use state setters instead of ref manipulation
    setIsNavigating(true);
    setLoadingProjectId(projectId);
    navigationInProgress.current = true; // This is acceptable as we're reading, then writing
    
    console.log(`Preparing to navigate to project: ${projectId}`);
    
    // Show loading feedback
    toast.loading(`Opening project...`, { duration: 3000 });
    
    // Use a shorter delay for more responsive navigation
    setTimeout(() => {
      console.log(`Navigating to: /builder/${projectId}`);
      // Use replace to prevent back button from returning to a potentially broken state
      navigate(`/builder/${projectId}`, { replace: true });
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
