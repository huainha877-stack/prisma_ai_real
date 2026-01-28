import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryCard } from '@/components/CategoryCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Stethoscope, 
  GraduationCap, 
  Zap, 
  FileText, 
  FolderOpen,
  Loader2,
  PartyPopper
} from 'lucide-react';

interface CategoryCount {
  medical: number;
  education: number;
  utility: number;
  insurance: number;
  others: number;
  events: number;
}

const categoryTexts = {
  en: {
    welcomeBack: "Welcome back",
    selectCategory: "Select a category to view or upload documents",
    welcomeGuest: "Document Categories",
    signInToAccess: "Sign in to access your documents",
    medical: { title: "Medical Reports", description: "Health records, prescriptions, and lab results" },
    education: { title: "Education / School Notes", description: "Academic documents and study materials" },
    utility: { title: "Utility Bills", description: "Electricity, water, internet, and phone bills" },
    insurance: { title: "Insurance & Legal Papers", description: "Policies, contracts, and legal documents" },
    others: { title: "Others", description: "Miscellaneous documents and files" },
    events: { title: "Events Folder", description: "Wedding cards, invitations, and special occasions" }
  },
  ur: {
    welcomeBack: "خوش آمدید",
    selectCategory: "دستاویزات دیکھنے یا اپ لوڈ کرنے کے لیے زمرہ منتخب کریں",
    welcomeGuest: "دستاویزات کے زمرے",
    signInToAccess: "اپنی دستاویزات تک رسائی کے لیے سائن ان کریں",
    medical: { title: "طبی رپورٹس", description: "صحت کے ریکارڈ، نسخے اور لیب کے نتائج" },
    education: { title: "تعلیم / اسکول نوٹس", description: "تعلیمی دستاویزات اور مطالعاتی مواد" },
    utility: { title: "یوٹیلیٹی بلز", description: "بجلی، پانی، انٹرنیٹ اور فون کے بل" },
    insurance: { title: "انشورنس اور قانونی کاغذات", description: "پالیسیاں، معاہدے اور قانونی دستاویزات" },
    others: { title: "دیگر", description: "متفرق دستاویزات اور فائلیں" },
    events: { title: "ایونٹس فولڈر", description: "شادی کے کارڈز، دعوت نامے اور خاص مواقع" }
  },
  hi: {
    welcomeBack: "वापसी पर स्वागत है",
    selectCategory: "दस्तावेज़ देखने या अपलोड करने के लिए श्रेणी चुनें",
    welcomeGuest: "दस्तावेज़ श्रेणियां",
    signInToAccess: "अपने दस्तावेज़ों तक पहुंचने के लिए साइन इन करें",
    medical: { title: "मेडिकल रिपोर्ट", description: "स्वास्थ्य रिकॉर्ड, प्रिस्क्रिप्शन और लैब परिणाम" },
    education: { title: "शिक्षा / स्कूल नोट्स", description: "अकादमिक दस्तावेज़ और अध्ययन सामग्री" },
    utility: { title: "यूटिलिटी बिल", description: "बिजली, पानी, इंटरनेट और फोन बिल" },
    insurance: { title: "बीमा और कानूनी कागजात", description: "पॉलिसियां, अनुबंध और कानूनी दस्तावेज़" },
    others: { title: "अन्य", description: "विविध दस्तावेज़ और फाइलें" },
    events: { title: "इवेंट्स फोल्डर", description: "शादी के कार्ड, निमंत्रण और विशेष अवसर" }
  },
  ar: {
    welcomeBack: "مرحبًا بعودتك",
    selectCategory: "حدد فئة لعرض المستندات أو تحميلها",
    welcomeGuest: "فئات المستندات",
    signInToAccess: "سجل الدخول للوصول إلى مستنداتك",
    medical: { title: "التقارير الطبية", description: "السجلات الصحية والوصفات الطبية ونتائج المختبر" },
    education: { title: "ملاحظات التعليم/المدرسة", description: "المستندات الأكاديمية ومواد الدراسة" },
    utility: { title: "فواتير الخدمات", description: "فواتير الكهرباء والماء والإنترنت والهاتف" },
    insurance: { title: "التأمين والأوراق القانونية", description: "الوثائق والعقود والمستندات القانونية" },
    others: { title: "أخرى", description: "مستندات وملفات متنوعة" },
    events: { title: "مجلد الأحداث", description: "بطاقات الزفاف والدعوات والمناسبات الخاصة" }
  }
};

interface DashboardCategoriesProps {
  isLoggedIn: boolean;
}

export function DashboardCategories({ isLoggedIn }: DashboardCategoriesProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const [counts, setCounts] = useState<CategoryCount>({
    medical: 0,
    education: 0,
    utility: 0,
    insurance: 0,
    others: 0,
    events: 0
  });
  const [loading, setLoading] = useState(true);

  const texts = categoryTexts[language as keyof typeof categoryTexts] || categoryTexts.en;

  const categories = [
    {
      id: 'medical' as const,
      title: texts.medical.title,
      description: texts.medical.description,
      icon: <Stethoscope className="w-6 h-6" />
    },
    {
      id: 'education' as const,
      title: texts.education.title,
      description: texts.education.description,
      icon: <GraduationCap className="w-6 h-6" />
    },
    {
      id: 'utility' as const,
      title: texts.utility.title,
      description: texts.utility.description,
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: 'insurance' as const,
      title: texts.insurance.title,
      description: texts.insurance.description,
      icon: <FileText className="w-6 h-6" />
    },
    {
      id: 'others' as const,
      title: texts.others.title,
      description: texts.others.description,
      icon: <FolderOpen className="w-6 h-6" />
    },
    {
      id: 'events' as const,
      title: texts.events.title,
      description: texts.events.description,
      icon: <PartyPopper className="w-6 h-6" />
    }
  ];

  useEffect(() => {
    if (user) {
      loadCounts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('category');

      if (error) throw error;

      const newCounts: CategoryCount = {
        medical: 0,
        education: 0,
        utility: 0,
        insurance: 0,
        others: 0,
        events: 0
      };

      data?.forEach((doc) => {
        if (doc.category in newCounts) {
          newCounts[doc.category as keyof CategoryCount]++;
        }
      });

      setCounts(newCounts);
    } catch (err) {
      console.error('Failed to load counts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (isLoggedIn) {
      navigate(`/category/${categoryId}`);
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className={`py-12 relative ${isRTL ? 'rtl' : ''}`}>
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-8 text-center">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {isLoggedIn ? texts.welcomeBack : texts.welcomeGuest}
              </h2>
              <p className="text-muted-foreground">
                {isLoggedIn ? texts.selectCategory : texts.signInToAccess}
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <div 
              key={category.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CategoryCard
                icon={category.icon}
                title={category.title}
                description={category.description}
                documentCount={isLoggedIn ? counts[category.id] : 0}
                category={category.id}
                onClick={() => handleCategoryClick(category.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}