import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Fresh Fruits",
    slug: "fresh-fruits",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800",
    description: "Farm fresh",
  },
  {
    name: "Dried Fruits",
    slug: "dried-fruits",
    image: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=800",
    description: "Premium quality",
  },
  {
    name: "Natural Soaps",
    slug: "natural-soaps",
    image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=800",
    description: "Handcrafted",
  },
  {
    name: "Gift Sets",
    slug: "gift-sets",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800",
    description: "Perfect gifts",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading mb-4">Shop by Category</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse our carefully curated collections of fresh fruits and natural soaps
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              to={`/shop?category=${category.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-square animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <p className="text-background/70 text-sm mb-1">{category.description}</p>
                <h3 className="font-display text-xl md:text-2xl font-semibold text-background mb-2">
                  {category.name}
                </h3>
                <div className="flex items-center gap-2 text-primary group-hover:gap-4 transition-all duration-300">
                  <span className="text-sm font-medium">Shop Now</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}