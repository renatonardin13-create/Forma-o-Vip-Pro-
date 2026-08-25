-- ========================================================
-- MÓDULO 30 — MULTIÁREAS DE MEMBROS + CATÁLOGO FLEXÍVEL
-- MIGRATION SUPABASE COM RLS (ROW LEVEL SECURITY)
-- ========================================================

-- 1. TABELA DE ÁREAS DE MEMBROS (member_areas)
CREATE TABLE IF NOT EXISTS public.member_areas (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL DEFAULT 'vip' CHECK (type IN ('cursos', 'ebooks', 'aplicativos', 'ferramentas', 'produtos_digitais', 'vip', 'personalizada')),
    description TEXT,
    logo_url TEXT,
    favicon_url TEXT DEFAULT 'https://api.iconify.design/lucide:crown.svg?color=%23D4AF37',
    cover_url TEXT,
    banner_url TEXT,
    mobile_banner_url TEXT,
    primary_color TEXT DEFAULT '#D4AF37',
    secondary_color TEXT DEFAULT '#151922',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    welcome_text TEXT,
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_cta_text TEXT DEFAULT 'Explorar Conteúdos',
    hero_cta_link TEXT DEFAULT '#conteudos',
    order_index INTEGER DEFAULT 0,
    login_customization JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_member_areas_slug ON public.member_areas(slug);
CREATE INDEX IF NOT EXISTS idx_member_areas_status ON public.member_areas(status);

-- 2. TABELA DE PRODUTOS DIGITAIS / ENTREGÁVEIS (digital_products)
CREATE TABLE IF NOT EXISTS public.digital_products (
    id TEXT PRIMARY KEY,
    area_id TEXT NOT NULL REFERENCES public.member_areas(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    short_description TEXT,
    full_description TEXT,
    type TEXT NOT NULL CHECK (type IN ('curso', 'ebook', 'aplicativo', 'ferramenta', 'arquivo', 'link')),
    category TEXT DEFAULT 'Geral',
    cover_url TEXT,
    banner_url TEXT,
    mobile_banner_url TEXT,
    logo_url TEXT,
    thumbnail_url TEXT,
    trailer_url TEXT,
    author JSONB DEFAULT '{"name": "Renato Nardin", "role": "Especialista VIP"}'::jsonb,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    order_index INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    course_id TEXT, -- Referência opcional à tabela de cursos existentes
    ebook JSONB DEFAULT '{}'::jsonb,
    app JSONB DEFAULT '{}'::jsonb,
    tool JSONB DEFAULT '{}'::jsonb,
    file JSONB DEFAULT '{}'::jsonb,
    link JSONB DEFAULT '{}'::jsonb,
    featured BOOLEAN DEFAULT FALSE,
    badge TEXT,
    access_level TEXT DEFAULT 'vip',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_digital_products_area_id ON public.digital_products(area_id);
CREATE INDEX IF NOT EXISTS idx_digital_products_type ON public.digital_products(type);
CREATE INDEX IF NOT EXISTS idx_digital_products_status ON public.digital_products(status);

-- 3. TABELA DE CONTROLE DE ACESSO POR USUÁRIO (user_area_accesses)
CREATE TABLE IF NOT EXISTS public.user_area_accesses (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    area_id TEXT NOT NULL REFERENCES public.member_areas(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.digital_products(id) ON DELETE CASCADE,
    start_date TIMESTAMPTZ DEFAULT NOW(),
    expiration_date TIMESTAMPTZ, -- NULL para vitalício
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired', 'blocked')),
    granted_by TEXT DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_area_accesses_user_area ON public.user_area_accesses(user_id, area_id);
CREATE INDEX IF NOT EXISTS idx_user_area_accesses_status ON public.user_area_accesses(status);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.member_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_area_accesses ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Policies for member_areas
-- Admins can do everything
CREATE POLICY "Admins have full access to member_areas" 
ON public.member_areas FOR ALL 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Public / Authenticated read active areas
CREATE POLICY "Users can read active member_areas" 
ON public.member_areas FOR SELECT 
TO anon, authenticated 
USING (status = 'active');

-- 2. Policies for digital_products
-- Admins can do everything
CREATE POLICY "Admins have full access to digital_products" 
ON public.digital_products FOR ALL 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Users can read products if they have access to the area or individual product
CREATE POLICY "Students can read published digital_products they have access to" 
ON public.digital_products FOR SELECT 
TO authenticated 
USING (
    status = 'published' AND (
        public.is_admin() OR
        EXISTS (
            SELECT 1 FROM public.user_area_accesses uaa
            WHERE uaa.user_id = auth.uid()
            AND uaa.area_id = digital_products.area_id
            AND uaa.status = 'active'
            AND (uaa.expiration_date IS NULL OR uaa.expiration_date > NOW())
            AND (uaa.product_id IS NULL OR uaa.product_id = digital_products.id)
        )
    )
);

-- 3. Policies for user_area_accesses
-- Admins have full access
CREATE POLICY "Admins have full access to user_area_accesses" 
ON public.user_area_accesses FOR ALL 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Students can read their own accesses
CREATE POLICY "Students can view their own area accesses" 
ON public.user_area_accesses FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());
