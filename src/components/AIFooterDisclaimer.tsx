import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const disclaimers = {
  en: "Ai can make mistakes, so double-check it.",
  ur: "جیمنی غلطیاں کر سکتا ہے، اس لیے دوبارہ چیک کریں۔",
  hi: "जेमिनी गलतियाँ कर सकता है, इसलिए दोबारा जांच लें।",
  ar: "قد يخطئ جيميني، لذا تحقق مرة أخرى."
};

export function AIFooterDisclaimer() {
  const { language } = useLanguage();
  const isRTL = language === 'ur' || language === 'ar';
  const disclaimer = disclaimers[language as keyof typeof disclaimers] || disclaimers.en;

  return (
    <div className={`flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground ${isRTL ? 'rtl' : ''}`}>
      <AlertCircle className="w-3.5 h-3.5" />
      <span>{disclaimer}</span>
    </div>
  );
}
