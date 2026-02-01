import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Bell,
  Palette,
  Globe,
  Shield,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Smartphone,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    promotions: true,
    orderUpdates: true,
  });

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary/30">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">{language === "rw" ? "Igenamiterere" : "Settings"}</h1>

            {/* Account Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {language === "rw" ? "Konti & Umwirondoro" : "Account & Profile"}
                </CardTitle>
                <CardDescription>
                  {language === "rw" ? "Gucunga amakuru yawe n'umwirondoro" : "Manage your personal information and profile"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link
                  to="/account"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{language === "rw" ? "Umwirondoro" : "Profile"}</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.email || (language === "rw" ? "Injira kugira ngo urebe" : "Sign in to view")}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>

            {/* Language & Region */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {language === "rw" ? "Ururimi & Akarere" : "Language & Region"}
                </CardTitle>
                <CardDescription>
                  {language === "rw" ? "Hitamo ururimi n'akarere" : "Choose your language and region preferences"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{language === "rw" ? "Ururimi rwo Gukoresha" : "App Language"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "rw" ? "Ikinyarwanda" : "English"}
                      </p>
                    </div>
                  </div>
                  <Select value={language} onValueChange={(v) => setLanguage(v as "rw" | "en")}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rw">🇷🇼 Ikinyarwanda</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  {language === "rw" ? "Isura" : "Appearance"}
                </CardTitle>
                <CardDescription>
                  {language === "rw" ? "Hindura uko porogaramu igaragara" : "Change how the app looks"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? (
                      <Moon className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Sun className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{language === "rw" ? "Insanganyamatsiko" : "Theme"}</p>
                      <p className="text-sm text-muted-foreground">
                        {theme === "dark"
                          ? language === "rw"
                            ? "Ijoro"
                            : "Dark"
                          : theme === "light"
                          ? language === "rw"
                            ? "Umucyo"
                            : "Light"
                          : language === "rw"
                          ? "Sisitemu"
                          : "System"}
                      </p>
                    </div>
                  </div>
                  <Select value={theme} onValueChange={(v) => handleThemeChange(v as typeof theme)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          {language === "rw" ? "Umucyo" : "Light"}
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          {language === "rw" ? "Ijoro" : "Dark"}
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          {language === "rw" ? "Sisitemu" : "System"}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  {language === "rw" ? "Imenyeshwa" : "Notifications"}
                </CardTitle>
                <CardDescription>
                  {language === "rw" ? "Gucunga imenyeshwa yawe" : "Manage your notification preferences"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notif">{language === "rw" ? "Imenyeshwa zisunzura" : "Push Notifications"}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "rw" ? "Akura imenyeshwa ku telefoni" : "Receive notifications on your device"}
                    </p>
                  </div>
                  <Switch
                    id="push-notif"
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notif">{language === "rw" ? "Imenyeshwa z'Imeyili" : "Email Notifications"}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "rw" ? "Akura imenyeshwa kuri imeyili yawe" : "Receive updates via email"}
                    </p>
                  </div>
                  <Switch
                    id="email-notif"
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="order-notif">{language === "rw" ? "Imenyeshwa z'Ubusabe" : "Order Updates"}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "rw" ? "Menya aho ubusabe bwawe bugeze" : "Get notified about your order status"}
                    </p>
                  </div>
                  <Switch
                    id="order-notif"
                    checked={notifications.orderUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, orderUpdates: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {language === "rw" ? "Ibanga & Umutekano" : "Privacy & Security"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  to="/account"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <span>{language === "rw" ? "Hindura Ijambo ry'ibanga" : "Change Password"}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  {language === "rw" ? "Ubufasha & Inkunga" : "Help & Support"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a
                  href="https://wa.me/250795909669"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <span>{language === "rw" ? "Twandikire kuri WhatsApp" : "Contact us on WhatsApp"}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </a>
              </CardContent>
            </Card>

            {/* About */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  {language === "rw" ? "Ibyerekeye" : "About"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-3">
                  <span>{language === "rw" ? "Verisiyo" : "Version"}</span>
                  <span className="text-muted-foreground">1.0.0</span>
                </div>
                <Link
                  to="/privacy"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <span>{language === "rw" ? "Politiki y'Ibanga" : "Privacy Policy"}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                <Link
                  to="/terms"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <span>{language === "rw" ? "Amategeko n'Amabwiriza" : "Terms of Service"}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>

            {/* Sign Out */}
            {user && (
              <Card className="mb-6 border-destructive/20">
                <CardContent className="pt-6">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {language === "rw" ? "Sohoka" : "Sign Out"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
