import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar,
  FileText,
  MessageSquare,
  Bell,
  Loader2,
  Save,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';

interface ActivityStats {
  documentsCount: number;
  messagesCount: number;
  remindersCount: number;
}

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<ActivityStats>({
    documentsCount: 0,
    messagesCount: 0,
    remindersCount: 0
  });

  useEffect(() => {
    if (user) {
      loadProfile();
      loadStats();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setFullName(data.full_name || '');
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const [docsResult, msgsResult, remindersResult] = await Promise.all([
        supabase.from('documents').select('id', { count: 'exact', head: true }),
        supabase.from('chat_messages').select('id', { count: 'exact', head: true }),
        supabase.from('reminders').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        documentsCount: docsResult.count || 0,
        messagesCount: msgsResult.count || 0,
        remindersCount: remindersResult.count || 0
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: fullName.trim() || null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully",
      });
    } catch (err) {
      console.error('Save error:', err);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const statCards = [
    { label: 'Documents', value: stats.documentsCount, icon: FileText, color: 'text-primary' },
    { label: 'Messages', value: stats.messagesCount, icon: MessageSquare, color: 'text-accent' },
    { label: 'Reminders', value: stats.remindersCount, icon: Bell, color: 'text-amber-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 fade-in">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover:bg-primary/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              Profile
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your account settings
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6 fade-in" style={{ animationDelay: '100ms' }}>
          {/* Avatar Section */}
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 glow">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              {fullName || 'Prisma User'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {user?.email}
            </p>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={user?.email || ''}
                  disabled
                  className="pl-10 bg-secondary/50"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Member Since
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={user?.created_at ? format(new Date(user.created_at), 'MMMM d, yyyy') : ''}
                  disabled
                  className="pl-10 bg-secondary/50"
                />
              </div>
            </div>

            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="w-full gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="fade-in" style={{ animationDelay: '200ms' }}>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Activity Summary
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {statCards.map((stat) => (
              <div 
                key={stat.label}
                className="bg-card rounded-xl border border-border p-4 text-center hover:border-primary/30 transition-colors"
              >
                <div className={`w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
