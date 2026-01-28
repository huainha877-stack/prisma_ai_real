import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const disclaimers = {
  en: "Please consult with a doctor before taking Result.",
  ur: "ان ادویات کے استعمال سے پہلے ڈاکٹر سے مشورہ ضرور کریں۔",
  hi: "इन दवाइयों को लेने से पहले कृपया डॉक्टर से सलाह लें।",
  ar: "يرجى استشارة الطبيب قبل تناول هذه الأدوية."
};

interface MedicalDisclaimerProps {
  className?: string;
}

export function MedicalDisclaimer({ className = '' }: MedicalDisclaimerProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ur' || language === 'ar';
  const disclaimer = disclaimers[language as keyof typeof disclaimers] || disclaimers.en;

  return (
    <div className={`flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl ${isRTL ? 'rtl text-right' : ''} ${className}`}>
      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
        {disclaimer}
      </p>
    </div>
  );
}
