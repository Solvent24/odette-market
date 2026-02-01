import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  is_new: boolean | null;
  is_sale: boolean | null;
  is_featured: boolean | null;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .limit(8);

      if (data) {
        setProducts(data);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  // Show placeholder products if none exist
  const displayProducts = products.length > 0 ? products : placeholderProducts;

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <h2 className="section-heading mb-4">Featured Products</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Handpicked favorites from our latest collection
            </p>
          </div>
          <Button variant="outline" asChild className="self-start md:self-auto">
            <Link to="/shop">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-2xl bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {displayProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const placeholderProducts: Product[] = [
  {
    id: "1",
    name: "Classic Cotton T-Shirt",
    slug: "classic-cotton-tshirt",
    price: 29.99,
    original_price: 39.99,
    image_url: null,
    is_new: true,
    is_sale: true,
    is_featured: true,
  },
  {
    id: "2",
    name: "Premium Wireless Headphones",
    slug: "premium-wireless-headphones",
    price: 199.99,
    original_price: null,
    image_url: null,
    is_new: true,
    is_sale: false,
    is_featured: true,
  },
  {
    id: "3",
    name: "Minimalist Ceramic Vase",
    slug: "minimalist-ceramic-vase",
    price: 49.99,
    original_price: null,
    image_url: null,
    is_new: false,
    is_sale: false,
    is_featured: true,
  },
  {
    id: "4",
    name: "Luxury Face Serum",
    slug: "luxury-face-serum",
    price: 79.99,
    original_price: 99.99,
    image_url: null,
    is_new: false,
    is_sale: true,
    is_featured: true,
  },
  {
    id: "5",
    name: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    price: 129.99,
    original_price: null,
    image_url: null,
    is_new: true,
    is_sale: false,
    is_featured: true,
  },
  {
    id: "6",
    name: "Smart Watch Pro",
    slug: "smart-watch-pro",
    price: 299.99,
    original_price: 349.99,
    image_url: null,
    is_new: false,
    is_sale: true,
    is_featured: true,
  },
  {
    id: "7",
    name: "Organic Candle Set",
    slug: "organic-candle-set",
    price: 45.99,
    original_price: null,
    image_url: null,
    is_new: false,
    is_sale: false,
    is_featured: true,
  },
  {
    id: "8",
    name: "Designer Sunglasses",
    slug: "designer-sunglasses",
    price: 159.99,
    original_price: 189.99,
    image_url: null,
    is_new: true,
    is_sale: true,
    is_featured: true,
  },
];
