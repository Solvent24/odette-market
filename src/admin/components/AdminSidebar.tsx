import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { 
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

const AdminSidebar = () => {
  const { language } = useLanguage();
  const location = useLocation();

  const menuItems = [
    {
      path: "/admin",
      icon: LayoutDashboard,
      label: language === "rw" ? "Incamake" : "Dashboard",
    },
    {
      path: "/admin/products",
      icon: Package,
      label: language === "rw" ? "Ibicuruzwa" : "Products",
    },
    {
      path: "/admin/categories",
      icon: FolderTree,
      label: language === "rw" ? "Ibyiciro" : "Categories",
    },
    {
      path: "/admin/orders",
      icon: ShoppingCart,
      label: language === "rw" ? "Ubusabe" : "Orders",
    },
    {
      path: "/admin/users",
      icon: Users,
      label: language === "rw" ? "Abakoresha" : "Users",
    },
    {
      path: "/admin/analytics",
      icon: BarChart3,
      label: language === "rw" ? "Imibare" : "Analytics",
    },
    {
      path: "/admin/settings",
      icon: Settings,
      label: language === "rw" ? "Igenamiterere" : "Settings",
    },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">O</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-foreground">Odette Admin</h1>
            <p className="text-xs text-muted-foreground">
              {language === "rw" ? "Ubuyobozi" : "Management"}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== "/admin" && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Back to Store */}
      <div className="p-4 border-t border-border">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <Home className="h-5 w-5" />
          <span className="font-medium">
            {language === "rw" ? "Subira mu Iduka" : "Back to Store"}
          </span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
