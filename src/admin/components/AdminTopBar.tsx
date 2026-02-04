import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LanguageToggle from "@/components/LanguageToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Menu, 
  LogOut, 
  User, 
  Bell,
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Settings,
  Users,
  BarChart3,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminTopBar = () => {
  const { signOut, user } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: language === "rw" ? "Incamake" : "Dashboard" },
    { path: "/admin/products", icon: Package, label: language === "rw" ? "Ibicuruzwa" : "Products" },
    { path: "/admin/categories", icon: FolderTree, label: language === "rw" ? "Ibyiciro" : "Categories" },
    { path: "/admin/orders", icon: ShoppingCart, label: language === "rw" ? "Ubusabe" : "Orders" },
    { path: "/admin/users", icon: Users, label: language === "rw" ? "Abakoresha" : "Users" },
    { path: "/admin/analytics", icon: BarChart3, label: language === "rw" ? "Imibare" : "Analytics" },
    { path: "/admin/settings", icon: Settings, label: language === "rw" ? "Igenamiterere" : "Settings" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-card border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Mobile menu button */}
        <div className="lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">O</span>
                  </div>
                  <div>
                    <h1 className="font-display font-bold text-lg">Odette Admin</h1>
                    <p className="text-xs text-muted-foreground">
                      {language === "rw" ? "Ubuyobozi" : "Management"}
                    </p>
                  </div>
                </div>
              </div>
              <nav className="p-4 space-y-1">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path ||
                    (item.path !== "/admin" && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
                <div className="pt-4 border-t border-border mt-4">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary"
                  >
                    <Home className="h-5 w-5" />
                    <span className="font-medium">
                      {language === "rw" ? "Subira mu Iduka" : "Back to Store"}
                    </span>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Page title on mobile */}
        <div className="lg:hidden">
          <h1 className="font-display font-bold text-lg text-primary">Odette Admin</h1>
        </div>

        {/* Spacer for desktop */}
        <div className="hidden lg:block" />

        {/* Right side actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <LanguageToggle />

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">Admin</span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin/settings" className="cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  {language === "rw" ? "Igenamiterere" : "Settings"}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                {language === "rw" ? "Sohoka" : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
