import { useState } from 'react';
import { Sparkles, ArrowRight, Target, Zap, Shield, FileText, Calendar, Stethoscope, GraduationCap, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CategoryCard } from '@/components/CategoryCard';
import { AnimatedRobot } from '@/components/AnimatedRobot';
import { AnimatedBilling } from '@/components/AnimatedBilling';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

export function LandingHero() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50" />
        
        <div className="container max-w-6xl mx-auto px-4 pt-20 pb-16 relative z-10">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary-foreground/80">Ultimate AI Hub – 5 Powerful Categories</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6">
            Unlock Your{' '}
            <span className="text-gradient">Creative Potential</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-10">
            PrismaAI brings together powerful AI tools – from document analysis to intelligent chat. Transform your documents into actionable insights with our cutting-edge tools.
          </p>

          {/* Animated Characters */}
          <div className="flex items-center justify-center gap-8 mb-12">
            <AnimatedRobot />
            <AnimatedBilling />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              onClick={() => setShowModal(true)}
              className="gap-2 px-8 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-5 h-5" />
              Explore AI
            </Button>
            {!user && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/auth')}
                className="gap-2 px-8 border-border hover:bg-secondary"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Category Cards Section */}
      <section className="py-12 relative">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Welcome back
            </h2>
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
                  documentCount={0}
                  category={category.id}
                  onClick={() => navigate('/auth')}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore AI Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Welcome to <span className="text-gradient">PrismaAI</span>
            </DialogTitle>
            <p className="text-muted-foreground text-center text-sm">
              Your Complete Guide to AI-Powered Document Management
            </p>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="text-xs font-semibold text-primary tracking-wider uppercase">App Purpose</div>
            
            <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Our Purpose</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    PrismaAI is a comprehensive AI-powered document suite designed to democratize access to cutting-edge artificial intelligence tools. We empower users to analyze documents, extract text, detect important dates, and much more — all in one unified platform.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">5 Document Categories</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Organize your documents across Medical Reports, Education Notes, Utility Bills, Insurance & Legal Papers, and Others. Each category maintains its own history for easy access and management.
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="text-xs font-semibold text-primary tracking-wider uppercase mt-6">Your Benefits</div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium text-sm mb-1">Smart OCR</h4>
                <p className="text-xs text-muted-foreground">Extract text from any document image</p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium text-sm mb-1">Instant Analysis</h4>
                <p className="text-xs text-muted-foreground">Get summaries and insights in seconds</p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium text-sm mb-1">Date Detection</h4>
                <p className="text-xs text-muted-foreground">Auto-detect dates and create reminders</p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium text-sm mb-1">Privacy First</h4>
                <p className="text-xs text-muted-foreground">Images never stored, only text saved</p>
              </div>
            </div>

            {/* CTA Buttons - Only show Create Account if not logged in */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {!user && (
                <Button
                  onClick={() => {
                    setShowModal(false);
                    navigate('/auth');
                  }}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  Create Account
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className={`border-border hover:bg-secondary ${user ? 'flex-1' : 'flex-1'}`}
              >
                {user ? 'Got it!' : 'Close'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
