import { format } from 'date-fns';
import { FileText, ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Document {
  id: string;
  title: string;
  summary: string | null;
  created_at: string;
}

interface DocumentListProps {
  documents: Document[];
  onSelect: (doc: Document) => void;
  onDelete: (id: string) => void;
}

export function DocumentList({ documents, onSelect, onDelete }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No documents yet
        </h3>
        <p className="text-muted-foreground text-sm">
          Upload a document image to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc, index) => (
        <div
          key={doc.id}
          className="bg-card rounded-xl border border-border p-4 hover:shadow-soft-md transition-all animate-fade-in group"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate">
                {doc.title}
              </h4>
              {doc.summary && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {doc.summary}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {format(new Date(doc.created_at), 'MMM d, yyyy · h:mm a')}
              </p>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(doc.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onSelect(doc)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <button
            onClick={() => onSelect(doc)}
            className="w-full mt-3 pt-3 border-t border-border flex items-center justify-center gap-2 text-sm text-primary font-medium hover:underline"
          >
            View & Chat
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
