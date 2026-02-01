import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { getTranslation } from "@/lib/translations";

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function Orders() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { formatPrice } = useSiteSettings();
  const t = (key: any) => getTranslation(language, key);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (data) setOrders(data);
    setIsLoading(false);
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: t("statusPending"),
      processing: t("statusProcessing"),
      shipped: t("statusShipped"),
      delivered: t("statusDelivered"),
      cancelled: t("statusCancelled"),
    };
    return statusMap[status] || status;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-semibold mb-2">{t("pleaseSignIn")}</h1>
          <p className="text-muted-foreground mb-6">{t("needToSignIn")}</p>
          <Button asChild>
            <Link to="/auth">{t("signIn")}</Link>
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
          <h1 className="section-heading mb-8">{t("orderHistory")}</h1>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-card rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">{t("noOrders")}</h2>
              <p className="text-muted-foreground mb-6">{t("continueShopping")}</p>
              <Button asChild>
                <Link to="/shop">{t("startShopping")}</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  to={`/order-confirmation/${order.id}`}
                  className="flex items-center gap-4 bg-card rounded-2xl p-4 md:p-6 shadow-card hover:shadow-medium transition-shadow"
                >
                  <div className="shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">
                        {t("orderNumber")} #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-800"}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(order.created_at).toLocaleDateString(
                        language === "rw" ? "rw-RW" : "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.total)}</p>
                  </div>

                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
