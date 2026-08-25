import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Sparkles, 
  Layers, 
  Save, 
  Link as LinkIcon,
  RefreshCw,
  Plus
} from 'lucide-react';
import { useStore } from '../../services/store';

interface ProductMapping {
  id: string;
  perfectPayCode: string;
  courseId: string;
  planName: string;
  price: string;
  status: 'active' | 'pending';
}

export const PerfectPayIntegration: React.FC = () => {
  const { courses } = useStore();

  const [apiToken, setApiToken] = useState('pp_live_token_77a98b12f4e3c2d1');
  const [webhookSecret, setWebhookSecret] = useState('pp_secret_sign_990142');
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  const [mappings, setMappings] = useState<ProductMapping[]>([
    {
      id: 'map_1',
      perfectPayCode: 'PPA129380',
      courseId: courses[0]?.id || 'course-1',
      planName: 'Formação VIP PRO (Acesso Anual)',
      price: 'R$ 497,00',
      status: 'active'
    },
    {
      id: 'map_2',
      perfectPayCode: 'PPA884192',
      courseId: courses[1]?.id || 'course-2',
      planName: 'Clube Black VIP (Assinatura Mensal)',
      price: 'R$ 97,00/mês',
      status: 'active'
    }
  ]);

  const [newPPCode, setNewPPCode] = useState('');
  const [newCourseId, setNewCourseId] = useState(courses[0]?.id || '');
  const [newPlanName, setNewPlanName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const handleAddMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPPCode || !newPlanName) return;

    const newMap: ProductMapping = {
      id: 'map_' + Date.now(),
      perfectPayCode: newPPCode.toUpperCase(),
      courseId: newCourseId,
      planName: newPlanName,
      price: newPrice || 'R$ 297,00',
      status: 'active'
    };

    setMappings(prev => [...prev, newMap]);
    setNewPPCode('');
    setNewPlanName('');
    setNewPrice('');
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E5A83B]/10 border border-[#E5A83B]/30 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-[#E5A83B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">Integração Oficial Perfect Pay</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                CONEXÃO ATIVA
              </span>
            </div>
            <p className="text-xs text-[#8E9BB0]">
              Cadastre seus produtos na Perfect Pay, vincule aos cursos da área de membros e libere acessos no piloto automático.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://app.perfectpay.com.br"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#E5A83B] hover:bg-[#D4AF37] text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#E5A83B]/20 transition"
          >
            <span>Acessar Painel Perfect Pay</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Configuração e mapeamento de produto salvos com sucesso!</span>
        </div>
      )}

      {/* Grid: Credentials & Mappings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: API Credentials */}
        <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#E5A83B]" />
            <span>Credenciais da Perfect Pay</span>
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#8E9BB0] uppercase font-mono">Chave de API / Token Live</label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-[#E5A83B] font-mono"
                />
                <button
                  onClick={() => handleCopy(apiToken, 'token')}
                  className="p-2 rounded-xl bg-[#151922] text-[#8E9BB0] hover:text-white border border-[#1D2230]"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#8E9BB0] uppercase font-mono">URL de Notificação (Webhook)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://api.formacaovip.pro/v1/webhook/perfect_pay"
                  className="w-full px-3 py-2 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white font-mono"
                />
                <button
                  onClick={() => handleCopy("https://api.formacaovip.pro/v1/webhook/perfect_pay", "wh")}
                  className="p-2 rounded-xl bg-[#151922] text-[#8E9BB0] hover:text-white border border-[#1D2230]"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Checklist Guide */}
            <div className="pt-3 border-t border-[#1D2230] space-y-2">
              <span className="text-[10px] font-bold text-[#8E9BB0] uppercase font-mono block">
                PASSO A PASSO NA PERFECT PAY:
              </span>
              <ol className="text-xs text-[#8E9BB0] space-y-1.5 list-decimal list-inside">
                <li>Acesse <strong>Produtos &gt; Criar Produto</strong> na Perfect Pay.</li>
                <li>Na aba <strong>Integrações &gt; Postback / Webhook</strong>, cole a URL acima.</li>
                <li>Marque os eventos <strong>Venda Aprovada</strong> e <strong>Assinatura Ativa</strong>.</li>
                <li>Copie o código do produto (Ex: <code className="text-[#E5A83B]">PPA129380</code>) e vincule ao lado!</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Right: Product Mapping Table & Add Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Product Form */}
          <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#E5A83B]" />
              <span>Vincular Novo Produto Perfect Pay ao Curso</span>
            </h3>

            <form onSubmit={handleAddMapping} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#8E9BB0] uppercase font-mono">Código Perfect Pay</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: PPA98120"
                  value={newPPCode}
                  onChange={(e) => setNewPPCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-[#E5A83B] font-mono uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#8E9BB0] uppercase font-mono">Nome da Oferta / Plano</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Acesso Vitalício VIP"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#8E9BB0] uppercase font-mono">Curso a Liberar</label>
                <select
                  value={newCourseId}
                  onChange={(e) => setNewCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#E5A83B] hover:bg-[#D4AF37] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#E5A83B]/20 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Vincular</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Mappings List */}
          <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#E5A83B]" />
              <span>Produtos & Cursos Mapeados ({mappings.length})</span>
            </h3>

            <div className="space-y-2.5">
              {mappings.map(map => {
                const linkedCourse = courses.find(c => c.id === map.courseId);
                return (
                  <div
                    key={map.id}
                    className="p-4 rounded-2xl bg-[#08090C] border border-[#1D2230] hover:border-[#E5A83B]/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#151922] text-[#E5A83B] font-mono text-xs font-bold border border-[#1D2230]">
                          {map.perfectPayCode}
                        </span>
                        <span className="text-xs font-bold text-white">{map.planName}</span>
                      </div>
                      <p className="text-[11px] text-[#8E9BB0] flex items-center gap-1">
                        <span>🔓 Libera acesso ao curso:</span>
                        <strong className="text-white">{linkedCourse?.title || 'Todos os Cursos VIP'}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-emerald-400 font-mono">{map.price}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                        SINCRONIZADO
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
