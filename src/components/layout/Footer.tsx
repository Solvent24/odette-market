import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter Section */}
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-semibold mb-2">
                {language === "rw" ? "Iyandikishe ku makuru" : "Subscribe to our Newsletter"}
              </h3>
              <p className="text-background/70">
                {language === "rw"
                  ? "Habwa amasoko yihariye, ibicuruzwa bishya, n'amakuru y'ubuzima."
                  : "Get exclusive offers, fresh arrivals, and wellness tips delivered to your inbox."}
              </p>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <Input
                type="email"
                placeholder={language === "rw" ? "Andika imeyili yawe" : "Enter your email"}
                className="w-full md:w-72 bg-background/10 border-background/20 text-background placeholder:text-background/50 rounded-full"
              />
              <Button variant="hero" className="whitespace-nowrap">
                {language === "rw" ? "Iyandikishe" : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-xl font-bold">
                Odette<span className="text-primary"> Business</span>
                <span className="text-xs font-sans font-normal text-background/50 ml-1">LTD</span>
              </span>
            </Link>
            <p className="text-background/70 mb-6">
              {language === "rw"
                ? "Ahantu hawe h'ibicuruzwa byiza: Imbuto, isabune y'umwimerere, n'impano zidasanzwe."
                : "Your trusted source for premium fresh fruits, dried fruits, and handcrafted natural soaps."}
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/__gatham"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/250795909669"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">
              {language === "rw" ? "Aho Ugera Vuba" : "Quick Links"}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/shop" className="text-background/70 hover:text-primary transition-colors">
                  {language === "rw" ? "Gura Byose" : "Shop All"}
                </Link>
              </li>
              <li>
                <Link to="/shop?new=true" className="text-background/70 hover:text-primary transition-colors">
                  {language === "rw" ? "Ibicuruzwa Bishya" : "New Arrivals"}
                </Link>
              </li>
              <li>
                <Link to="/shop?sale=true" className="text-background/70 hover:text-primary transition-colors">
                  {language === "rw" ? "Iguzwe" : "Sale"}
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-background/70 hover:text-primary transition-colors">
                  {language === "rw" ? "Igenamiterere" : "Settings"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-lg mb-4">
              {language === "rw" ? "Serivisi z'Umukiriya" : "Customer Service"}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/orders" className="text-background/70 hover:text-primary transition-colors">
                  {language === "rw" ? "Amateka y'Ubusabe" : "Order History"}
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-background/70 hover:text-primary transition-colors">
                  {language === "rw" ? "Konti Yanjye" : "My Account"}
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/250795909669"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/70 hover:text-primary transition-colors"
                >
                  {language === "rw" ? "Twandikire" : "Contact Us"}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">
              {language === "rw" ? "Twandikire" : "Contact Us"}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-background/70">
                  Nyamagabe - Gasaka, Rwanda
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href="tel:+250795909669" className="text-background/70 hover:text-primary transition-colors">
                  +250 795 909 669
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-primary shrink-0" />
                <a
                  href="https://wa.me/250795909669"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/70 hover:text-primary transition-colors"
                >
                  WhatsApp: +250 795 909 669
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Instagram className="h-5 w-5 text-primary shrink-0" />
                <a
                  href="https://www.instagram.com/__gatham"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/70 hover:text-primary transition-colors"
                >
                  @__gatham
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href="mailto:info@odettebusiness.com" className="text-background/70 hover:text-primary transition-colors">
                  info@odettebusiness.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/60">
            <p>© 2025 Odette Business LTD. {language === "rw" ? "Uburenganzira bwose burabitswe." : "All rights reserved."}</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                {language === "rw" ? "Politiki y'Ibanga" : "Privacy Policy"}
              </Link>
              <Link to="/terms" className="hover:text-primary transition-colors">
                {language === "rw" ? "Amategeko" : "Terms of Service"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
