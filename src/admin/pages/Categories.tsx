import { useLanguage } from "@/hooks/useLanguage";
import CategoriesManagement from "@/components/admin/CategoriesManagement";

const Categories = () => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">
          {language === "rw" ? "Gucunga Ibyiciro" : "Categories Management"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === "rw" ? "Ongeraho, hindura, cyangwa siba ibyiciro" : "Add, edit, or delete categories"}
        </p>
      </div>
      <CategoriesManagement />
    </div>
  );
};

export default Categories;
