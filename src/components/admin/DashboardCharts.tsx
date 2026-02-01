import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  stock: number;
  category_id: string | null;
}

interface Category {
  id: string;
  name: string;
}

const COLORS = ["hsl(15, 85%, 65%)", "hsl(25, 60%, 55%)", "hsl(40, 75%, 55%)", "hsl(30, 25%, 50%)"];

const DashboardCharts = () => {
  const [revenueData, setRevenueData] = useState<{ date: string; revenue: number }[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<{ name: string; value: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; products: number }[]>([]);
  const [stockData, setStockData] = useState<{ name: string; stock: number }[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // Fetch orders for revenue and status charts
        const { data: orders } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: true });

        // Fetch products and categories
        const { data: products } = await supabase.from("products").select("*");
        const { data: categories } = await supabase.from("categories").select("*");

        if (orders) {
          // Revenue by day (last 7 days)
          const last7Days = [...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split("T")[0];
          });

          const revenueByDay = last7Days.map((date) => {
            const dayOrders = orders.filter(
              (o) => o.created_at.split("T")[0] === date
            );
            return {
              date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
              revenue: dayOrders.reduce((sum, o) => sum + Number(o.total), 0),
            };
          });
          setRevenueData(revenueByDay);

          // Order status distribution
          const statusCounts = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          setOrderStatusData(
            Object.entries(statusCounts).map(([name, value]) => ({
              name: name.charAt(0).toUpperCase() + name.slice(1),
              value,
            }))
          );
        }

        if (products && categories) {
          // Products by category
          const categoryProducts = categories.map((cat) => ({
            name: cat.name,
            products: products.filter((p) => p.category_id === cat.id).length,
          }));
          setCategoryData(categoryProducts);

          // Top 5 products by stock (for inventory overview)
          const topProducts = [...products]
            .sort((a, b) => b.stock - a.stock)
            .slice(0, 5)
            .map((p) => ({
              name: p.name.length > 15 ? p.name.slice(0, 15) + "..." : p.name,
              stock: p.stock,
            }));
          setStockData(topProducts);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(15, 85%, 65%)"
                strokeWidth={3}
                dot={{ fill: "hsl(15, 85%, 65%)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Order Status Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Products by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Products by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="products" fill="hsl(25, 60%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Stock Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Top Products by Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis
                dataKey="name"
                type="category"
                stroke="hsl(var(--muted-foreground))"
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="stock" fill="hsl(40, 75%, 55%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
