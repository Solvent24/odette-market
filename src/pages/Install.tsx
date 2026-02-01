import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Smartphone, Check, X } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for app installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
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
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <Smartphone className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-display font-bold mb-4">
              Install Odette Business
            </h1>
            <p className="text-lg text-muted-foreground">
              Get quick access to our store from your home screen
            </p>
          </div>

          {isInstalled ? (
            <Card className="border-green-500/50 bg-green-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">App Installed!</h3>
                    <p className="text-muted-foreground">
                      You can now access Odette Business from your home screen.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : isInstallable ? (
            <Card>
              <CardHeader>
                <CardTitle>Ready to Install</CardTitle>
                <CardDescription>
                  Click the button below to add Odette Business to your home screen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleInstall} size="lg" className="w-full gap-2">
                  <Download className="h-5 w-5" />
                  Install App
                </Button>
              </CardContent>
            </Card>
          ) : isIOS ? (
            <Card>
              <CardHeader>
                <CardTitle>Install on iOS</CardTitle>
                <CardDescription>
                  Follow these steps to install on your iPhone or iPad
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Tap the Share button</p>
                    <p className="text-sm text-muted-foreground">
                      Look for the share icon at the bottom of Safari
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Scroll and tap "Add to Home Screen"</p>
                    <p className="text-sm text-muted-foreground">
                      Find this option in the share menu
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Tap "Add"</p>
                    <p className="text-sm text-muted-foreground">
                      Confirm to add the app to your home screen
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Install Instructions</CardTitle>
                <CardDescription>
                  Your browser may not support automatic installation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  To install this app, use the browser menu and look for "Install app" 
                  or "Add to Home Screen" option.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <X className="h-4 w-4" />
                  <span>Automatic install prompt not available</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary rounded-full mb-3">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Quick Access</h3>
              <p className="text-sm text-muted-foreground">
                Launch directly from your home screen
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary rounded-full mb-3">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Works Offline</h3>
              <p className="text-sm text-muted-foreground">
                Browse products even without internet
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary rounded-full mb-3">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Fast & Smooth</h3>
              <p className="text-sm text-muted-foreground">
                App-like experience in your browser
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Install;
