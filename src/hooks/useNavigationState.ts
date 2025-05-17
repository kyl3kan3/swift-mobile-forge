
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useNavigationState() {
  // Fix hook order by declaring all useState hooks first
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState(0);
  
  // Then useRef hooks
  const navigationInProgress = useRef(false);
  const navigationStartTime = useRef<number | null>(null);
  const navigationAttempts = useRef(0);
  
  // Then other hooks
  const location = useLocation();
  const navigate = useNavigate();
  
  // Reset navigation state only when first arriving at dashboard
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
  
  // Progress animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isNavigating) {
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
  }, [isNavigating]);
  
  // Clear loading state if navigation takes too long
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isNavigating) {
      // Extended timeout - if we're still on the Dashboard after 15 seconds, clear loading state
      timeout = setTimeout(() => {
        if (location.pathname.includes('dashboard') && isNavigating) {
          console.log("Navigation timeout - still on dashboard after 15 seconds");
          setIsNavigating(false);
          setLoadingProjectId(null);
          navigationInProgress.current = false;
          navigationStartTime.current = null;
          navigationAttempts.current = 0;
          
          toast.error("Navigation failed. Please try again.");
        }
      }, 15000); // Increased timeout
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isNavigating, location.pathname]);

  // Navigation function using a hybrid approach for maximum reliability
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
    navigationAttempts.current += 1;
    
    // Complete the progress animation
    setProgressValue(100);
    
    // Try React Router navigation first
    setTimeout(() => {
      console.log(`Navigating to project: ${projectId}`);
      
      try {
        // Use React Router's navigate function
        navigate(`/builder/${projectId}`);
        
        // Fallback to direct navigation after a delay if still on dashboard
        setTimeout(() => {
          if (location.pathname.includes('dashboard')) {
            console.log("Fallback to direct navigation");
            const timestamp = new Date().getTime();
            window.location.href = `/builder/${projectId}?t=${timestamp}`;
          }
        }, 2000);
      } catch (error) {
        console.error("Navigation error:", error);
        // Immediate fallback
        const timestamp = new Date().getTime();
        window.location.href = `/builder/${projectId}?t=${timestamp}`;
      }
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
