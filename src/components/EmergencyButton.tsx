import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { getTranslation, Language } from "@/lib/translations";

const EmergencyButton = () => {
  const { settings } = useSiteSettings();
  const lang = (settings.language || "rw") as Language;
  const t = (key: any) => getTranslation(lang, key);

  const handleEmergencyCall = () => {
    window.location.href = `tel:${settings.emergency_phone}`;
  };

  return (
    <Button
      onClick={handleEmergencyCall}
      variant="destructive"
      size="sm"
      className="fixed bottom-20 right-4 z-40 rounded-full shadow-lg gap-2"
    >
      <Phone className="h-4 w-4" />
      {t("emergencyCall")}
    </Button>
  );
};

export default EmergencyButton;
