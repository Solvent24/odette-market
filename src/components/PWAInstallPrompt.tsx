import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { getTranslation, Language } from "@/lib/translations";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const { settings } = useSiteSettings();
  const lang = (settings.language || "rw") as Language;
  const t = (key: any) => getTranslation(lang, key);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // Check if already dismissed
    const dismissed = localStorage.getItem("pwa-prompt-dismissed");
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const dayInMs = 24 * 60 * 60 * 1000;
    
    // Show again after 1 day
    if (dismissed && Date.now() - dismissedTime < dayInMs) {
      return;
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // For iOS, show the prompt after a short delay
    if (isIOSDevice) {
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a short delay
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for app installed
    window.addEventListener("appinstalled", () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-card border border-border rounded-2xl shadow-2xl p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground">{t("installTitle")}</h3>
              <button
                onClick={handleDismiss}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {t("installDescription")}
            </p>
            <div className="mt-3 flex gap-2">
              {isIOS ? (
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">iOS:</p>
                  <p>1. Tap Share button</p>
                  <p>2. "Add to Home Screen"</p>
                </div>
              ) : deferredPrompt ? (
                <Button onClick={handleInstall} size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  {t("installButton")}
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Use browser menu → "Install app"
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
