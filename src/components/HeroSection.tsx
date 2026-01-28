import { useState } from 'react';
import { Sparkles, ArrowRight, Target, Zap, Shield, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AnimatedRobot } from '@/components/AnimatedRobot';
import { AnimatedBilling } from '@/components/AnimatedBilling';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const heroTexts = {
  en: {
    badge: "Ultimate AI Hub – 5 Powerful Categories",
    title1: "Unlock Your",
    title2: "Creative Potential",
    description: "PrismaAI brings together powerful AI tools – from document analysis to intelligent chat. Transform your documents into actionable insights with our cutting-edge tools.",
    exploreAI: "Explore AI",
    getStarted: "Get Started",
    modalTitle: "Welcome to",
    modalSubtitle: "Your Complete Guide to AI-Powered Document Management",
    purpose: "App Purpose",
    ourPurpose: "Our Purpose",
    ourPurposeDesc: "PrismaAI is a comprehensive AI-powered document suite designed to democratize access to cutting-edge artificial intelligence tools. We empower users to analyze documents, extract text, detect important dates, and much more — all in one unified platform.",
    categories: "5 Document Categories",
    categoriesDesc: "Organize your documents across Medical Reports, Education Notes, Utility Bills, Insurance & Legal Papers, and Others. Each category maintains its own history for easy access and management.",
    benefits: "Your Benefits",
    smartOCR: "Smart OCR",
    smartOCRDesc: "Extract text from any document image",
    instantAnalysis: "Instant Analysis",
    instantAnalysisDesc: "Get summaries and insights in seconds",
    dateDetection: "Date Detection",
    dateDetectionDesc: "Auto-detect dates and create reminders",
    privacyFirst: "Privacy First",
    privacyFirstDesc: "Images never stored, only text saved",
    createAccount: "Create Account",
    gotIt: "Got it!",
    close: "Close"
  },
  ur: {
    badge: "الٹیمیٹ AI حب – 5 طاقتور زمرے",
    title1: "اپنی",
    title2: "تخلیقی صلاحیت کھولیں",
    description: "پرزما AI طاقتور AI ٹولز کو اکٹھا کرتا ہے – دستاویز کے تجزیے سے لے کر ذہین چیٹ تک۔ اپنی دستاویزات کو قابل عمل بصیرت میں تبدیل کریں۔",
    exploreAI: "AI دریافت کریں",
    getStarted: "شروع کریں",
    modalTitle: "خوش آمدید",
    modalSubtitle: "AI سے چلنے والے دستاویز کے انتظام کے لیے آپ کی مکمل گائیڈ",
    purpose: "ایپ کا مقصد",
    ourPurpose: "ہمارا مقصد",
    ourPurposeDesc: "پرزما AI ایک جامع AI سے چلنے والا دستاویز سوٹ ہے جو جدید ترین مصنوعی ذہانت کے ٹولز تک رسائی کو جمہوری بنانے کے لیے ڈیزائن کیا گیا ہے۔",
    categories: "5 دستاویز کے زمرے",
    categoriesDesc: "اپنی دستاویزات کو میڈیکل رپورٹس، تعلیمی نوٹس، یوٹیلیٹی بلز، انشورنس اور قانونی کاغذات اور دیگر میں منظم کریں۔",
    benefits: "آپ کے فوائد",
    smartOCR: "سمارٹ OCR",
    smartOCRDesc: "کسی بھی دستاویز کی تصویر سے متن نکالیں",
    instantAnalysis: "فوری تجزیہ",
    instantAnalysisDesc: "سیکنڈوں میں خلاصے اور بصیرت حاصل کریں",
    dateDetection: "تاریخ کا پتہ لگانا",
    dateDetectionDesc: "خود بخود تاریخوں کا پتہ لگائیں اور یاد دہانیاں بنائیں",
    privacyFirst: "رازداری پہلے",
    privacyFirstDesc: "تصاویر کبھی محفوظ نہیں ہوتیں، صرف متن محفوظ ہوتا ہے",
    createAccount: "اکاؤنٹ بنائیں",
    gotIt: "سمجھ گیا!",
    close: "بند کریں"
  },
  hi: {
    badge: "अल्टीमेट AI हब – 5 शक्तिशाली श्रेणियां",
    title1: "अपनी",
    title2: "रचनात्मक क्षमता अनलॉक करें",
    description: "प्रिज्मा AI शक्तिशाली AI टूल्स को एक साथ लाता है – दस्तावेज़ विश्लेषण से लेकर बुद्धिमान चैट तक। अपने दस्तावेज़ों को कार्रवाई योग्य अंतर्दृष्टि में बदलें।",
    exploreAI: "AI खोजें",
    getStarted: "शुरू करें",
    modalTitle: "स्वागत है",
    modalSubtitle: "AI-संचालित दस्तावेज़ प्रबंधन के लिए आपकी पूर्ण गाइड",
    purpose: "ऐप का उद्देश्य",
    ourPurpose: "हमारा उद्देश्य",
    ourPurposeDesc: "प्रिज्मा AI एक व्यापक AI-संचालित दस्तावेज़ सूट है जो अत्याधुनिक कृत्रिम बुद्धिमत्ता उपकरणों तक पहुंच को लोकतांत्रिक बनाने के लिए डिज़ाइन किया गया है।",
    categories: "5 दस्तावेज़ श्रेणियां",
    categoriesDesc: "अपने दस्तावेज़ों को मेडिकल रिपोर्ट, शिक्षा नोट्स, यूटिलिटी बिल, बीमा और कानूनी कागजात और अन्य में व्यवस्थित करें।",
    benefits: "आपके लाभ",
    smartOCR: "स्मार्ट OCR",
    smartOCRDesc: "किसी भी दस्तावेज़ छवि से टेक्स्ट निकालें",
    instantAnalysis: "तत्काल विश्लेषण",
    instantAnalysisDesc: "सेकंड में सारांश और अंतर्दृष्टि प्राप्त करें",
    dateDetection: "तिथि पहचान",
    dateDetectionDesc: "स्वचालित रूप से तिथियों का पता लगाएं और रिमाइंडर बनाएं",
    privacyFirst: "गोपनीयता पहले",
    privacyFirstDesc: "छवियां कभी संग्रहीत नहीं होतीं, केवल टेक्स्ट सहेजा जाता है",
    createAccount: "खाता बनाएं",
    gotIt: "समझ गया!",
    close: "बंद करें"
  },
  ar: {
    badge: "مركز AI النهائي – 5 فئات قوية",
    title1: "أطلق العنان",
    title2: "لإمكاناتك الإبداعية",
    description: "يجمع بريزما AI أدوات AI القوية معًا – من تحليل المستندات إلى الدردشة الذكية. حول مستنداتك إلى رؤى قابلة للتنفيذ.",
    exploreAI: "استكشف AI",
    getStarted: "ابدأ الآن",
    modalTitle: "مرحبًا بك في",
    modalSubtitle: "دليلك الكامل لإدارة المستندات المدعومة بالذكاء الاصطناعي",
    purpose: "غرض التطبيق",
    ourPurpose: "هدفنا",
    ourPurposeDesc: "بريزما AI هو مجموعة شاملة من المستندات المدعومة بالذكاء الاصطناعي مصممة لإضفاء الطابع الديمقراطي على الوصول إلى أدوات الذكاء الاصطناعي المتطورة.",
    categories: "5 فئات للمستندات",
    categoriesDesc: "نظم مستنداتك عبر التقارير الطبية، ملاحظات التعليم، فواتير الخدمات، التأمين والأوراق القانونية، وغيرها.",
    benefits: "فوائدك",
    smartOCR: "OCR ذكي",
    smartOCRDesc: "استخراج النص من أي صورة مستند",
    instantAnalysis: "تحليل فوري",
    instantAnalysisDesc: "احصل على ملخصات ورؤى في ثوانٍ",
    dateDetection: "اكتشاف التاريخ",
    dateDetectionDesc: "اكتشاف التواريخ تلقائيًا وإنشاء تذكيرات",
    privacyFirst: "الخصوصية أولاً",
    privacyFirstDesc: "الصور لا تُخزن أبدًا، فقط النص يُحفظ",
    createAccount: "إنشاء حساب",
    gotIt: "فهمت!",
    close: "إغلاق"
  }
};

export function HeroSection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  
  const texts = heroTexts[language as keyof typeof heroTexts] || heroTexts.en;

  return (
    <section className={`relative overflow-hidden ${isRTL ? 'rtl' : ''}`}>
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50" />
      
      <div className="container max-w-6xl mx-auto px-4 pt-20 pb-16 relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-foreground/80">{texts.badge}</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6 text-foreground">
          {texts.title1}{' '}
          <span className="text-gradient">{texts.title2}</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-10">
          {texts.description}
        </p>

        {/* Animated Characters */}
        <div className="flex items-center justify-center gap-8 mb-12">
          <AnimatedRobot />
          <AnimatedBilling />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button
            size="lg"
            onClick={() => setShowModal(true)}
            className="gap-2 px-8 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-5 h-5" />
            {texts.exploreAI}
          </Button>
          {!user && (
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/auth')}
              className="gap-2 px-8 border-border hover:bg-secondary"
            >
              {texts.getStarted}
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Explore AI Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {texts.modalTitle} <span className="text-gradient">PrismaAI</span>
            </DialogTitle>
            <p className="text-muted-foreground text-center text-sm">
              {texts.modalSubtitle}
            </p>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="text-xs font-semibold text-primary tracking-wider uppercase">{texts.purpose}</div>
            
            <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{texts.ourPurpose}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {texts.ourPurposeDesc}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{texts.categories}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {texts.categoriesDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="text-xs font-semibold text-primary tracking-wider uppercase mt-6">{texts.benefits}</div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium text-sm mb-1">{texts.smartOCR}</h4>
                <p className="text-xs text-muted-foreground">{texts.smartOCRDesc}</p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium text-sm mb-1">{texts.instantAnalysis}</h4>
                <p className="text-xs text-muted-foreground">{texts.instantAnalysisDesc}</p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium text-sm mb-1">{texts.dateDetection}</h4>
                <p className="text-xs text-muted-foreground">{texts.dateDetectionDesc}</p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium text-sm mb-1">{texts.privacyFirst}</h4>
                <p className="text-xs text-muted-foreground">{texts.privacyFirstDesc}</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {!user && (
                <Button
                  onClick={() => {
                    setShowModal(false);
                    navigate('/auth');
                  }}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  {texts.createAccount}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex-1 border-border hover:bg-secondary"
              >
                {user ? texts.gotIt : texts.close}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}