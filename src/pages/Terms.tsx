import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/hooks/useLanguage';

const termsTexts = {
  en: {
    title: 'Terms of Service',
    lastUpdated: 'Last updated: January 2026',
    intro: 'Welcome to Prisma AI. By using our service, you agree to these terms. Please read them carefully.',
    sections: [
      {
        title: 'Acceptance of Terms',
        content: 'By accessing or using Prisma AI, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.'
      },
      {
        title: 'Use License',
        content: 'Permission is granted to temporarily use Prisma AI for personal, non-commercial document management purposes. This license does not include the right to modify, copy, or distribute the software, or use it for any commercial purpose without our written consent.'
      },
      {
        title: 'User Accounts',
        content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized access or use of your account.'
      },
      {
        title: 'Content Ownership',
        content: 'You retain all ownership rights to the documents and content you upload to Prisma AI. We do not claim any ownership over your content. However, you grant us a limited license to process and store your content to provide our services.'
      },
      {
        title: 'AI Services',
        content: 'Our AI-powered features are provided for convenience and should not be relied upon as the sole source of truth. While we strive for accuracy, AI-generated summaries and analyses may contain errors. Always verify important information from original sources.'
      },
      {
        title: 'Prohibited Uses',
        content: 'You may not use Prisma AI for any illegal purpose, to upload malicious content, to infringe on intellectual property rights, or to attempt to gain unauthorized access to our systems.'
      },
      {
        title: 'Service Modifications',
        content: 'We reserve the right to modify, suspend, or discontinue any part of our service at any time. We will provide reasonable notice of significant changes when possible.'
      },
      {
        title: 'Limitation of Liability',
        content: 'Prisma AI is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.'
      },
      {
        title: 'Contact',
        content: 'For any questions regarding these Terms of Service, please contact us at legal@prisma-ai.com'
      }
    ]
  },
  ur: {
    title: 'سروس کی شرائط',
    lastUpdated: 'آخری اپڈیٹ: جنوری 2026',
    intro: 'پرزما AI میں خوش آمدید۔ ہماری سروس استعمال کرکے، آپ ان شرائط سے متفق ہیں۔ براہ کرم انہیں غور سے پڑھیں۔',
    sections: [
      {
        title: 'شرائط کی قبولیت',
        content: 'پرزما AI تک رسائی یا استعمال کرکے، آپ ان سروس کی شرائط سے بندھے ہوئے ہیں۔'
      },
      {
        title: 'استعمال کا لائسنس',
        content: 'ذاتی، غیر تجارتی دستاویز کے انتظام کے مقاصد کے لیے پرزما AI کا عارضی استعمال کرنے کی اجازت دی گئی ہے۔'
      },
      {
        title: 'صارف اکاؤنٹس',
        content: 'آپ اپنے اکاؤنٹ کی اسناد کی رازداری برقرار رکھنے کے ذمہ دار ہیں۔'
      },
      {
        title: 'مواد کی ملکیت',
        content: 'آپ اپنی اپلوڈ کردہ دستاویزات کی تمام ملکیت کے حقوق برقرار رکھتے ہیں۔'
      },
      {
        title: 'AI خدمات',
        content: 'ہماری AI خصوصیات سہولت کے لیے فراہم کی گئی ہیں اور صرف سچائی کے ذریعہ کے طور پر استعمال نہیں ہونی چاہیے۔'
      },
      {
        title: 'ممنوعہ استعمال',
        content: 'آپ پرزما AI کو کسی غیر قانونی مقصد کے لیے استعمال نہیں کر سکتے۔'
      },
      {
        title: 'سروس میں تبدیلیاں',
        content: 'ہم کسی بھی وقت اپنی سروس کے کسی بھی حصے میں ترمیم کرنے کا حق محفوظ رکھتے ہیں۔'
      },
      {
        title: 'ذمہ داری کی حد',
        content: 'پرزما AI "جیسا ہے" فراہم کی گئی ہے بغیر کسی قسم کی وارنٹی کے۔'
      },
      {
        title: 'رابطہ',
        content: 'ان شرائط کے بارے میں کسی سوال کے لیے براہ کرم ہم سے رابطہ کریں۔'
      }
    ]
  },
  hi: {
    title: 'सेवा की शर्तें',
    lastUpdated: 'अंतिम अपडेट: जनवरी 2026',
    intro: 'प्रिज्मा AI में आपका स्वागत है। हमारी सेवा का उपयोग करके, आप इन शर्तों से सहमत हैं। कृपया इन्हें ध्यान से पढ़ें।',
    sections: [
      {
        title: 'शर्तों की स्वीकृति',
        content: 'प्रिज्मा AI तक पहुंचने या उपयोग करके, आप इन सेवा की शर्तों से बंधे हैं।'
      },
      {
        title: 'उपयोग लाइसेंस',
        content: 'व्यक्तिगत, गैर-व्यावसायिक दस्तावेज़ प्रबंधन उद्देश्यों के लिए प्रिज्मा AI का अस्थायी रूप से उपयोग करने की अनुमति है।'
      },
      {
        title: 'उपयोगकर्ता खाते',
        content: 'आप अपने खाते की क्रेडेंशियल्स की गोपनीयता बनाए रखने के लिए जिम्मेदार हैं।'
      },
      {
        title: 'सामग्री स्वामित्व',
        content: 'आप अपने अपलोड किए गए दस्तावेज़ों के सभी स्वामित्व अधिकार बनाए रखते हैं।'
      },
      {
        title: 'AI सेवाएं',
        content: 'हमारी AI सुविधाएं सुविधा के लिए प्रदान की जाती हैं और केवल सत्य के स्रोत के रूप में नहीं।'
      },
      {
        title: 'निषिद्ध उपयोग',
        content: 'आप प्रिज्मा AI का उपयोग किसी अवैध उद्देश्य के लिए नहीं कर सकते।'
      },
      {
        title: 'सेवा संशोधन',
        content: 'हम किसी भी समय अपनी सेवा के किसी भी हिस्से को संशोधित करने का अधिकार सुरक्षित रखते हैं।'
      },
      {
        title: 'दायित्व की सीमा',
        content: 'प्रिज्मा AI बिना किसी वारंटी के "जैसा है" प्रदान की जाती है।'
      },
      {
        title: 'संपर्क',
        content: 'इन शर्तों के बारे में किसी भी प्रश्न के लिए कृपया हमसे संपर्क करें।'
      }
    ]
  },
  ar: {
    title: 'شروط الخدمة',
    lastUpdated: 'آخر تحديث: يناير 2026',
    intro: 'مرحبًا بك في بريزما AI. باستخدام خدمتنا، فإنك توافق على هذه الشروط. يرجى قراءتها بعناية.',
    sections: [
      {
        title: 'قبول الشروط',
        content: 'من خلال الوصول إلى بريزما AI أو استخدامها، فإنك توافق على الالتزام بشروط الخدمة هذه.'
      },
      {
        title: 'رخصة الاستخدام',
        content: 'يُسمح باستخدام بريزما AI مؤقتًا لأغراض إدارة المستندات الشخصية وغير التجارية.'
      },
      {
        title: 'حسابات المستخدمين',
        content: 'أنت مسؤول عن الحفاظ على سرية بيانات اعتماد حسابك.'
      },
      {
        title: 'ملكية المحتوى',
        content: 'تحتفظ بجميع حقوق الملكية للمستندات التي تقوم بتحميلها.'
      },
      {
        title: 'خدمات الذكاء الاصطناعي',
        content: 'يتم توفير ميزات الذكاء الاصطناعي لدينا للراحة ولا ينبغي الاعتماد عليها كمصدر وحيد للحقيقة.'
      },
      {
        title: 'الاستخدامات المحظورة',
        content: 'لا يجوز لك استخدام بريزما AI لأي غرض غير قانوني.'
      },
      {
        title: 'تعديلات الخدمة',
        content: 'نحتفظ بالحق في تعديل أي جزء من خدمتنا في أي وقت.'
      },
      {
        title: 'تحديد المسؤولية',
        content: 'يتم توفير بريزما AI "كما هي" دون أي ضمانات من أي نوع.'
      },
      {
        title: 'اتصل بنا',
        content: 'لأي أسئلة حول شروط الخدمة هذه، يرجى الاتصال بنا.'
      }
    ]
  }
};

export default function Terms() {
  const { language, isRTL } = useLanguage();
  const texts = termsTexts[language as keyof typeof termsTexts] || termsTexts.en;

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
