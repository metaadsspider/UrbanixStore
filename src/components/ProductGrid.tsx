import { useProducts, categorizeProduct, Product } from "@/hooks/useProducts";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";
import { AlertCircle } from "lucide-react";

interface ProductGridProps {
  category?: string;
  limit?: number;
}

export function ProductGrid({ category, limit }: ProductGridProps) {
  const { data, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium">Failed to load products</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Please try again later
        </p>
      </div>
    );
  }

  let products = data?.products || [];

  // Filter by category if specified
  if (category && category !== "all") {
    products = products.filter(
      (product) => categorizeProduct(product) === category
    );
  }

  // Apply limit if specified
  if (limit) {
    products = products.slice(0, limit);
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Check back later for new arrivals
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
