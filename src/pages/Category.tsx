import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { DocumentList } from '@/components/DocumentList';
import { DocumentUpload } from '@/components/DocumentUpload';
import { DocumentChat } from '@/components/DocumentChat';
import { UtilitySubOptions } from '@/components/UtilitySubOptions';
import { CategoryNotes } from '@/components/CategoryNotes';
import { LanguageSelectorInline } from '@/components/LanguageSelectorInline';
import { VoiceTyping } from '@/components/VoiceTyping';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  ArrowLeft, 
  Plus, 
  Loader2,
  Stethoscope,
  GraduationCap,
  Zap,
  FileText,
  FolderOpen,
  Mic
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  extracted_text: string;
  summary: string | null;
  created_at: string;
}

import { PartyPopper } from 'lucide-react';

const categoryInfo: Record<string, { title: string; icon: JSX.Element; color: string }> = {
  medical: {
    title: 'Medical Reports',
    icon: <Stethoscope className="w-5 h-5" />,
    color: 'text-red-600 bg-red-100 dark:bg-red-900/30'
  },
  education: {
    title: 'Education / School Notes',
    icon: <GraduationCap className="w-5 h-5" />,
    color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30'
  },
  utility: {
    title: 'Utility Bills',
    icon: <Zap className="w-5 h-5" />,
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
  },
  insurance: {
    title: 'Insurance & Legal Papers',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30'
  },
  others: {
    title: 'Others',
    icon: <FolderOpen className="w-5 h-5" />,
    color: 'text-gray-600 bg-gray-100 dark:bg-gray-800/30'
  },
  events: {
    title: 'Events Folder',
    icon: <PartyPopper className="w-5 h-5" />,
    color: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30'
  }
};

export default function Category() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language, isRTL } = useLanguage();
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showUtilityOptions, setShowUtilityOptions] = useState(false);
  const [selectedUtilityType, setSelectedUtilityType] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showNotes, setShowNotes] = useState(false);

  const category = categoryId && categoryInfo[categoryId];

  useEffect(() => {
    if (categoryId) {
      loadDocuments();
    }
  }, [categoryId]);

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('category', categoryId as any)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDocuments(prev => prev.filter(d => d.id !== id));
      toast({
        title: "Document deleted",
        description: "The document has been removed",
      });
    } catch (err) {
      console.error('Delete error:', err);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive"
      });
    }
  };

  const handleUploadClick = () => {
    // Show utility sub-options for utility category
    if (categoryId === 'utility') {
      setShowUtilityOptions(true);
    } else {
      setShowUpload(true);
    }
  };

  const handleUtilitySelect = (subType: string) => {
    setSelectedUtilityType(subType);
    setShowUtilityOptions(false);
    setShowUpload(true);
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Category not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go back
          </Button>
        </div>
      </div>
    );
  }

  if (selectedDocument) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <DocumentChat 
          document={selectedDocument} 
          onBack={() => setSelectedDocument(null)} 
        />
      </div>
    );
  }

  // Translations for Category page
  const categoryTranslations = {
    en: { upload: 'Upload', documents: 'documents', document: 'document', notes: 'Notes' },
    ur: { upload: 'اپ لوڈ', documents: 'دستاویزات', document: 'دستاویز', notes: 'نوٹس' },
    hi: { upload: 'अपलोड', documents: 'दस्तावेज़', document: 'दस्तावेज़', notes: 'नोट्स' },
    ar: { upload: 'تحميل', documents: 'مستندات', document: 'مستند', notes: 'ملاحظات' },
  };
  const ct = categoryTranslations[language as keyof typeof categoryTranslations] || categoryTranslations.en;

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : ''}`}>
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6 animate-fade-in flex-wrap">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${category.color}`}>
            {category.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground">
              {category.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {documents.length} {documents.length === 1 ? ct.document : ct.documents}
            </p>
          </div>
        </div>

        {/* Action Bar with Language & Voice */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <LanguageSelectorInline />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowNotes(!showNotes)}
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            {ct.notes}
          </Button>
          <div className="flex-1" />
          <Button onClick={handleUploadClick} className="gap-2">
            <Plus className="w-4 h-4" />
            {ct.upload}
          </Button>
        </div>

        {/* Notes Section */}
        {showNotes && categoryId && (
          <div className="mb-6 animate-fade-in">
            <CategoryNotes categoryId={categoryId} />
          </div>
        )}

        {/* Medical Disclaimer - only show for medical category */}
        {categoryId === 'medical' && (
          <MedicalDisclaimer className="mb-6 animate-fade-in" />
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <DocumentList
            documents={documents}
            onSelect={(doc) => setSelectedDocument(doc as Document)}
            onDelete={handleDelete}
          />
        )}
      </main>

      {showUtilityOptions && (
        <UtilitySubOptions
          onSelect={handleUtilitySelect}
          onClose={() => setShowUtilityOptions(false)}
        />
      )}

      {showUpload && categoryId && (
        <DocumentUpload
          category={categoryId}
          onSuccess={() => {
            setShowUpload(false);
            setSelectedUtilityType(null);
            loadDocuments();
          }}
          onClose={() => {
            setShowUpload(false);
            setSelectedUtilityType(null);
          }}
        />
      )}
    </div>
  );
}
