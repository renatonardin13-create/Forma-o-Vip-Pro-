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
  Radio
} from 'lucide-react';

interface WebhookLog {
  id: string;
  platform: string;
  event: string;
  customerEmail: string;
  customerName: string;
  productName: string;
  status: 'success' | 'error';
  timestamp: string;
  payload: any;
}

export const WebhooksManager: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('perfect_pay');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [webhookToken] = useState('pp_sec_live_9a87f2e1c4d5b6a0');
  const [simulatedLogs, setSimulatedLogs] = useState<WebhookLog[]>([
    {
      id: 'log_01',
      platform: 'Perfect Pay',
      event: 'purchase_approved',
      customerEmail: 'alunovip@exemplo.com.br',
      customerName: 'Rodrigo Medeiros',
      productName: 'Formação VIP PRO - Acesso Vitalício',
      status: 'success',
      timestamp: 'Hoje, às 14:32:10',
      payload: {
        event: 'purchase_approved',
        transaction_id: 'PP-98234710',
        product: { id: 'PROD-8821', name: 'Formação VIP PRO' },
        customer: { name: 'Rodrigo Medeiros', email: 'alunovip@exemplo.com.br', doc: '098.***.***-12' },
        status: 'approved',
        amount: 497.00
      }
    },
    {
      id: 'log_02',
      platform: 'Perfect Pay',
      event: 'subscription_renewed',
      customerEmail: 'mariana.silva@teste.com',
      customerName: 'Mariana Silva',
      productName: 'Clube Black VIP Mensal',
      status: 'success',
      timestamp: 'Hoje, às 11:15:45',
      payload: {
        event: 'subscription_renewed',
        transaction_id: 'PP-77123994',
        product: { id: 'PROD-3301', name: 'Clube Black VIP' },
        customer: { name: 'Mariana Silva', email: 'mariana.silva@teste.com' },
        status: 'approved',
        amount: 97.00
      }
    }
  ]);

  const [activeLogPayload, setActiveLogPayload] = useState<any | null>(null);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSuccessToast, setTestSuccessToast] = useState(false);

  const webhookEndpoint = `https://api.formacaovip.pro/v1/webhook/${selectedPlatform}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhookEndpoint);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(webhookToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleSimulateWebhook = () => {
    setIsSendingTest(true);
    setTimeout(() => {
      const newLog: WebhookLog = {
        id: 'log_' + Date.now(),
        platform: selectedPlatform === 'perfect_pay' ? 'Perfect Pay' : selectedPlatform.toUpperCase(),
        event: 'purchase_approved',
        customerEmail: `cliente_${Math.floor(Math.random() * 1000)}@gmail.com`,
        customerName: 'Cliente Teste Webhook',
        productName: 'Formação VIP PRO Master',
        status: 'success',
        timestamp: 'Agora mesmo',
        payload: {
          event: 'purchase_approved',
          transaction_id: 'PP-TEST-' + Math.floor(Math.random() * 900000 + 100000),
          product: { id: 'PROD-AUTO', name: 'Formação VIP PRO Master' },
          customer: { name: 'Cliente Teste Webhook', email: `cliente_${Math.floor(Math.random() * 1000)}@gmail.com` },
          status: 'approved',
          amount: 497.00,
          delivered_credentials: true
        }
      };

      setSimulatedLogs(prev => [newLog, ...prev]);
      setIsSendingTest(false);
      setTestSuccessToast(true);
      setTimeout(() => setTestSuccessToast(false), 3000);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E5A83B]/10 border border-[#E5A83B]/30 flex items-center justify-center">
              <Webhook className="w-6 h-6 text-[#E5A83B]" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Central de Webhooks & Integrações</h2>
              <p className="text-xs text-[#8E9BB0]">
                Receba vendas em tempo real, cadastre alunos automaticamente e envie as credenciais de acesso por e-mail e WhatsApp.
              </p>
            </div>
          </div>

          <button
            onClick={handleSimulateWebhook}
            disabled={isSendingTest}
            className="px-4 py-2.5 rounded-xl bg-[#E5A83B] hover:bg-[#D4AF37] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#E5A83B]/20 transition disabled:opacity-50"
          >
            {isSendingTest ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span>Simular Disparo de Venda (Teste)</span>
          </button>
        </div>

        {testSuccessToast && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Webhook de teste recebido com sucesso! Usuário criado e acesso liberado instantaneamente.</span>
          </div>
        )}
      </div>

      {/* Platform Selector & Endpoint */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Platform Selection */}
        <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            Selecione a Plataforma
          </h3>

          <div className="space-y-2">
            {[
              { id: 'perfect_pay', name: 'Perfect Pay', desc: 'Recomendada • Integração Nativa Oficial', badge: 'OFICIAL' },
              { id: 'kiwify', name: 'Kiwify', desc: 'Webhooks 2.0 & Token', badge: 'ATIVO' },
              { id: 'hotmart', name: 'Hotmart', desc: 'Hotmart Club & Postback', badge: 'ATIVO' },
              { id: 'eduzz', name: 'Eduzz / Nutror', desc: 'Nutror API & Webhook', badge: 'ATIVO' },
              { id: 'braip', name: 'Braip', desc: 'Postback de vendas', badge: 'ATIVO' },
            ].map(platform => {
              const isSelected = selectedPlatform === platform.id;
              return (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#151922] border-[#E5A83B] text-white shadow-sm'
                      : 'bg-[#08090C] border-[#1D2230] text-[#8E9BB0] hover:border-[#E5A83B]/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{platform.name}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        isSelected ? 'bg-[#E5A83B] text-black' : 'bg-[#1D2230] text-[#8E9BB0]'
                      }`}>
                        {platform.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#8E9BB0] mt-0.5">{platform.desc}</p>
                  </div>
                  <Radio className={`w-4 h-4 ${isSelected ? 'text-[#E5A83B]' : 'text-[#1D2230]'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Webhook URL & Token Setup */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#E5A83B]" />
              <span>URL de Postback / Webhook para {selectedPlatform === 'perfect_pay' ? 'Perfect Pay' : selectedPlatform.toUpperCase()}</span>
            </h3>

            {/* URL Box */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#8E9BB0] uppercase font-mono">
                URL DO SEU WEBHOOK (Copie e cole na plataforma de pagamento)
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 rounded-xl bg-[#08090C] border border-[#1D2230] font-mono text-xs text-white truncate select-all">
                  {webhookEndpoint}
                </div>
                <button
                  onClick={handleCopyUrl}
                  className="px-4 py-3 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-xs font-bold text-white border border-[#1D2230] flex items-center gap-1.5 transition flex-shrink-0"
                >
                  {copiedUrl ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedUrl ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Secret Token */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#8E9BB0] uppercase font-mono">
                TOKEN DE SEGURANÇA & ASSINATURA (SECRET KEY)
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 rounded-xl bg-[#08090C] border border-[#1D2230] font-mono text-xs text-[#E5A83B] truncate select-all flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#8E9BB0]" />
                  <span>{webhookToken}</span>
                </div>
                <button
                  onClick={handleCopyToken}
                  className="px-4 py-3 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-xs font-bold text-white border border-[#1D2230] flex items-center gap-1.5 transition flex-shrink-0"
                >
                  {copiedToken ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedToken ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Events Supported */}
            <div className="pt-2 border-t border-[#1D2230]">
              <span className="text-[10px] font-bold text-[#8E9BB0] uppercase font-mono block mb-2">
                EVENTOS PROCESSADOS AUTOMATICAMENTE:
              </span>
              <div className="flex flex-wrap gap-2">
                {['Venda Aprovada (PIX/Cartão/Boleto)', 'Assinatura Renovada', 'Reembolso / Chargeback', 'Carrinho Abandonado', 'Acesso Revogado'].map((ev, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-[#151922] border border-[#1D2230] text-[11px] text-[#E5A83B] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {ev}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Logs Table */}
          <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E5A83B]" />
                <span>Logs Recentes de Webhooks Recebidos</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE (STATUS 200 OK)
              </span>
            </div>

            <div className="space-y-2">
              {simulatedLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-[#08090C] border border-[#1D2230] hover:border-[#E5A83B]/40 transition flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{log.customerName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#151922] text-[#E5A83B] font-mono">
                          {log.platform}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#8E9BB0] truncate mt-0.5">
                        {log.customerEmail} • <span className="text-white">{log.productName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[10px] text-[#8E9BB0] font-mono hidden sm:inline">{log.timestamp}</span>
                    <button
                      onClick={() => setActiveLogPayload(log.payload)}
                      className="px-3 py-1 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-xs font-bold text-[#E5A83B] border border-[#1D2230] flex items-center gap-1"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>Payload</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payload Modal */}
      {activeLogPayload && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0D0F12] border border-[#1D2230] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1D2230] pb-3">
              <h4 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                <Code className="w-4 h-4 text-[#E5A83B]" />
                <span>JSON Payload do Webhook</span>
              </h4>
              <button
                onClick={() => setActiveLogPayload(null)}
                className="text-[#8E9BB0] hover:text-white text-xs font-bold font-mono"
              >
                FECHAR ✕
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-[#08090C] border border-[#1D2230] text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-72">
              {JSON.stringify(activeLogPayload, null, 2)}
            </pre>
            <div className="flex justify-end">
              <button
                onClick={() => setActiveLogPayload(null)}
                className="px-4 py-2 rounded-xl bg-[#E5A83B] text-black font-bold text-xs"
              >
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
