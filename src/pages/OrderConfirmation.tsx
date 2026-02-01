import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, Download } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
  shipping_address: Record<string, string> | null;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    image_url: string | null;
  };
}

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId && user) {
      fetchOrder();
    }
  }, [orderId, user]);

  const fetchOrder = async () => {
    setIsLoading(true);

    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (orderData) {
      setOrder(orderData as Order);

      const { data: itemsData } = await supabase
        .from("order_items")
        .select("*, products(name, image_url)")
        .eq("order_id", orderId);

      if (itemsData) {
        setOrderItems(itemsData as OrderItem[]);
      }
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-16 w-16 bg-secondary rounded-full mx-auto" />
            <div className="h-8 bg-secondary rounded w-64 mx-auto" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">Order not found</h1>
          <Button asChild>
            <Link to="/orders">View Orders</Link>
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
          {/* Success Message */}
          <div className="text-center mb-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-display font-semibold mb-2">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. We'll send you an email confirmation shortly.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Order Details */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Order Details
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono">{order.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="capitalize font-medium text-primary">{order.status}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p className="text-sm text-muted-foreground">
                  {order.shipping_address.fullName}<br />
                  {order.shipping_address.address}<br />
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}<br />
                  {order.shipping_address.country}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h2 className="font-semibold text-lg mb-4">Order Items</h2>

              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.products?.image_url || "/placeholder.svg"}
                      alt={item.products?.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.products?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button asChild>
              <Link to="/orders">View All Orders</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}