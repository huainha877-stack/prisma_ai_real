import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { CategoryCard } from '@/components/CategoryCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Stethoscope, 
  GraduationCap, 
  Zap, 
  FileText, 
  FolderOpen,
  Loader2 
} from 'lucide-react';

interface CategoryCount {
  medical: number;
  education: number;
  utility: number;
  insurance: number;
  others: number;
}

const categories = [
  {
    id: 'medical' as const,
    title: 'Medical Reports',
    description: 'Health records, prescriptions, and lab results',
    icon: <Stethoscope className="w-6 h-6" />
  },
  {
    id: 'education' as const,
    title: 'Education / School Notes',
    description: 'Academic documents and study materials',
    icon: <GraduationCap className="w-6 h-6" />
  },
  {
    id: 'utility' as const,
    title: 'Utility Bills',
    description: 'Electricity, water, internet, and phone bills',
    icon: <Zap className="w-6 h-6" />
  },
  {
    id: 'insurance' as const,
    title: 'Insurance & Legal Papers',
    description: 'Policies, contracts, and legal documents',
    icon: <FileText className="w-6 h-6" />
  },
  {
    id: 'others' as const,
    title: 'Others',
    description: 'Miscellaneous documents and files',
    icon: <FolderOpen className="w-6 h-6" />
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [counts, setCounts] = useState<CategoryCount>({
    medical: 0,
    education: 0,
    utility: 0,
    insurance: 0,
    others: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCounts();
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
        others: 0
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back
        </h1>
        <p className="text-muted-foreground">
          Select a category to view or upload documents
        </p>
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
              documentCount={counts[category.id]}
              category={category.id}
              onClick={() => navigate(`/category/${category.id}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
