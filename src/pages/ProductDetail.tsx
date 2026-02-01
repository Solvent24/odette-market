import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Heart, Star, Truck, Shield, RefreshCcw, Minus, Plus, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  description: string | null;
  image_url: string | null;
  is_new: boolean | null;
  is_sale: boolean | null;
  stock: number;
  category_id: string | null;
}

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  created_at: string;
  user_id: string;
  profiles?: { username: string | null } | null;
}

export default function ProductDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 5, title: "", content: "" });
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  useEffect(() => {
    if (product && user) {
      checkWishlist();
    }
  }, [product, user]);

  const fetchProduct = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (data) {
      setProduct(data);
      fetchReviews(data.id);
      fetchRelatedProducts(data.category_id, data.id);
    }
    setIsLoading(false);
  };

  const fetchReviews = async (productId: string) => {
    const { data } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    
    if (data) setReviews(data as Review[]);
  };

  const fetchRelatedProducts = async (categoryId: string | null, excludeId: string) => {
    if (!categoryId) return;
    
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .neq("id", excludeId)
      .limit(4);
    
    if (data) setRelatedProducts(data);
  };

  const checkWishlist = async () => {
    if (!user || !product) return;
    
    const { data } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .maybeSingle();
    
    setIsInWishlist(!!data);
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      return;
    }
    if (!product) return;
    
    await addToCart(product.id, quantity);
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Please sign in to add to wishlist");
      return;
    }
    if (!product) return;

    if (isInWishlist) {
      await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", product.id);
      setIsInWishlist(false);
      toast.success("Removed from wishlist");
    } else {
      await supabase.from("wishlist").insert({
        user_id: user.id,
        product_id: product.id,
      });
      setIsInWishlist(true);
      toast.success("Added to wishlist!");
    }
  };

  const submitReview = async () => {
    if (!user || !product) {
      toast.error("Please sign in to submit a review");
      return;
    }

    const { error } = await supabase.from("product_reviews").insert({
      product_id: product.id,
      user_id: user.id,
      rating: newReview.rating,
      title: newReview.title || null,
      content: newReview.content || null,
    });

    if (error) {
      toast.error("Failed to submit review");
    } else {
      toast.success("Review submitted!");
      setNewReview({ rating: 5, title: "", content: "" });
      fetchReviews(product.id);
    }
  };

  const averageRating = reviews.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  const discount = product?.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-secondary rounded-2xl" />
              <div className="space-y-4">
                <div className="h-8 bg-secondary rounded w-3/4" />
                <div className="h-6 bg-secondary rounded w-1/4" />
                <div className="h-24 bg-secondary rounded" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">Product not found</h1>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/shop" className="hover:text-foreground">Shop</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* Product Section */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Image */}
            <div className="relative">
              <div className="aspect-square bg-secondary/30 rounded-2xl overflow-hidden">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_new && <span className="badge-new">New</span>}
                {product.is_sale && discount > 0 && (
                  <span className="badge-sale">-{discount}%</span>
                )}
              </div>
            </div>

            {/* Details */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-semibold mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(averageRating)
                          ? "fill-gold text-gold"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  ({reviews.length} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-foreground">
                  ${product.price.toFixed(2)}
                </span>
                {product.original_price && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.original_price.toFixed(2)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="badge-sale">Save {discount}%</span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-6">
                {product.description}
              </p>

              {/* Stock */}
              <p className="text-sm mb-6">
                {product.stock > 0 ? (
                  <span className="text-green-600">✓ In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-destructive">Out of Stock</span>
                )}
              </p>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border rounded-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  size="lg"
                  className="flex-1 rounded-full"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full"
                  onClick={toggleWishlist}
                >
                  <Heart
                    className={`h-5 w-5 ${isInWishlist ? "fill-destructive text-destructive" : ""}`}
                  />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 border-t pt-6">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Secure Payment</p>
                </div>
                <div className="text-center">
                  <RefreshCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Easy Returns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="reviews" className="mb-16">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-6">
              <p className="text-muted-foreground max-w-3xl">
                {product.description || "No description available."}
              </p>
            </TabsContent>
            <TabsContent value="reviews" className="pt-6">
              {/* Write Review */}
              {user && (
                <div className="bg-card rounded-2xl p-6 mb-8 shadow-card">
                  <h3 className="font-semibold mb-4">Write a Review</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-muted-foreground">Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= newReview.rating
                              ? "fill-gold text-gold"
                              : "text-muted"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <Textarea
                    placeholder="Share your thoughts about this product..."
                    value={newReview.content}
                    onChange={(e) =>
                      setNewReview({ ...newReview, content: e.target.value })
                    }
                    className="mb-4"
                  />
                  <Button onClick={submitReview}>Submit Review</Button>
                </div>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-gold text-gold"
                                  : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">
                          {review.profiles?.username || "Anonymous"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.content && (
                        <p className="text-muted-foreground">{review.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="section-heading mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}