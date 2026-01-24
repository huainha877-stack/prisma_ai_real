import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { DocumentList } from '@/components/DocumentList';
import { DocumentUpload } from '@/components/DocumentUpload';
import { DocumentChat } from '@/components/DocumentChat';
import { UtilitySubOptions } from '@/components/UtilitySubOptions';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Plus, 
  Loader2,
  Stethoscope,
  GraduationCap,
  Zap,
  FileText,
  FolderOpen
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  extracted_text: string;
  summary: string | null;
  created_at: string;
}

const categoryInfo: Record<string, { title: string; icon: JSX.Element; color: string }> = {
  medical: {
    title: 'Medical Reports',
    icon: <Stethoscope className="w-5 h-5" />,
    color: 'text-red-600 bg-red-100'
  },
  education: {
    title: 'Education / School Notes',
    icon: <GraduationCap className="w-5 h-5" />,
    color: 'text-amber-600 bg-amber-100'
  },
  utility: {
    title: 'Utility Bills',
    icon: <Zap className="w-5 h-5" />,
    color: 'text-blue-600 bg-blue-100'
  },
  insurance: {
    title: 'Insurance & Legal Papers',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-purple-600 bg-purple-100'
  },
  others: {
    title: 'Others',
    icon: <FolderOpen className="w-5 h-5" />,
    color: 'text-gray-600 bg-gray-100'
  }
};

export default function Category() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showUtilityOptions, setShowUtilityOptions] = useState(false);
  const [selectedUtilityType, setSelectedUtilityType] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${category.color}`}>
            {category.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              {category.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {documents.length} {documents.length === 1 ? 'document' : 'documents'}
            </p>
          </div>
          <Button onClick={handleUploadClick} className="gap-2">
            <Plus className="w-4 h-4" />
            Upload Image
          </Button>
        </div>

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
