# GUIA OFICIAL DE CONFIGURAÇÃO DE GATEWAY
## Kiwify e PerfectPay — Integração com a Formação VIP Pro

---

### 1. ARQUITETURA DA INTEGRAÇÃO
A Formação VIP Pro utiliza uma arquitetura comercial desacoplada, segura e idempotente para processamento de vendas de cursos e produtos digitais. 

O fluxo de processamento opera em 6 etapas:
1. O cliente adquire o produto no checkout oficial do gateway (Kiwify ou PerfectPay).
2. O gateway envia uma requisição HTTP POST para a Edge Function do Supabase.
3. A Edge Function valida a assinatura criptográfica e o token secreto da requisição.
4. O ID do produto externo é consultado na tabela `public.produtos_cursos` para resolver o `digital_product_id` interno.
5. O usuário é criado ou localizado no Supabase Auth, e o acesso é persistido em `public.user_area_accesses` e `public.matriculas`.
6. Um e-mail com as credenciais de acesso é disparado automaticamente para o comprador via Resend.

---

### 2. CONFIGURAÇÃO NA KIWIFY

#### 2.1 Onde localizar o ID do Produto
1. Faça login na sua conta da **Kiwify** (https://dashboard.kiwify.com.br).
2. No menu lateral esquerdo, clique em **Produtos**.
3. Selecione o produto correspondente (ex: *"Depois dos 60: 50 cuidados que todo idoso e sua família precisam conhecer"*).
4. Na barra de navegação do produto ou na URL do navegador, identifique o identificador alfanumérico único do produto (exemplo: `a1b2c3d4-e5f6-7890-abcd-ef1234567890` ou o código curto presente nas configurações de checkout).
5. Guarde este código exatamente como fornecido para cadastrar no mapeamento da Formação VIP Pro.

#### 2.2 Onde configurar a URL do Webhook
1. No menu lateral do dashboard da Kiwify, clique em **Apps** ou **Configurações** -> **Webhooks**.
2. Clique no botão **Criar Webhook** (ou **Adicionar Webhook**).
3. Preencha os seguintes dados:
   - **Nome do Webhook:** `Formação VIP Pro - Liberação de Acesso`
   - **URL do Webhook:** 
     ```
     https://[SEU-PROJETO-SUPABASE].supabase.co/functions/v1/webhook-liberacao-acesso
     ```
   - **Produtos:** Selecione o produto específico ou todos os produtos que deseja integrar.
   - **Eventos a marcar obrigatoriamente:**
     - `Order approved` (Pedido aprovado)
     - `Order refunded` (Pedido reembolsado)
     - `Order chargedback` (Pedido com chargeback)

#### 2.3 Onde obter / configurar o Token Secreto
1. Ao criar o Webhook na Kiwify, será exibido um campo com o **Token de Autenticação** (Webhook Secret).
2. Copie este valor.
3. Acesse o **Supabase Dashboard** -> **Project Settings** -> **Edge Functions** -> **Secrets**.
4. Adicione o secret:
   - Nome: `KIWIFY_WEBHOOK_TOKEN`
   - Valor: `[token_copiado_da_kiwify]`
5. Clique em **Save**.

#### 2.4 Formato do Payload (Kiwify)
A Kiwify envia payloads JSON estruturados da seguinte forma:
```json
{
  "order_id": "9a12c45e-...",
  "order_status": "paid",
  "Product": {
    "product_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "product_name": "Depois dos 60: 50 cuidados..."
  },
  "Customer": {
    "full_name": "Nome do Cliente",
    "email": "cliente@email.com",
    "mobile": "+5511999999999"
  },
  "signature": "sha256_generated_hash..."
}
```

---

### 3. CONFIGURAÇÃO NA PERFECTPAY

#### 3.1 Onde localizar o ID do Produto
1. Faça login na sua conta da **PerfectPay** (https://app.perfectpay.com.br).
2. No menu superior ou lateral, clique em **Produtos** -> **Meus Produtos**.
3. Localize o produto cadastrado.
4. O **Código do Produto** (ID) é exibido na listagem de produtos ou no topo da página de edição (exemplo: `PPP123456`).
5. Copie exatamente este identificador para utilização no mapeamento.

#### 3.2 Onde configurar a URL do Webhook (Postback)
1. Na edição do produto na PerfectPay, clique na aba **Integrações** ou **Postback**.
2. Clique em **Novo Postback**.
3. Configure os seguintes parâmetros:
   - **Tipo de Envio:** `POST (JSON)`
   - **URL do Postback:**
     ```
     https://[SEU-PROJETO-SUPABASE].supabase.co/functions/v1/webhook-liberacao-acesso
     ```
   - **Eventos a disparar:**
     - `Venda Aprovada / Aprovado`
     - `Reembolso / Devolvido`
     - `Chargeback / Reclamado`

#### 3.3 Onde configurar o Token Secreto (Chave de Segurança)
1. Na aba de configurações de API/Postback da PerfectPay, defina ou copie a sua **Chave Única de Postback (Security Token)**.
2. Acesse o **Supabase Dashboard** -> **Project Settings** -> **Edge Functions** -> **Secrets**.
3. Adicione o secret:
   - Nome: `PERFECTPAY_WEBHOOK_TOKEN`
   - Valor: `[chave_unica_perfectpay]`
4. Clique em **Save**.

#### 3.4 Formato do Payload (PerfectPay)
A PerfectPay transmite os eventos com o seguinte formato:
```json
{
  "sale_id": "PP-998811",
  "sale_status_enum": 2,
  "product_id": "PPP123456",
  "product_name": "Depois dos 60: 50 cuidados...",
  "customer": {
    "full_name": "Nome do Cliente",
    "email": "cliente@email.com"
  },
  "token": "seu_token_secreto"
}
```
*Mapeamento de status PerfectPay:*
- `sale_status_enum: 2` (Aprovado) -> `APPROVED`
- `sale_status_enum: 7` (Reembolsado) -> `REFUNDED`
- `sale_status_enum: 6` (Chargeback) -> `CHARGEBACK`

---

### 4. CADASTRO DO MAPEAMENTO NA FORMAÇÃO VIP PRO

Após obter o ID oficial do produto no gateway escolhido, você deve cadastrá-lo na Central Administrativa da plataforma.

#### Passo a Passo:
1. Acesse a plataforma Formação VIP Pro como **Administrador**.
2. No menu lateral, selecione **Webhooks & Integrações**.
3. Clique na aba **Mapeamento de Produtos**.
4. Clique no botão **Novo Mapeamento**.
5. Preencha os campos obrigatórios:
   - **Plataforma:** Selecione `Kiwify` ou `PerfectPay`.
   - **ID do Produto no Gateway:** Cole o código obtido (ex: `PPP123456`).
   - **Nome do Produto no Gateway:** `Depois dos 60: 50 cuidados que todo idoso e sua família precisam conhecer`.
   - **Tipo de Destino:** Selecione `Produto Digital (E-book / App / Ferramenta)`.
   - **Produto Digital de Destino:** Selecione `"Depois dos 60: 50 cuidados que todo idoso e sua família precisam conhecer"` (`prod-depois-dos-60-real`).
   - **Área de Membros:** `E-books & Guias Digitais` (`area-ebooks`).
   - **Status:** `Ativo` (marcado).
6. Clique em **Salvar Mapeamento**.

#### Regras Críticas de Integridade:
- **PROIBIDO IDs Fictícios ou PENDENTE:** O sistema recusa requisições com IDs em branco ou com valor `"PENDENTE"`.
- **REGRA DE CONFLITO (409):** Cada ID de gateway externo deve apontar para exatamente **um único destino**. O sistema bloqueia automaticamente qualquer tentativa de vincular o mesmo ID externo a múltiplos produtos distintos.
- **ISOLAMENTO:** O acesso liberado pelo mapeamento será estritamente vinculado ao produto configurado, sem vazar permissões para outros cursos ou e-books.
