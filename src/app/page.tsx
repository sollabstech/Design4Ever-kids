import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import ProductGrid from "@/components/home/ProductGrid";
import PromoBanners from "@/components/home/PromoBanners";
import TrustBadges from "@/components/home/TrustBadges";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <ProductGrid title="Featured Products" />
      <PromoBanners />
      <TrustBadges />
      <ProductGrid title="Best Sellers" />
      <Newsletter />
    </>
  );
}
