-- ==============================================================================
-- SUPABASE MIGRATION: Webhook Liberação de Acesso & Área de Membros
-- ==============================================================================

-- 1. Enable UUID Extension if not already active
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Perfis de Usuários (Profiles)
CREATE TABLE IF NOT EXISTS public.perfis (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT,
    email TEXT UNIQUE,
    avatar_url TEXT,
    role TEXT DEFAULT 'student' CHECK (role IN ('admin', 'student')),
    precisa_trocar_senha BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Matrículas dos Alunos
CREATE TABLE IF NOT EXISTS public.matriculas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    produto_id TEXT,
    produto_nome TEXT,
    curso_id TEXT NOT NULL,
    plataforma_origem TEXT NOT NULL CHECK (plataforma_origem IN ('kiwify', 'perfectpay', 'hotmart', 'eduzz', 'manual')),
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'revogado', 'reembolsado', 'bloqueado')),
    data_liberacao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unq_user_course UNIQUE (user_id, curso_id)
);

-- 4. Tabela de Mapeamento Produto → Curso da Área de Membros
CREATE TABLE IF NOT EXISTS public.produtos_cursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id TEXT NOT NULL,
    produto_nome TEXT NOT NULL,
    curso_id TEXT NOT NULL,
    curso_nome TEXT NOT NULL,
    plataforma TEXT DEFAULT 'todas' CHECK (plataforma IN ('kiwify', 'perfectpay', 'todas')),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabela de Logs de Webhook (Auditoria e Resolução de Problemas)
CREATE TABLE IF NOT EXISTS public.webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plataforma TEXT NOT NULL,
    evento TEXT,
    email_comprador TEXT,
    nome_comprador TEXT,
    produto_id TEXT,
    produto_nome TEXT,
    status_processamento TEXT NOT NULL, -- 'sucesso', 'erro', 'ignorado', 'revogado'
    sucesso BOOLEAN DEFAULT FALSE,
    mensagem_detalhe TEXT,
    payload_bruto JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Índices para Otimização de Consultas
CREATE INDEX IF NOT EXISTS idx_matriculas_user_id ON public.matriculas(user_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_curso_id ON public.matriculas(curso_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_status ON public.matriculas(status);
CREATE INDEX IF NOT EXISTS idx_produtos_cursos_prod_id ON public.produtos_cursos(produto_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created ON public.webhook_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_email ON public.webhook_logs(email_comprador);

-- 7. Configuração de Row Level Security (RLS)
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matriculas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos_cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para PERFIS:
-- O aluno pode ler e atualizar seu próprio perfil
CREATE POLICY "Alunos podem visualizar seu próprio perfil" 
    ON public.perfis FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Alunos podem atualizar seu próprio perfil" 
    ON public.perfis FOR UPDATE 
    USING (auth.uid() = id);

-- Políticas para MATRÍCULAS:
-- O aluno pode ler apenas as suas próprias matrículas ativas
CREATE POLICY "Alunos podem visualizar apenas suas próprias matrículas" 
    ON public.matriculas FOR SELECT 
    USING (auth.uid() = user_id);

-- Políticas para PRODUTOS_CURSOS:
-- Todos os usuários autenticados podem consultar os cursos mapeados ativos
CREATE POLICY "Leitura pública de cursos mapeados ativos" 
    ON public.produtos_cursos FOR SELECT 
    USING (ativo = TRUE);

-- Políticas para WEBHOOK_LOGS:
-- Apenas service role / admins têm acesso aos logs
CREATE POLICY "Service role tem acesso total aos logs" 
    ON public.webhook_logs FOR ALL 
    USING (auth.jwt()->>'role' = 'service_role' OR auth.jwt()->>'email' IN (
        SELECT email FROM public.perfis WHERE role = 'admin'
    ));

-- 8. Trigger para auto-criação de perfil ao cadastrar no Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.perfis (id, nome, email, role, precisa_trocar_senha)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        'student',
        TRUE
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Inserção de Mapeamentos Iniciais de Exemplo
INSERT INTO public.produtos_cursos (produto_id, produto_nome, curso_id, curso_nome, plataforma, ativo)
VALUES 
    ('PPA882194', 'Formação VIP PRO Master', 'course-negocios-digitais', 'Formação VIP PRO: Estratégias & Escala Digital', 'perfectpay', TRUE),
    ('PPA773102', 'Clube Black VIP Anual', 'course-vsl-milionaria', 'Copywriting & VSLs de Alta Conversão', 'perfectpay', TRUE),
    ('KW-PROD-991', 'Mentoria Tráfego Escala 100k', 'course-trafego-pago-mastery', 'Tráfego Pago de Alta Performance', 'kiwify', TRUE),
    ('KW-PROD-105', 'Design & UI/UX para Infoprodutos', 'course-ui-ux-design', 'Design & Interfaces de Alta Conversão', 'kiwify', TRUE)
ON CONFLICT DO NOTHING;
