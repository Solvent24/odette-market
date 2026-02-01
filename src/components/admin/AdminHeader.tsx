import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Home, LogOut, User, Settings } from "lucide-react";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/hooks/useLanguage";

const AdminHeader = () => {
  const { signOut, user } = useAuth();
  const { language } = useLanguage();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-xl sm:text-2xl font-display font-bold text-primary">
            {language === "rw" ? "Ubuyobozi bwa Odette" : "Odette Admin"}
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <LanguageToggle />

          <Link to="/admin?tab=settings">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">{language === "rw" ? "Igenamiterere" : "Settings"}</span>
            </Button>
          </Link>

          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">{language === "rw" ? "Iduka" : "Store"}</span>
            </Button>
          </Link>
          
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="max-w-[150px] truncate">{user?.email}</span>
          </div>

          <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{language === "rw" ? "Sohoka" : "Logout"}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
