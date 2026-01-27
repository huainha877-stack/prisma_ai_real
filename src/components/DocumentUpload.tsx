import { useState, useRef } from 'react';
import { Upload, Camera, X, Loader2, FileImage, AlertCircle, FileText, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage, languageOptions } from '@/hooks/useLanguage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DocumentUploadProps {
  category: string;
  onSuccess: () => void;
  onClose: () => void;
}

// Supported file types
const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/heic': ['.heic'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
};

const ACCEPT_STRING = 'image/*,application/pdf,.doc,.docx';

export function DocumentUpload({ category, onSuccess, onClose }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDocument, setIsDocument] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('auto');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { language: appLanguage } = useLanguage();

  const isImageFile = (file: File) => file.type.startsWith('image/');
  const isPdfFile = (file: File) => file.type === 'application/pdf';
  const isDocFile = (file: File) => 
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.type === 'application/msword';

  const languageSelectOptions = [
    { code: 'auto', name: 'Auto-Detect' },
    ...languageOptions
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const isValidType = isImageFile(selectedFile) || isPdfFile(selectedFile) || isDocFile(selectedFile);
    if (!isValidType) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image (JPG, PNG), PDF, or Word document (DOC, DOCX)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file under 10MB",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
    setIsDocument(!isImageFile(selectedFile));

    // Create preview for images only
    if (isImageFile(selectedFile)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        const { data, error } = await supabase.functions.invoke('analyze-document', {
          body: {
            imageBase64: base64Data,
            category: category,
            mimeType: file.type,
            language: selectedLanguage === 'auto' ? null : selectedLanguage,
            responseLanguage: appLanguage
          }
        });

        if (error) {
          console.error('Analysis error:', error);
          toast({
            title: "Analysis failed",
            description: error.message || "Failed to analyze document",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        if (data.error) {
          toast({
            title: "Analysis failed",
            description: data.error,
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        toast({
          title: "Document analyzed",
          description: "Text has been extracted and saved successfully",
        });

        // Clear the form and notify parent
        setFile(null);
        setPreview(null);
        setLoading(false);
        onSuccess();
      };

      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read the file",
          variant: "destructive"
        });
        setLoading(false);
      };
    } catch (err) {
      console.error('Upload error:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-lg shadow-soft-xl animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Upload Document</h2>
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-[140px] h-9">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languageSelectOptions.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={onClose} disabled={loading}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {!preview && !isDocument ? (
            <div className="space-y-4">
              {/* Main Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="text-foreground font-medium mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-muted-foreground">
                  Images (JPG, PNG), PDF, or Word (DOC, DOCX) up to 10MB
                </p>
              </div>

              {/* Camera Button */}
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleCameraCapture}
              >
                <Camera className="w-5 h-5" />
                Take Photo with Camera
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview for images */}
              {preview && (
                <div className="relative rounded-xl overflow-hidden bg-muted">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-64 object-contain"
                  />
                  {!loading && (
                    <button
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                        setIsDocument(false);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-card rounded-full flex items-center justify-center shadow-md hover:bg-card-hover transition-colors"
                    >
                      <X className="w-4 h-4 text-foreground" />
                    </button>
                  )}
                </div>
              )}

              {/* Preview for documents (PDF/DOCX) */}
              {isDocument && !preview && (
                <div className="relative rounded-xl overflow-hidden bg-muted p-8 text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-foreground font-medium">Document Selected</p>
                  {!loading && (
                    <button
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                        setIsDocument(false);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-card rounded-full flex items-center justify-center shadow-md hover:bg-card-hover transition-colors"
                    >
                      <X className="w-4 h-4 text-foreground" />
                    </button>
                  )}
                </div>
              )}
              
              <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                {isDocument ? (
                  <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                ) : (
                  <FileImage className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {file && (file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT_STRING}
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Camera input */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex items-start gap-2 mt-4 p-3 bg-accent/10 rounded-lg">
            <AlertCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Images are used only for analysis and are not stored. Only extracted text is saved.
            </p>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-border">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleAnalyze}
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Document'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
