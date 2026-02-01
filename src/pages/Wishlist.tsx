import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface WishlistItem {
  id: string;
  product_id: string;
  products: {
    id: string;
    name: string;
    slug: string;
    price: number;
    original_price: number | null;
    image_url: string | null;
  };
}

export default function Wishlist() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("wishlist")
      .select("*, products(id, name, slug, price, original_price, image_url)")
      .eq("user_id", user?.id);

    if (data) setItems(data as WishlistItem[]);
    setIsLoading(false);
  };

  const removeFromWishlist = async (productId: string) => {
    await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", user?.id)
      .eq("product_id", productId);
    
    setItems(items.filter((item) => item.product_id !== productId));
    toast.success("Removed from wishlist");
  };

  const moveToCart = async (productId: string) => {
    await addToCart(productId);
    await removeFromWishlist(productId);
    toast.success("Moved to cart!");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Please Sign In</h1>
          <p className="text-muted-foreground mb-6">
            Sign in to view your wishlist
          </p>
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        <div className="container mx-auto px-4 py-8">
          <h1 className="section-heading mb-8">
            My Wishlist {items.length > 0 && `(${items.length})`}
          </h1>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl animate-pulse aspect-[3/4]" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Save items you love by clicking the heart icon
              </p>
              <Button asChild>
                <Link to="/shop">Explore Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-card rounded-2xl overflow-hidden shadow-card">
                  <Link to={`/product/${item.products.slug}`}>
                    <div className="aspect-square bg-secondary/30">
                      <img
                        src={item.products.image_url || "/placeholder.svg"}
                        alt={item.products.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link
                      to={`/product/${item.products.slug}`}
                      className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2 block mb-2"
                    >
                      {item.products.name}
                    </Link>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-semibold text-lg">
                        ${item.products.price.toFixed(2)}
                      </span>
                      {item.products.original_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${item.products.original_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 rounded-full"
                        onClick={() => moveToCart(item.product_id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => removeFromWishlist(item.product_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}