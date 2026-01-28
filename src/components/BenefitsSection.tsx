import { 
  Activity, 
  Calendar, 
  Zap, 
  Globe, 
  Mic, 
  Camera,
  Shield,
  Edit3,
  PartyPopper,
  Map,
  Languages
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const benefits = {
  en: [
    {
      icon: PartyPopper,
      title: "Smart Event Archiving",
      description: "Never lose an invitation again. Store wedding cards and event details in a dedicated folder with automatic calendar syncing."
    },
    {
      icon: Map,
      title: "Dynamic Health Mapping",
      description: "See your health progress over time with our 'Journey Map' that compares your old and new medical reports."
    },
    {
      icon: Shield,
      title: "Medical Safety First",
      description: "Get instant summaries of prescriptions and lab results, always backed by professional medical disclaimers."
    },
    {
      icon: Languages,
      title: "Global Communication",
      description: "Effortlessly switch between multiple languages with our flag-integrated language selector."
    },
    {
      icon: Calendar,
      title: "Precision Scheduling",
      description: "Full control over your calendar. Edit or fix any reminder or appointment with a single tap."
    },
    {
      icon: Camera,
      title: "Integrated Multi-Media",
      description: "Use high-speed Camera scanning and Voice-to-Text for a seamless, typing-free experience."
    }
  ],
  ur: [
    {
      icon: PartyPopper,
      title: "سمارٹ ایونٹ آرکائیونگ",
      description: "دعوت نامے کبھی نہ کھوئیں۔ شادی کے کارڈز اور ایونٹ کی تفصیلات کو خودکار کیلنڈر سنکنگ کے ساتھ محفوظ کریں۔"
    },
    {
      icon: Map,
      title: "متحرک صحت میپنگ",
      description: "ہماری 'جرنی میپ' کے ساتھ وقت کے ساتھ اپنی صحت کی پیشرفت دیکھیں جو آپ کی پرانی اور نئی طبی رپورٹس کا موازنہ کرتی ہے۔"
    },
    {
      icon: Shield,
      title: "طبی حفاظت پہلے",
      description: "نسخوں اور لیب نتائج کا فوری خلاصہ حاصل کریں، ہمیشہ پیشہ ورانہ طبی انتباہات کے ساتھ۔"
    },
    {
      icon: Languages,
      title: "عالمی مواصلات",
      description: "ہمارے جھنڈے والے زبان کے انتخاب کے ساتھ آسانی سے متعدد زبانوں میں سوئچ کریں۔"
    },
    {
      icon: Calendar,
      title: "درست شیڈولنگ",
      description: "اپنے کیلنڈر پر مکمل کنٹرول۔ کسی بھی یاددہانی یا ملاقات کو ایک ٹیپ سے ترمیم کریں۔"
    },
    {
      icon: Camera,
      title: "مربوط ملٹی میڈیا",
      description: "تیز رفتار کیمرہ سکیننگ اور وائس ٹو ٹیکسٹ کا استعمال کریں بغیر ٹائپنگ کے تجربے کے لیے۔"
    }
  ],
  hi: [
    {
      icon: PartyPopper,
      title: "स्मार्ट इवेंट आर्काइविंग",
      description: "फिर कभी निमंत्रण न खोएं। शादी के कार्ड और इवेंट विवरण को ऑटोमैटिक कैलेंडर सिंकिंग के साथ सुरक्षित करें।"
    },
    {
      icon: Map,
      title: "डायनामिक हेल्थ मैपिंग",
      description: "हमारे 'जर्नी मैप' के साथ समय के साथ अपनी स्वास्थ्य प्रगति देखें जो आपकी पुरानी और नई मेडिकल रिपोर्ट की तुलना करता है।"
    },
    {
      icon: Shield,
      title: "मेडिकल सेफ्टी फर्स्ट",
      description: "प्रिस्क्रिप्शन और लैब परिणामों का तुरंत सारांश प्राप्त करें, हमेशा पेशेवर मेडिकल डिस्क्लेमर के साथ।"
    },
    {
      icon: Languages,
      title: "ग्लोबल कम्युनिकेशन",
      description: "हमारे फ्लैग-इंटीग्रेटेड लैंग्वेज सेलेक्टर के साथ आसानी से कई भाषाओं में स्विच करें।"
    },
    {
      icon: Calendar,
      title: "प्रिसिजन शेड्यूलिंग",
      description: "अपने कैलेंडर पर पूर्ण नियंत्रण। किसी भी रिमाइंडर या अपॉइंटमेंट को एक टैप से एडिट करें।"
    },
    {
      icon: Camera,
      title: "इंटीग्रेटेड मल्टी-मीडिया",
      description: "हाई-स्पीड कैमरा स्कैनिंग और वॉयस-टू-टेक्स्ट का उपयोग करें बिना टाइपिंग के अनुभव के लिए।"
    }
  ],
  ar: [
    {
      icon: PartyPopper,
      title: "أرشفة الأحداث الذكية",
      description: "لا تفقد دعوة مرة أخرى. خزن بطاقات الزفاف وتفاصيل الأحداث في مجلد مخصص مع مزامنة التقويم التلقائية."
    },
    {
      icon: Map,
      title: "رسم خرائط الصحة الديناميكي",
      description: "شاهد تقدمك الصحي بمرور الوقت مع 'خريطة الرحلة' التي تقارن تقاريرك الطبية القديمة والجديدة."
    },
    {
      icon: Shield,
      title: "السلامة الطبية أولاً",
      description: "احصل على ملخصات فورية للوصفات الطبية ونتائج المختبر، مدعومة دائمًا بإخلاء المسؤولية الطبية المهنية."
    },
    {
      icon: Languages,
      title: "التواصل العالمي",
      description: "انتقل بسهولة بين لغات متعددة باستخدام محدد اللغة المتكامل مع الأعلام."
    },
    {
      icon: Calendar,
      title: "جدولة دقيقة",
      description: "تحكم كامل في تقويمك. عدل أي تذكير أو موعد بنقرة واحدة."
    },
    {
      icon: Camera,
      title: "وسائط متعددة متكاملة",
      description: "استخدم المسح الضوئي عالي السرعة بالكاميرا وتحويل الصوت إلى نص لتجربة سلسة بدون كتابة."
    }
  ]
};

export function BenefitsSection() {
  const { language } = useLanguage();
  const currentBenefits = benefits[language as keyof typeof benefits] || benefits.en;
  const isRTL = language === 'ur' || language === 'ar';

  const sectionTitle = {
    en: 'Your Benefits',
    ur: 'آپ کے فوائد',
    hi: 'आपके लाभ',
    ar: 'فوائدك'
  };

  const sectionDesc = {
    en: 'Discover how Prisma AI simplifies your health, events, and document management',
    ur: 'دریافت کریں کہ پرزما AI آپ کی صحت، ایونٹس اور دستاویزات کے انتظام کو کیسے آسان بناتا ہے',
    hi: 'जानें कि प्रिज्मा AI आपकी स्वास्थ्य, इवेंट्स और दस्तावेज़ प्रबंधन को कैसे सरल बनाता है',
    ar: 'اكتشف كيف يبسط بريزما AI صحتك وأحداثك وإدارة مستنداتك'
  };

  return (
    <section className={`py-16 ${isRTL ? 'rtl' : ''}`}>
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {sectionTitle[language as keyof typeof sectionTitle] || sectionTitle.en}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {sectionDesc[language as keyof typeof sectionDesc] || sectionDesc.en}
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
