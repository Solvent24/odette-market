import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { getTranslation, Language } from "@/lib/translations";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price?: number | null;
  image_url?: string | null;
  is_new?: boolean;
  is_sale?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { formatPrice, settings } = useSiteSettings();
  const lang = (settings.language || "rw") as Language;
  const t = (key: any) => getTranslation(lang, key);
  
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error(lang === "rw" ? "Injira kugira ngo ushyire mu gatebo" : "Please sign in to add items to cart");
      return;
    }
    
    await addToCart(product.id);
    toast.success(lang === "rw" ? "Byashyizwe mu gatebo!" : "Added to cart!");
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group card-product block"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        <img
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_new && (
            <span className="badge-new">{lang === "rw" ? "Gishya" : "New"}</span>
          )}
          {product.is_sale && discount > 0 && (
            <span className="badge-sale">-{discount}%</span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 rounded-full shadow-md"
            onClick={(e) => {
              e.preventDefault();
              if (!user) {
                toast.error(lang === "rw" ? "Injira kugira ngo ushyire mu bifuzwa" : "Please sign in to add to wishlist");
                return;
              }
              toast.success(lang === "rw" ? "Byashyizwe mu bifuzwa!" : "Added to wishlist!");
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Add to Cart */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Button
            variant="default"
            className="w-full rounded-full shadow-lg"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {t("addToCart")}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < 4 ? "fill-gold text-gold" : "text-muted"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">(24)</span>
        </div>

        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.original_price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
