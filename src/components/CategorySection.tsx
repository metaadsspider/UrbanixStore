import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: "clothes",
    name: "Clothes",
    description: "T-shirts, hoodies & more",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=800&fit=crop",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "caps",
    name: "Caps",
    description: "Streetwear headwear",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=800&fit=crop",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "sunglasses",
    name: "Sunglasses",
    description: "Premium eyewear",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=800&fit=crop",
    gradient: "from-orange-500/20 to-red-500/20",
  },
];

export function CategorySection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Shop by Category
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Explore our curated collections of streetwear essentials
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} via-transparent to-transparent`} />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              
              <div className="absolute inset-x-6 bottom-6">
                <h3 className="text-2xl font-display font-bold text-foreground">
                  {category.name}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {category.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-primary font-medium">
                  <span>Explore</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
