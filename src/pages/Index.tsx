import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import ProductMarquee from "@/components/home/ProductMarquee";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoSection from "@/components/home/PromoSection";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        <HeroSection />
        <ProductMarquee />
        <CategoriesSection />
        <FeaturedProducts />
        <PromoSection />
      </main>
      <Footer />
    </div>
  );
}
