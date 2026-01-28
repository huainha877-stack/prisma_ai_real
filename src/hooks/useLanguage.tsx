import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ur' | 'en' | 'ar' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  ur: {
    // Header & Navigation
    'app.name': 'پرزما اے آئی',
    'nav.getStarted': 'شروع کریں',
    'nav.profile': 'پروفائل',
    'nav.reminders': 'یاد دہانیاں',
    'nav.logout': 'لاگ آؤٹ',
    
    // Landing Page
    'landing.badge': 'الٹیمیٹ اے آئی ہب – 5 طاقتور زمرے',
    'landing.title': 'اپنی تخلیقی صلاحیت کو کھولیں',
    'landing.description': 'پرزما اے آئی طاقتور اے آئی ٹولز کو یکجا کرتا ہے – دستاویز کے تجزیے سے لے کر ذہین چیٹ تک۔ اپنی دستاویزات کو ہماری جدید ٹیکنالوجی کے ذریعے قابل عمل بصیرت میں تبدیل کریں۔',
    'landing.exploreAI': 'اے آئی دریافت کریں',
    'landing.welcomeBack': 'خوش آمدید',
    'landing.selectCategory': 'دستاویزات دیکھنے یا اپ لوڈ کرنے کے لیے زمرہ منتخب کریں',
    
    // Categories
    'category.medical': 'طبی رپورٹس',
    'category.medical.desc': 'صحت کے ریکارڈ، نسخے، اور لیب نتائج',
    'category.education': 'تعلیم / اسکول نوٹس',
    'category.education.desc': 'تعلیمی دستاویزات اور مطالعاتی مواد',
    'category.utility': 'یوٹیلیٹی بل',
    'category.utility.desc': 'بجلی، پانی، انٹرنیٹ، اور فون کے بل',
    'category.insurance': 'انشورنس اور قانونی کاغذات',
    'category.insurance.desc': 'پالیسیاں، معاہدے، اور قانونی دستاویزات',
    'category.others': 'دیگر',
    'category.others.desc': 'متفرق دستاویزات اور فائلیں',
    
    // Document Upload
    'upload.title': 'دستاویز اپ لوڈ کریں',
    'upload.dragDrop': 'اپ لوڈ کرنے کے لیے کلک کریں یا ڈریگ اینڈ ڈراپ کریں',
    'upload.fileTypes': 'تصاویر (JPG, PNG)، PDF، یا Word (DOC, DOCX) 10MB تک',
    'upload.takePhoto': 'کیمرے سے تصویر لیں',
    'upload.cancel': 'منسوخ',
    'upload.analyze': 'دستاویز کا تجزیہ کریں',
    'upload.analyzing': 'تجزیہ ہو رہا ہے...',
    'upload.privacy': 'تصاویر صرف تجزیے کے لیے استعمال ہوتی ہیں اور محفوظ نہیں کی جاتیں۔ صرف نکالا گیا متن محفوظ ہوتا ہے۔',
    
    // Modal
    'modal.welcome': 'پرزما اے آئی میں خوش آمدید',
    'modal.guide': 'اے آئی سے چلنے والے دستاویز انتظام کی مکمل رہنمائی',
    'modal.purpose': 'ایپ کا مقصد',
    'modal.ourPurpose': 'ہمارا مقصد',
    'modal.purposeDesc': 'پرزما اے آئی ایک جامع اے آئی سے چلنے والا دستاویز سوٹ ہے جو جدید مصنوعی ذہانت کے ٹولز تک رسائی کو عام کرنے کے لیے ڈیزائن کیا گیا ہے۔',
    'modal.categories': '5 دستاویز کے زمرے',
    'modal.categoriesDesc': 'اپنی دستاویزات کو طبی رپورٹس، تعلیمی نوٹس، یوٹیلیٹی بل، انشورنس اور قانونی کاغذات، اور دیگر میں منظم کریں۔',
    'modal.benefits': 'آپ کے فوائد',
    'modal.smartOCR': 'سمارٹ OCR',
    'modal.smartOCRDesc': 'کسی بھی دستاویز کی تصویر سے متن نکالیں',
    'modal.instantAnalysis': 'فوری تجزیہ',
    'modal.instantAnalysisDesc': 'سیکنڈوں میں خلاصے اور بصیرت حاصل کریں',
    'modal.dateDetection': 'تاریخ کی شناخت',
    'modal.dateDetectionDesc': 'خود بخود تاریخیں شناخت کریں اور یاد دہانیاں بنائیں',
    'modal.privacyFirst': 'پرائیویسی اولین',
    'modal.privacyFirstDesc': 'تصاویر کبھی محفوظ نہیں ہوتیں، صرف متن محفوظ ہوتا ہے',
    'modal.createAccount': 'اکاؤنٹ بنائیں',
    'modal.close': 'بند کریں',
    'modal.gotIt': 'سمجھ گیا!',
    
    // Common
    'common.documents': 'دستاویزات',
    'common.document': 'دستاویز',
    'common.records': 'ریکارڈز',
    'common.viewRecords': 'ریکارڈز دیکھیں',
  },
  en: {
    // Header & Navigation
    'app.name': 'Prisma AI',
    'nav.getStarted': 'Get Started',
    'nav.profile': 'Profile',
    'nav.reminders': 'Reminders',
    'nav.logout': 'Logout',
    
    // Landing Page
    'landing.badge': 'Ultimate AI Hub – 5 Powerful Categories',
    'landing.title': 'Unlock Your Creative Potential',
    'landing.description': 'PrismaAI brings together powerful AI tools – from document analysis to intelligent chat. Transform your documents into actionable insights with our cutting-edge tools.',
    'landing.exploreAI': 'Explore AI',
    'landing.welcomeBack': 'Welcome back',
    'landing.selectCategory': 'Select a category to view or upload documents',
    
    // Categories
    'category.medical': 'Medical Reports',
    'category.medical.desc': 'Health records, prescriptions, and lab results',
    'category.education': 'Education / School Notes',
    'category.education.desc': 'Academic documents and study materials',
    'category.utility': 'Utility Bills',
    'category.utility.desc': 'Electricity, water, internet, and phone bills',
    'category.insurance': 'Insurance & Legal Papers',
    'category.insurance.desc': 'Policies, contracts, and legal documents',
    'category.others': 'Others',
    'category.others.desc': 'Miscellaneous documents and files',
    
    // Document Upload
    'upload.title': 'Upload Document',
    'upload.dragDrop': 'Click to upload or drag and drop',
    'upload.fileTypes': 'Images (JPG, PNG), PDF, or Word (DOC, DOCX) up to 10MB',
    'upload.takePhoto': 'Take Photo with Camera',
    'upload.cancel': 'Cancel',
    'upload.analyze': 'Analyze Document',
    'upload.analyzing': 'Analyzing...',
    'upload.privacy': 'Images are used only for analysis and are not stored. Only extracted text is saved.',
    
    // Modal
    'modal.welcome': 'Welcome to PrismaAI',
    'modal.guide': 'Your Complete Guide to AI-Powered Document Management',
    'modal.purpose': 'App Purpose',
    'modal.ourPurpose': 'Our Purpose',
    'modal.purposeDesc': 'PrismaAI is a comprehensive AI-powered document suite designed to democratize access to cutting-edge artificial intelligence tools.',
    'modal.categories': '5 Document Categories',
    'modal.categoriesDesc': 'Organize your documents across Medical Reports, Education Notes, Utility Bills, Insurance & Legal Papers, and Others.',
    'modal.benefits': 'Your Benefits',
    'modal.smartOCR': 'Smart OCR',
    'modal.smartOCRDesc': 'Extract text from any document image',
    'modal.instantAnalysis': 'Instant Analysis',
    'modal.instantAnalysisDesc': 'Get summaries and insights in seconds',
    'modal.dateDetection': 'Date Detection',
    'modal.dateDetectionDesc': 'Auto-detect dates and create reminders',
    'modal.privacyFirst': 'Privacy First',
    'modal.privacyFirstDesc': 'Images never stored, only text saved',
    'modal.createAccount': 'Create Account',
    'modal.close': 'Close',
    'modal.gotIt': 'Got it!',
    
    // Common
    'common.documents': 'documents',
    'common.document': 'document',
    'common.records': 'records',
    'common.viewRecords': 'View records',
  },
  ar: {
    // Header & Navigation
    'app.name': 'بريزما AI',
    'nav.getStarted': 'ابدأ الآن',
    'nav.profile': 'الملف الشخصي',
    'nav.reminders': 'التذكيرات',
    'nav.logout': 'تسجيل خروج',
    
    // Landing Page
    'landing.badge': 'مركز AI المتكامل – 5 فئات قوية',
    'landing.title': 'أطلق العنان لإمكاناتك الإبداعية',
    'landing.description': 'يجمع بريزما AI أدوات ذكاء اصطناعي قوية - من تحليل المستندات إلى الدردشة الذكية. حول مستنداتك إلى رؤى قابلة للتنفيذ.',
    'landing.exploreAI': 'استكشف AI',
    'landing.welcomeBack': 'مرحباً بعودتك',
    'landing.selectCategory': 'اختر فئة لعرض أو تحميل المستندات',
    
    // Categories
    'category.medical': 'التقارير الطبية',
    'category.medical.desc': 'السجلات الصحية والوصفات ونتائج المختبر',
    'category.education': 'التعليم / ملاحظات المدرسة',
    'category.education.desc': 'المستندات الأكاديمية والمواد الدراسية',
    'category.utility': 'فواتير الخدمات',
    'category.utility.desc': 'الكهرباء والماء والإنترنت وفواتير الهاتف',
    'category.insurance': 'التأمين والأوراق القانونية',
    'category.insurance.desc': 'السياسات والعقود والمستندات القانونية',
    'category.others': 'أخرى',
    'category.others.desc': 'المستندات والملفات المتنوعة',
    
    // Document Upload
    'upload.title': 'تحميل المستند',
    'upload.dragDrop': 'انقر للتحميل أو اسحب وأفلت',
    'upload.fileTypes': 'صور (JPG, PNG)، PDF، أو Word (DOC, DOCX) حتى 10MB',
    'upload.takePhoto': 'التقط صورة بالكاميرا',
    'upload.cancel': 'إلغاء',
    'upload.analyze': 'تحليل المستند',
    'upload.analyzing': 'جاري التحليل...',
    'upload.privacy': 'تُستخدم الصور للتحليل فقط ولا يتم تخزينها. يتم حفظ النص المستخرج فقط.',
    
    // Modal
    'modal.welcome': 'مرحباً في بريزما AI',
    'modal.guide': 'دليلك الكامل لإدارة المستندات بالذكاء الاصطناعي',
    'modal.purpose': 'غرض التطبيق',
    'modal.ourPurpose': 'هدفنا',
    'modal.purposeDesc': 'بريزما AI هي مجموعة شاملة لإدارة المستندات مدعومة بالذكاء الاصطناعي.',
    'modal.categories': '5 فئات للمستندات',
    'modal.categoriesDesc': 'نظم مستنداتك عبر التقارير الطبية، الملاحظات التعليمية، فواتير الخدمات، التأمين والأوراق القانونية، وأخرى.',
    'modal.benefits': 'فوائدك',
    'modal.smartOCR': 'OCR ذكي',
    'modal.smartOCRDesc': 'استخراج النص من أي صورة مستند',
    'modal.instantAnalysis': 'تحليل فوري',
    'modal.instantAnalysisDesc': 'احصل على ملخصات ورؤى في ثوانٍ',
    'modal.dateDetection': 'اكتشاف التاريخ',
    'modal.dateDetectionDesc': 'اكتشف التواريخ تلقائياً وأنشئ تذكيرات',
    'modal.privacyFirst': 'الخصوصية أولاً',
    'modal.privacyFirstDesc': 'الصور لا تُخزن أبداً، فقط النص يُحفظ',
    'modal.createAccount': 'إنشاء حساب',
    'modal.close': 'إغلاق',
    'modal.gotIt': 'فهمت!',
    
    // Common
    'common.documents': 'مستندات',
    'common.document': 'مستند',
    'common.records': 'سجلات',
    'common.viewRecords': 'عرض السجلات',
  },
  hi: {
    // Header & Navigation
    'app.name': 'प्रिज्मा AI',
    'nav.getStarted': 'शुरू करें',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.reminders': 'रिमाइंडर',
    'nav.logout': 'लॉग आउट',
    
    // Landing Page
    'landing.badge': 'अल्टीमेट AI हब – 5 शक्तिशाली श्रेणियां',
    'landing.title': 'अपनी रचनात्मक क्षमता को खोलें',
    'landing.description': 'प्रिज्मा AI शक्तिशाली AI टूल्स को एक साथ लाता है – दस्तावेज़ विश्लेषण से लेकर बुद्धिमान चैट तक। अपने दस्तावेज़ों को हमारी अत्याधुनिक तकनीक के साथ कार्रवाई योग्य अंतर्दृष्टि में बदलें।',
    'landing.exploreAI': 'AI खोजें',
    'landing.welcomeBack': 'वापसी पर स्वागत है',
    'landing.selectCategory': 'दस्तावेज़ देखने या अपलोड करने के लिए एक श्रेणी चुनें',
    
    // Categories
    'category.medical': 'मेडिकल रिपोर्ट',
    'category.medical.desc': 'स्वास्थ्य रिकॉर्ड, प्रिस्क्रिप्शन, और लैब परिणाम',
    'category.education': 'शिक्षा / स्कूल नोट्स',
    'category.education.desc': 'शैक्षणिक दस्तावेज़ और अध्ययन सामग्री',
    'category.utility': 'यूटिलिटी बिल',
    'category.utility.desc': 'बिजली, पानी, इंटरनेट, और फोन बिल',
    'category.insurance': 'बीमा और कानूनी कागजात',
    'category.insurance.desc': 'पॉलिसी, अनुबंध, और कानूनी दस्तावेज़',
    'category.others': 'अन्य',
    'category.others.desc': 'विविध दस्तावेज़ और फ़ाइलें',
    
    // Document Upload
    'upload.title': 'दस्तावेज़ अपलोड करें',
    'upload.dragDrop': 'अपलोड करने के लिए क्लिक करें या ड्रैग एंड ड्रॉप करें',
    'upload.fileTypes': 'छवियां (JPG, PNG), PDF, या Word (DOC, DOCX) 10MB तक',
    'upload.takePhoto': 'कैमरे से फोटो लें',
    'upload.cancel': 'रद्द करें',
    'upload.analyze': 'दस्तावेज़ का विश्लेषण करें',
    'upload.analyzing': 'विश्लेषण हो रहा है...',
    'upload.privacy': 'छवियों का उपयोग केवल विश्लेषण के लिए किया जाता है और संग्रहीत नहीं किया जाता है। केवल निकाला गया टेक्स्ट सहेजा जाता है।',
    
    // Modal
    'modal.welcome': 'प्रिज्मा AI में आपका स्वागत है',
    'modal.guide': 'AI-संचालित दस्तावेज़ प्रबंधन के लिए आपका पूर्ण मार्गदर्शक',
    'modal.purpose': 'ऐप का उद्देश्य',
    'modal.ourPurpose': 'हमारा उद्देश्य',
    'modal.purposeDesc': 'प्रिज्मा AI एक व्यापक AI-संचालित दस्तावेज़ सूट है।',
    'modal.categories': '5 दस्तावेज़ श्रेणियां',
    'modal.categoriesDesc': 'अपने दस्तावेज़ों को मेडिकल रिपोर्ट, शिक्षा नोट्स, यूटिलिटी बिल, बीमा और कानूनी कागजात, और अन्य में व्यवस्थित करें।',
    'modal.benefits': 'आपके लाभ',
    'modal.smartOCR': 'स्मार्ट OCR',
    'modal.smartOCRDesc': 'किसी भी दस्तावेज़ छवि से टेक्स्ट निकालें',
    'modal.instantAnalysis': 'तत्काल विश्लेषण',
    'modal.instantAnalysisDesc': 'सेकंड में सारांश और अंतर्दृष्टि प्राप्त करें',
    'modal.dateDetection': 'तिथि पहचान',
    'modal.dateDetectionDesc': 'स्वचालित रूप से तिथियां पहचानें और रिमाइंडर बनाएं',
    'modal.privacyFirst': 'गोपनीयता पहले',
    'modal.privacyFirstDesc': 'छवियां कभी संग्रहीत नहीं होतीं, केवल टेक्स्ट सहेजा जाता है',
    'modal.createAccount': 'खाता बनाएं',
    'modal.close': 'बंद करें',
    'modal.gotIt': 'समझ गया!',
    
    // Common
    'common.documents': 'दस्तावेज़',
    'common.document': 'दस्तावेज़',
    'common.records': 'रिकॉर्ड',
    'common.viewRecords': 'रिकॉर्ड देखें',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('prisma-language');
    return (saved as Language) || 'en'; // Default to English
  });

  useEffect(() => {
    localStorage.setItem('prisma-language', language);
    // Set document direction for RTL languages
    document.documentElement.dir = ['ur', 'ar'].includes(language) ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  const isRTL = ['ur', 'ar'].includes(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export const languageOptions = [
  { code: 'en' as Language, name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ur' as Language, name: 'اردو', nativeName: 'Urdu', flag: '🇵🇰' },
  { code: 'hi' as Language, name: 'हिन्दी', nativeName: 'Hindi', flag: '🇮🇳' },
  { code: 'ar' as Language, name: 'العربية', nativeName: 'Arabic', flag: '🇸🇦' },
];
