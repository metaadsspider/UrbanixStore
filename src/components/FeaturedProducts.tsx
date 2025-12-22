import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "./ProductGrid";

export function FeaturedProducts() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wide">
              Featured
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">
              Trending Now
            </h2>
            <p className="mt-3 text-muted-foreground max-w-lg">
              Discover what's hot in streetwear this season
            </p>
          </div>
          <Button asChild variant="outline" className="self-start md:self-auto">
            <Link to="/products">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ProductGrid limit={8} />
      </div>
    </section>
  );
}
