-- ========================================================
-- FASE 2.5A — CORREÇÃO DO SCHEMA DE MAPEAMENTO
-- OBJETIVO: Permitir mapeamento flexível de produtos externos
-- ========================================================

-- 1. Adicionar novas colunas de mapeamento
ALTER TABLE public.produtos_cursos 
ADD COLUMN IF NOT EXISTS area_id TEXT REFERENCES public.member_areas(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS digital_product_id TEXT REFERENCES public.digital_products(id) ON DELETE SET NULL;

-- 2. Flexibilizar colunas do modelo antigo para suportar o novo modelo
-- (Mantendo as colunas mas permitindo NULL para quando o mapeamento for para área ou produto digital)
ALTER TABLE public.produtos_cursos 
ALTER COLUMN curso_id DROP NOT NULL,
ALTER COLUMN curso_nome DROP NOT NULL;

-- 3. Adicionar comentários documentais
COMMENT ON COLUMN public.produtos_cursos.area_id IS 'ID da área de membros vinculada (tabela member_areas)';
COMMENT ON COLUMN public.produtos_cursos.digital_product_id IS 'ID do produto digital vinculado (tabela digital_products)';
COMMENT ON COLUMN public.produtos_cursos.curso_id IS 'ID do curso legado (opcional no novo modelo)';

-- 4. Criar índices para performance nas consultas do Webhook
CREATE INDEX IF NOT EXISTS idx_produtos_cursos_area_id ON public.produtos_cursos(area_id);
CREATE INDEX IF NOT EXISTS idx_produtos_cursos_digital_product_id ON public.produtos_cursos(digital_product_id);
