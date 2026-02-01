import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  phone_number: string;
  whatsapp_number: string;
  mtn_momo_code: string;
  airtel_money_code: string;
  emergency_phone: string;
  currency: string;
  currency_symbol: string;
  language: string;
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  formatPrice: (price: number) => string;
  updateSetting: (key: string, value: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  phone_number: "0783308948",
  whatsapp_number: "+250783308948",
  mtn_momo_code: "0783308948",
  airtel_money_code: "0783308948",
  emergency_phone: "0783308948",
  currency: "RWF",
  currency_symbol: "RWF",
  language: "rw",
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("setting_key, setting_value");

      if (error) throw error;

      const settingsMap: Partial<SiteSettings> = {};
      data?.forEach((item: { setting_key: string; setting_value: string }) => {
        settingsMap[item.setting_key as keyof SiteSettings] = item.setting_value;
      });

      setSettings({ ...defaultSettings, ...settingsMap });
    } catch (error) {
      console.error("Error fetching site settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const formatPrice = (price: number) => {
    return `${settings.currency_symbol} ${price.toLocaleString()}`;
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({ setting_value: value })
        .eq("setting_key", key);

      if (error) throw error;

      setSettings((prev) => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error("Error updating setting:", error);
      throw error;
    }
  };

  return (
    <SiteSettingsContext.Provider
      value={{ settings, isLoading, formatPrice, updateSetting, refetch: fetchSettings }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  }
  return context;
}
