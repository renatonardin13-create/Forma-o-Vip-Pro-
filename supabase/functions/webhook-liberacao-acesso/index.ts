// Supabase Edge Function: webhook-liberacao-acesso
// Handles sales notifications from Kiwify and PerfectPay with pluggable GatewayAdapters.
// Enforces strict mapping rule: external_product_id -> produtos_cursos -> digital_product_id / area_id / curso_id
// Strictly forbids heuristic, ILIKE, or name-based access grants. Zero fallbacks for unmapped products.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

// Security & Environment Variables (Server-Only Secrets)
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const KIWIFY_WEBHOOK_TOKEN = Deno.env.get("KIWIFY_WEBHOOK_TOKEN") ?? "";
const PERFECTPAY_WEBHOOK_TOKEN = Deno.env.get("PERFECTPAY_WEBHOOK_TOKEN") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const APP_LOGIN_URL = Deno.env.get("APP_LOGIN_URL") ?? "https://membros.formacaovip.pro/login";

// Initialize Supabase Admin Client (Service Role for bypass RLS and Auth Admin API)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-token, x-kiwify-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
};

// ============================================================================
// 1. NORMALIZAÇÃO DE STATUS E TIPOS DO ADAPTER
// ============================================================================
export type NormalizedPaymentStatus =
  | "APPROVED"    // Compra aprovada / paga
  | "PENDING"     // Aguardando pagamento (PIX / Boleto)
  | "REFUNDED"    // Reembolso solicitado / concluído
  | "CHARGEBACK"  // Chargeback / disputa financeira
  | "CANCELLED"   // Compra cancelada antes do pagamento
  | "FAILED"      // Pagamento recusado / falha de cartão
  | "UNKNOWN";    // Status não reconhecido

export interface NormalizedWebhookEvent {
  platform: "kiwify" | "perfectpay";
  rawEvent: string;
  normalizedStatus: NormalizedPaymentStatus;
  externalOrderId: string;
  externalProductId: string;
  productName: string;
  buyerEmail: string;
  buyerName: string;
  timestamp: string;
  idempotencyKey: string;
  tokenProvided?: string;
  rawPayload: any;
}

export interface GatewayAdapter {
  name: "kiwify" | "perfectpay";
  validateAuth(event: NormalizedWebhookEvent): { valid: boolean; reason?: string };
  normalize(body: any, req: Request, url: URL): NormalizedWebhookEvent;
}

// ============================================================================
// 2. ADAPTER KIWIFY
// ============================================================================
export const KiwifyAdapter: GatewayAdapter = {
  name: "kiwify",

  validateAuth(event: NormalizedWebhookEvent): { valid: boolean; reason?: string } {
    if (!KIWIFY_WEBHOOK_TOKEN) {
      // Se a variável não estiver configurada no ambiente, registra aviso no console
      console.warn("[KiwifyAdapter] KIWIFY_WEBHOOK_TOKEN não configurada no Supabase Secrets.");
      return { valid: true };
    }
    const token = event.tokenProvided || "";
    if (token !== KIWIFY_WEBHOOK_TOKEN) {
      return { valid: false, reason: "Token de segurança Kiwify inválido ou ausente." };
    }
    return { valid: true };
  },

  normalize(body: any, req: Request, url: URL): NormalizedWebhookEvent {
    const orderStatus = (body.order_status || body.status || "").toLowerCase().trim();
    const eventName = (body.event || "").toLowerCase().trim();

    let normalizedStatus: NormalizedPaymentStatus = "UNKNOWN";

    if (
      orderStatus === "paid" ||
      orderStatus === "approved" ||
      eventName === "compra_aprovada" ||
      eventName === "order_approved"
    ) {
      normalizedStatus = "APPROVED";
    } else if (
      orderStatus === "waiting_payment" ||
      orderStatus === "pending" ||
      orderStatus === "boleto" ||
      orderStatus === "pix" ||
      eventName === "waiting_payment"
    ) {
      normalizedStatus = "PENDING";
    } else if (
      orderStatus === "refunded" ||
      eventName === "order_refunded" ||
      eventName === "reembolso"
    ) {
      normalizedStatus = "REFUNDED";
    } else if (
      orderStatus === "chargedback" ||
      orderStatus === "chargeback" ||
      eventName === "order_chargeback"
    ) {
      normalizedStatus = "CHARGEBACK";
    } else if (
      orderStatus === "cancelled" ||
      orderStatus === "canceled" ||
      eventName === "order_cancelled"
    ) {
      normalizedStatus = "CANCELLED";
    } else if (orderStatus === "refused" || orderStatus === "failed") {
      normalizedStatus = "FAILED";
    }

    const externalOrderId = (body.order_id || body.order_ref || body.id || "").toString().trim();
    // Extrai estritamente o ID do produto sem fallback genérico
    const rawProductId = (body.Product?.product_id || body.product?.id || body.product_id || "").toString().trim();
    const productName = (body.Product?.product_name || body.product?.name || body.product_name || "Produto Kiwify").toString().trim();

    const buyerEmail = (body.Customer?.email || body.customer?.email || body.email || "").toString().trim().toLowerCase();
    const buyerName = (body.Customer?.full_name || body.customer?.name || body.name || "").toString().trim();

    const tokenProvided =
      body.signature ||
      body.token ||
      body.webhook_token ||
      url.searchParams.get("token") ||
      req.headers.get("x-kiwify-signature") ||
      req.headers.get("x-webhook-token") ||
      "";

    const idempotencyKey = externalOrderId
      ? `kw_${externalOrderId}_${normalizedStatus}`
      : `kw_${buyerEmail}_${rawProductId}_${Date.now()}`;

    return {
      platform: "kiwify",
      rawEvent: eventName || orderStatus || "webhook_event",
      normalizedStatus,
      externalOrderId,
      externalProductId: rawProductId,
      productName,
      buyerEmail,
      buyerName,
      timestamp: new Date().toISOString(),
      idempotencyKey,
      tokenProvided,
      rawPayload: body,
    };
  },
};

// ============================================================================
// 3. ADAPTER PERFECTPAY
// ============================================================================
export const PerfectPayAdapter: GatewayAdapter = {
  name: "perfectpay",

  validateAuth(event: NormalizedWebhookEvent): { valid: boolean; reason?: string } {
    if (!PERFECTPAY_WEBHOOK_TOKEN) {
      console.warn("[PerfectPayAdapter] PERFECTPAY_WEBHOOK_TOKEN não configurada no Supabase Secrets.");
      return { valid: true };
    }
    const token = event.tokenProvided || "";
    if (token !== PERFECTPAY_WEBHOOK_TOKEN) {
      return { valid: false, reason: "Token de segurança PerfectPay inválido ou ausente." };
    }
    return { valid: true };
  },

  normalize(body: any, req: Request, url: URL): NormalizedWebhookEvent {
    const saleStatusEnum = (body.sale_status_enum || body.status || "").toString().toLowerCase().trim();

    let normalizedStatus: NormalizedPaymentStatus = "UNKNOWN";

    // PerfectPay status enums: 2=Aprovado, 1=Pendente, 4=Reembolsado, 7=Chargeback, 3=Cancelado, 5=Recusado
    if (
      saleStatusEnum === "approved" ||
      saleStatusEnum === "authorized" ||
      saleStatusEnum === "complete" ||
      saleStatusEnum === "2"
    ) {
      normalizedStatus = "APPROVED";
    } else if (
      saleStatusEnum === "pending" ||
      saleStatusEnum === "waiting_payment" ||
      saleStatusEnum === "1"
    ) {
      normalizedStatus = "PENDING";
    } else if (
      saleStatusEnum === "refunded" ||
      saleStatusEnum === "4" ||
      saleStatusEnum === "6"
    ) {
      normalizedStatus = "REFUNDED";
    } else if (
      saleStatusEnum === "chargeback" ||
      saleStatusEnum === "7"
    ) {
      normalizedStatus = "CHARGEBACK";
    } else if (
      saleStatusEnum === "cancelled" ||
      saleStatusEnum === "canceled" ||
      saleStatusEnum === "3"
    ) {
      normalizedStatus = "CANCELLED";
    } else if (
      saleStatusEnum === "refused" ||
      saleStatusEnum === "failed" ||
      saleStatusEnum === "5"
    ) {
      normalizedStatus = "FAILED";
    }

    const externalOrderId = (body.sale_code || body.order_id || body.code || "").toString().trim();
    // Extrai estritamente o ID do produto sem fallback genérico
    const rawProductId = (body.product?.code || body.product?.id || body.product_code || body.product_id || "").toString().trim();
    const productName = (body.product?.name || body.product_name || "Produto PerfectPay").toString().trim();

    const buyerEmail = (body.customer?.email || body.customer_email || body.client?.email || body.email || "").toString().trim().toLowerCase();
    const buyerName = (body.customer?.name || body.customer_name || body.client?.name || body.name || "").toString().trim();

    const tokenProvided =
      body.token ||
      body.webhook_token ||
      body.security_token ||
      url.searchParams.get("token") ||
      req.headers.get("x-webhook-token") ||
      "";

    const idempotencyKey = externalOrderId
      ? `pp_${externalOrderId}_${normalizedStatus}`
      : `pp_${buyerEmail}_${rawProductId}_${Date.now()}`;

    return {
      platform: "perfectpay",
      rawEvent: saleStatusEnum || "webhook_event",
      normalizedStatus,
      externalOrderId,
      externalProductId: rawProductId,
      productName,
      buyerEmail,
      buyerName,
      timestamp: new Date().toISOString(),
      idempotencyKey,
      tokenProvided,
      rawPayload: body,
    };
  },
};

// ============================================================================
// 4. HELPERS DE APOIO (SENHA, E-MAIL, LOGS)
// ============================================================================

function generateSecurePassword(length = 12): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const digits = "23456789";
  const special = "!@#$%&*";
  const all = upper + lower + digits + special;

  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);

  let password = "";
  password += upper[randomBytes[0] % upper.length];
  password += lower[randomBytes[1] % lower.length];
  password += digits[randomBytes[2] % digits.length];
  password += special[randomBytes[3] % special.length];

  for (let i = 4; i < length; i++) {
    password += all[randomBytes[i] % all.length];
  }

  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}

async function sendWelcomeEmail(
  toEmail: string,
  studentName: string,
  tempPassword: string,
  contentTitle: string
) {
  if (!RESEND_API_KEY) {
    console.warn("[Email] RESEND_API_KEY não configurada. Notificação por e-mail ignorada.");
    return { success: false, reason: "RESEND_API_KEY not configured" };
  }

  const firstName = studentName.trim().split(" ")[0] || "Aluno";

  const emailHtml = `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seu Acesso VIP Foi Liberado!</title>
    <style>
      body { margin: 0; padding: 0; background-color: #08090C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF; }
      .container { max-width: 600px; margin: 0 auto; background-color: #0D0F12; border: 1px solid #1D2230; border-radius: 20px; overflow: hidden; }
      .header { background: linear-gradient(135deg, #151922 0%, #08090C 100%); padding: 36px 28px; text-align: center; border-bottom: 1px solid #1D2230; }
      .logo-badge { display: inline-block; padding: 6px 14px; background: rgba(229, 168, 59, 0.12); border: 1px solid rgba(229, 168, 59, 0.35); border-radius: 999px; color: #E5A83B; font-size: 11px; font-weight: 800; letter-spacing: 1px; margin-bottom: 12px; }
      .title { color: #FFFFFF; font-size: 24px; font-weight: 800; margin: 0 0 8px 0; letter-spacing: -0.5px; }
      .subtitle { color: #8E9BB0; font-size: 14px; margin: 0; line-height: 1.5; }
      .content { padding: 32px 28px; }
      .welcome-text { font-size: 15px; color: #E1E7EF; line-height: 1.6; margin-bottom: 24px; }
      .card-credentials { background: #151922; border: 1px solid #1D2230; border-left: 4px solid #E5A83B; border-radius: 14px; padding: 22px; margin: 24px 0; }
      .card-title { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #8E9BB0; letter-spacing: 1.2px; margin-bottom: 14px; }
      .cred-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
      .cred-label { color: #8E9BB0; }
      .cred-value { font-family: monospace; font-weight: bold; color: #FFFFFF; }
      .cred-pass { color: #E5A83B; background: rgba(229,168,59,0.1); padding: 2px 8px; border-radius: 6px; }
      .alert-box { background: rgba(229, 168, 59, 0.08); border: 1px dashed rgba(229, 168, 59, 0.35); border-radius: 12px; padding: 14px 18px; color: #D4AF37; font-size: 12px; line-height: 1.5; margin-top: 16px; }
      .btn-container { text-align: center; margin: 32px 0 20px 0; }
      .btn-primary { display: inline-block; background: #E5A83B; color: #000000; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 36px; border-radius: 12px; letter-spacing: 0.5px; box-shadow: 0 4px 20px rgba(229, 168, 59, 0.25); }
      .footer { background: #08090C; padding: 24px 28px; text-align: center; border-top: 1px solid #1D2230; color: #586376; font-size: 11px; }
    </style>
  </head>
  <body>
    <div style="padding: 24px 12px;">
      <div class="container">
        <div class="header">
          <div class="logo-badge">ÁREA DE MEMBROS VIP</div>
          <h1 class="title">Parabéns, ${firstName}!</h1>
          <p class="subtitle">Seu acesso ao conteúdo <strong>${contentTitle}</strong> foi liberado.</p>
        </div>

        <div class="content">
          <p class="welcome-text">
            Olá, <strong>${studentName}</strong>! Identificamos o seu pagamento com sucesso. A sua conta foi provisionada em nossa plataforma premium e os conteúdos já estão disponíveis.
          </p>

          <div class="card-credentials">
            <div class="card-title">DADOS PARA SEU PRIMEIRO ACESSO</div>
            <div class="cred-row">
              <span class="cred-label">Link da Plataforma:</span>
              <span class="cred-value">${APP_LOGIN_URL}</span>
            </div>
            <div class="cred-row">
              <span class="cred-label">E-mail:</span>
              <span class="cred-value">${toEmail}</span>
            </div>
            <div class="cred-row" style="margin-bottom: 0;">
              <span class="cred-label">Senha Provisória:</span>
              <span class="cred-value cred-pass">${tempPassword}</span>
            </div>

            <div class="alert-box">
              🔒 <strong>Atenção de Segurança:</strong> Por motivos de proteção da sua conta, no seu primeiro login você será solicitado a criar uma nova senha pessoal definitiva.
            </div>
          </div>

          <div class="btn-container">
            <a href="${APP_LOGIN_URL}" class="btn-primary" target="_blank">
              ACESSAR ÁREA DE MEMBROS AGORA →
            </a>
          </div>
        </div>

        <div class="footer">
          <p>© 2026 Formação VIP Pro. Todos os direitos reservados.</p>
          <p>Se tiver dúvidas, responda a este e-mail para contatar o suporte oficial.</p>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Formação VIP <acesso@formacaovip.pro>",
        to: [toEmail],
        subject: `🎉 Acesso Liberado: ${contentTitle} - Suas credenciais`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[Email Resend Error]", res.status, errText);
      return { success: false, error: errText };
    }

    const data = await res.json();
    return { success: true, id: data.id };
  } catch (err: any) {
    console.error("[Email Exception]", err.message);
    return { success: false, error: err.message };
  }
}

async function logWebhookExecution(params: {
  plataforma: string;
  evento: string;
  email_comprador?: string;
  nome_comprador?: string;
  produto_id?: string;
  produto_nome?: string;
  status_processamento: "sucesso" | "erro" | "ignorado" | "revogado";
  sucesso: boolean;
  mensagem_detalhe: string;
  payload_bruto: any;
}) {
  try {
    await supabase.from("webhook_logs").insert([
      {
        plataforma: params.plataforma,
        evento: params.evento,
        email_comprador: params.email_comprador || null,
        nome_comprador: params.nome_comprador || null,
        produto_id: params.produto_id || null,
        produto_nome: params.produto_nome || null,
        status_processamento: params.status_processamento,
        sucesso: params.sucesso,
        mensagem_detalhe: params.mensagem_detalhe,
        payload_bruto: params.payload_bruto,
      },
    ]);
  } catch (e: any) {
    console.error("[Log Webhook Exception]", e.message);
  }
}

// ============================================================================
// 5. NÚCLEO DE MAPEAMENTO E PROCESSAMENTO CENTRAL
// ============================================================================

interface ProcessResult {
  success: boolean;
  httpStatus: number;
  message: string;
  data?: any;
}

async function processEvent(event: NormalizedWebhookEvent): Promise<ProcessResult> {
  const {
    platform,
    normalizedStatus,
    externalOrderId,
    externalProductId,
    productName,
    buyerEmail,
    buyerName,
    rawPayload,
  } = event;

  // 1. Validação do e-mail do comprador
  if (!buyerEmail || !buyerEmail.includes("@")) {
    const errorMsg = `E-mail do comprador inválido ou ausente: "${buyerEmail}".`;
    await logWebhookExecution({
      plataforma: platform,
      evento: event.rawEvent,
      email_comprador: buyerEmail,
      nome_comprador: buyerName,
      produto_id: externalProductId,
      produto_nome: productName,
      status_processamento: "erro",
      sucesso: false,
      mensagem_detalhe: errorMsg,
      payload_bruto: rawPayload,
    });
    return { success: false, httpStatus: 400, message: errorMsg };
  }

  // 2. Validação do produto_id externo (Regra do PENDENTE e ausência de ID)
  if (
    !externalProductId ||
    externalProductId === "PENDENTE" ||
    externalProductId === "pendente" ||
    externalProductId.trim().length === 0
  ) {
    const errorMsg = `Produto externo pendente de configuração comercial ou ausente ("${externalProductId}"). Liberação recusada por segurança.`;
    await logWebhookExecution({
      plataforma: platform,
      evento: event.rawEvent,
      email_comprador: buyerEmail,
      nome_comprador: buyerName,
      produto_id: externalProductId || "PENDENTE",
      produto_nome: productName,
      status_processamento: "erro",
      sucesso: false,
      mensagem_detalhe: errorMsg,
      payload_bruto: rawPayload,
    });
    return { success: false, httpStatus: 422, message: errorMsg };
  }

  // 3. Consulta de mapeamento estrito na tabela produtos_cursos
  // REGRA ABSOLUTA: APENAS busca por igualdade estrita de produto_id e ativo = true
  const { data: mappingRows, error: mapErr } = await supabase
    .from("produtos_cursos")
    .select("id, produto_id, produto_nome, curso_id, curso_nome, area_id, digital_product_id, ativo")
    .eq("produto_id", externalProductId)
    .eq("ativo", true);

  if (mapErr) {
    const errorMsg = `Falha ao consultar mapeamento no banco de dados: ${mapErr.message}`;
    await logWebhookExecution({
      plataforma: platform,
      evento: event.rawEvent,
      email_comprador: buyerEmail,
      nome_comprador: buyerName,
      produto_id: externalProductId,
      produto_nome: productName,
      status_processamento: "erro",
      sucesso: false,
      mensagem_detalhe: errorMsg,
      payload_bruto: rawPayload,
    });
    return { success: false, httpStatus: 500, message: errorMsg };
  }

  // Se houver mais de um mapeamento para o mesmo produto_id externo: CONFLITO!
  if (mappingRows && mappingRows.length > 1) {
    const conflictMsg = `CONFLITO DE MAPEAMENTO: Múltiplos destinos (${mappingRows.length}) encontrados para o produto externo ${externalProductId}. Liberação bloqueada por segurança.`;
    await logWebhookExecution({
      plataforma: platform,
      evento: event.rawEvent,
      email_comprador: buyerEmail,
      nome_comprador: buyerName,
      produto_id: externalProductId,
      produto_nome: productName,
      status_processamento: "erro",
      sucesso: false,
      mensagem_detalhe: conflictMsg,
      payload_bruto: rawPayload,
    });
    return { success: false, httpStatus: 409, message: conflictMsg };
  }

  // Se não encontrar nenhum mapeamento ativo:
  if (!mappingRows || mappingRows.length === 0) {
    const unmappedMsg = `Produto externo não mapeado: ${externalProductId}. Nenhuma liberação autorizada.`;
    await logWebhookExecution({
      plataforma: platform,
      evento: event.rawEvent,
      email_comprador: buyerEmail,
      nome_comprador: buyerName,
      produto_id: externalProductId,
      produto_nome: productName,
      status_processamento: "erro",
      sucesso: false,
      mensagem_detalhe: unmappedMsg,
      payload_bruto: rawPayload,
    });
    return { success: false, httpStatus: 422, message: unmappedMsg };
  }

  const mapping = mappingRows[0];
  const { digital_product_id, area_id, curso_id, curso_nome } = mapping;
  const contentTitle = curso_nome || productName || "Conteúdo VIP";

  // ==========================================================================
  // FLUXO A: COMPRA APROVADA (APPROVED)
  // ==========================================================================
  if (normalizedStatus === "APPROVED") {
    // 1. Localizar ou criar usuário no Supabase Auth
    let userId = "";
    let isNewUser = false;
    let tempPassword = "";

    const { data: usersList, error: listErr } = await supabase.auth.admin.listUsers();
    if (listErr) {
      const errDetail = `Erro ao listar usuários no Supabase Auth: ${listErr.message}`;
      await logWebhookExecution({
        plataforma: platform,
        evento: "compra_aprovada",
        email_comprador: buyerEmail,
        nome_comprador: buyerName,
        produto_id: externalProductId,
        produto_nome: productName,
        status_processamento: "erro",
        sucesso: false,
        mensagem_detalhe: errDetail,
        payload_bruto: rawPayload,
      });
      return { success: false, httpStatus: 500, message: errDetail };
    }

    const existingUser = usersList?.users.find(
      (u) => u.email?.toLowerCase() === buyerEmail
    );

    if (existingUser) {
      userId = existingUser.id;
    } else {
      isNewUser = true;
      tempPassword = generateSecurePassword(12);

      const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
        email: buyerEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          name: buyerName || buyerEmail.split("@")[0],
          origin: platform,
          external_order_id: externalOrderId,
        },
      });

      if (createErr || !newUser?.user) {
        const createDetail = `Falha ao criar usuário no Supabase Auth: ${createErr?.message}`;
        await logWebhookExecution({
          plataforma: platform,
          evento: "compra_aprovada",
          email_comprador: buyerEmail,
          nome_comprador: buyerName,
          produto_id: externalProductId,
          produto_nome: productName,
          status_processamento: "erro",
          sucesso: false,
          mensagem_detalhe: createDetail,
          payload_bruto: rawPayload,
        });
        return { success: false, httpStatus: 500, message: createDetail };
      }

      userId = newUser.user.id;

      // Criar perfil em perfis com precisa_trocar_senha = true
      await supabase.from("perfis").upsert({
        id: userId,
        nome: buyerName || buyerEmail.split("@")[0],
        email: buyerEmail,
        role: "student",
        precisa_trocar_senha: true,
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(buyerName || buyerEmail)}`,
        updated_at: new Date().toISOString(),
      });
    }

    // 2. Liberação de acesso atômica e idempotente
    let accessResultDesc = "";

    // 2.1 Liberação em user_area_accesses (Para Produto Digital ou Área Inteira)
    if (digital_product_id) {
      // Liberação de produto digital específico
      const uaaId = `uaa_prod_${userId}_${digital_product_id}`.substring(0, 100);
      const { error: uaaErr } = await supabase.from("user_area_accesses").upsert(
        {
          id: uaaId,
          user_id: userId,
          area_id: area_id || "area-vip",
          product_id: digital_product_id,
          status: "active",
          granted_by: "webhook",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (uaaErr) {
        console.error("[Webhook] Erro no upsert de user_area_accesses:", uaaErr.message);
        accessResultDesc += `[Erro Produto: ${uaaErr.message}] `;
      } else {
        accessResultDesc += `[Produto Digital: ${digital_product_id} ATIVO] `;
      }
    } else if (area_id) {
      // Liberação de área de membros completa
      const uaaId = `uaa_area_${userId}_${area_id}`.substring(0, 100);
      const { error: uaaErr } = await supabase.from("user_area_accesses").upsert(
        {
          id: uaaId,
          user_id: userId,
          area_id: area_id,
          product_id: null,
          status: "active",
          granted_by: "webhook",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (uaaErr) {
        accessResultDesc += `[Erro Área: ${uaaErr.message}] `;
      } else {
        accessResultDesc += `[Área: ${area_id} ATIVA] `;
      }
    }

    // 2.2 Se houver curso_id legado associado, garante a matrícula na tabela matriculas
    if (curso_id) {
      const { error: matErr } = await supabase.from("matriculas").upsert(
        {
          user_id: userId,
          produto_id: externalProductId,
          produto_nome: productName,
          curso_id: curso_id,
          plataforma_origem: platform,
          status: "ativo",
          data_liberacao: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id, curso_id" }
      );

      if (matErr) {
        accessResultDesc += `[Aviso Matrícula: ${matErr.message}] `;
      } else {
        accessResultDesc += `[Curso: ${curso_id} ATIVO] `;
      }
    }

    // 3. Envio de e-mail de boas-vindas se for novo usuário
    let emailStatus = "not_needed_existing_user";
    if (isNewUser && tempPassword) {
      const emailRes = await sendWelcomeEmail(
        buyerEmail,
        buyerName,
        tempPassword,
        contentTitle
      );
      emailStatus = emailRes.success ? "sent" : `failed: ${emailRes.error || emailRes.reason}`;
    }

    // 4. Log de Sucesso e Idempotência
    await logWebhookExecution({
      plataforma: platform,
      evento: "compra_aprovada",
      email_comprador: buyerEmail,
      nome_comprador: buyerName,
      produto_id: externalProductId,
      produto_nome: productName,
      status_processamento: "sucesso",
      sucesso: true,
      mensagem_detalhe: isNewUser
        ? `Novo aluno provisionado. Acesso liberado: ${accessResultDesc}. E-mail de credenciais: ${emailStatus}.`
        : `Aluno existente identificado. Acesso sincronizado de forma idempotente: ${accessResultDesc}.`,
      payload_bruto: rawPayload,
    });

    return {
      success: true,
      httpStatus: 200,
      message: `Acesso liberado com sucesso para ${buyerEmail}.`,
      data: {
        userId,
        isNewUser,
        emailStatus,
        accessResultDesc,
      },
    };
  }

  // ==========================================================================
  // FLUXO B: REEMBOLSO (REFUNDED) OU CHARGEBACK
  // ==========================================================================
  if (normalizedStatus === "REFUNDED" || normalizedStatus === "CHARGEBACK") {
    const targetStatus = normalizedStatus === "CHARGEBACK" ? "blocked" : "revoked";
    const targetMatStatus = normalizedStatus === "CHARGEBACK" ? "revogado" : "reembolsado";

    // 1. Localiza o usuário pelo e-mail
    const { data: usersList } = await supabase.auth.admin.listUsers();
    const targetUser = usersList?.users.find((u) => u.email?.toLowerCase() === buyerEmail);

    if (!targetUser) {
      const noUserMsg = `Usuário ${buyerEmail} não localizado no sistema. Nenhum acesso a revogar.`;
      await logWebhookExecution({
        plataforma: platform,
        evento: normalizedStatus.toLowerCase(),
        email_comprador: buyerEmail,
        nome_comprador: buyerName,
        produto_id: externalProductId,
        produto_nome: productName,
        status_processamento: "ignorado",
        sucesso: true,
        mensagem_detalhe: noUserMsg,
        payload_bruto: rawPayload,
      });
      return { success: true, httpStatus: 200, message: noUserMsg };
    }

    let revokeDesc = "";

    // 2. Revogação em user_area_accesses
    if (digital_product_id) {
      const uaaId = `uaa_prod_${targetUser.id}_${digital_product_id}`.substring(0, 100);
      const { error: revErr } = await supabase
        .from("user_area_accesses")
        .update({ status: targetStatus, updated_at: new Date().toISOString() })
        .eq("id", uaaId);

      revokeDesc += revErr
        ? `[Erro revogação produto: ${revErr.message}] `
        : `[Produto ${digital_product_id}: ${targetStatus}] `;
    } else if (area_id) {
      const uaaId = `uaa_area_${targetUser.id}_${area_id}`.substring(0, 100);
      const { error: revErr } = await supabase
        .from("user_area_accesses")
        .update({ status: targetStatus, updated_at: new Date().toISOString() })
        .eq("id", uaaId);

      revokeDesc += revErr
        ? `[Erro revogação área: ${revErr.message}] `
        : `[Área ${area_id}: ${targetStatus}] `;
    }

    // 3. Revogação em matriculas (legado) buscando estritamente por user_id e produto_id
    if (curso_id) {
      const { error: matRevErr } = await supabase
        .from("matriculas")
        .update({ status: targetMatStatus, updated_at: new Date().toISOString() })
        .eq("user_id", targetUser.id)
        .eq("curso_id", curso_id);

      revokeDesc += matRevErr
        ? `[Erro revogação matrícula: ${matRevErr.message}] `
        : `[Matrícula curso ${curso_id}: ${targetMatStatus}] `;
    }

    await logWebhookExecution({
      plataforma: platform,
      evento: normalizedStatus.toLowerCase(),
      email_comprador: buyerEmail,
      nome_comprador: buyerName,
      produto_id: externalProductId,
      produto_nome: productName,
      status_processamento: "revogado",
      sucesso: true,
      mensagem_detalhe: `Acesso do aluno ${buyerEmail} atualizado para ${targetStatus} devido a ${normalizedStatus}. Detalhes: ${revokeDesc}`,
      payload_bruto: rawPayload,
    });

    return {
      success: true,
      httpStatus: 200,
      message: `Acesso revogado com sucesso para ${buyerEmail}.`,
      data: { revokeDesc },
    };
  }

  // ==========================================================================
  // FLUXO C: EVENTOS INFORMATIVOS (PENDING, CANCELLED, FAILED, UNKNOWN)
  // ==========================================================================
  const infoMsg = `Evento informativo recebido: status ${normalizedStatus} (ordem: ${externalOrderId || "s/n"}). Nenhuma concessão de acesso concedida.`;
  await logWebhookExecution({
    plataforma: platform,
    evento: event.rawEvent,
    email_comprador: buyerEmail,
    nome_comprador: buyerName,
    produto_id: externalProductId,
    produto_nome: productName,
    status_processamento: "ignorado",
    sucesso: true,
    mensagem_detalhe: infoMsg,
    payload_bruto: rawPayload,
  });

  return {
    success: true,
    httpStatus: 200,
    message: infoMsg,
  };
}

// ============================================================================
// 6. MAIN HTTP SERVER HANDLER
// ============================================================================
serve(async (req: Request) => {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);

  // Health-check / Diagnostic GET request
  if (req.method === "GET") {
    return new Response(
      JSON.stringify({
        status: "ready",
        version: "3.3",
        service: "webhook-liberacao-acesso",
        adapters: ["kiwify", "perfectpay"],
        strictMappingRule: "produto_id EXTERNO -> produtos_cursos.produto_id -> digital_product_id -> user_area_accesses.product_id",
        security: "Token authentication and exact mapping enforced",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  let body: any = {};
  try {
    const rawText = await req.text();
    if (rawText) {
      body = JSON.parse(rawText);
    }
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "Invalid JSON payload", detail: err.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Identificação do Adapter / Plataforma
  const pathname = url.pathname.toLowerCase();
  let adapter: GatewayAdapter | null = null;

  if (pathname.includes("kiwify") || url.searchParams.get("platform") === "kiwify") {
    adapter = KiwifyAdapter;
  } else if (
    pathname.includes("perfectpay") ||
    pathname.includes("perfect_pay") ||
    url.searchParams.get("platform") === "perfectpay"
  ) {
    adapter = PerfectPayAdapter;
  } else {
    // Detecção por estrutura do payload
    if (body.order_status || body.order_id || body.Customer || body.Signature) {
      adapter = KiwifyAdapter;
    } else if (body.sale_status_enum || body.sale_code || body.customer?.doc || body.token) {
      adapter = PerfectPayAdapter;
    }
  }

  if (!adapter) {
    return new Response(
      JSON.stringify({
        error: "Unrecognized platform. Send request to /kiwify or /perfectpay, or include ?platform= parameter.",
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Normalização do Evento via Adapter
  const normalizedEvent = adapter.normalize(body, req, url);

  // Validação de Autenticação / Token
  const authCheck = adapter.validateAuth(normalizedEvent);
  if (!authCheck.valid) {
    await logWebhookExecution({
      plataforma: adapter.name,
      evento: "unauthorized",
      email_comprador: normalizedEvent.buyerEmail,
      nome_comprador: normalizedEvent.buyerName,
      produto_id: normalizedEvent.externalProductId,
      produto_nome: normalizedEvent.productName,
      status_processamento: "erro",
      sucesso: false,
      mensagem_detalhe: authCheck.reason || "Token de autenticação não autorizado.",
      payload_bruto: body,
    });

    return new Response(
      JSON.stringify({ error: "Unauthorized", detail: authCheck.reason }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Processamento Central
  try {
    const result = await processEvent(normalizedEvent);
    return new Response(JSON.stringify(result), {
      status: result.httpStatus,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[Webhook Exception]", err.message);
    await logWebhookExecution({
      plataforma: adapter.name,
      evento: normalizedEvent.rawEvent,
      email_comprador: normalizedEvent.buyerEmail,
      nome_comprador: normalizedEvent.buyerName,
      produto_id: normalizedEvent.externalProductId,
      produto_nome: normalizedEvent.productName,
      status_processamento: "erro",
      sucesso: false,
      mensagem_detalhe: `Erro inesperado durante processamento: ${err.message}`,
      payload_bruto: body,
    });

    return new Response(
      JSON.stringify({ error: "Internal Server Error", message: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
