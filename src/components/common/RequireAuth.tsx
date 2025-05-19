
import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// This is a placeholder for actual authentication logic
// You would replace this with your actual auth check
const isAuthenticated = () => {
  // For now, we'll just simulate being authenticated
  // In reality, this would check a token, session state, etc.
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
    // If not authenticated, redirect to login
    if (!isAuthenticated()) {
      console.log("User not authenticated, redirecting to login");
      navigate("/", { replace: true });
    } else {
      console.log("User authenticated, rendering protected route", location.pathname);
    }
    setIsChecking(false);
  }, [navigate, location.pathname]);

  // Add loading state to prevent flash of redirect
  if (isChecking) {
    return <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-r-transparent"></div>
    </div>;
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default RequireAuth;
