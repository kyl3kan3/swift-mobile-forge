
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  
  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // If authenticated, render children
  return <>{children}</>;
};

export default RequireAuth;
