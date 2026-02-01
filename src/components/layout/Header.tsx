import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageToggle from "@/components/LanguageToggle";

const categories = [
  { name: { rw: "Imbuto Nshya", en: "Fresh Fruits" }, slug: "fresh-fruits" },
  { name: { rw: "Imbuto Zumye", en: "Dried Fruits" }, slug: "dried-fruits" },
  { name: { rw: "Isabune y'Umwimerere", en: "Natural Soaps" }, slug: "natural-soaps" },
  { name: { rw: "Impano", en: "Gift Sets" }, slug: "gift-sets" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAdmin, signOut } = useAuth();
  const { itemCount } = useCart();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      {/* Top banner */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
        {language === "rw"
          ? "Kohereza ku buntu ku busabe burenga RWF 50,000 | Koresha kode WELCOME10"
          : "Free shipping on orders over RWF 50,000 | Use code WELCOME10 for 10% off"}
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl lg:text-2xl font-bold text-foreground">
              Odette<span className="text-primary"> Business</span>
              <span className="text-xs font-sans font-normal text-muted-foreground ml-1">LTD</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className="nav-link font-medium">
              {t("home")}
            </Link>
            <Link to="/shop" className="nav-link font-medium">
              {t("shopNow")}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="nav-link font-medium flex items-center gap-1">
                {t("categories")} <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 animate-slide-down">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.slug} asChild>
                    <Link to={`/shop?category=${category.slug}`}>
                      {category.name[language]}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/shop?sale=true" className="nav-link font-medium text-destructive">
              {t("sale")}
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-11 bg-secondary/50 border-0 rounded-full focus-visible:ring-primary/30"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Language Toggle */}
            <LanguageToggle />

            {/* Settings */}
            <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
              <Link to="/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>

            {/* Wishlist */}
            {user && (
              <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
                <Link to="/wishlist">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>
            )}

            {/* Cart */}
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 animate-slide-down">
                  <DropdownMenuItem asChild>
                    <Link to="/account">{t("myAccount")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">{t("orderHistory")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist">{t("wishlist")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      {language === "rw" ? "Igenamiterere" : "Settings"}
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="text-primary font-medium">
                          {t("adminDashboard")}
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    {t("signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/auth">{t("signIn")}</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth?mode=signup">{t("signUp")}</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border py-4 animate-slide-down">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 h-11 bg-secondary/50 border-0 rounded-full"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="py-2 px-4 rounded-lg hover:bg-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("home")}
              </Link>
              <Link
                to="/shop"
                className="py-2 px-4 rounded-lg hover:bg-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("shopNow")}
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/shop?category=${category.slug}`}
                  className="py-2 px-4 rounded-lg hover:bg-secondary transition-colors pl-8"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name[language]}
                </Link>
              ))}
              <Link
                to="/shop?sale=true"
                className="py-2 px-4 rounded-lg hover:bg-secondary transition-colors text-destructive"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("sale")}
              </Link>
              <Link
                to="/settings"
                className="py-2 px-4 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-4 w-4" />
                {language === "rw" ? "Igenamiterere" : "Settings"}
              </Link>
              {!user && (
                <div className="flex gap-2 pt-4 border-t border-border mt-2">
                  <Button variant="outline" asChild className="flex-1">
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      {t("signIn")}
                    </Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link to="/auth?mode=signup" onClick={() => setIsMenuOpen(false)}>
                      {t("signUp")}
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}