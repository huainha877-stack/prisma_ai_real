import { useAuth } from '@/hooks/useAuth';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { BenefitsSection } from '@/components/BenefitsSection';
import { DashboardCategories } from '@/components/DashboardCategories';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero section always visible */}
        <HeroSection />
        
        {/* Categories section - different behavior for logged in users */}
        <DashboardCategories isLoggedIn={!!user} />
        
        {/* Benefits section always visible */}
        <BenefitsSection />
      </main>
      <Footer showDisclaimer={false} />
    </div>
  );
};

export default Index;
