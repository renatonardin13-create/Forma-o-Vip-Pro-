-- Tabela de progresso individual de vídeo por aluno e aula
CREATE TABLE IF NOT EXISTS public.progresso_aulas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    aula_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    percentual_assistido INTEGER NOT NULL DEFAULT 0 CHECK (percentual_assistido >= 0 AND percentual_assistido <= 100),
    segundos_assistidos INTEGER NOT NULL DEFAULT 0 CHECK (segundos_assistidos >= 0),
    duracao_total INTEGER NOT NULL DEFAULT 0,
    concluido BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, aula_id)
);

-- Índices para consultas de alta performance
CREATE INDEX IF NOT EXISTS idx_progresso_aulas_user ON public.progresso_aulas(user_id);
CREATE INDEX IF NOT EXISTS idx_progresso_aulas_course ON public.progresso_aulas(course_id);
CREATE INDEX IF NOT EXISTS idx_progresso_aulas_aula ON public.progresso_aulas(aula_id);

-- RLS (Row Level Security)
ALTER TABLE public.progresso_aulas ENABLE ROW LEVEL SECURITY;

-- Aluno pode consultar seu próprio progresso
CREATE POLICY "Alunos podem visualizar seu próprio progresso"
    ON public.progresso_aulas
    FOR SELECT
    USING (auth.uid() = user_id);

-- Aluno pode inserir/atualizar seu progresso
CREATE POLICY "Alunos podem salvar seu próprio progresso"
    ON public.progresso_aulas
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Alunos podem atualizar seu próprio progresso"
    ON public.progresso_aulas
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Admins e Service Role podem gerenciar tudo
CREATE POLICY "Admins possuem acesso total ao progresso de aulas"
    ON public.progresso_aulas
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );
