import { Link } from "react-router-dom";
import { Product } from "@/hooks/useProducts";
import { useCurrency } from "@/contexts/CurrencyContext";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { formatPrice, currency } = useCurrency();

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <img
          src={product.primaryImage}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Quick view overlay */}
        <div className="absolute inset-x-4 bottom-4 opacity-0 transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
          <div className="bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
            <span className="text-sm font-medium">View Details</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 space-y-1">
        <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        <p className="text-lg font-semibold text-gradient">
          {formatPrice(product.priceUSD)}
        </p>
        {currency === "INR" && (
          <p className="text-xs text-muted-foreground">
            *Varies on live USD rate
          </p>
        )}
        {product.sizes.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {product.sizes.slice(0, 4).join(", ")}
            {product.sizes.length > 4 && ` +${product.sizes.length - 4} more`}
          </p>
        )}
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square rounded-xl bg-muted" />
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-5 bg-muted rounded w-1/3" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </div>
    </div>
  );
}
