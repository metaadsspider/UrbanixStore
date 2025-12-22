import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative z-10 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            New Collection 2025
          </span>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight animate-slide-up">
            Redefine Your{" "}
            <span className="text-gradient">Street Style</span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "100ms" }}>
            Discover exclusive streetwear collections. From caps to sunglasses, 
            elevate your look with Urbanix premium fashion.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 text-lg px-8 shadow-elevated"
            >
              <Link to="/products">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="text-lg px-8"
            >
              <Link to="/products?category=clothes">
                View Clothes
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-accent/20 animate-float hidden md:block" />
      <div className="absolute top-32 right-20 w-16 h-16 rounded-full bg-primary/20 animate-float hidden md:block" style={{ animationDelay: "1s" }} />
    </section>
  );
}
