
import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 flex flex-col flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
