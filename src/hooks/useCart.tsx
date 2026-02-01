import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
  };
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    const { data } = await supabase
      .from("cart_items")
      .select(`
        id,
        product_id,
        quantity,
        products (
          id,
          name,
          price,
          image_url
        )
      `)
      .eq("user_id", user.id);

    if (data) {
      setItems(
        data.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          product: item.products as CartItem["product"],
        }))
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) return;

    const existingItem = items.find((item) => item.product_id === productId);
    
    if (existingItem) {
      await updateQuantity(productId, existingItem.quantity + quantity);
    } else {
      await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: productId,
        quantity,
      });
      await fetchCart();
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);
    
    await fetchCart();
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("user_id", user.id)
      .eq("product_id", productId);
    
    await fetchCart();
  };

  const clearCart = async () => {
    if (!user) return;

    await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);
    
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
