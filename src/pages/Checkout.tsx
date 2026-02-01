import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard, Truck, Lock, ArrowLeft, Phone, MessageCircle, Banknote } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { getTranslation, Language } from "@/lib/translations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const { formatPrice, settings } = useSiteSettings();
  const lang = (settings.language || "rw") as Language;
  const t = (key: any) => getTranslation(lang, key);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mtn_momo");
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Rwanda",
  });

  const shipping = total >= 50000 ? 0 : 2000;
  const tax = total * 0.18;
  const grandTotal = total + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total: grandTotal,
          status: "pending",
          shipping_address: { ...shippingInfo, payment_method: paymentMethod },
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product?.price || 0,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();

      toast.success(lang === "rw" ? "Ubusabe bwoherejwe neza!" : "Order placed successfully!");
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      toast.error(lang === "rw" ? "Byanze. Ongera ugerageze." : "Failed to place order. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMomoInstructions = () => {
    const amount = Math.round(grandTotal);
    return `*182*8*1*${settings.mtn_momo_code}*${amount}# ${lang === "rw" ? "cyangwa" : "or"} *182*1*1*${settings.mtn_momo_code}*${amount}#`;
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      lang === "rw" 
        ? `Muraho! Ndashaka gutumiza ibicuruzwa. Nimero y'ubusabe: ${items.length} ibicuruzwa, Igiciro: ${formatPrice(grandTotal)}`
        : `Hello! I want to order products. Order: ${items.length} items, Total: ${formatPrice(grandTotal)}`
    );
    window.open(`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}?text=${message}`, "_blank");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <Lock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold mb-2">{t("emptyCart")}</h1>
          <p className="text-muted-foreground mb-6">
            {lang === "rw" ? "Shyira ibicuruzwa mbere yo kwishyura" : "Add some items before checking out"}
          </p>
          <Button asChild>
            <Link to="/shop">{t("continueShopping")}</Link>
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
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/cart">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {lang === "rw" ? "Garuka ku Gatebo" : "Back to Cart"}
            </Link>
          </Button>

          <h1 className="section-heading mb-8">{t("checkout")}</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Shipping & Payment */}
              <div className="lg:col-span-2 space-y-8">
                {/* Shipping Information */}
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <div className="flex items-center gap-2 mb-6">
                    <Truck className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-lg">{t("shippingInfo")}</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">{t("fullName")}</Label>
                      <Input
                        id="fullName"
                        required
                        value={shippingInfo.fullName}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, fullName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{t("email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={shippingInfo.email}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, email: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t("phone")}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        placeholder="07XXXXXXXX"
                        value={shippingInfo.phone}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, phone: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">{t("country")}</Label>
                      <Input
                        id="country"
                        required
                        value={shippingInfo.country}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, country: e.target.value })
                        }
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="address">{t("address")}</Label>
                      <Input
                        id="address"
                        required
                        value={shippingInfo.address}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, address: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">{t("city")}</Label>
                      <Input
                        id="city"
                        required
                        value={shippingInfo.city}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, city: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">{t("state")}</Label>
                      <Input
                        id="state"
                        required
                        value={shippingInfo.state}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, state: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-lg">{t("paymentMethod")}</h2>
                  </div>

                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    {/* MTN MoMo */}
                    <label className="flex items-start gap-3 p-4 border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                      <RadioGroupItem value="mtn_momo" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-yellow-500" />
                          <p className="font-medium">{t("mtnMoMo")}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("mtnMoMoDesc")}
                        </p>
                        {paymentMethod === "mtn_momo" && (
                          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                            <p className="text-sm font-mono">{getMomoInstructions()}</p>
                          </div>
                        )}
                      </div>
                    </label>

                    {/* Airtel Money */}
                    <label className="flex items-start gap-3 p-4 border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors mt-3">
                      <RadioGroupItem value="airtel_money" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-red-500" />
                          <p className="font-medium">{t("airtelMoney")}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("airtelMoneyDesc")}
                        </p>
                        {paymentMethod === "airtel_money" && (
                          <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                            <p className="text-sm">
                              {lang === "rw" ? "Kohereza kuri:" : "Send to:"} {settings.airtel_money_code}
                            </p>
                            <p className="text-sm font-semibold mt-1">
                              {lang === "rw" ? "Amafaranga:" : "Amount:"} {formatPrice(grandTotal)}
                            </p>
                          </div>
                        )}
                      </div>
                    </label>

                    {/* Cash on Delivery */}
                    <label className="flex items-start gap-3 p-4 border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors mt-3">
                      <RadioGroupItem value="cash_delivery" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Banknote className="h-4 w-4 text-green-500" />
                          <p className="font-medium">{t("cashDelivery")}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("cashDeliveryDesc")}
                        </p>
                        {paymentMethod === "cash_delivery" && (
                          <div className="mt-3">
                            <Button
                              type="button"
                              variant="outline"
                              className="gap-2"
                              onClick={handleWhatsAppContact}
                            >
                              <MessageCircle className="h-4 w-4" />
                              {t("contactOnWhatsApp")}
                            </Button>
                          </div>
                        )}
                      </div>
                    </label>
                  </RadioGroup>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-2xl p-6 shadow-card sticky top-32">
                  <h2 className="font-semibold text-lg mb-4">{t("orderSummary")}</h2>

                  {/* Items */}
                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.product?.image_url || "/placeholder.svg"}
                          alt={item.product?.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-1">
                            {item.product?.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {lang === "rw" ? "Umubare:" : "Qty:"} {item.quantity}
                          </p>
                          <p className="text-sm font-semibold">
                            {formatPrice((item.product?.price || 0) * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t("subtotal")}</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t("shipping")}</span>
                      <span>{shipping === 0 ? t("freeShipping") : formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t("tax")} (18%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                      <span>{t("total")}</span>
                      <span>{formatPrice(grandTotal)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t("processing") : `${t("placeOrder")} • ${formatPrice(grandTotal)}`}
                  </Button>

                  <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>{t("secureCheckout")}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
