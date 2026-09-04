# CHECKLIST OFICIAL DE GO-LIVE — PRODUÇÃO
## Formação VIP Pro — Plataforma de Membros & Infoprodutos

---

### 1. VISÃO GERAL
Este documento estabelece o protocolo operacional e a sequência estrita de homologação e validação para o Go-Live da **Formação VIP Pro**. O sistema passou com 100% de sucesso nas fases de auditoria e segurança (Fases 3.2D, 3.3, 3.3B e 3.3C). Todos os mecanismos de proteção, RLS, isolamento de usuários, idempotência e geração de URLs assinadas para e-books já estão operacionais.

---

### 2. ETAPA 1 — PRÉ-DEPLOY (CONFIGURAÇÃO DE INFRAESTRUTURA)

- [ ] **Configuração do Vercel (Frontend)**
  - Projeto criado apontando para o repositório oficial da Formação VIP Pro.
  - Framework Preset: **Vite**.
  - Root Directory: `./`.
  - Build Command: `npm run build`.
  - Output Directory: `dist`.
  - Arquivo `vercel.json` validado com rewrites SPA `{"source": "/(.*)", "destination": "/index.html"}`.

- [ ] **Variáveis de Ambiente no Vercel (Client-Side)**
  - `VITE_SUPABASE_URL`: URL do projeto Supabase (ex: `https://[app-id].supabase.co`).
  - `VITE_SUPABASE_ANON_KEY`: Chave anônima pública (Publishable Key).
  - **AUDITORIA DE SEGURANÇA:** Confirmado que **NENHUMA** variável `SERVICE_ROLE`, `WEBHOOK_TOKEN` ou `SECRET` foi inserida com o prefixo `VITE_`.

---

### 3. ETAPA 2 — BANCO DE DADOS & STORAGE (SUPABASE)

- [ ] **Execução das Migrations SQL (Database)**
  - `20260825_multi_member_areas.sql` (tabelas de áreas, produtos e acessos).
  - `20260825_webhook_and_memberships.sql` (webhook logs, matrículas, perfis).
  - `20260903_add_flexible_mapping_to_produtos_cursos.sql` (mapeamento flexível Kiwify/PerfectPay).
  - `20260904_ebook_protection.sql` (bucket privado `ebooks`, coluna `storage_path`).
  - `20260904_rls_homologation.sql` (tabela `sales_transactions`, view `profiles`, RLS integral).

- [ ] **Auditoria de Row Level Security (RLS)**
  - RLS ativo em `public.perfis`.
  - RLS ativo em `public.digital_products`.
  - RLS ativo em `public.user_area_accesses`.
  - RLS ativo em `public.produtos_cursos`.
  - RLS ativo em `public.matriculas`.
  - RLS ativo em `public.sales_transactions`.
  - RLS ativo em `public.webhook_logs`.

- [ ] **Configuração do Bucket Privado de E-books**
  - Bucket `ebooks` configurado com `public = false`.
  - Limite de arquivo: 50 MB.
  - MIME type estrito: `application/pdf`.
  - Apenas Administradores ou Edge Functions com Service Role podem gravar ou emitir URLs assinadas.

- [ ] **Deploy das Edge Functions (Backend)**
  - `ebook-signed-url`: Gera URLs pré-assinadas temporárias (15 minutos) após validação de token JWT e licença ativa.
  - `webhook-liberacao-acesso`: Processa eventos de compra, refund e chargeback da Kiwify e PerfectPay.

- [ ] **Configuração dos Secrets no Supabase (Edge Functions Secrets)**
  - `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço interna (server-only).
  - `KIWIFY_WEBHOOK_TOKEN`: Token de assinatura/segredo configurado na Kiwify.
  - `PERFECTPAY_WEBHOOK_TOKEN`: Token de assinatura/segredo configurado na PerfectPay.
  - `RESEND_API_KEY`: Chave de API para envio automático de credenciais de boas-vindas.
  - `APP_LOGIN_URL`: URL canônica de login (`https://membros.formacaovip.pro/login`).

---

### 4. ETAPA 3 — CONFIGURAÇÃO DO GATEWAY DE PAGAMENTOS

- [ ] **Escolha do Gateway de Pagamento**
  - Gateway selecionado: Kiwify ou PerfectPay.
- [ ] **Obtenção dos Dados Oficiais do Produto no Gateway**
  - Obter o ID real do produto no gateway (ex: `kw_prod_abc123` ou código numérico).
  - Obter a URL oficial de Checkout gerada pelo gateway.
- [ ] **Configuração da URL de Webhook no Gateway**
  - Cadastrar o endpoint do Edge Function:
    `https://[project-id].supabase.co/functions/v1/webhook-liberacao-acesso`
  - Selecionar eventos:
    - Compra Aprovada (Order Approved / Pagamento Aprovado)
    - Reembolso (Refunded)
    - Chargeback / Contestação (Disputed / Chargeback)
- [ ] **Configuração do Token de Segurança**
  - Inserir o mesmo token seguro nas configurações do webhook no painel do gateway e nos secrets do Supabase.

---

### 5. ETAPA 4 — ATIVAÇÃO DO PRODUTO REAL ("DEPOIS DOS 60")

- [ ] **Upload do Arquivo PDF Oficial no Storage**
  - Acessar Central Admin -> Produtos Digitais -> E-book "Depois dos 60".
  - Fazer upload do arquivo PDF final diagramado.
  - O sistema valida a assinatura binária `%PDF-` e grava em:
    `prod-depois-dos-60-real/depois-dos-60-50-cuidados.pdf`.
- [ ] **Cadastro do Mapeamento Comercial**
  - Acessar Central Admin -> Webhooks & Integrações -> Mapeamento de Produtos.
  - Cadastrar:
    - Plataforma: Kiwify ou PerfectPay.
    - ID do Produto no Gateway: ID numérico/alfanumérico real.
    - Destino: Produto Digital -> "Depois dos 60" (`prod-depois-dos-60-real`).
    - Status: Ativo (`ativo = true`).
- [ ] **Atualização do Status Comercial do Produto**
  - Atualizar campo `externalProductId` de `PENDENTE` para o ID real.
  - Atualizar campo `checkoutUrl` com a URL real do checkout.
  - Alterar `commercialStatus` de `PENDENTE` para `ATIVO`.
  - Ativar `webhookActive = true`.

---

### 6. ETAPA 5 — TESTE EM SANDBOX / TRANSAÇÃO PILOTO

- [ ] **Disparo de Webhook de Teste (Simulador / Sandbox)**
  - Enviar payload simulado de compra aprovada com o ID real mapeado.
  - Verificar código de resposta HTTP `200 OK`.
  - Conferir na tabela `public.webhook_logs`:
    - `status_processamento`: `sucesso`
    - `sucesso`: `true`
    - `evento`: `compra_aprovada`
- [ ] **Verificação da Criação da Conta e Permissões**
  - Verificar criação do usuário no Supabase Auth.
  - Verificar inserção do perfil em `public.perfis`.
  - Verificar liberação em `public.user_area_accesses` com `status = 'active'`.
  - Testar login do aluno: confirmar que o e-book "Depois dos 60" aparece com badge "Liberado".
- [ ] **Verificação do EbookReaderModal e Signed URL**
  - Clicar em "Ler E-book".
  - Confirmar requisição à Edge Function `ebook-signed-url`.
  - Confirmar carregamento do PDF no visualizador seguro sem botão "Baixar PDF".
- [ ] **Teste de Estorno / Chargeback**
  - Enviar payload de `refunded`: confirmar transição do status de acesso para `revoked`.
  - Enviar payload de `chargeback`: confirmar transição para `blocked`.
  - Confirmar que o aluno perde acesso imediato ao e-book após o estorno.

---

### 7. ETAPA 6 — VALIDAÇÃO PÓS-DEPLOY

- [ ] Teste de transação piloto real com valor mínimo (ou cartão de teste/PIX).
- [ ] Validação de recebimento do e-mail de acesso via Resend.
- [ ] Auditoria de logs em tempo real no Supabase Dashboard.
- [ ] Validação de responsividade mobile e desktop na página de vendas e na área de membros.
- [ ] Auditoria de rotas no Vercel (recarregar `/aluno`, `/admin`, `/ebooks` sem erro 404).

---

### 8. PLANO DE CONTINGÊNCIA & ROLLBACK

- **Cenário A: Falha na integração do Webhook**
  1. Acessar Supabase Dashboard -> Functions -> `webhook-liberacao-acesso` -> Logs.
  2. Identificar se o erro é de autenticação (`401 Invalid webhook token`), mapeamento (`422 Unmapped`) ou duplicidade (`409 Conflict`).
  3. No caso de compras aprovadas pendentes, utilizar a Central Admin -> "Usuários & Acessos" -> "Conceder Novo Acesso" para liberação manual imediata sem interrupção para o cliente.
  4. Reprocessar o webhook no painel do gateway após ajustar as credenciais.

- **Cenário B: Falha no Vercel / Frontend**
  1. Utilizar a funcionalidade **Instant Rollback** do Vercel para reverter para a versão de deploy anterior estável.
  2. Verificar as variáveis de ambiente no dashboard do Vercel.

- **Cenário C: Indisponibilidade de Storage**
  1. O visualizador de e-books possui fallback elegante informando que o arquivo está sendo sincronizado.
  2. A integridade das contas de usuários e dos direitos de acesso permanece 100% preservada no banco de dados relacional.
