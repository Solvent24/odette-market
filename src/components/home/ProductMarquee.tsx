import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
}

export default function ProductMarquee() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, slug, price, original_price, image_url")
        .limit(12);

      if (data) {
        setProducts(data);
      }
    };

    fetchProducts();
  }, []);

  // Duplicate products for seamless loop
  const displayProducts = [...products, ...products];

  return (
    <section className="py-8 md:py-12 bg-background border-y border-border/50">
      <div className="container mx-auto px-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
          Featured Products
        </h3>
        
        <div
          ref={marqueeRef}
          className="overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`flex gap-4 ${!isHovered ? "animate-marquee" : ""}`}
            style={{
              animation: isHovered ? "none" : "marquee 60s linear infinite",
            }}
          >
            {displayProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="flex-shrink-0 w-40 md:w-48 group"
              >
                <div className="relative h-40 md:h-48 rounded-lg overflow-hidden bg-secondary/50">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">No image</span>
                    </div>
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      className="gap-2"
                      asChild
                    >
                      <Link to={`/product/${product.slug}`}>
                        <ShoppingCart className="h-4 w-4" />
                        Shop
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Product info */}
                <div className="p-3 text-center">
                  <p className="text-sm font-medium line-clamp-2 text-foreground mb-1">
                    {product.name}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-semibold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        ${product.original_price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
      `}</style>
    </section>
  );
}
