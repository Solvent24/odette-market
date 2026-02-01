import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useLanguage } from "@/hooks/useLanguage";
import { getTranslation } from "@/lib/translations";

export default function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const { isSupported, permission, requestPermission, subscribeToOrderUpdates } =
    usePushNotifications();
  const { language } = useLanguage();
  const t = (key: any) => getTranslation(language, key);

  useEffect(() => {
    // Check if we should show the prompt
    const dismissed = localStorage.getItem("notification-prompt-dismissed");
    const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
    const threeDays = 3 * 24 * 60 * 60 * 1000;

    if (
      isSupported &&
      permission === "default" &&
      Date.now() - dismissedTime > threeDays
    ) {
      // Delay showing the prompt
      const timer = setTimeout(() => setShowPrompt(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isSupported, permission]);

  useEffect(() => {
    if (permission === "granted") {
      const unsubscribe = subscribeToOrderUpdates();
      return unsubscribe;
    }
  }, [permission, subscribeToOrderUpdates]);

  const handleEnable = async () => {
    const granted = await requestPermission();
    if (granted) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("notification-prompt-dismissed", Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card border border-border rounded-2xl shadow-lg p-4 z-50 animate-in slide-in-from-bottom-4">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Bell className="h-5 w-5 text-primary" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-sm">{t("enableNotifications")}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {t("orderUpdates")}
          </p>

          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={handleEnable}>
              {t("enableNotifications")}
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDismiss}>
              {t("cancel")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
