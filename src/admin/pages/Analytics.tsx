import { useLanguage } from "@/hooks/useLanguage";
import DashboardCharts from "@/components/admin/DashboardCharts";

const Analytics = () => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">
          {language === "rw" ? "Imibare n'Inyandiko" : "Analytics & Reports"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === "rw" 
            ? "Reba imibare y'iduka ryawe" 
            : "View detailed analytics about your store"}
        </p>
      </div>
      <DashboardCharts />
    </div>
  );
};

export default Analytics;
