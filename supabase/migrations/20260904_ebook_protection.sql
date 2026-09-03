
-- ========================================================
-- FASE 2.8B — PROTEÇÃO DE E-BOOKS (STORAGE + COLUNAS)
-- ========================================================

-- 1. Adicionar coluna storage_path na tabela digital_products
ALTER TABLE public.digital_products 
ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- 2. Criar Bucket 'ebooks' se não existir
-- Nota: Supabase Storage é gerenciado via inserts na tabela storage.buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('ebooks', 'ebooks', false, 52428800, '{application/pdf}') -- 50MB limit, apenas PDF
ON CONFLICT (id) DO UPDATE SET public = false;

-- 3. Políticas de Segurança para o Storage Bucket 'ebooks'
-- Remover qualquer política existente para este bucket
DELETE FROM storage.policies WHERE bucket_id = 'ebooks';

-- Política 1: Somente ADMINS podem fazer upload, deletar e listar arquivos
CREATE POLICY "Admins podem gerenciar ebooks"
ON storage.objects FOR ALL
TO authenticated
USING (
    bucket_id = 'ebooks' AND 
    (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
    bucket_id = 'ebooks' AND 
    (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'admin'
);

-- Política 2: Usuários autenticados NÃO podem ler diretamente via SELECT (será via Edge Function)
-- No entanto, para fins de debug ou se decidíssemos usar RLS direto, a regra seria mais complexa.
-- Seguindo a regra absoluta: "NÃO criar uma policy que permita todos os usuários autenticados lerem todos os PDFs."
-- Deixaremos sem policy de SELECT para usuários comuns, forçando o uso da Edge Function com SERVICE_ROLE.

-- Política 3: Service Role tem acesso total (padrão do Supabase, mas explícito aqui se necessário)
-- O Supabase já permite service_role bypassar RLS.
