
import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// This is a placeholder for actual authentication logic
// In a real app, this would check tokens, session state, etc.
const isAuthenticated = () => {
  // For demonstration purposes, we're just returning true
  return true;
};

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    // Check authentication status once on mount
    const checkAuth = () => {
      if (!isAuthenticated()) {
        console.log("User not authenticated, redirecting to login");
        navigate("/", { replace: true, state: { from: location.pathname } });
      } else {
        console.log("User authenticated, rendering protected route", location.pathname);
      }
      setIsChecking(false);
    };
    
    checkAuth();
    // Don't include navigate in dependencies to prevent redirect loops
  }, [location.pathname]); 

  // Show loading state while checking auth
  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-r-transparent"></div>
      </div>
    );
  }

  // If we're not redirecting, render the protected content
  return <>{children}</>;
};

export default RequireAuth;
