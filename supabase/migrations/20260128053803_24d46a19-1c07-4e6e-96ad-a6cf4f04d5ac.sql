-- Create category_notes table for persistent notes storage
CREATE TABLE public.category_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add unique constraint for user + category
ALTER TABLE public.category_notes ADD CONSTRAINT unique_user_category UNIQUE (user_id, category);

-- Enable RLS
ALTER TABLE public.category_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own notes" 
ON public.category_notes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes" 
ON public.category_notes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" 
ON public.category_notes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" 
ON public.category_notes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_category_notes_updated_at
BEFORE UPDATE ON public.category_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add 'events' to document_category enum
ALTER TYPE public.document_category ADD VALUE IF NOT EXISTS 'events';