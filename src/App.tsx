
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import RequireAuth from "@/components/common/RequireAuth";

// Load the Index page eagerly as it's the first one users see
import Index from "./pages/Index";

// Import SimpleProjects page directly
import SimpleProjects from "./pages/SimpleProjects";

// Lazy load other pages for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Projects = lazy(() => import("./pages/Projects"));
const TemplateGallery = lazy(() => import("./pages/TemplateGallery"));
const AppBuilder = lazy(() => import("./pages/AppBuilder"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading component for Suspense fallback
const LoadingPage = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-r-transparent"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Configure QueryClient with optimized options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 10000,
      gcTime: 300000
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="bottom-right" closeButton richColors />
      <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={<LoadingPage />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/projects" element={<RequireAuth><Projects /></RequireAuth>} />
              <Route path="/simple-projects" element={<SimpleProjects />} />
              <Route path="/templates" element={<RequireAuth><TemplateGallery /></RequireAuth>} />
              <Route path="/templates/:projectId" element={<RequireAuth><TemplateGallery /></RequireAuth>} />
              <Route path="/builder/:projectId" element={<RequireAuth><AppBuilder key="builder" /></RequireAuth>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
