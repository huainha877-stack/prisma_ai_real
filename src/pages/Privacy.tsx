import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/hooks/useLanguage';

const privacyTexts = {
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: January 2026',
    intro: 'At Prisma AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our document management application.',
    sections: [
      {
        title: 'Information We Collect',
        content: 'We collect information you provide directly to us, such as when you create an account, upload documents, or contact us for support. This includes your name, email address, and the documents you choose to store with us.'
      },
      {
        title: 'How We Use Your Information',
        content: 'We use the information we collect to provide, maintain, and improve our services, to process your documents using AI technology, to send you notifications about reminders and events, and to respond to your inquiries.'
      },
      {
        title: 'Data Security',
        content: 'We implement appropriate technical and organizational security measures to protect your personal information. All documents are encrypted at rest and in transit. Access to your data is strictly controlled and limited to authorized personnel.'
      },
      {
        title: 'AI Processing',
        content: 'Our AI features analyze your documents to provide summaries, extract key information, and enable intelligent search. This processing is done securely, and we do not share your document content with third parties for their own purposes.'
      },
      {
        title: 'Your Rights',
        content: 'You have the right to access, correct, or delete your personal information at any time. You can export your data or request account deletion through your profile settings.'
      },
      {
        title: 'Contact Us',
        content: 'If you have any questions about this Privacy Policy, please contact us at support@prisma-ai.com'
      }
    ]
  },
  ur: {
    title: 'رازداری کی پالیسی',
    lastUpdated: 'آخری اپڈیٹ: جنوری 2026',
    intro: 'پرزما AI میں، ہم آپ کی رازداری کو سنجیدگی سے لیتے ہیں۔ یہ رازداری کی پالیسی بتاتی ہے کہ ہم آپ کی معلومات کیسے جمع، استعمال، اور محفوظ کرتے ہیں۔',
    sections: [
      {
        title: 'ہم کیا معلومات جمع کرتے ہیں',
        content: 'ہم وہ معلومات جمع کرتے ہیں جو آپ براہ راست ہمیں فراہم کرتے ہیں، جیسے اکاؤنٹ بنانا، دستاویزات اپلوڈ کرنا، یا سپورٹ کے لیے رابطہ کرنا۔'
      },
      {
        title: 'ہم آپ کی معلومات کیسے استعمال کرتے ہیں',
        content: 'ہم جمع کردہ معلومات کو اپنی خدمات فراہم کرنے، برقرار رکھنے اور بہتر بنانے کے لیے استعمال کرتے ہیں۔'
      },
      {
        title: 'ڈیٹا سیکیورٹی',
        content: 'ہم آپ کی ذاتی معلومات کی حفاظت کے لیے مناسب تکنیکی اور تنظیمی حفاظتی اقدامات لاگو کرتے ہیں۔'
      },
      {
        title: 'AI پروسیسنگ',
        content: 'ہماری AI خصوصیات آپ کی دستاویزات کا تجزیہ کرتی ہیں تاکہ خلاصے فراہم کریں اور اہم معلومات نکالیں۔'
      },
      {
        title: 'آپ کے حقوق',
        content: 'آپ کو کسی بھی وقت اپنی ذاتی معلومات تک رسائی، درست کرنے یا حذف کرنے کا حق ہے۔'
      },
      {
        title: 'ہم سے رابطہ کریں',
        content: 'اگر آپ کو اس رازداری کی پالیسی کے بارے میں کوئی سوال ہے تو براہ کرم ہم سے رابطہ کریں۔'
      }
    ]
  },
  hi: {
    title: 'गोपनीयता नीति',
    lastUpdated: 'अंतिम अपडेट: जनवरी 2026',
    intro: 'प्रिज्मा AI में, हम आपकी गोपनीयता को गंभीरता से लेते हैं। यह गोपनीयता नीति बताती है कि हम आपकी जानकारी कैसे एकत्र, उपयोग और सुरक्षित करते हैं।',
    sections: [
      {
        title: 'हम कौन सी जानकारी एकत्र करते हैं',
        content: 'हम वह जानकारी एकत्र करते हैं जो आप सीधे हमें प्रदान करते हैं, जैसे खाता बनाना, दस्तावेज़ अपलोड करना।'
      },
      {
        title: 'हम आपकी जानकारी का उपयोग कैसे करते हैं',
        content: 'हम एकत्रित जानकारी का उपयोग अपनी सेवाएं प्रदान करने, बनाए रखने और सुधारने के लिए करते हैं।'
      },
      {
        title: 'डेटा सुरक्षा',
        content: 'हम आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए उचित तकनीकी और संगठनात्मक सुरक्षा उपाय लागू करते हैं।'
      },
      {
        title: 'AI प्रोसेसिंग',
        content: 'हमारी AI सुविधाएं सारांश प्रदान करने और महत्वपूर्ण जानकारी निकालने के लिए आपके दस्तावेज़ों का विश्लेषण करती हैं।'
      },
      {
        title: 'आपके अधिकार',
        content: 'आपको किसी भी समय अपनी व्यक्तिगत जानकारी तक पहुंचने, सही करने या हटाने का अधिकार है।'
      },
      {
        title: 'हमसे संपर्क करें',
        content: 'यदि आपको इस गोपनीयता नीति के बारे में कोई प्रश्न है तो कृपया हमसे संपर्क करें।'
      }
    ]
  },
  ar: {
    title: 'سياسة الخصوصية',
    lastUpdated: 'آخر تحديث: يناير 2026',
    intro: 'في بريزما AI، نأخذ خصوصيتك على محمل الجد. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك.',
    sections: [
      {
        title: 'المعلومات التي نجمعها',
        content: 'نجمع المعلومات التي تقدمها لنا مباشرة، مثل إنشاء حساب أو تحميل المستندات.'
      },
      {
        title: 'كيف نستخدم معلوماتك',
        content: 'نستخدم المعلومات التي نجمعها لتوفير خدماتنا وصيانتها وتحسينها.'
      },
      {
        title: 'أمان البيانات',
        content: 'نطبق تدابير أمنية تقنية وتنظيمية مناسبة لحماية معلوماتك الشخصية.'
      },
      {
        title: 'معالجة الذكاء الاصطناعي',
        content: 'تحلل ميزات الذكاء الاصطناعي لدينا مستنداتك لتقديم الملخصات واستخراج المعلومات الرئيسية.'
      },
      {
        title: 'حقوقك',
        content: 'لديك الحق في الوصول إلى معلوماتك الشخصية أو تصحيحها أو حذفها في أي وقت.'
      },
      {
        title: 'اتصل بنا',
        content: 'إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا.'
      }
    ]
  }
};

export default function Privacy() {
  const { language, isRTL } = useLanguage();
  const texts = privacyTexts[language as keyof typeof privacyTexts] || privacyTexts.en;

  return (
    <div className={`min-h-screen bg-background flex flex-col ${isRTL ? 'rtl' : ''}`}>
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">{texts.title}</h1>
        <p className="text-muted-foreground mb-8">{texts.lastUpdated}</p>
        
        <p className="text-foreground mb-8 leading-relaxed">{texts.intro}</p>
        
        <div className="space-y-8">
          {texts.sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl font-semibold text-foreground mb-3">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer showDisclaimer={false} />
    </div>
  );
}
