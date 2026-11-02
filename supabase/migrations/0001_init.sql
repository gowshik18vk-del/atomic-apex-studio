-- ====================================================================
-- ATOMIC APEX STUDIO - PRODUCTION INITIAL MIGRATION
-- File: supabase/migrations/0001_init.sql
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT DEFAULT 'Apex Creator',
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    credits INT DEFAULT 100 CHECK (credits >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 2. CREDIT LEDGER (Audit log of every atomic deduction and refund)
CREATE TABLE IF NOT EXISTS public.credit_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    delta INT NOT NULL, -- negative for spend, positive for refund/top-up
    reason TEXT NOT NULL,
    generation_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credit ledger"
    ON public.credit_ledger FOR SELECT
    USING (auth.uid() = user_id);

-- 3. GENERATIONS TABLE (Async job tracking for Image & Video)
CREATE TABLE IF NOT EXISTS public.generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    kind TEXT NOT NULL CHECK (kind IN ('image', 'video')),
    model TEXT NOT NULL,
    prompt TEXT NOT NULL,
    params JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'succeeded', 'failed')),
    cost INT NOT NULL DEFAULT 2,
    provider_job_id TEXT,
    result_path TEXT,
    thumb_path TEXT,
    error TEXT,
    favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    finished_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own generations"
    ON public.generations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations"
    ON public.generations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generations"
    ON public.generations FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own generations"
    ON public.generations FOR DELETE
    USING (auth.uid() = user_id);

-- 4. CHAT THREADS & MESSAGES
CREATE TABLE IF NOT EXISTS public.chat_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Creative Session',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own chat threads"
    ON public.chat_threads FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat threads"
    ON public.chat_threads FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own chat messages"
    ON public.chat_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.chat_threads
            WHERE chat_threads.id = chat_messages.thread_id
            AND chat_threads.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own chat messages"
    ON public.chat_messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chat_threads
            WHERE chat_threads.id = chat_messages.thread_id
            AND chat_threads.user_id = auth.uid()
        )
    );

-- 5. API RUNS LOG
CREATE TABLE IF NOT EXISTS public.api_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    method TEXT NOT NULL,
    url TEXT NOT NULL,
    status_code INT NOT NULL,
    duration_ms INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.api_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own api runs"
    ON public.api_runs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own api runs"
    ON public.api_runs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 6. ATOMIC TRANSACTION: spend_credits
CREATE OR REPLACE FUNCTION public.spend_credits(
    p_user_id UUID,
    p_amount INT,
    p_generation_id UUID,
    p_reason TEXT DEFAULT 'Generation fee'
)
RETURNS BOOLEAN AS $$
DECLARE
    current_credits INT;
BEGIN
    SELECT credits INTO current_credits
    FROM public.profiles
    WHERE id = p_user_id
    FOR UPDATE;

    IF current_credits IS NULL OR current_credits < p_amount THEN
        RETURN FALSE;
    END IF;

    UPDATE public.profiles
    SET credits = credits - p_amount
    WHERE id = p_user_id;

    INSERT INTO public.credit_ledger (user_id, delta, reason, generation_id)
    VALUES (p_user_id, -p_amount, p_reason, p_generation_id);

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. ATOMIC TRANSACTION: refund_credits (on failed jobs)
CREATE OR REPLACE FUNCTION public.refund_credits(
    p_user_id UUID,
    p_amount INT,
    p_generation_id UUID,
    p_reason TEXT DEFAULT 'Generation failed refund'
)
RETURNS VOID AS $$
BEGIN
    UPDATE public.profiles
    SET credits = credits + p_amount
    WHERE id = p_user_id;

    INSERT INTO public.credit_ledger (user_id, delta, reason, generation_id)
    VALUES (p_user_id, p_amount, p_reason, p_generation_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. TRIGGER: New Auth User -> Profile with 100 Credits
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, credits)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Apex Creator'),
        100
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.credit_ledger (user_id, delta, reason)
    VALUES (NEW.id, 100, 'Welcome bonus credits');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 9. STORAGE: Private 'generations' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('generations', 'generations', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users access own objects in generations bucket"
    ON storage.objects FOR ALL
    USING (bucket_id = 'generations' AND (storage.foldername(name))[1] = auth.uid()::text);
