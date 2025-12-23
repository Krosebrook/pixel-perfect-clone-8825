import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { DashboardPreview } from "@/components/DashboardPreview";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <DashboardPreview />
      <Footer />
    </main>
  );
};

export default Index;
