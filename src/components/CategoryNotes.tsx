import { useState, useEffect } from 'react';
import { StickyNote, Save, Loader2, Calendar, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CategoryNotesProps {
  categoryId: string;
}

const translations = {
  en: {
    notes: 'Notes',
    notesPlaceholder: 'Write your notes here... You can add tasks, reminders, or any thoughts.',
    save: 'Save Notes',
    saving: 'Saving...',
    saved: 'Notes saved successfully',
    addReminder: 'Add Reminder',
    reminderTitle: 'Reminder Title',
    reminderDate: 'Date',
    reminderTime: 'Time',
    createReminder: 'Create Reminder',
    reminderCreated: 'Reminder created successfully',
    loadError: 'Failed to load notes',
    saveError: 'Failed to save notes',
  },
  ur: {
    notes: 'نوٹس',
    notesPlaceholder: 'اپنے نوٹس یہاں لکھیں... آپ کام، یاد دہانیاں، یا کوئی بھی خیالات شامل کر سکتے ہیں۔',
    save: 'نوٹس محفوظ کریں',
    saving: 'محفوظ ہو رہا ہے...',
    saved: 'نوٹس کامیابی سے محفوظ ہو گئے',
    addReminder: 'یاد دہانی شامل کریں',
    reminderTitle: 'یاد دہانی کا عنوان',
    reminderDate: 'تاریخ',
    reminderTime: 'وقت',
    createReminder: 'یاد دہانی بنائیں',
    reminderCreated: 'یاد دہانی کامیابی سے بن گئی',
    loadError: 'نوٹس لوڈ کرنے میں ناکام',
    saveError: 'نوٹس محفوظ کرنے میں ناکام',
  },
  hi: {
    notes: 'नोट्स',
    notesPlaceholder: 'अपने नोट्स यहाँ लिखें... आप कार्य, रिमाइंडर, या कोई भी विचार जोड़ सकते हैं।',
    save: 'नोट्स सहेजें',
    saving: 'सहेज रहा है...',
    saved: 'नोट्स सफलतापूर्वक सहेजे गए',
    addReminder: 'रिमाइंडर जोड़ें',
    reminderTitle: 'रिमाइंडर शीर्षक',
    reminderDate: 'तारीख',
    reminderTime: 'समय',
    createReminder: 'रिमाइंडर बनाएं',
    reminderCreated: 'रिमाइंडर सफलतापूर्वक बना',
    loadError: 'नोट्स लोड करने में विफल',
    saveError: 'नोट्स सहेजने में विफल',
  },
  ar: {
    notes: 'ملاحظات',
    notesPlaceholder: 'اكتب ملاحظاتك هنا... يمكنك إضافة مهام أو تذكيرات أو أي أفكار.',
    save: 'حفظ الملاحظات',
    saving: 'جاري الحفظ...',
    saved: 'تم حفظ الملاحظات بنجاح',
    addReminder: 'إضافة تذكير',
    reminderTitle: 'عنوان التذكير',
    reminderDate: 'التاريخ',
    reminderTime: 'الوقت',
    createReminder: 'إنشاء تذكير',
    reminderCreated: 'تم إنشاء التذكير بنجاح',
    loadError: 'فشل في تحميل الملاحظات',
    saveError: 'فشل في حفظ الملاحظات',
  },
};

export function CategoryNotes({ categoryId }: CategoryNotesProps) {
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [creatingReminder, setCreatingReminder] = useState(false);
  const { toast } = useToast();
  const { language, isRTL } = useLanguage();

  const t = translations[language as keyof typeof translations] || translations.en;

  // Load notes from database
  useEffect(() => {
    loadNotes();
  }, [categoryId]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('category_notes')
        .select('content')
        .eq('user_id', user.id)
        .eq('category', categoryId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setNotes(data.content);
      } else {
        // Fallback to localStorage for existing notes
        const savedNotes = localStorage.getItem(`prisma-notes-${categoryId}`);
        if (savedNotes) {
          setNotes(savedNotes);
        }
      }
    } catch (err) {
      console.error('Failed to load notes:', err);
      // Fallback to localStorage
      const savedNotes = localStorage.getItem(`prisma-notes-${categoryId}`);
      if (savedNotes) {
        setNotes(savedNotes);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('category_notes')
        .upsert({
          user_id: user.id,
          category: categoryId,
          content: notes,
        }, {
          onConflict: 'user_id,category'
        });

      if (error) throw error;

      // Also save to localStorage as backup
      localStorage.setItem(`prisma-notes-${categoryId}`, notes);

      toast({
        title: t.saved,
      });
    } catch (err) {
      console.error('Failed to save notes:', err);
      toast({
        title: t.saveError,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateReminder = async () => {
    if (!reminderTitle.trim() || !reminderDate) return;

    setCreatingReminder(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('reminders').insert({
        user_id: user.id,
        title: reminderTitle.trim(),
        description: `Note from ${categoryId} category`,
        due_date: reminderDate,
        due_time: reminderTime || null,
      });

      if (error) throw error;

      toast({
        title: t.reminderCreated,
      });

      setShowReminderDialog(false);
      setReminderTitle('');
      setReminderDate('');
      setReminderTime('');
    } catch (err) {
      console.error('Failed to create reminder:', err);
      toast({
        title: 'Error',
        description: 'Failed to create reminder',
        variant: 'destructive',
      });
    } finally {
      setCreatingReminder(false);
    }
  };

  return (
    <div className={`bg-card border border-border rounded-xl p-4 ${isRTL ? 'rtl' : ''}`}>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <StickyNote className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">{t.notes}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">{t.addReminder}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t.addReminder}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="reminder-title">{t.reminderTitle}</Label>
                  <Input
                    id="reminder-title"
                    value={reminderTitle}
                    onChange={(e) => setReminderTitle(e.target.value)}
                    placeholder={t.reminderTitle}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reminder-date">{t.reminderDate}</Label>
                    <Input
                      id="reminder-date"
                      type="date"
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reminder-time">{t.reminderTime}</Label>
                    <Input
                      id="reminder-time"
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleCreateReminder} 
                  className="w-full"
                  disabled={!reminderTitle.trim() || !reminderDate || creatingReminder}
                >
                  {creatingReminder ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 mr-2" />
                      {t.createReminder}
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t.notesPlaceholder}
            className="min-h-[120px] resize-none mb-3"
          />

          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className="w-full gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.saving}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {t.save}
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
}
