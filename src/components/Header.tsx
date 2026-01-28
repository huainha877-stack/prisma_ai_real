import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Calendar, User, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificationBell } from '@/components/NotificationBell';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/hooks/useLanguage';
import logo from '@/assets/logo.png';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="glass border-b border-border sticky top-0 z-50">
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button 
          onClick={() => handleNavigation('/')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img src={logo} alt="Prisma AI" className="w-9 h-9 object-contain" />
          <span className="text-xl font-semibold text-gradient">{t('app.name')}</span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <LanguageSelector />
          <ThemeToggle />
          
          {user ? (
            <>
              <NotificationBell />
              
              <Button
                variant={location.pathname === '/reminders' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => navigate('/reminders')}
                className="hover:bg-primary/10"
              >
                <Calendar className="w-5 h-5" />
              </Button>
              
              <Button
                variant={location.pathname === '/profile' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => navigate('/profile')}
                className="hover:bg-primary/10"
              >
                <User className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <Button
              onClick={() => navigate('/auth')}
              className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {t('nav.getStarted')}
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="hover:bg-primary/10"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background absolute left-0 right-0 top-16 z-50 shadow-lg animate-fade-in">
          <div className="container max-w-6xl mx-auto px-4 py-4 flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2 pb-3 border-b border-border">
              <LanguageSelector />
            </div>
            
            {user ? (
              <>
                <Button
                  variant={location.pathname === '/' ? 'secondary' : 'ghost'}
                  onClick={() => handleNavigation('/')}
                  className="justify-start gap-3 w-full"
                >
                  <img src={logo} alt="" className="w-5 h-5" />
                  Home
                </Button>
                
                <Button
                  variant={location.pathname === '/reminders' ? 'secondary' : 'ghost'}
                  onClick={() => handleNavigation('/reminders')}
                  className="justify-start gap-3 w-full"
                >
                  <Calendar className="w-5 h-5" />
                  Reminders
                </Button>
                
                <Button
                  variant={location.pathname === '/profile' ? 'secondary' : 'ghost'}
                  onClick={() => handleNavigation('/profile')}
                  className="justify-start gap-3 w-full"
                >
                  <User className="w-5 h-5" />
                  Profile
                </Button>

                <div className="flex items-center justify-center pt-3 border-t border-border">
                  <NotificationBell />
                </div>
                
                <Button
                  variant="ghost"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start gap-3 w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={() => handleNavigation('/auth')}
                className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 w-full"
              >
                {t('nav.getStarted')}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
