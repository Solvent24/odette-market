import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import DashboardCharts from "@/components/admin/DashboardCharts";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  pendingOrders: number;
  lowStockProducts: number;
}

const Dashboard = () => {
  const { formatPrice } = useSiteSettings();
  const { language } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          supabase.from("products").select("id, stock, price"),
          supabase.from("orders").select("id, total, status"),
          supabase.from("profiles").select("id"),
        ]);

        const products = productsRes.data || [];
        const orders = ordersRes.data || [];
        const users = usersRes.data || [];

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue: orders.reduce((sum, o) => sum + Number(o.total), 0),
          totalUsers: users.length,
          pendingOrders: orders.filter((o) => o.status === "pending").length,
          lowStockProducts: products.filter((p) => p.stock < 10).length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const t = {
    dashboard: language === "rw" ? "Incamake" : "Dashboard",
    totalProducts: language === "rw" ? "Ibicuruzwa Byose" : "Total Products",
    totalOrders: language === "rw" ? "Ubusabe Bwose" : "Total Orders",
    totalRevenue: language === "rw" ? "Amafaranga Yose" : "Total Revenue",
    users: language === "rw" ? "Abakoresha" : "Users",
    pending: language === "rw" ? "Bitegereje" : "Pending",
    lowStock: language === "rw" ? "Stock Nke" : "Low Stock",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">{t.dashboard}</h1>
        <p className="text-muted-foreground mt-1">
          {language === "rw" ? "Reba uko iduka ryawe rigenda" : "Monitor your store performance"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              {t.totalProducts}
            </CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {loadingStats ? "..." : stats.totalProducts}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              {t.totalOrders}
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {loadingStats ? "..." : stats.totalOrders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              {t.totalRevenue}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {loadingStats ? "..." : formatPrice(stats.totalRevenue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              {t.users}
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {loadingStats ? "..." : stats.totalUsers}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              {t.pending}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-accent">
              {loadingStats ? "..." : stats.pendingOrders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              {t.lowStock}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-destructive">
              {loadingStats ? "..." : stats.lowStockProducts}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <DashboardCharts />
    </div>
  );
};

export default Dashboard;
