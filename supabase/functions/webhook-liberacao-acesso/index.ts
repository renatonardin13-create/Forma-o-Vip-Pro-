// Supabase Edge Function: webhook-liberacao-acesso
// Handles sales notifications from Kiwify and PerfectPay
// Automatically provisions member access, enrollments, user accounts, and dispatches luxury welcome emails via Resend.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

// Security & Environment Variables
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

// Helper: Generate Secure Random 12-char Password
function generateSecurePassword(length = 12): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const digits = "23456789";
  const special = "!@#$%&*";
  const all = upper + lower + digits + special;

  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);

  let password = "";
  // Guarantee at least one of each category
  password += upper[randomBytes[0] % upper.length];
  password += lower[randomBytes[1] % lower.length];
  password += digits[randomBytes[2] % digits.length];
  password += special[randomBytes[3] % special.length];

  for (let i = 4; i < length; i++) {
    password += all[randomBytes[i] % all.length];
  }

  // Shuffle the password characters
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}

// Helper: Send Transactional Luxury Welcome Email via Resend
async function sendWelcomeEmail(
  toEmail: string,
  studentName: string,
  tempPassword: string,
  courseName: string
) {
  if (!RESEND_API_KEY) {
    console.warn("[Email] RESEND_API_KEY not configured. Skipping email dispatch.");
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
        <!-- Header -->
        <div class="header">
          <div class="logo-badge">ÁREA DE MEMBROS VIP</div>
          <h1 class="title">Parabéns, ${firstName}!</h1>
          <p class="subtitle">Seu acesso ao conteúdo <strong>${courseName}</strong> está pronto.</p>
        </div>

        <!-- Content -->
        <div class="content">
          <p class="welcome-text">
            Olá, <strong>${studentName}</strong>! Identificamos o seu pagamento com sucesso. A sua conta foi provisionada em nossa plataforma premium e todas as aulas e materiais já estão disponíveis.
          </p>

          <!-- Credentials Box -->
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

          <!-- CTA Button -->
          <div class="btn-container">
            <a href="${APP_LOGIN_URL}" class="btn-primary" target="_blank">
              ACESSAR ÁREA DE MEMBROS AGORA →
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>© 2026 Formação VIP Pro. Todos os direitos reservados.</p>
          <p>Se tiver dúvidas, responda a este e-mail para contatar o nosso suporte.</p>
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
        subject: `🎉 Acesso Liberado: ${courseName} - Suas credenciais`,
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

// Helper: Write Log to Supabase `webhook_logs` table
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

// Helper: Process Approved Sale (Create/Find User, Create Matricula, Send Email)
async function processApprovedSale(params: {
  plataforma: "kiwify" | "perfectpay";
  buyerEmail: string;
  buyerName: string;
  productId: string;
  productName: string;
  payload: any;
}) {
  const { plataforma, buyerEmail, buyerName, productId, productName, payload } = params;
  const cleanEmail = buyerEmail.trim().toLowerCase();
  const cleanName = buyerName.trim() || cleanEmail.split("@")[0];

  // 1. Find Product -> Course Mapping in `produtos_cursos`
  let mappedCourseId = "course-default";
  let mappedCourseName = productName || "Formação VIP PRO";

  const { data: mappingData, error: mapErr } = await supabase
    .from("produtos_cursos")
    .select("curso_id, curso_nome, area_id, digital_product_id")
    .or(`produto_id.eq.${productId},produto_nome.ilike.%${productName}%`)
    .eq("ativo", true)
    .limit(1);

  if (!mapErr && mappingData && mappingData.length > 0) {
    mappedCourseId = mappingData[0].curso_id || "course-default";
    mappedCourseName = mappingData[0].curso_nome || productName;
  }

  // 2. Check if user already exists in Supabase Auth
  let userId = "";
  let isNewUser = false;
  let tempPassword = "";

  const { data: usersList, error: listUserErr } = await supabase.auth.admin.listUsers();
  const existingUser = usersList?.users.find(
    (u) => u.email?.toLowerCase() === cleanEmail
  );

  if (existingUser) {
    userId = existingUser.id;
    console.log(`[Webhook] Usuário existente encontrado: ${cleanEmail} (ID: ${userId})`);
  } else {
    // 3. Create new user in Supabase Auth
    isNewUser = true;
    tempPassword = generateSecurePassword(12);

    const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
      email: cleanEmail,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name: cleanName,
        origin: plataforma,
      },
    });

    if (createErr || !newUser.user) {
      throw new Error(`Falha ao criar usuário no Supabase Auth: ${createErr?.message}`);
    }

    userId = newUser.user.id;
    console.log(`[Webhook] Novo usuário criado com sucesso: ${cleanEmail} (ID: ${userId})`);

    // Create profile in `perfis` table with `precisa_trocar_senha = true`
    await supabase.from("perfis").upsert({
      id: userId,
      nome: cleanName,
      email: cleanEmail,
      role: "student",
      precisa_trocar_senha: true,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
      updated_at: new Date().toISOString(),
    });
  }

  // 4. Register or Update enrollment in `matriculas` (Legacy System)
  const { data: matricula, error: matErr } = await supabase.from("matriculas").upsert(
    {
      user_id: userId,
      produto_id: productId,
      produto_nome: productName,
      curso_id: mappedCourseId,
      plataforma_origem: plataforma,
      status: "ativo",
      data_liberacao: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id, curso_id" }
  ).select().single();

  if (matErr) {
    console.warn("[Webhook] Aviso ao gravar matrícula:", matErr.message);
  }

  // 4.1. NEW: Register or Update Individual Access in `user_area_accesses` (Flexible System)
  let flexibleAccessStatus = "skipped";
  if (!mapErr && mappingData && mappingData.length > 0) {
    const mapping = mappingData[0];
    const { area_id, digital_product_id } = mapping;

    if (digital_product_id) {
      // UPSERT atômico para produto específico baseado no índice unq_uaa_product_access
      const { error: accErr } = await supabase.from("user_area_accesses").upsert(
        {
          id: `uaa_prod_${userId}_${digital_product_id}`.substring(0, 100),
          user_id: userId,
          area_id: area_id,
          product_id: digital_product_id,
          status: "active",
          granted_by: "webhook",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id, product_id" }
      );
      
      if (accErr) {
        console.error("[Webhook] Erro no UPSERT de produto digital:", accErr.message);
        flexibleAccessStatus = `error_product: ${accErr.message}`;
      } else {
        flexibleAccessStatus = `product_active: ${digital_product_id}`;
      }
    } else if (area_id) {
      // UPSERT atômico para liberação total da área baseado no índice unq_uaa_area_access
      const { error: accErr } = await supabase.from("user_area_accesses").upsert(
        {
          id: `uaa_area_${userId}_${area_id}`.substring(0, 100),
          user_id: userId,
          area_id: area_id,
          product_id: null,
          status: "active",
          granted_by: "webhook",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id, area_id" }
      );

      if (accErr) {
        console.error("[Webhook] Erro no UPSERT de área de membros:", accErr.message);
        flexibleAccessStatus = `error_area: ${accErr.message}`;
      } else {
        flexibleAccessStatus = `area_active: ${area_id}`;
      }
    }
  }

  // 5. Send Welcome Email if this is a newly created student
  let emailStatus = "not_needed_existing_user";
  if (isNewUser && tempPassword) {
    const emailResult = await sendWelcomeEmail(
      cleanEmail,
      cleanName,
      tempPassword,
      mappedCourseName
    );
    emailStatus = emailResult.success ? "sent" : `failed: ${emailResult.error || emailResult.reason}`;
  }

  // 6. Log success
  await logWebhookExecution({
    plataforma,
    evento: "compra_aprovada",
    email_comprador: cleanEmail,
    nome_comprador: cleanName,
    produto_id: productId,
    produto_nome: productName,
    status_processamento: "sucesso",
    sucesso: true,
    mensagem_detalhe: isNewUser
      ? `Novo aluno criado. Acesso ${flexibleAccessStatus}. Matrícula #${matricula?.id || "ok"} para '${mappedCourseName}'. E-mail: ${emailStatus}.`
      : `Aluno já existente. Acesso ${flexibleAccessStatus}. Matrícula para '${mappedCourseName}'.`,
    payload_bruto: payload,
  });

  return {
    success: true,
    user_id: userId,
    is_new_user: isNewUser,
    course_id: mappedCourseId,
    course_name: mappedCourseName,
    email_status: emailStatus,
  };
}

// Helper: Process Refund / Chargeback (Revoke Enrollment)
async function processRefundOrChargeback(params: {
  plataforma: "kiwify" | "perfectpay";
  buyerEmail: string;
  productId: string;
  productName: string;
  reason: string;
  payload: any;
}) {
  const { plataforma, buyerEmail, productId, productName, reason, payload } = params;
  const cleanEmail = buyerEmail.trim().toLowerCase();

  // Find user by email
  const { data: usersList } = await supabase.auth.admin.listUsers();
  const user = usersList?.users.find((u) => u.email?.toLowerCase() === cleanEmail);

  if (!user) {
    await logWebhookExecution({
      plataforma,
      evento: reason,
      email_comprador: cleanEmail,
      produto_id: productId,
      produto_nome: productName,
      status_processamento: "ignorado",
      sucesso: true,
      mensagem_detalhe: `Usuário ${cleanEmail} não encontrado no banco. Nenhuma ação de cancelamento necessária.`,
      payload_bruto: payload,
    });
    return { success: true, message: "User not found, nothing to revoke" };
  }

  // 1. Update matriculas status to 'reembolsado' / 'revogado' (Legacy System)
  const { error: updateErr } = await supabase
    .from("matriculas")
    .update({
      status: reason === "chargeback" ? "revogado" : "reembolsado",
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .or(`produto_id.eq.${productId},produto_nome.eq.${productName}`);

  // 2. Find Mapping for Flexible System
  const { data: mappingData } = await supabase
    .from("produtos_cursos")
    .select("area_id, digital_product_id")
    .or(`produto_id.eq.${productId},produto_nome.eq.${productName}`)
    .eq("ativo", true)
    .limit(1);

  let flexibleRevokeStatus = "none";
  if (mappingData && mappingData.length > 0) {
    const { area_id, digital_product_id } = mappingData[0];
    const newStatus = reason === "chargeback" ? "blocked" : "revoked";

    if (digital_product_id) {
      const { error: revErr } = await supabase
        .from("user_area_accesses")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("product_id", digital_product_id);
      
      flexibleRevokeStatus = revErr ? `error_product: ${revErr.message}` : `product_revoked: ${digital_product_id}`;
    } else if (area_id) {
      const { error: revErr } = await supabase
        .from("user_area_accesses")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("area_id", area_id)
        .is("product_id", null);
      
      flexibleRevokeStatus = revErr ? `error_area: ${revErr.message}` : `area_revoked: ${area_id}`;
    }
  }

  await logWebhookExecution({
    plataforma,
    evento: reason,
    email_comprador: cleanEmail,
    produto_id: productId,
    produto_nome: productName,
    status_processamento: "revogado",
    sucesso: true,
    mensagem_detalhe: `Acesso revogado (Matrícula: ${updateErr ? "erro" : "ok"}, Digital: ${flexibleRevokeStatus}) devido a ${reason}.`,
    payload_bruto: payload,
  });

  return { success: true, message: "Access revoked successfully" };
}

// MAIN REQUEST HANDLER
serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const pathname = url.pathname;

  // Determine platform from route or payload
  let platform: "kiwify" | "perfectpay" | "unknown" = "unknown";
  if (pathname.includes("kiwify") || url.searchParams.get("platform") === "kiwify") {
    platform = "kiwify";
  } else if (
    pathname.includes("perfectpay") ||
    pathname.includes("perfect_pay") ||
    url.searchParams.get("platform") === "perfectpay"
  ) {
    platform = "perfectpay";
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

  // Auto-detect platform from payload if route was generic
  if (platform === "unknown") {
    if (body.order_status || body.order_id || body.Customer || body.Signature) {
      platform = "kiwify";
    } else if (body.sale_status_enum || body.sale_code || body.customer?.doc || body.token) {
      platform = "perfectpay";
    }
  }

  // ==========================================
  // 1. KIWIFY PROCESSOR & SECURITY VALIDATION
  // ==========================================
  if (platform === "kiwify") {
    const signatureOrToken =
      body.signature ||
      body.token ||
      body.webhook_token ||
      url.searchParams.get("token") ||
      req.headers.get("x-kiwify-signature") ||
      req.headers.get("x-webhook-token");

    // Security Token Validation against KIWIFY_WEBHOOK_TOKEN
    if (KIWIFY_WEBHOOK_TOKEN && signatureOrToken !== KIWIFY_WEBHOOK_TOKEN) {
      await logWebhookExecution({
        plataforma: "kiwify",
        evento: "unauthorized",
        status_processamento: "erro",
        sucesso: false,
        mensagem_detalhe: "Token de segurança Kiwify inválido ou ausente.",
        payload_bruto: body,
      });

      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid Kiwify Webhook Token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const orderStatus = (body.order_status || body.status || "").toLowerCase();
    const eventName = (body.event || "").toLowerCase();

    // Extract Buyer Data from Kiwify Payload
    const buyerEmail = body.Customer?.email || body.customer?.email || body.email || "";
    const buyerName = body.Customer?.full_name || body.customer?.name || body.name || "";
    const productId = body.Product?.product_id || body.product?.id || body.product_id || "PROD-KIWIFY";
    const productName = body.Product?.product_name || body.product?.name || body.product_name || "Formação VIP Kiwify";

    // Filter Approved Events: "paid", "approved", "compra_aprovada", "order_approved"
    const isApproved =
      orderStatus === "paid" ||
      orderStatus === "approved" ||
      eventName === "compra_aprovada" ||
      eventName === "order_approved";

    // Filter Refund / Chargeback
    const isRefund =
      orderStatus === "refunded" ||
      orderStatus === "chargedback" ||
      orderStatus === "chargeback" ||
      eventName === "order_refunded" ||
      eventName === "order_chargeback";

    if (isApproved) {
      try {
        const result = await processApprovedSale({
          plataforma: "kiwify",
          buyerEmail,
          buyerName,
          productId,
          productName,
          payload: body,
        });

        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err: any) {
        await logWebhookExecution({
          plataforma: "kiwify",
          evento: "compra_aprovada",
          email_comprador: buyerEmail,
          nome_comprador: buyerName,
          produto_id: productId,
          produto_nome: productName,
          status_processamento: "erro",
          sucesso: false,
          mensagem_detalhe: `Erro ao processar liberação: ${err.message}`,
          payload_bruto: body,
        });

        return new Response(
          JSON.stringify({ error: "Internal processing error", message: err.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else if (isRefund) {
      const result = await processRefundOrChargeback({
        plataforma: "kiwify",
        buyerEmail,
        productId,
        productName,
        reason: orderStatus.includes("charge") ? "chargeback" : "reembolso",
        payload: body,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      // Other events: waiting_payment, boleto, abandoned_cart
      await logWebhookExecution({
        plataforma: "kiwify",
        evento: orderStatus || eventName || "other_event",
        email_comprador: buyerEmail,
        nome_comprador: buyerName,
        produto_id: productId,
        produto_nome: productName,
        status_processamento: "ignorado",
        sucesso: true,
        mensagem_detalhe: `Evento Kiwify '${orderStatus || eventName}' recebido e registrado (sem alteração de matrícula).`,
        payload_bruto: body,
      });

      return new Response(
        JSON.stringify({ message: "Event ignored (not approved or refund)", status: orderStatus }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }

  // ===============================================
  // 2. PERFECT PAY PROCESSOR & SECURITY VALIDATION
  // ===============================================
  if (platform === "perfectpay") {
    const token =
      body.token ||
      body.webhook_token ||
      body.security_token ||
      url.searchParams.get("token") ||
      req.headers.get("x-webhook-token");

    // Security Token Validation against PERFECTPAY_WEBHOOK_TOKEN
    if (PERFECTPAY_WEBHOOK_TOKEN && token !== PERFECTPAY_WEBHOOK_TOKEN) {
      await logWebhookExecution({
        plataforma: "perfectpay",
        evento: "unauthorized",
        status_processamento: "erro",
        sucesso: false,
        mensagem_detalhe: "Token de autenticação PerfectPay inválido ou ausente.",
        payload_bruto: body,
      });

      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid PerfectPay Webhook Token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const saleStatusEnum = (body.sale_status_enum || body.status || "").toString().toLowerCase();

    // Extract Buyer Data from PerfectPay Payload
    const buyerEmail =
      body.customer?.email ||
      body.customer_email ||
      body.client?.email ||
      body.email ||
      "";
    const buyerName =
      body.customer?.name ||
      body.customer_name ||
      body.client?.name ||
      body.name ||
      "";
    const productId =
      body.product?.code ||
      body.product?.id ||
      body.product_code ||
      body.product_id ||
      "PROD-PERFECTPAY";
    const productName =
      body.product?.name ||
      body.product_name ||
      "Formação VIP PerfectPay";

    // PerfectPay Approved Status: "approved", 2 (approved numeric enum)
    const isApproved =
      saleStatusEnum === "approved" ||
      saleStatusEnum === "2" ||
      saleStatusEnum === "authorized" ||
      saleStatusEnum === "complete";

    // PerfectPay Refund / Chargeback Status: "refunded", "chargeback", 4 (refunded), 7 (chargeback)
    const isRefund =
      saleStatusEnum === "refunded" ||
      saleStatusEnum === "chargeback" ||
      saleStatusEnum === "4" ||
      saleStatusEnum === "7";

    if (isApproved) {
      try {
        const result = await processApprovedSale({
          plataforma: "perfectpay",
          buyerEmail,
          buyerName,
          productId,
          productName,
          payload: body,
        });

        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err: any) {
        await logWebhookExecution({
          plataforma: "perfectpay",
          evento: "compra_aprovada",
          email_comprador: buyerEmail,
          nome_comprador: buyerName,
          produto_id: productId,
          produto_nome: productName,
          status_processamento: "erro",
          sucesso: false,
          mensagem_detalhe: `Erro ao processar liberação PerfectPay: ${err.message}`,
          payload_bruto: body,
        });

        return new Response(
          JSON.stringify({ error: "Internal processing error", message: err.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else if (isRefund) {
      const result = await processRefundOrChargeback({
        plataforma: "perfectpay",
        buyerEmail,
        productId,
        productName,
        reason: saleStatusEnum.includes("charge") || saleStatusEnum === "7" ? "chargeback" : "reembolso",
        payload: body,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      // Waiting payment, boleto generated, etc.
      await logWebhookExecution({
        plataforma: "perfectpay",
        evento: `status_${saleStatusEnum}`,
        email_comprador: buyerEmail,
        nome_comprador: buyerName,
        produto_id: productId,
        produto_nome: productName,
        status_processamento: "ignorado",
        sucesso: true,
        mensagem_detalhe: `Evento PerfectPay '${saleStatusEnum}' recebido (aguardando aprovação).`,
        payload_bruto: body,
      });

      return new Response(
        JSON.stringify({ message: "Event ignored (status not approved)", status: saleStatusEnum }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }

  // Fallback for unhandled route
  return new Response(
    JSON.stringify({ error: "Unrecognized platform. Send to /kiwify or /perfectpay" }),
    { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
