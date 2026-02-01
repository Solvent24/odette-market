import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.jpg";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Fresh fruits and natural soaps"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6 animate-fade-in backdrop-blur-sm">
            Fresh & Natural Products
          </span>
          
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-background mb-6 leading-tight animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Nature's Best <br />
            <span className="text-primary">Fruits & Soaps</span>
          </h1>
          
          <p className="text-lg md:text-xl text-background/80 mb-8 max-w-lg animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Discover our premium selection of fresh fruits, dried fruits, and handcrafted natural soaps. Quality you can trust.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/shop">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild className="text-background border-background/30 hover:border-background hover:text-background">
              <Link to="/shop?new=true">
                New Arrivals
              </Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 mt-12 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center gap-2 text-background/80">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-sm">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm">Fresh Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-background/80">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-sm">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-background/80">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-sm">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
