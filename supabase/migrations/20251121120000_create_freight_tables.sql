CREATE TABLE IF NOT EXISTS public.integration_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    request_payload JSONB,
    response_payload JSONB,
    status_code INTEGER,
    duration_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cashback_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uf CHAR(2) NOT NULL UNIQUE,
    percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed cashback data
INSERT INTO public.cashback_rules (uf, percentage) VALUES
('SP', 1.5),
('RJ', 1.0),
('MG', 1.2),
('SC', 2.0)
ON CONFLICT (uf) DO UPDATE SET percentage = EXCLUDED.percentage;

-- Enable RLS
ALTER TABLE public.integration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashback_rules ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable insert for authenticated users only" ON public.integration_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable read for authenticated users only" ON public.cashback_rules FOR SELECT TO authenticated USING (true);
