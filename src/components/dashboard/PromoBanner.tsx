
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export default function PromoBanner() {
  return (
    <div className="flex items-center gap-4 py-5 px-8 bg-gradient-to-r from-accent/80 to-accent/20 rounded-2xl backdrop-blur-md border border-accent/40 mb-8 shadow-lg animate-fade-in">
      <Zap className="h-6 w-6 text-primary" />
      <div className="flex-1">
        <h3 className="font-medium text-lg mb-0.5">Upgrade to Pro</h3>
        <p className="text-sm text-muted-foreground/90">Access advanced AI features and unlimited projects.</p>
      </div>
      <Button className="bg-white shadow-lg text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300">
        Learn More
      </Button>
    </div>
  );
}
