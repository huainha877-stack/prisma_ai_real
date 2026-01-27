import { 
  Activity, 
  Calendar, 
  Zap, 
  Globe, 
  Mic, 
  Camera,
  Shield,
  Edit3
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const benefits = {
  en: [
    {
      icon: Activity,
      title: "Comprehensive Health Tracking",
      description: "Seamlessly transform your medical reports into a visual Health Journey Map to track your recovery and progress."
    },
    {
      icon: Calendar,
      title: "Smart Hajj Planner",
      description: "Organize your pilgrimage with automated event marking, calendar reminders, and flexible scheduling."
    },
    {
      icon: Zap,
      title: "Instant Medical Insights",
      description: "Get immediate breakdowns of your lab results and suggested medications with professional safety disclaimers."
    },
    {
      icon: Globe,
      title: "Multilingual Accessibility",
      description: "Communicate in your preferred language—our AI understands and responds in major global languages including Urdu, English, Hindi, and Arabic."
    },
    {
      icon: Mic,
      title: "Hands-Free Interaction",
      description: "Use Voice Typing and Camera Scan features for a faster, more efficient experience without manual typing."
    },
    {
      icon: Edit3,
      title: "Secure & Flexible Management",
      description: "Easily edit or delete your appointments and reminders to ensure your schedule is always accurate."
    }
  ],
  ur: [
    {
      icon: Activity,
      title: "جامع صحت کی نگرانی",
      description: "اپنی طبی رپورٹس کو صحت کے سفر کے نقشے میں تبدیل کریں اور اپنی صحت یابی کو ٹریک کریں۔"
    },
    {
      icon: Calendar,
      title: "سمارٹ حج پلانر",
      description: "اپنے حج کو خودکار ایونٹ مارکنگ، کیلنڈر یاددہانیوں اور لچکدار شیڈولنگ کے ساتھ منظم کریں۔"
    },
    {
      icon: Zap,
      title: "فوری طبی بصیرت",
      description: "اپنی لیب رپورٹس کی فوری تفصیل اور تجویز کردہ ادویات حفاظتی انتباہات کے ساتھ حاصل کریں۔"
    },
    {
      icon: Globe,
      title: "کثیر لسانی رسائی",
      description: "اپنی پسندیدہ زبان میں بات چیت کریں - ہماری AI اردو، انگریزی، ہندی اور عربی میں جواب دیتی ہے۔"
    },
    {
      icon: Mic,
      title: "ہینڈز فری تعامل",
      description: "وائس ٹائپنگ اور کیمرہ سکین فیچرز کا استعمال کریں بغیر ٹائپنگ کے تیز تجربے کے لیے۔"
    },
    {
      icon: Edit3,
      title: "محفوظ اور لچکدار انتظام",
      description: "اپنی ملاقاتوں اور یاددہانیوں کو آسانی سے ترمیم یا حذف کریں۔"
    }
  ],
  hi: [
    {
      icon: Activity,
      title: "व्यापक स्वास्थ्य ट्रैकिंग",
      description: "अपनी मेडिकल रिपोर्ट्स को विजुअल हेल्थ जर्नी मैप में बदलें और अपनी रिकवरी ट्रैक करें।"
    },
    {
      icon: Calendar,
      title: "स्मार्ट हज प्लानर",
      description: "ऑटोमेटेड इवेंट मार्किंग, कैलेंडर रिमाइंडर्स और फ्लेक्सिबल शेड्यूलिंग के साथ अपनी तीर्थयात्रा प्लान करें।"
    },
    {
      icon: Zap,
      title: "तत्काल चिकित्सा अंतर्दृष्टि",
      description: "अपनी लैब रिपोर्ट्स का तुरंत विश्लेषण और सुझाई गई दवाइयां सुरक्षा चेतावनियों के साथ प्राप्त करें।"
    },
    {
      icon: Globe,
      title: "बहुभाषी पहुंच",
      description: "अपनी पसंदीदा भाषा में संवाद करें - हमारी AI उर्दू, अंग्रेजी, हिंदी और अरबी में जवाब देती है।"
    },
    {
      icon: Mic,
      title: "हैंड्स-फ्री इंटरैक्शन",
      description: "टाइपिंग के बिना तेज अनुभव के लिए वॉयस टाइपिंग और कैमरा स्कैन फीचर्स का उपयोग करें।"
    },
    {
      icon: Edit3,
      title: "सुरक्षित और लचीला प्रबंधन",
      description: "अपनी अपॉइंटमेंट्स और रिमाइंडर्स को आसानी से एडिट या डिलीट करें।"
    }
  ],
  ar: [
    {
      icon: Activity,
      title: "تتبع صحي شامل",
      description: "حول تقاريرك الطبية إلى خريطة رحلة صحية مرئية لتتبع تعافيك وتقدمك."
    },
    {
      icon: Calendar,
      title: "مخطط الحج الذكي",
      description: "نظم حجك مع وضع علامات الأحداث التلقائية وتذكيرات التقويم والجدولة المرنة."
    },
    {
      icon: Zap,
      title: "رؤى طبية فورية",
      description: "احصل على تحليل فوري لنتائج المختبر والأدوية المقترحة مع إخلاء المسؤولية المهنية."
    },
    {
      icon: Globe,
      title: "إمكانية الوصول متعددة اللغات",
      description: "تواصل بلغتك المفضلة - الذكاء الاصطناعي يفهم ويستجيب بالأردية والإنجليزية والهندية والعربية."
    },
    {
      icon: Mic,
      title: "تفاعل بدون استخدام اليدين",
      description: "استخدم ميزات الكتابة الصوتية ومسح الكاميرا لتجربة أسرع بدون كتابة يدوية."
    },
    {
      icon: Edit3,
      title: "إدارة آمنة ومرنة",
      description: "عدل أو احذف مواعيدك وتذكيراتك بسهولة لضمان دقة جدولك دائمًا."
    }
  ]
};

export function BenefitsSection() {
  const { language } = useLanguage();
  const currentBenefits = benefits[language as keyof typeof benefits] || benefits.en;
  const isRTL = language === 'ur' || language === 'ar';

  return (
    <section className={`py-16 ${isRTL ? 'rtl' : ''}`}>
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === 'ur' ? 'آپ کے فوائد' : 
             language === 'hi' ? 'आपके लाभ' : 
             language === 'ar' ? 'فوائدك' : 
             'Your Benefits'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === 'ur' ? 'دریافت کریں کہ پرزما AI آپ کی صحت اور سفری منصوبہ بندی کو کیسے آسان بناتا ہے' :
             language === 'hi' ? 'जानें कि प्रिज्मा AI आपकी स्वास्थ्य और यात्रा योजना को कैसे सरल बनाता है' :
             language === 'ar' ? 'اكتشف كيف يبسط بريزما AI صحتك وتخطيط سفرك' :
             'Discover how Prisma AI simplifies your health and travel planning'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentBenefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all hover:shadow-soft-lg animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
