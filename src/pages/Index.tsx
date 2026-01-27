import { useAuth } from '@/hooks/useAuth';
import Dashboard from './Dashboard';
import { LandingHero } from '@/components/LandingHero';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show landing page with hero for all users, but Dashboard content for logged-in users
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {user ? <Dashboard /> : <LandingHero />}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
