
-- Analytics table for view/download tracking
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
    event_type TEXT,
    event_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can view own analytics" ON public.analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert analytics" ON public.analytics FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY IF NOT EXISTS "Service role manages analytics" ON public.analytics USING (auth.role() = 'service_role');
