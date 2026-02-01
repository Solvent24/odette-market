import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $50",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% protected",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated help",
  },
];

export default function PromoSection() {
  return (
    <>
      {/* Features Bar */}
      <section className="py-12 bg-background border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="flex items-center gap-4 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-16 md:py-24 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto text-center md:text-left">
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-background/20 text-sm font-medium mb-4">
                Limited Time Offer
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Up to 50% Off
              </h2>
              <p className="text-lg opacity-90 max-w-md">
                Don't miss out on our seasonal offers. Shop now and save on fresh fruits and natural soaps.
              </p>
            </div>
            <Button
              variant="heroOutline"
              size="xl"
              asChild
              className="text-primary-foreground border-primary-foreground/30 hover:border-primary-foreground hover:text-primary-foreground"
            >
              <Link to="/shop?sale=true">
                Shop Sale <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
