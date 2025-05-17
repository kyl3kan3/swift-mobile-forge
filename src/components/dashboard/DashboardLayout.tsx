
import React from "react";
import { cn } from "@/lib/utils";
import { useNavigationState } from "@/hooks/useNavigationState";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const { isNavigating } = useNavigationState();

  return (
    <div className={cn(
      "flex flex-col min-h-screen bg-gradient-to-br from-background/80 via-background to-accent/10",
      isNavigating ? "pointer-events-none" : "",
      className
    )}>
      <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col relative z-10">
          {children}
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/10 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-builder-accent-purple/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
