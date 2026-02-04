import { useLanguage } from "@/hooks/useLanguage";
import OrdersManagement from "@/components/admin/OrdersManagement";

const Orders = () => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">
          {language === "rw" ? "Gucunga Ubusabe" : "Orders Management"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === "rw" ? "Reba no guhindura imimerere y'ubusabe" : "View and update order status"}
        </p>
      </div>
      <OrdersManagement />
    </div>
  );
};

export default Orders;
