import { useLanguage } from "@/hooks/useLanguage";
import ProductsManagement from "@/components/admin/ProductsManagement";

const Products = () => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">
          {language === "rw" ? "Gucunga Ibicuruzwa" : "Products Management"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === "rw" ? "Ongeraho, hindura, cyangwa siba ibicuruzwa" : "Add, edit, or delete products"}
        </p>
      </div>
      <ProductsManagement />
    </div>
  );
};

export default Products;
