import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, MapPin, Lock, Save, Settings } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Profile {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

export default function Account() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile>({
    username: "",
    full_name: "",
    avatar_url: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user?.id)
      .maybeSingle();

    if (data) {
      setProfile({
        username: data.username,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
      });
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        username: profile.username,
        full_name: profile.full_name,
      })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully!");
    }
    setIsSaving(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Please Sign In</h1>
          <p className="text-muted-foreground mb-6">
            Sign in to view your account
          </p>
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        <div className="container mx-auto px-4 py-8">
          <h1 className="section-heading mb-8">My Account</h1>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="font-semibold">{profile.full_name || profile.username || "User"}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>

                <nav className="space-y-2">
                  <Link
                    to="/orders"
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <MapPin className="h-4 w-4" />
                    Order History
                  </Link>
                  <Link
                    to="/wishlist"
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Wishlist
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-destructive/10 text-destructive transition-colors w-full text-left"
                  >
                    <Lock className="h-4 w-4" />
                    Sign Out
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="profile">
                <TabsList className="mb-6">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <div className="bg-card rounded-2xl p-6 shadow-card">
                    <h2 className="font-semibold text-lg mb-6">Profile Information</h2>

                    {isLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-12 bg-secondary rounded animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              value={profile.username || ""}
                              onChange={(e) =>
                                setProfile({ ...profile, username: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                              id="fullName"
                              value={profile.full_name || ""}
                              onChange={(e) =>
                                setProfile({ ...profile, full_name: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" value={user.email || ""} disabled />
                          <p className="text-xs text-muted-foreground mt-1">
                            Email cannot be changed
                          </p>
                        </div>

                        <Button onClick={handleSave} disabled={isSaving}>
                          <Save className="h-4 w-4 mr-2" />
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="security">
                  <div className="bg-card rounded-2xl p-6 shadow-card">
                    <h2 className="font-semibold text-lg mb-6">Security Settings</h2>

                    <div className="space-y-6">
                      <div>
                        <Label>Password</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Update your password to keep your account secure
                        </p>
                        <Button variant="outline">Change Password</Button>
                      </div>

                      <div className="pt-6 border-t">
                        <h3 className="font-medium text-destructive mb-2">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Permanently delete your account and all associated data
                        </p>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}