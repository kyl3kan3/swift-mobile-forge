
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
      setIsNavigating(false);
      setLoadingProjectId(null);
      setProgressValue(0);
      navigationInProgress.current = false;
    };

    // Reset on mount only if we're actually on the dashboard
    // This prevents resetting during navigation
    if (location.pathname === '/dashboard') {
      resetNavigationState();
    }

    return () => {
      // Do not reset when leaving dashboard - we need to maintain state during navigation
    };
  }, [location.pathname]);
  
  // Only detect if we're going back to dashboard from another route
  useEffect(() => {
    // We don't want to reset navigation state when we're actually navigating to the builder
    // Only reset if we detect we're back at dashboard WITHOUT successfully navigating
    if (location.pathname === '/dashboard' && navigationInProgress.current) {
      console.log('Navigation failed or user returned to dashboard, resetting navigation state');
      
      // Add a small delay to ensure we're not resetting during an active navigation
      setTimeout(() => {
        if (location.pathname === '/dashboard') {
          setIsNavigating(false);
          setLoadingProjectId(null);
          setProgressValue(0);
          navigationInProgress.current = false;
        }
      }, 500);
    }
  }, [location.pathname]);
  
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
          navigationInProgress.current = false;
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
    
    setIsNavigating(true);
    setLoadingProjectId(projectId);
    navigationInProgress.current = true;
    
    console.log(`Preparing to navigate to project: ${projectId}`);
    
    // Complete the progress immediately when actually navigating
    setProgressValue(100);
    
    // Use a forced navigation approach to ensure the route change happens
    setTimeout(() => {
      console.log(`Navigating to: /builder/${projectId}`);
      // Use replace here to force a clean navigation
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
