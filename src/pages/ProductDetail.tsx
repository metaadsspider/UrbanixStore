import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingBag, Instagram } from "lucide-react";
import { useProduct } from "@/hooks/useProducts";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";

const INSTAGRAM_URL = "https://www.instagram.com/urbanixstore07";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(id || "");
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <div className="container py-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-muted rounded w-1/4 animate-pulse" />
              <div className="h-32 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen">
        <div className="container py-12">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold">Product not found</h1>
            <p className="text-muted-foreground mt-2">
              The product you're looking for doesn't exist.
            </p>
            <Button asChild className="mt-6">
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      return;
    }
    
    addItem({
      productId: product.id,
      title: product.title,
      image: product.primaryImage,
      priceUSD: product.priceUSD,
      size: selectedSize || "One Size",
      color: selectedColor || "",
      quantity,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Generate order message and open Instagram
    const message = `Hi! I'd like to order:\n\n${product.title}\nSize: ${selectedSize || "One Size"}\n${selectedColor ? `Color: ${selectedColor}\n` : ""}Qty: ${quantity}\nPrice: ${formatPrice(product.priceUSD * quantity)}\n\nPlease confirm availability!`;
    navigator.clipboard.writeText(message);
    window.open(INSTAGRAM_URL, "_blank");
    alert("Order details copied! Paste in Instagram DM.");
  };

  return (
    <main className="min-h-screen">
      <div className="container py-8 md:py-12">
        {/* Back button */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
              <img
                src={product.images[activeImage] || product.primaryImage}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors",
                      activeImage === index ? "border-primary" : "border-transparent"
                    )}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">
                {product.title}
              </h1>
              <p className="text-3xl font-bold text-gradient mt-4">
                {formatPrice(product.priceUSD)}
              </p>
            </div>

            {product.description && (
              <p className="text-muted-foreground leading-relaxed">
                {product.description.replace(/<[^>]*>/g, "")}
              </p>
            )}

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-3">
                  Size <span className="text-destructive">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "px-4 py-2 border rounded-lg font-medium transition-all",
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-3">Color</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "px-4 py-2 border rounded-lg font-medium transition-all",
                        selectedColor === color
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-3">Quantity</label>
              <div className="flex items-center gap-1 border rounded-lg w-fit">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                size="lg"
                variant="outline"
                className="flex-1 gap-2"
                onClick={handleAddToCart}
                disabled={product.sizes.length > 0 && !selectedSize}
              >
                <ShoppingBag className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                className="flex-1 gap-2 bg-gradient-primary hover:opacity-90"
                onClick={handleBuyNow}
                disabled={product.sizes.length > 0 && !selectedSize}
              >
                <Instagram className="h-5 w-5" />
                Order via Instagram
              </Button>
            </div>

            {product.sizes.length > 0 && !selectedSize && (
              <p className="text-sm text-destructive">
                Please select a size to continue
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default ProductDetail;
