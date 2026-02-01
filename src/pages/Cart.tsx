import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

export default function Cart() {
  const { user } = useAuth();
  const { items, itemCount, total, updateQuantity, removeFromCart, isLoading } = useCart();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your cart
          </p>
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any items yet
          </p>
          <Button asChild>
            <Link to="/shop">Start Shopping</Link>
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
          <h1 className="section-heading mb-8">Shopping Cart ({itemCount} items)</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-card rounded-2xl p-4 shadow-card"
                >
                  {/* Image */}
                  <Link
                    to={`/product/${item.product?.id}`}
                    className="shrink-0"
                  >
                    <img
                      src={item.product?.image_url || "/placeholder.svg"}
                      alt={item.product?.name}
                      className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product?.id}`}
                      className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.product?.name}
                    </Link>
                    <p className="text-lg font-bold text-primary mt-2">
                      ${item.product?.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border rounded-full">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() =>
                            updateQuantity(item.product_id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() =>
                            updateQuantity(item.product_id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.product_id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="hidden sm:block text-right">
                    <p className="text-sm text-muted-foreground">Subtotal</p>
                    <p className="font-semibold">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 shadow-card sticky top-32">
                <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>{total >= 50 ? "Free" : "$4.99"}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span>${(total * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>
                      ${(total + (total >= 50 ? 0 : 4.99) + total * 0.08).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button asChild className="w-full rounded-full" size="lg">
                  <Link to="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Free shipping on orders over $50
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}