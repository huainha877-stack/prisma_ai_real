import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Calendar, User, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificationBell } from '@/components/NotificationBell';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/hooks/useLanguage';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <header className="glass border-b border-border sticky top-0 z-50">
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img src="/logo.png" alt="PrismaAI" className="w-9 h-9" />
          <span className="text-xl font-semibold text-gradient">{t('app.name')}</span>
        </button>

        <div className="flex items-center gap-1">
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
      </div>
    </header>
  );
}
