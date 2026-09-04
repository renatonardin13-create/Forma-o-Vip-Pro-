-- ==============================================================================
-- SUPABASE MIGRATION: Homologação RLS, Profiles View e Sales Transactions
-- FASE 3.3C: Auditoria e Integridade Relacional
-- ==============================================================================

-- 1. Compatibilidade Profiles <-> Perfis
CREATE OR REPLACE VIEW public.profiles AS 
SELECT * FROM public.perfis;

-- 2. Atualização da função is_admin() para consultar public.perfis com garantia
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.perfis 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Tabela de Transações Comerciais (sales_transactions)
CREATE TABLE IF NOT EXISTS public.sales_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id TEXT UNIQUE NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT,
    customer_email TEXT NOT NULL,
    amount NUMERIC(10,2) DEFAULT 0.00,
    currency TEXT DEFAULT 'BRL',
    status TEXT NOT NULL CHECK (status IN ('approved', 'pending', 'cancelled', 'refunded', 'chargeback', 'expired')),
    provider TEXT NOT NULL CHECK (provider IN ('kiwify', 'perfectpay', 'hotmart', 'manual', 'stripe', 'outro')),
    origin TEXT DEFAULT 'webhook',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMPTZ
);

-- Índices para consultas e performance
CREATE INDEX IF NOT EXISTS idx_sales_transactions_customer_email ON public.sales_transactions(customer_email);
CREATE INDEX IF NOT EXISTS idx_sales_transactions_user_id ON public.sales_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_transactions_transaction_id ON public.sales_transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_sales_transactions_status ON public.sales_transactions(status);

-- Habilitar RLS em sales_transactions
ALTER TABLE public.sales_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança para sales_transactions:
-- Apenas Admins podem gerenciar todas as transações
CREATE POLICY "Admins possuem acesso total a sales_transactions"
ON public.sales_transactions FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Alunos podem apenas visualizar transações vinculadas ao seu ID ou E-mail
CREATE POLICY "Alunos podem visualizar apenas suas proprias transacoes"
ON public.sales_transactions FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR auth.jwt()->>'email' = customer_email);

-- 4. Garantir políticas administrativas nas tabelas essenciais
-- Admins podem gerenciar produtos_cursos
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'produtos_cursos' AND policyname = 'Admins podem gerenciar produtos_cursos'
    ) THEN
        CREATE POLICY "Admins podem gerenciar produtos_cursos"
        ON public.produtos_cursos FOR ALL
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());
    END IF;
END $$;

-- Admins podem gerenciar matriculas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'matriculas' AND policyname = 'Admins podem gerenciar matriculas'
    ) THEN
        CREATE POLICY "Admins podem gerenciar matriculas"
        ON public.matriculas FOR ALL
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());
    END IF;
END $$;
