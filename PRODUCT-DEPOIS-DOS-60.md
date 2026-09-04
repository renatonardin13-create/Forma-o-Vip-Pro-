# FICHA TÉCNICA OFICIAL DO PRODUTO REAL
## "Depois dos 60: 50 cuidados que todo idoso e sua família precisam conhecer"

---

### 1. DADOS CADASTRAIS DO PRODUTO

| Parâmetro | Valor Homologado | Status Atual |
|---|---|---|
| **ID do Produto** | `prod-depois-dos-60-real` | ✅ Homologado |
| **Título Oficial** | Depois dos 60: 50 cuidados que todo idoso e sua família precisam conhecer | ✅ Homologado |
| **Tipo de Entregável** | `ebook` | ✅ Homologado |
| **Área de Membros** | `area-ebooks` (E-books & Guias Digitais) | ✅ Homologado |
| **Status de Publicação** | `published` | ✅ Homologado |
| **Categoria** | Saúde & Bem-estar | ✅ Homologado |
| **Página de Vendas Oficial** | `https://depois-dos-60.vercel.app/` | ✅ Homologado |
| **Storage Path no Bucket** | `prod-depois-dos-60-real/depois-dos-60-50-cuidados.pdf` | ✅ Homologado |
| **Bucket Supabase** | `ebooks` (Privado, RLS ativo, max 50MB, MIME application/pdf) | ✅ Homologado |
| **Nível de Acesso** | `vip` (Individual ou Área) | ✅ Homologado |
| **ID Externo no Gateway** | `PENDENTE` | ⏳ Aguardando Gateway |
| **URL de Checkout** | `""` (Vazio / PENDENTE) | ⏳ Aguardando Gateway |
| **Status Comercial** | `PENDENTE` | ⏳ Aguardando Gateway |
| **Webhook Comercial** | `false` (Desativado até Go-Live) | ⏳ Aguardando Gateway |
| **Arquivo PDF no Storage** | `""` (Aguardando upload do PDF diagramado) | ⏳ Aguardando PDF Final |

---

### 2. ARQUITETURA DE SEGURANÇA E PROTEÇÃO

O produto **Depois dos 60** conta com proteção multicamada de propriedade intelectual:
1. **Zero Exposição Pública:** O PDF nunca é hospedado com URLs públicas estáticas.
2. **Storage Privado:** O bucket `ebooks` bloqueia leitura direta via CDN pública e proíbe downloads por usuários desautenticados.
3. **Signed URLs Efêmeras:** Cada leitura gera uma URL assinada exclusiva com validade de 15 minutos via Edge Function (`ebook-signed-url`), gerada apenas após confirmação de token JWT e licença ativa.
4. **Sem Botão de Download:** O leitor web (`EbookReaderModal`) embute o PDF no iframe seguro sem botão de "Baixar PDF" ou URLs permanentes.
5. **Sanitização de Upload:** Validação estrita de cabeçalho binário `%PDF-1.x`, proteção contra vírus/executáveis renomeados (MZ, ELF, ZIP) e bloqueio de path traversal.

---

### 3. O QUE FALTA PREENCHER QUANDO O GATEWAY FOR DEFINIDO

Assim que a conta no gateway de pagamento (Kiwify ou PerfectPay) for criada e o produto cadastrado, deverão ser fornecidas 4 informações reais:

1. **Nome do Gateway Escolhido:** `kiwify` ou `perfectpay`.
2. **ID Externo Real do Produto:** Código do produto fornecido pelo gateway (ex: `kw_prod_xyz` ou `PP123456`).
3. **URL Oficial de Checkout:** Link seguro de checkout gerado pelo gateway (ex: `https://pay.kiwify.com.br/...` ou `https://checkout.perfectpay.com.br/...`).
4. **Token Secreto do Webhook:** Segredo compartilhado entre o gateway e o Supabase.

> **REGRA DE OURO:** Sob nenhuma circunstância o ID externo deve permanecer como `"PENDENTE"` ou conter links fictícios (`example.com`, `#`) no momento do Go-Live.

---

### 4. O QUE FALTA FAZER PARA O PDF REAL

1. **Obter o Arquivo Final Diagramado:**
   - Garantir que o PDF final do guia "Depois dos 60" esteja devidamente revisado e com tamanho inferior a 50 MB.
2. **Upload pelo Painel Administrativo:**
   - Acessar **Painel Admin** -> **Produtos Digitais** -> Localizar "Depois dos 60".
   - Clicar no botão **Upload de E-book**.
   - Selecionar o arquivo PDF.
   - O sistema valida a assinatura binária e faz o upload diretamente para:
     `ebooks/prod-depois-dos-60-real/depois-dos-60-50-cuidados.pdf`.
3. **Confirmação:**
   - O campo `storagePath` do produto será atualizado para o caminho protegido.

---

### 5. PASSO A PASSO FINAL PARA COLOCAR O PRODUTO EM VENDAS

1. **Passo 1 — Upload do PDF:**
   - Realizar o upload do arquivo PDF oficial no Storage conforme seção 4.
2. **Passo 2 — Configurar Webhook no Gateway:**
   - Seguir as orientações do `GATEWAY-SETUP.md` para apontar o webhook do gateway para:
     `https://[seu-projeto].supabase.co/functions/v1/webhook-liberacao-acesso`.
3. **Passo 3 — Criar Mapeamento no Admin:**
   - Acessar **Webhooks & Integrações** -> **Mapeamento de Produtos** -> **Novo Mapeamento**.
   - Vincular o ID externo do gateway ao `prod-depois-dos-60-real`.
4. **Passo 4 — Atualizar Ficha Comercial do Produto:**
   - Na edição do produto "Depois dos 60", preencher:
     - ID Externo = `[ID real do gateway]`
     - Checkout URL = `[URL real do checkout]`
     - Status Comercial = `ATIVO`
     - Webhook Ativo = `Sim`
   - Salvar as alterações.
5. **Passo 5 — Teste de Compra Piloto:**
   - Realizar uma compra de teste através do link de checkout ou simulador com o ID real.
   - Confirmar liberação instantânea de acesso e visualização no `EbookReaderModal`.
6. **Passo 6 — Tráfego e Escala:**
   - Apontar as campanhas de tráfego para a página de vendas oficial (`https://depois-dos-60.vercel.app/`), cujo botão de compra direciona para o checkout configurado.
