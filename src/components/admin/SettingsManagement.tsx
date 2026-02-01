import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Phone, MessageCircle, CreditCard, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Setting {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string | null;
}

const SettingsManagement = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .order("setting_key");

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.setting_key === key ? { ...s, setting_value: value } : s))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const setting of settings) {
        const { error } = await supabase
          .from("site_settings")
          .update({ setting_value: setting.setting_value })
          .eq("setting_key", setting.setting_key);

        if (error) throw error;
      }

      toast({ title: "Ibikoresho byabitswe neza!" });
    } catch (error: any) {
      toast({
        title: "Ikosa",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getValue = (key: string) => {
    return settings.find((s) => s.setting_key === key)?.setting_value || "";
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contact Numbers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Numero za Telefoni
          </CardTitle>
          <CardDescription>Koresha numero za telefoni n'ubutumwa</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Telefoni Nyamukuru</Label>
            <Input
              value={getValue("phone_number")}
              onChange={(e) => updateSetting("phone_number", e.target.value)}
              placeholder="0783308948"
            />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp</Label>
            <Input
              value={getValue("whatsapp_number")}
              onChange={(e) => updateSetting("whatsapp_number", e.target.value)}
              placeholder="+250783308948"
            />
          </div>
          <div className="space-y-2">
            <Label>Telefoni y'Ibibazo Byihutirwa</Label>
            <Input
              value={getValue("emergency_phone")}
              onChange={(e) => updateSetting("emergency_phone", e.target.value)}
              placeholder="0783308948"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Ibikoresho byo Kwishyura
          </CardTitle>
          <CardDescription>Numero za Mobile Money</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>MTN MoMo Code/Number</Label>
            <Input
              value={getValue("mtn_momo_code")}
              onChange={(e) => updateSetting("mtn_momo_code", e.target.value)}
              placeholder="0783308948"
            />
            <p className="text-xs text-muted-foreground">
              Umukiriya azakoresha: *182*8*1*{getValue("mtn_momo_code") || "code"}*amafaranga#
            </p>
          </div>
          <div className="space-y-2">
            <Label>Airtel Money Number</Label>
            <Input
              value={getValue("airtel_money_code")}
              onChange={(e) => updateSetting("airtel_money_code", e.target.value)}
              placeholder="0783308948"
            />
          </div>
        </CardContent>
      </Card>

      {/* Language & Currency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Ururimi n'Ifaranga
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Ururimi</Label>
            <Select
              value={getValue("language")}
              onValueChange={(value) => updateSetting("language", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Hitamo ururimi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rw">Ikinyarwanda</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Ifaranga</Label>
            <Select
              value={getValue("currency")}
              onValueChange={(value) => {
                updateSetting("currency", value);
                updateSetting("currency_symbol", value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Hitamo ifaranga" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RWF">RWF (Amafaranga y'u Rwanda)</SelectItem>
                <SelectItem value="USD">USD (Dollar)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Kubika..." : "Bika Ibikoresho"}
        </Button>
      </div>
    </div>
  );
};

export default SettingsManagement;
