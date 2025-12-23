import { useSearchParams } from "react-router-dom";
import { ProductGrid } from "@/components/ProductGrid";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "All Products" },
  { id: "clothes", label: "Clothes" },
  { id: "caps", label: "Caps" },
  { id: "others", label: "Others" },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  const handleCategoryChange = (category: string) => {
    if (category === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <main className="min-h-screen">
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-display font-bold">
              {activeCategory === "all" ? "All Products" : categories.find(c => c.id === activeCategory)?.label}
            </h1>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
              Browse our collection of premium streetwear
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                onClick={() => handleCategoryChange(cat.id)}
                className={cn(
                  activeCategory === cat.id && "bg-gradient-primary"
                )}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          <ProductGrid category={activeCategory} />
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Products;
