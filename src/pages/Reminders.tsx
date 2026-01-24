import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  format, 
  isPast, 
  isToday, 
  isTomorrow, 
  addDays,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay
} from 'date-fns';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Check, 
  Bell,
  Loader2,
  ChevronLeft,
  ChevronRight,
  List,
  Grid3X3,
  CalendarDays
} from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  due_time: string | null;
  is_acknowledged: boolean;
  document_id: string | null;
  created_at: string;
}

type ViewMode = 'month' | 'week' | 'day';

export default function Reminders() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (err) {
      console.error('Failed to load reminders:', err);
      toast({
        title: "Error",
        description: "Failed to load reminders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeReminder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .update({ is_acknowledged: true })
        .eq('id', id);

      if (error) throw error;

      setReminders(prev => 
        prev.map(r => r.id === id ? { ...r, is_acknowledged: true } : r)
      );

      toast({
        title: "Reminder acknowledged",
        description: "This reminder has been marked as done",
      });
    } catch (err) {
      console.error('Acknowledge error:', err);
      toast({
        title: "Error",
        description: "Failed to acknowledge reminder",
        variant: "destructive"
      });
    }
  };

  const getDateLabel = (date: string) => {
    const d = new Date(date);
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    if (isPast(d)) return 'Overdue';
    return format(d, 'MMM d, yyyy');
  };

  const getRemindersForDate = (date: Date) => {
    return reminders.filter(r => isSameDay(new Date(r.due_date), date));
  };

  // Calendar grid generation
  const getMonthDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  };

  const getWeekDays = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  };

  const navigatePrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const navigateNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const pendingReminders = reminders.filter(r => !r.is_acknowledged);
  const days = viewMode === 'month' ? getMonthDays() : viewMode === 'week' ? getWeekDays() : [currentDate];
  const selectedDayReminders = selectedDate ? getRemindersForDate(selectedDate) : [];

  const viewModeButtons = [
    { mode: 'day' as ViewMode, icon: CalendarDays, label: 'Day' },
    { mode: 'week' as ViewMode, icon: List, label: 'Week' },
    { mode: 'month' as ViewMode, icon: Grid3X3, label: 'Month' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 fade-in">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover:bg-primary/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center glow">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              Calendar
            </h1>
            <p className="text-sm text-muted-foreground">
              {pendingReminders.length} pending reminder{pendingReminders.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
            {/* Calendar View */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden fade-in">
              {/* Calendar Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={navigatePrevious}>
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <h2 className="text-lg font-semibold text-foreground min-w-[200px] text-center">
                    {viewMode === 'day' 
                      ? format(currentDate, 'EEEE, MMMM d, yyyy')
                      : viewMode === 'week'
                        ? `${format(startOfWeek(currentDate), 'MMM d')} - ${format(endOfWeek(currentDate), 'MMM d, yyyy')}`
                        : format(currentDate, 'MMMM yyyy')
                    }
                  </h2>
                  <Button variant="ghost" size="icon" onClick={navigateNext}>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Today
                  </Button>
                  <div className="flex bg-secondary rounded-lg p-1">
                    {viewModeButtons.map(({ mode, icon: Icon, label }) => (
                      <Button
                        key={mode}
                        variant={viewMode === mode ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode(mode)}
                        className={`gap-1 ${viewMode === mode ? 'glow-sm' : ''}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Day Headers */}
              {viewMode !== 'day' && (
                <div className="grid grid-cols-7 border-b border-border">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-muted-foreground py-3 border-r border-border last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Calendar Grid */}
              {viewMode === 'month' && (
                <div className="grid grid-cols-7">
                  {days.map((day, index) => {
                    const dayReminders = getRemindersForDate(day);
                    const pendingCount = dayReminders.filter(r => !r.is_acknowledged).length;
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    
                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedDate(day)}
                        className={`
                          min-h-[100px] p-2 border-r border-b border-border last:border-r-0 cursor-pointer transition-colors
                          ${!isCurrentMonth ? 'opacity-30' : ''}
                          ${isSelected ? 'bg-primary/10' : 'hover:bg-card-hover'}
                          ${isToday(day) ? 'bg-primary/5' : ''}
                        `}
                      >
                        <div className={`
                          w-7 h-7 rounded-full flex items-center justify-center text-sm mb-1
                          ${isToday(day) ? 'bg-primary text-primary-foreground font-semibold' : ''}
                          ${isSelected && !isToday(day) ? 'bg-secondary' : ''}
                        `}>
                          {format(day, 'd')}
                        </div>
                        {dayReminders.length > 0 && (
                          <div className="space-y-1">
                            {dayReminders.slice(0, 2).map(reminder => (
                              <div
                                key={reminder.id}
                                className={`
                                  text-xs px-2 py-1 rounded truncate
                                  ${reminder.is_acknowledged 
                                    ? 'bg-muted/50 text-muted-foreground line-through' 
                                    : 'bg-primary/20 text-primary'
                                  }
                                `}
                              >
                                {reminder.title}
                              </div>
                            ))}
                            {dayReminders.length > 2 && (
                              <div className="text-xs text-muted-foreground px-2">
                                +{dayReminders.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {viewMode === 'week' && (
                <div className="grid grid-cols-7 min-h-[400px]">
                  {days.map((day, index) => {
                    const dayReminders = getRemindersForDate(day);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    
                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedDate(day)}
                        className={`
                          p-3 border-r border-border last:border-r-0 cursor-pointer transition-colors
                          ${isSelected ? 'bg-primary/10' : 'hover:bg-card-hover'}
                          ${isToday(day) ? 'bg-primary/5' : ''}
                        `}
                      >
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-sm mb-3 mx-auto
                          ${isToday(day) ? 'bg-primary text-primary-foreground font-semibold' : ''}
                        `}>
                          {format(day, 'd')}
                        </div>
                        <div className="space-y-2">
                          {dayReminders.map(reminder => (
                            <div
                              key={reminder.id}
                              className={`
                                text-xs p-2 rounded-lg
                                ${reminder.is_acknowledged 
                                  ? 'bg-muted/50 text-muted-foreground' 
                                  : 'bg-primary/20 text-primary border border-primary/30'
                                }
                              `}
                            >
                              <p className={reminder.is_acknowledged ? 'line-through' : ''}>
                                {reminder.title}
                              </p>
                              {reminder.due_time && (
                                <p className="text-[10px] mt-1 opacity-70">{reminder.due_time}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {viewMode === 'day' && (
                <div className="p-6 min-h-[400px]">
                  {getRemindersForDate(currentDate).length === 0 ? (
                    <div className="text-center py-16">
                      <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No reminders for this day</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {getRemindersForDate(currentDate).map(reminder => (
                        <div
                          key={reminder.id}
                          className={`
                            p-4 rounded-xl border flex items-start gap-4 transition-all
                            ${reminder.is_acknowledged 
                              ? 'bg-muted/30 border-border opacity-60' 
                              : 'bg-card border-primary/30 hover:border-primary/50'
                            }
                          `}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            reminder.is_acknowledged ? 'bg-muted' : 'bg-primary/20'
                          }`}>
                            <Bell className={`w-5 h-5 ${reminder.is_acknowledged ? 'text-muted-foreground' : 'text-primary'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-medium ${reminder.is_acknowledged ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {reminder.title}
                            </h4>
                            {reminder.description && (
                              <p className="text-sm text-muted-foreground mt-1">{reminder.description}</p>
                            )}
                            {reminder.due_time && (
                              <p className="text-sm text-primary mt-2">{reminder.due_time}</p>
                            )}
                          </div>
                          {!reminder.is_acknowledged && (
                            <Button variant="ghost" size="icon" onClick={() => acknowledgeReminder(reminder.id)}>
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar - Selected Day Details */}
            <div className="space-y-4 fade-in" style={{ animationDelay: '100ms' }}>
              {/* Selected Date */}
              <div className="bg-card rounded-2xl border border-border p-4">
                <h3 className="font-semibold text-foreground mb-1">
                  {selectedDate ? format(selectedDate, 'EEEE, MMMM d') : 'Select a date'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedDate 
                    ? `${selectedDayReminders.length} reminder${selectedDayReminders.length !== 1 ? 's' : ''}`
                    : 'Click on a date to view reminders'
                  }
                </p>
              </div>

              {/* Selected Day Reminders */}
              {selectedDate && selectedDayReminders.length > 0 && (
                <div className="space-y-2">
                  {selectedDayReminders.map(reminder => (
                    <div
                      key={reminder.id}
                      className={`
                        bg-card rounded-xl border p-4 flex items-start gap-3 transition-all
                        ${reminder.is_acknowledged 
                          ? 'border-border opacity-60' 
                          : isPast(new Date(reminder.due_date)) && !isToday(new Date(reminder.due_date))
                            ? 'border-destructive/50'
                            : 'border-primary/30'
                        }
                      `}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        reminder.is_acknowledged 
                          ? 'bg-muted text-muted-foreground'
                          : isPast(new Date(reminder.due_date)) && !isToday(new Date(reminder.due_date))
                            ? 'bg-destructive/20 text-destructive'
                            : 'bg-primary/20 text-primary'
                      }`}>
                        {reminder.is_acknowledged ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Bell className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm ${reminder.is_acknowledged ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {reminder.title}
                        </h4>
                        {reminder.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{reminder.description}</p>
                        )}
                        {reminder.due_time && (
                          <p className="text-xs text-primary mt-1">{reminder.due_time}</p>
                        )}
                      </div>
                      {!reminder.is_acknowledged && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => acknowledgeReminder(reminder.id)}>
                          <Check className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Pending Reminders Overview */}
              <div className="bg-card rounded-2xl border border-border p-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  All Pending ({pendingReminders.length})
                </h3>
                {pendingReminders.length === 0 ? (
                  <div className="text-center py-6">
                    <Check className="w-8 h-8 text-accent mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">All caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {pendingReminders.slice(0, 10).map(reminder => (
                      <div
                        key={reminder.id}
                        onClick={() => setSelectedDate(new Date(reminder.due_date))}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-card-hover cursor-pointer transition-colors"
                      >
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          isPast(new Date(reminder.due_date)) && !isToday(new Date(reminder.due_date))
                            ? 'bg-destructive'
                            : isToday(new Date(reminder.due_date))
                              ? 'bg-amber-500'
                              : 'bg-primary'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">{reminder.title}</p>
                          <p className="text-xs text-muted-foreground">{getDateLabel(reminder.due_date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
