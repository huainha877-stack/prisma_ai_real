import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { format, isPast, isToday } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface Reminder {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  due_time: string | null;
  is_acknowledged: boolean;
}

export function NotificationBell() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadReminders();
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('is_acknowledged', false)
        .order('due_date', { ascending: true })
        .limit(10);

      if (error) throw error;
      setReminders(data || []);
    } catch (err) {
      console.error('Failed to load reminders:', err);
    }
  };

  const acknowledgeReminder = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('reminders')
        .update({ is_acknowledged: true })
        .eq('id', id);

      if (error) throw error;
      setReminders(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to acknowledge:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDateColor = (date: string) => {
    const d = new Date(date);
    if (isPast(d) && !isToday(d)) return 'text-destructive';
    if (isToday(d)) return 'text-amber-500';
    return 'text-primary';
  };

  const getDateLabel = (date: string) => {
    const d = new Date(date);
    if (isToday(d)) return 'Today';
    if (isPast(d)) return 'Overdue';
    return format(d, 'MMM d');
  };

  const unacknowledgedCount = reminders.length;
  const hasUrgent = reminders.some(r => isPast(new Date(r.due_date)) && !isToday(new Date(r.due_date)));

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-primary/10"
      >
        <Bell className="w-5 h-5" />
        {unacknowledgedCount > 0 && (
          <span className={`
            absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full text-xs font-medium 
            flex items-center justify-center px-1
            ${hasUrgent 
              ? 'bg-destructive text-destructive-foreground animate-pulse' 
              : 'bg-primary text-primary-foreground'
            }
          `}>
            {unacknowledgedCount > 9 ? '9+' : unacknowledgedCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsOpen(false);
                navigate('/reminders');
              }}
              className="text-xs text-primary hover:text-primary"
            >
              View All
            </Button>
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto">
            {reminders.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {reminders.map(reminder => (
                  <div
                    key={reminder.id}
                    className="p-4 hover:bg-card-hover transition-colors cursor-pointer"
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/reminders');
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isPast(new Date(reminder.due_date)) && !isToday(new Date(reminder.due_date))
                          ? 'bg-destructive/20'
                          : 'bg-primary/20'
                      }`}>
                        <Calendar className={`w-4 h-4 ${getDateColor(reminder.due_date)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {reminder.title}
                        </p>
                        {reminder.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {reminder.description}
                          </p>
                        )}
                        <p className={`text-xs mt-1 font-medium ${getDateColor(reminder.due_date)}`}>
                          {getDateLabel(reminder.due_date)}
                          {reminder.due_time && ` · ${reminder.due_time}`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0 hover:bg-primary/10"
                        onClick={(e) => acknowledgeReminder(reminder.id, e)}
                        disabled={loading}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {reminders.length > 0 && (
            <div className="p-3 border-t border-border bg-secondary/30">
              <p className="text-xs text-center text-muted-foreground">
                {unacknowledgedCount} pending reminder{unacknowledgedCount !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
