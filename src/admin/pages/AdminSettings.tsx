import { useLanguage } from "@/hooks/useLanguage";
import SettingsManagement from "@/components/admin/SettingsManagement";

const AdminSettings = () => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">
          {language === "rw" ? "Igenamiterere ry'Urubuga" : "Site Settings"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === "rw" 
            ? "Hindura igenamiterere ry'urubuga" 
            : "Configure your site settings"}
        </p>
      </div>
      <SettingsManagement />
    </div>
  );
};

export default AdminSettings;
