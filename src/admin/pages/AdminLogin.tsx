import { useState, useEffect } from "react";
 import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
 import { Lock, Mail, UserPlus } from "lucide-react";

const AdminLogin = () => {
  const { signIn, user, isAdmin, isLoading } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && user && isAdmin) {
      navigate("/admin");
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: language === "rw" ? "Ikosa" : "Error",
        description: error.message,
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const t = {
    title: language === "rw" ? "Kwinjira mu Buyobozi" : "Admin Login",
    description: language === "rw" 
      ? "Injiza imeyili n'ijambo ry'ibanga byawe" 
      : "Enter your email and password to access admin",
    email: language === "rw" ? "Imeyili" : "Email",
    password: language === "rw" ? "Ijambo ry'ibanga" : "Password",
    login: language === "rw" ? "Injira" : "Login",
    loggingIn: language === "rw" ? "Kwinjira..." : "Logging in...",
     noAccount: language === "rw" ? "Nta konti ufite?" : "Don't have an account?",
     register: language === "rw" ? "Kwiyandikisha" : "Register",
     backToStore: language === "rw" ? "Subira mu iduka" : "Back to Store",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4">
            <span className="text-primary-foreground font-bold text-2xl">O</span>
          </div>
          <CardTitle className="text-2xl font-display">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t.loggingIn : t.login}
            </Button>
          </form>

           <div className="mt-6 text-center space-y-3">
             <div>
               <p className="text-sm text-muted-foreground">{t.noAccount}</p>
               <Link 
                 to="/admin/register" 
                 className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-1"
               >
                 <UserPlus className="h-3 w-3" />
                 {t.register}
               </Link>
             </div>
             <Link 
               to="/" 
               className="text-sm text-muted-foreground hover:text-foreground"
             >
               {t.backToStore}
             </Link>
           </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
