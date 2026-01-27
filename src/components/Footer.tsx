import { Home, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

const footerTexts = {
  en: {
    designedBy: "Designed and Developed by",
    home: "Home",
    privacy: "Privacy",
    terms: "Terms",
    support: "Support",
    aiDisclaimer: "Ai can make mistakes, so double-check it."
  },
  ur: {
    designedBy: "ڈیزائن اور تیار کردہ",
    home: "ہوم",
    privacy: "رازداری",
    terms: "شرائط",
    support: "سپورٹ",
    aiDisclaimer: "جیمنی غلطیاں کر سکتا ہے، اس لیے دوبارہ چیک کریں۔"
  },
  hi: {
    designedBy: "द्वारा डिज़ाइन और विकसित",
    home: "होم",
    privacy: "गोपनीयता",
    terms: "शर्तें",
    support: "सहायता",
    aiDisclaimer: "जेमिनी गलतियाँ कर सकता है, इसलिए दोबारा जांच लें।"
  },
  ar: {
    designedBy: "تصميم وتطوير بواسطة",
    home: "الرئيسية",
    privacy: "الخصوصية",
    terms: "الشروط",
    support: "الدعم",
    aiDisclaimer: "قد يخطئ جيميني، لذا تحقق مرة أخرى."
  }
};

export function Footer() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRTL = language === 'ur' || language === 'ar';
  const texts = footerTexts[language as keyof typeof footerTexts] || footerTexts.en;

  return (
    <footer className={`border-t border-border bg-card/50 backdrop-blur-sm ${isRTL ? 'rtl' : ''}`}>
      <div className="container max-w-6xl mx-auto px-4 py-6">
        {/* Logo and Brand */}
        <div className="flex items-center justify-center gap-3 mb-4 pb-4 border-b border-border">
          <img src="/logo.png" alt="PrismaAI" className="w-8 h-8" />
          <span className="text-lg font-semibold text-gradient">PrismaAI</span>
        </div>

        {/* AI Disclaimer */}
        <div className="flex items-center justify-center gap-2 mb-4 pb-4 border-b border-border">
          <AlertCircle className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{texts.aiDisclaimer}</span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="PrismaAI" className="w-8 h-8" />
            <span className="text-lg font-semibold text-gradient">Prisma AI</span>
          </div>

          {/* Credit */}
          <p className="text-sm text-muted-foreground">
            {texts.designedBy}{' '}
            <span className="text-primary font-medium">Abeha Inam</span>
          </p>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="w-4 h-4" />
              {texts.home}
            </button>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {texts.privacy}
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {texts.terms}
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {texts.support}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
