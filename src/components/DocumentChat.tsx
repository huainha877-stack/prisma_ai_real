import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Loader2, FileText, Bot, User, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { VoiceTyping } from '@/components/VoiceTyping';
import { AIFooterDisclaimer } from '@/components/AIFooterDisclaimer';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';
import { LanguageSelectorInline } from '@/components/LanguageSelectorInline';
import { useLanguage } from '@/hooks/useLanguage';

interface Document {
  id: string;
  title: string;
  extracted_text: string;
  summary: string | null;
  created_at: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface DocumentChatProps {
  document: Document;
  onBack: () => void;
}

export function DocumentChat({ document, onBack }: DocumentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [showDocument, setShowDocument] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const { language, isRTL } = useLanguage();

  useEffect(() => {
    loadMessages();
  }, [document.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('document_id', document.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []).map(m => ({
        ...m,
        role: m.role as 'user' | 'assistant'
      })));
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Optimistically add user message
    const tempUserMsg: Message = {
      id: 'temp-user-' + Date.now(),
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const { data, error } = await supabase.functions.invoke('chat-document', {
        body: {
          documentId: document.id,
          message: userMessage,
          language: language // Pass selected language
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Add AI response
      const aiMessage: Message = {
        id: 'ai-' + Date.now(),
        role: 'assistant',
        content: data.message,
        created_at: new Date().toISOString()
      };
      setMessages(prev => prev.map(m => 
        m.id === tempUserMsg.id ? { ...m, id: 'user-' + Date.now() } : m
      ).concat(aiMessage));
    } catch (err) {
      console.error('Chat error:', err);
      toast({
        title: "Failed to send message",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive"
      });
      // Remove the optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMsg.id));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e as any);
    }
  };

  // Typing indicator component
  const TypingIndicator = () => (
    <div className="flex items-center gap-3 message-enter">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 glow-sm">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-primary rounded-full typing-dot"></span>
          <span className="w-2 h-2 bg-primary rounded-full typing-dot"></span>
          <span className="w-2 h-2 bg-primary rounded-full typing-dot"></span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-[calc(100vh-4rem)] ${isRTL ? 'rtl' : ''}`}>
      {/* Header */}
      <div className="glass border-b border-border p-4">
        <div className="flex items-center gap-4 max-w-4xl mx-auto flex-wrap">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-primary/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-foreground truncate">
              {document.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {format(new Date(document.created_at), 'MMM d, yyyy')}
            </p>
          </div>
          <LanguageSelectorInline />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDocument(!showDocument)}
            className="gap-2 text-muted-foreground"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Document</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showDocument ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Collapsible Document Content */}
      {showDocument && (
        <div className="glass border-b border-border p-4 max-h-48 overflow-y-auto scale-in">
          <div className="flex items-start gap-3 max-w-4xl mx-auto">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Extracted Text
              </p>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap line-clamp-6">
                {document.extracted_text}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages - ChatGPT Style */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {loadingMessages ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16 fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 glow">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Ask about this document
              </h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                I can help you understand the content, find specific information, or answer questions about what's in this document.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {['Summarize the key points', 'What dates are mentioned?', 'Explain the main topic'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-4 py-2 bg-card border border-border rounded-full text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 message-enter ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 glow-sm">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-card border border-border rounded-tl-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  <p className={`text-xs mt-2 ${
                    msg.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'
                  }`}>
                    {format(new Date(msg.created_at), 'h:mm a')}
                  </p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))
          )}
          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input - ChatGPT Style */}
      <div className="glass border-t border-border p-4">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-2 bg-card border border-border rounded-2xl p-2 focus-within:border-primary/50 focus-within:glow-sm transition-all">
            <VoiceTyping 
              onTranscript={(text) => setInput(prev => prev + ' ' + text)}
              disabled={loading}
            />
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Prisma AI..."
              disabled={loading}
              rows={1}
              className="flex-1 min-h-[44px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!input.trim() || loading}
              className="h-10 w-10 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-30"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <AIFooterDisclaimer />
        </form>
      </div>
    </div>
  );
}
