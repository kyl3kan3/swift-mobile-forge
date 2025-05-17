
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background/80 via-background to-accent/10 p-4">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-center">
        Welcome to Mobile Forge
      </h1>
      <p className="text-xl text-center text-muted-foreground mb-10 max-w-lg">
        Build powerful mobile apps with AI assistance
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="px-8">
          <Link to="/dashboard">Dashboard</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="px-8">
          <Link to="/projects">Projects</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
