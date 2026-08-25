import React, { useState } from 'react';
import { 
  Webhook, 
  CheckCircle2, 
  Copy, 
  Send, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  Clock, 
  AlertCircle,
  Code,
  ExternalLink,
  Lock,
  Radio,
  BookOpen,
  Plus,
  Trash2,
  Mail,
  Database,
  Filter,
  Check,
  FileCode,
  Layers,
  ArrowRight,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { useStore } from '../../services/store';
import { ProdutoCursoMapping, WebhookLogRecord } from '../../types';

export const WebhooksManager: React.FC = () => {
  const { 
    courses, 
    produtosCursos, 
    saveProdutoCursoMapping, 
    deleteProdutoCursoMapping, 
    webhookLogs, 
    addWebhookLog, 
    clearWebhookLogs,
    processWebhookSimulation,
    matriculas
  } = useStore();

  const [activeTab, setActiveTab] = useState<'endpoints' | 'simulator' | 'mappings' | 'logs' | 'sql' | 'email'>('endpoints');
  const [selectedPlatform, setSelectedPlatform] = useState<'perfectpay' | 'kiwify'>('perfectpay');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Simulator State
  const [simPlatform, setSimPlatform] = useState<'perfectpay' | 'kiwify'>('perfectpay');
  const [simEventType, setSimEventType] = useState<'approved' | 'refund' | 'chargeback' | 'invalid_token' | 'waiting_payment'>('approved');
  const [simBuyerName, setSimBuyerName] = useState('Rodrigo Medeiros');
  const [simBuyerEmail, setSimBuyerEmail] = useState('rodrigo.medeiros@exemplo.com.br');
  const [simProductId, setSimProductId] = useState('PPA882194');
  const [simProductName, setSimProductName] = useState('Formação VIP PRO Master');
  const [simToken, setSimToken] = useState('pp_sec_live_9a87f2e1c4d5b6a0');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<{ success: boolean; message: string; log: WebhookLogRecord; userCreated?: boolean; tempPassword?: string } | null>(null);

  // Mapping Form State
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [newProdId, setNewProdId] = useState('');
  const [newProdName, setNewProdName] = useState('');
  const [newCourseId, setNewCourseId] = useState(courses[0]?.id || 'course-negocios-digitais');
  const [newPlat, setNewPlat] = useState<'kiwify' | 'perfectpay' | 'todas'>('todas');

  // Logs Filter & Payload Modal
  const [logFilterPlatform, setLogFilterPlatform] = useState<string>('all');
  const [activePayloadModal, setActivePayloadModal] = useState<WebhookLogRecord | null>(null);

  // Supabase edge function URLs
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://membros.formacaovip.pro';
  const perfectPayUrl = `${baseUrl}/functions/v1/webhook-liberacao-acesso/perfectpay`;
  const kiwifyUrl = `${baseUrl}/functions/v1/webhook-liberacao-acesso/kiwify`;

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleRunSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulating(true);
    setSimResult(null);

    setTimeout(() => {
      const res = processWebhookSimulation({
        platform: simPlatform,
        eventType: simEventType,
        buyerEmail: simBuyerEmail,
        buyerName: simBuyerName,
        productId: simProductId,
        productName: simProductName,
        token: simEventType === 'invalid_token' ? 'TOKEN_INVALIDO_TESTE' : simToken
      });
      setSimResult(res);
      setIsSimulating(false);
    }, 600);
  };

  const handleSaveMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdId || !newProdName || !newCourseId) return;

    const selectedCourse = courses.find(c => c.id === newCourseId);
    saveProdutoCursoMapping({
      id: `map_${Date.now()}`,
      produto_id: newProdId.trim(),
      produto_nome: newProdName.trim(),
      curso_id: newCourseId,
      curso_nome: selectedCourse?.title || 'Curso VIP',
      plataforma: newPlat,
      ativo: true,
      created_at: new Date().toISOString().split('T')[0]
    });

    setNewProdId('');
    setNewProdName('');
    setShowMappingModal(false);
  };

  const filteredLogs = webhookLogs.filter(log => {
    if (logFilterPlatform === 'all') return true;
    return log.plataforma === logFilterPlatform;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E5A83B]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E5A83B]/10 border border-[#E5A83B]/30 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#E5A83B]/10">
              <Webhook className="w-7 h-7 text-[#E5A83B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">Central de Webhooks & Automação de Acesso</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                  EDGE FUNCTION 2026
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#8E9BB0] mt-1 max-w-3xl leading-relaxed">
                Integração automática para <strong>Kiwify</strong> e <strong>PerfectPay</strong> via Supabase Edge Function <code className="text-[#E5A83B] bg-[#151922] px-1.5 py-0.5 rounded">webhook-liberacao-acesso</code>. Criação de usuário, vínculo de matrículas, envio de e-mails de boas-vindas com Resend e troca de senha no primeiro acesso.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('simulator')}
            className="px-5 py-3 rounded-2xl bg-[#E5A83B] hover:bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#E5A83B]/20 transition flex-shrink-0"
          >
            <Zap className="w-4 h-4" />
            <span>Simulador de Vendas</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-[#1D2230] pt-4 overflow-x-auto no-scrollbar">
          {[
            { id: 'endpoints', label: 'Rotas & Tokens', icon: ShieldCheck },
            { id: 'simulator', label: 'Simulador / Testes', icon: Zap },
            { id: 'mappings', label: `Mapeamento Produtos (${produtosCursos.length})`, icon: Layers },
            { id: 'logs', label: `Logs de Execução (${webhookLogs.length})`, icon: Clock },
            { id: 'sql', label: 'Schema SQL Supabase', icon: Database },
            { id: 'email', label: 'Template de Boas-Vindas', icon: Mail }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#151922] text-[#E5A83B] border border-[#E5A83B]/50 shadow-sm'
                    : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: ENDPOINTS & TOKENS */}
      {activeTab === 'endpoints' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Kiwify Endpoint Card */}
          <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-400 text-sm">
                  KW
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Rota Webhook: Kiwify</h3>
                  <p className="text-[11px] text-[#8E9BB0]">Validação via assinatura / token Kiwify</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono text-[10px] font-bold">
                POST /kiwify
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8E9BB0] font-mono">
                URL de Webhook (Cole na Kiwify em Configurações &gt; Webhooks)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={kiwifyUrl}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs font-mono text-white select-all"
                />
                <button
                  onClick={() => copyToClipboard(kiwifyUrl, 'kiwify_url')}
                  className="px-3.5 py-2.5 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-white border border-[#1D2230] text-xs font-bold flex items-center gap-1.5 transition"
                >
                  {copiedField === 'kiwify_url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'kiwify_url' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8E9BB0] font-mono">
                Variável de Ambiente: <code className="text-[#E5A83B]">KIWIFY_WEBHOOK_TOKEN</code>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="kiwify_sec_live_example_token_9912"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs font-mono text-[#E5A83B] select-all"
                />
                <button
                  onClick={() => copyToClipboard('kiwify_sec_live_example_token_9912', 'kiwify_token')}
                  className="px-3.5 py-2.5 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-white border border-[#1D2230] text-xs font-bold flex items-center gap-1.5 transition"
                >
                  {copiedField === 'kiwify_token' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'kiwify_token' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#08090C] border border-[#1D2230] space-y-1.5 text-xs text-[#8E9BB0]">
              <p className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Eventos Processados:
              </p>
              <p className="text-[11px] leading-relaxed">
                • <strong className="text-emerald-400">compra_aprovada / order_status: paid</strong>: Cria usuário no Auth, gera matrícula e dispara boas-vindas.<br />
                • <strong className="text-rose-400">reembolso / chargeback</strong>: Revoga a matrícula imediatamente.<br />
                • <strong className="text-amber-400">aguardando_pagamento / boleto</strong>: Apenas loga no banco sem liberar acesso.
              </p>
            </div>
          </div>

          {/* PerfectPay Endpoint Card */}
          <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E5A83B]/10 border border-[#E5A83B]/30 flex items-center justify-center font-black text-[#E5A83B] text-sm">
                  PP
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Rota Webhook: PerfectPay</h3>
                  <p className="text-[11px] text-[#8E9BB0]">Validação via token público de PostBack</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#E5A83B]/15 text-[#E5A83B] font-mono text-[10px] font-bold">
                POST /perfectpay
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8E9BB0] font-mono">
                URL de Postback (Cole na PerfectPay em Ferramentas &gt; Postback)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={perfectPayUrl}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs font-mono text-white select-all"
                />
                <button
                  onClick={() => copyToClipboard(perfectPayUrl, 'perfectpay_url')}
                  className="px-3.5 py-2.5 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-white border border-[#1D2230] text-xs font-bold flex items-center gap-1.5 transition"
                >
                  {copiedField === 'perfectpay_url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'perfectpay_url' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8E9BB0] font-mono">
                Variável de Ambiente: <code className="text-[#E5A83B]">PERFECTPAY_WEBHOOK_TOKEN</code>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="pp_sec_live_9a87f2e1c4d5b6a0"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs font-mono text-[#E5A83B] select-all"
                />
                <button
                  onClick={() => copyToClipboard('pp_sec_live_9a87f2e1c4d5b6a0', 'perfectpay_token')}
                  className="px-3.5 py-2.5 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-white border border-[#1D2230] text-xs font-bold flex items-center gap-1.5 transition"
                >
                  {copiedField === 'perfectpay_token' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'perfectpay_token' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#08090C] border border-[#1D2230] space-y-1.5 text-xs text-[#8E9BB0]">
              <p className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E5A83B]" /> Eventos Processados:
              </p>
              <p className="text-[11px] leading-relaxed">
                • <strong className="text-emerald-400">sale_status_enum: approved / 2</strong>: Criação automática de aluno e envio de e-mail.<br />
                • <strong className="text-rose-400">sale_status_enum: refunded / chargeback / 6 / 7</strong>: Revogação automática de matrículas.<br />
                • <strong className="text-amber-400">sale_status_enum: pending / 1</strong>: Registro em logs.
              </p>
            </div>
          </div>

          {/* Environment Variables Table */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#E5A83B]" />
              <span>Variáveis de Ambiente Necessárias (Supabase Secrets)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#1D2230] text-[#8E9BB0] uppercase font-mono text-[10px]">
                    <th className="py-2.5 px-3">Variável</th>
                    <th className="py-2.5 px-3">Descrição</th>
                    <th className="py-2.5 px-3">Origem</th>
                    <th className="py-2.5 px-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D2230] font-mono">
                  <tr>
                    <td className="py-3 px-3 font-bold text-[#E5A83B]">KIWIFY_WEBHOOK_TOKEN</td>
                    <td className="py-3 px-3 text-[#8E9BB0]">Token secreto da Kiwify para validar payloads</td>
                    <td className="py-3 px-3 text-white">Dashboard Kiwify</td>
                    <td className="py-3 px-3 text-right">
                      <button onClick={() => copyToClipboard('KIWIFY_WEBHOOK_TOKEN', 'v1')} className="text-[#E5A83B] hover:underline">Copiar Nome</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-[#E5A83B]">PERFECTPAY_WEBHOOK_TOKEN</td>
                    <td className="py-3 px-3 text-[#8E9BB0]">Token público de PostBack da PerfectPay</td>
                    <td className="py-3 px-3 text-white">Dashboard PerfectPay</td>
                    <td className="py-3 px-3 text-right">
                      <button onClick={() => copyToClipboard('PERFECTPAY_WEBHOOK_TOKEN', 'v2')} className="text-[#E5A83B] hover:underline">Copiar Nome</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-emerald-400">RESEND_API_KEY</td>
                    <td className="py-3 px-3 text-[#8E9BB0]">API Key para disparo de e-mails de boas-vindas</td>
                    <td className="py-3 px-3 text-white">resend.com/api-keys</td>
                    <td className="py-3 px-3 text-right">
                      <button onClick={() => copyToClipboard('RESEND_API_KEY', 'v3')} className="text-[#E5A83B] hover:underline">Copiar Nome</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-blue-400">SUPABASE_SERVICE_ROLE_KEY</td>
                    <td className="py-3 px-3 text-[#8E9BB0]">Chave mestra do Supabase para criar alunos no Auth</td>
                    <td className="py-3 px-3 text-white">Supabase Settings &gt; API</td>
                    <td className="py-3 px-3 text-right">
                      <button onClick={() => copyToClipboard('SUPABASE_SERVICE_ROLE_KEY', 'v4')} className="text-[#E5A83B] hover:underline">Copiar Nome</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E5A83B]/10 border border-[#E5A83B]/30 flex items-center justify-center text-[#E5A83B]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Simulador de Eventos de Webhook</h3>
                  <p className="text-xs text-[#8E9BB0]">Teste o fluxo completo sem gastar um centavo</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleRunSimulation} className="space-y-4">
              {/* Platform selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSimPlatform('perfectpay');
                    setSimProductId('PPA882194');
                    setSimProductName('Formação VIP PRO Master');
                    setSimToken('pp_sec_live_9a87f2e1c4d5b6a0');
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                    simPlatform === 'perfectpay'
                      ? 'bg-[#151922] border-[#E5A83B] text-white'
                      : 'bg-[#08090C] border-[#1D2230] text-[#8E9BB0]'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-white">PerfectPay</p>
                    <p className="text-[10px] text-[#8E9BB0]">Payload padrão Postback</p>
                  </div>
                  <Radio className={`w-4 h-4 ${simPlatform === 'perfectpay' ? 'text-[#E5A83B]' : 'text-[#1D2230]'}`} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSimPlatform('kiwify');
                    setSimProductId('KW-PROD-991');
                    setSimProductName('Mentoria Tráfego Escala 100k');
                    setSimToken('kiwify_sec_live_example_token_9912');
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                    simPlatform === 'kiwify'
                      ? 'bg-[#151922] border-emerald-500 text-white'
                      : 'bg-[#08090C] border-[#1D2230] text-[#8E9BB0]'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-white">Kiwify</p>
                    <p className="text-[10px] text-[#8E9BB0]">Payload Webhook 2.0</p>
                  </div>
                  <Radio className={`w-4 h-4 ${simPlatform === 'kiwify' ? 'text-emerald-400' : 'text-[#1D2230]'}`} />
                </button>
              </div>

              {/* Event type */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-[#8E9BB0] font-mono">
                  Tipo de Evento a Simular
                </label>
                <select
                  value={simEventType}
                  onChange={(e) => setSimEventType(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#E5A83B]"
                >
                  <option value="approved">✅ Compra Aprovada (Liberar Acesso + Enviar E-mail)</option>
                  <option value="refund">↩️ Reembolso / Estorno (Revogar Acesso)</option>
                  <option value="chargeback">⚠️ Chargeback / Contestação (Bloquear Acesso)</option>
                  <option value="waiting_payment">⏳ Boleto/PIX Gerado (Apenas Logar, sem liberar)</option>
                  <option value="invalid_token">🚫 Token Inválido / Assinatura Errada (Retornar 401)</option>
                </select>
              </div>

              {/* Buyer info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-[#8E9BB0] font-mono">Nome do Comprador</label>
                  <input
                    type="text"
                    required
                    value={simBuyerName}
                    onChange={(e) => setSimBuyerName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#E5A83B]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-[#8E9BB0] font-mono">E-mail do Comprador</label>
                  <input
                    type="email"
                    required
                    value={simBuyerEmail}
                    onChange={(e) => setSimBuyerEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#E5A83B]"
                  />
                </div>
              </div>

              {/* Product info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-[#8E9BB0] font-mono">Código / ID do Produto</label>
                  <input
                    type="text"
                    required
                    value={simProductId}
                    onChange={(e) => setSimProductId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#E5A83B] font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-[#8E9BB0] font-mono">Nome do Produto</label>
                  <input
                    type="text"
                    required
                    value={simProductName}
                    onChange={(e) => setSimProductName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#E5A83B]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSimulating}
                className="w-full py-3.5 rounded-xl bg-[#E5A83B] hover:bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#E5A83B]/20 transition disabled:opacity-50"
              >
                {isSimulating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{isSimulating ? 'Processando Webhook...' : 'Disparar Simulação de Webhook'}</span>
              </button>
            </form>
          </div>

          {/* Simulation Output */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-4">
              <h3 className="text-sm font-extrabold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <Code className="w-4 h-4 text-[#E5A83B]" />
                <span>Resultado da Execução</span>
              </h3>

              {simResult ? (
                <div className="space-y-4 animate-in fade-in">
                  <div className={`p-4 rounded-2xl border ${
                    simResult.success 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  } space-y-2`}>
                    <div className="flex items-center gap-2">
                      {simResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <ShieldAlert className="w-5 h-5 text-rose-400" />}
                      <span className="font-extrabold text-sm text-white">
                        {simResult.success ? 'Webhook Executado com Sucesso' : 'Falha na Validação'}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#D0D7E2]">{simResult.message}</p>

                    {simResult.userCreated && simResult.tempPassword && (
                      <div className="mt-3 p-3 rounded-xl bg-[#08090C] border border-emerald-500/30 space-y-1 font-mono text-xs">
                        <p className="text-emerald-400 font-bold">🔑 Novo Aluno Criado:</p>
                        <p className="text-white">Email: <span className="text-[#8E9BB0]">{simBuyerEmail}</span></p>
                        <p className="text-white">Senha Provisória: <span className="text-[#E5A83B] font-black">{simResult.tempPassword}</span></p>
                        <p className="text-[10px] text-emerald-400/80">precisa_trocar_senha = true (Troca obrigatória no 1º login)</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-[#8E9BB0] font-bold">Log de Auditoria Gerado:</label>
                    <pre className="p-3.5 rounded-xl bg-[#08090C] border border-[#1D2230] text-[11px] font-mono text-[#8E9BB0] overflow-x-auto max-h-48">
                      {JSON.stringify(simResult.log, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-[#8E9BB0] space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-[#1D2230]" />
                  <p className="text-xs">Preencha o formulário e clique em Disparar Simulação para visualizar o processamento em tempo real.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCT TO COURSE MAPPINGS */}
      {activeTab === 'mappings' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">Mapeamento: Produtos das Plataformas → Cursos da Área VIP</h3>
              <p className="text-xs text-[#8E9BB0]">
                Tabela <code className="text-[#E5A83B] bg-[#151922] px-1.5 py-0.5 rounded">produtos_cursos</code>. Quando o webhook recebe uma venda do ID do produto, ele libera automaticamente o curso correspondente.
              </p>
            </div>

            <button
              onClick={() => setShowMappingModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#E5A83B] hover:bg-[#D4AF37] text-black font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Mapeamento</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1D2230] text-[#8E9BB0] uppercase font-mono text-[10px]">
                  <th className="py-3 px-4">Plataforma</th>
                  <th className="py-3 px-4">Código / ID do Produto</th>
                  <th className="py-3 px-4">Nome do Produto</th>
                  <th className="py-3 px-4">Curso Liberado na Área VIP</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D2230]">
                {produtosCursos.map(mapping => (
                  <tr key={mapping.id} className="hover:bg-[#151922]/40 transition">
                    <td className="py-3.5 px-4 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        mapping.plataforma === 'perfectpay' 
                          ? 'bg-[#E5A83B]/10 text-[#E5A83B] border border-[#E5A83B]/30'
                          : mapping.plataforma === 'kiwify'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      }`}>
                        {mapping.plataforma.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white select-all">
                      {mapping.produto_id}
                    </td>
                    <td className="py-3.5 px-4 text-white font-medium">
                      {mapping.produto_nome}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-[#E5A83B]" />
                        <span className="font-bold text-white">{mapping.curso_nome}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                        ATIVO
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => deleteProdutoCursoMapping(mapping.id)}
                        className="p-1.5 rounded-lg text-[#8E9BB0] hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Remover mapeamento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal for adding mapping */}
          {showMappingModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0D0F12] border border-[#1D2230] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
                <h4 className="text-base font-extrabold text-white">Adicionar Novo Mapeamento</h4>
                <form onSubmit={handleSaveMapping} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#8E9BB0] uppercase font-mono">Plataforma</label>
                    <select
                      value={newPlat}
                      onChange={(e) => setNewPlat(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white"
                    >
                      <option value="perfectpay">PerfectPay</option>
                      <option value="kiwify">Kiwify</option>
                      <option value="todas">Todas as Plataformas</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#8E9BB0] uppercase font-mono">ID / Código do Produto</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: PPA882194 ou KW-PROD-991"
                      value={newProdId}
                      onChange={(e) => setNewProdId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#8E9BB0] uppercase font-mono">Nome do Produto</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Formação VIP PRO Vitalício"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#8E9BB0] uppercase font-mono">Curso a Liberar</label>
                    <select
                      value={newCourseId}
                      onChange={(e) => setNewCourseId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white"
                    >
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowMappingModal(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#8E9BB0] hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#E5A83B] hover:bg-[#D4AF37] text-black font-bold text-xs"
                    >
                      Salvar Mapeamento
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: WEBHOOK LOGS & AUDIT */}
      {activeTab === 'logs' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">Auditoria de Webhooks em Tempo Real</h3>
              <p className="text-xs text-[#8E9BB0]">
                Tabela <code className="text-[#E5A83B] bg-[#151922] px-1.5 py-0.5 rounded">webhook_logs</code>. Registra todas as requisições recebidas, status de processamento e respostas.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={logFilterPlatform}
                onChange={(e) => setLogFilterPlatform(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white"
              >
                <option value="all">Todas as plataformas</option>
                <option value="perfectpay">Apenas PerfectPay</option>
                <option value="kiwify">Apenas Kiwify</option>
              </select>

              <button
                onClick={clearWebhookLogs}
                className="px-3 py-2 rounded-xl bg-[#151922] hover:bg-rose-500/20 text-xs font-bold text-[#8E9BB0] hover:text-rose-400 border border-[#1D2230] transition"
              >
                Limpar Logs
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredLogs.map(log => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-[#08090C] border border-[#1D2230] hover:border-[#E5A83B]/40 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      log.status_processamento === 'sucesso'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : log.status_processamento === 'revogado'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : log.status_processamento === 'ignorado'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {log.status_processamento.toUpperCase()}
                    </span>

                    <span className="text-xs font-mono font-bold text-white uppercase">
                      {log.plataforma} • {log.evento}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-[#8E9BB0]">
                    <span>{log.created_at}</span>
                    <button
                      onClick={() => setActivePayloadModal(log)}
                      className="px-2.5 py-1 rounded-lg bg-[#151922] hover:bg-[#1D2230] text-[#E5A83B] font-mono text-[10px] font-bold flex items-center gap-1"
                    >
                      <Code className="w-3 h-3" /> Ver Payload
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#8E9BB0] pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-mono block text-[#8E9BB0]/70">Comprador</span>
                    <strong className="text-white">{log.nome_comprador}</strong> ({log.email_comprador})
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono block text-[#8E9BB0]/70">Produto / ID</span>
                    <span className="text-white">{log.produto_nome || log.produto_id || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono block text-[#8E9BB0]/70">Detalhe</span>
                    <span className="text-white truncate block">{log.mensagem_detalhe}</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="py-12 text-center text-[#8E9BB0]">
                Nenhum log registrado ainda. Utilize o Simulador de Vendas para disparar requisições de teste.
              </div>
            )}
          </div>

          {/* Modal Payload Inspector */}
          {activePayloadModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0D0F12] border border-[#1D2230] rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Code className="w-4 h-4 text-[#E5A83B]" />
                    <span>Payload Bruto ({activePayloadModal.plataforma.toUpperCase()})</span>
                  </h4>
                  <button
                    onClick={() => setActivePayloadModal(null)}
                    className="text-[#8E9BB0] hover:text-white text-xs font-bold"
                  >
                    Fechar
                  </button>
                </div>

                <pre className="p-4 rounded-2xl bg-[#08090C] border border-[#1D2230] text-xs font-mono text-emerald-400 overflow-x-auto max-h-96 select-all">
                  {JSON.stringify(activePayloadModal.payload_bruto, null, 2)}
                </pre>

                <div className="flex justify-end">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(activePayloadModal.payload_bruto, null, 2), 'payload_json')}
                    className="px-4 py-2 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedField === 'payload_json' ? 'Copiado!' : 'Copiar JSON'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: SQL MIGRATION VIEW & COPY */}
      {activeTab === 'sql' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">Migration SQL Completa para o Supabase</h3>
              <p className="text-xs text-[#8E9BB0]">
                Execute esse script no <strong>Supabase SQL Editor</strong> para criar as tabelas <code className="text-[#E5A83B]">perfis</code>, <code className="text-[#E5A83B]">matriculas</code>, <code className="text-[#E5A83B]">produtos_cursos</code> e <code className="text-[#E5A83B]">webhook_logs</code> com RLS e triggers.
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(`-- SUPABASE MIGRATION: Webhook Liberação de Acesso & Área de Membros
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

CREATE TABLE IF NOT EXISTS public.webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plataforma TEXT NOT NULL,
    evento TEXT,
    email_comprador TEXT,
    nome_comprador TEXT,
    produto_id TEXT,
    produto_nome TEXT,
    status_processamento TEXT NOT NULL,
    sucesso BOOLEAN DEFAULT FALSE,
    mensagem_detalhe TEXT,
    payload_bruto JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matriculas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos_cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;`, 'sql_script')}
              className="px-4 py-2.5 rounded-xl bg-[#E5A83B] hover:bg-[#D4AF37] text-black font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              {copiedField === 'sql_script' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedField === 'sql_script' ? 'Script Copiado!' : 'Copiar SQL Completo'}</span>
            </button>
          </div>

          <pre className="p-4 sm:p-6 rounded-2xl bg-[#08090C] border border-[#1D2230] text-xs font-mono text-emerald-400 overflow-x-auto max-h-[500px] select-all leading-relaxed">
{`-- 1. Tabela de Perfis de Usuários (Profiles)
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

-- 2. Tabela de Matrículas dos Alunos
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

-- 3. Mapeamento Produto → Curso
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

-- 4. Logs de Auditoria
CREATE TABLE IF NOT EXISTS public.webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plataforma TEXT NOT NULL,
    evento TEXT,
    email_comprador TEXT,
    nome_comprador TEXT,
    produto_id TEXT,
    produto_nome TEXT,
    status_processamento TEXT NOT NULL,
    sucesso BOOLEAN DEFAULT FALSE,
    mensagem_detalhe TEXT,
    payload_bruto JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`}
          </pre>
        </div>
      )}

      {/* TAB 6: RESEND WELCOME EMAIL PREVIEW */}
      {activeTab === 'email' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">Preview do E-mail Transacional de Boas-Vindas (Resend)</h3>
              <p className="text-xs text-[#8E9BB0]">
                Template HTML responsivo com a identidade visual <strong>Dourado &amp; Grafite</strong>, credenciais de primeiro acesso e link seguro.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              Resend API v2 Ready
            </span>
          </div>

          {/* Email Preview Box */}
          <div className="max-w-xl mx-auto rounded-3xl bg-[#08090C] border border-[#E5A83B]/30 p-8 space-y-6 shadow-2xl text-left font-sans">
            <div className="text-center space-y-2 border-b border-[#1D2230] pb-6">
              <div className="inline-block px-3 py-1 rounded-full bg-[#E5A83B]/10 border border-[#E5A83B]/30 text-[#E5A83B] text-[10px] font-extrabold font-mono uppercase tracking-widest">
                FORMAÇÃO VIP PRO
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Seu Acesso Foi Liberado! 🚀</h2>
              <p className="text-xs text-[#8E9BB0]">Parabéns pela decisão de acelerar os seus resultados.</p>
            </div>

            <div className="space-y-4 text-xs text-[#D0D7E2] leading-relaxed">
              <p>Olá, <strong className="text-white">Rodrigo Medeiros</strong>,</p>
              <p>Seu pagamento foi confirmado com sucesso e sua vaga no curso <strong className="text-[#E5A83B]">Formação VIP PRO Master</strong> está 100% liberada.</p>

              {/* Credentials Box */}
              <div className="p-4 rounded-2xl bg-[#151922] border border-[#1D2230] space-y-2 font-mono">
                <p className="text-[11px] font-bold text-[#E5A83B] uppercase">Suas Credenciais de Acesso:</p>
                <p className="text-xs text-white"><strong>E-mail:</strong> rodrigo.medeiros@exemplo.com.br</p>
                <p className="text-xs text-white"><strong>Senha Temporária:</strong> <span className="text-[#E5A83B] font-bold bg-[#08090C] px-2 py-0.5 rounded border border-[#E5A83B]/30">Vip#994821!</span></p>
                <p className="text-[10px] text-[#8E9BB0] pt-1">
                  🔒 Por questões de segurança, você será convidado a cadastrar uma nova senha pessoal no seu primeiro login.
                </p>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  className="w-full py-3.5 rounded-xl bg-[#E5A83B] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#E5A83B]/20"
                >
                  Acessar Área de Membros VIP Agora
                </button>
              </div>
            </div>

            <div className="border-t border-[#1D2230] pt-4 text-center text-[10px] text-[#8E9BB0]">
              © 2026 Formação VIP PRO. Todos os direitos reservados.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
