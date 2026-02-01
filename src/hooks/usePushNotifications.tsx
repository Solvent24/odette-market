import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PushNotificationState {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
}

export function usePushNotifications() {
  const { user } = useAuth();
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    permission: "default",
    isSubscribed: false,
  });

  useEffect(() => {
    const isSupported = "Notification" in window && "serviceWorker" in navigator;
    setState((prev) => ({
      ...prev,
      isSupported,
      permission: isSupported ? Notification.permission : "denied",
    }));
  }, []);

  const requestPermission = useCallback(async () => {
    if (!state.isSupported) return false;

    try {
      const permission = await Notification.requestPermission();
      setState((prev) => ({ ...prev, permission }));
      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }, [state.isSupported]);

  const showNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (state.permission !== "granted") return;

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
            icon: "/icons/icon-192x192.png",
            badge: "/icons/icon-192x192.png",
            ...options,
          });
        });
      } else {
        new Notification(title, options);
      }
    },
    [state.permission]
  );

  const subscribeToOrderUpdates = useCallback(() => {
    if (!user) return () => {};

    const channel = supabase
      .channel(`order-updates-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const order = payload.new as { id: string; status: string };
          const statusMessages: Record<string, { title: string; body: string }> = {
            processing: {
              title: "Order Processing",
              body: `Your order #${order.id.slice(0, 8).toUpperCase()} is being processed`,
            },
            shipped: {
              title: "Order Shipped! 🚚",
              body: `Your order #${order.id.slice(0, 8).toUpperCase()} has been shipped`,
            },
            delivered: {
              title: "Order Delivered! 🎉",
              body: `Your order #${order.id.slice(0, 8).toUpperCase()} has been delivered`,
            },
            cancelled: {
              title: "Order Cancelled",
              body: `Your order #${order.id.slice(0, 8).toUpperCase()} has been cancelled`,
            },
          };

          const message = statusMessages[order.status];
          if (message) {
            showNotification(message.title, {
              body: message.body,
              tag: `order-${order.id}`,
              data: { orderId: order.id, status: order.status },
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, showNotification]);

  return {
    ...state,
    requestPermission,
    showNotification,
    subscribeToOrderUpdates,
  };
}
