import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Copy, 
  Edit3, 
  Eye, 
  Sparkles, 
  RefreshCw,
  FileCode,
  Layout,
  Crown
} from 'lucide-react';

interface EmailTemplate {
  id: string;
  title: string;
  category: 'Boas-Vindas' | 'Conteúdo' | 'Certificado' | 'Recuperação' | 'Vendas';
  subject: string;
  preheader: string;
  body: string;
}

export const EmailTemplatesManager: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: 'tpl_welcome',
      title: 'Acesso Imediato & Boas-Vindas VIP',
      category: 'Boas-Vindas',
      subject: '🔥 Parabéns! Seu acesso à Formação VIP PRO foi liberado',
      preheader: 'Aqui estão seus dados de acesso e primeiros passos...',
      body: `Olá, <strong>{NOME_ALUNO}</strong>! 🎉<br/><br/>
Seja muito bem-vindo(a) à <strong>Formação VIP PRO</strong>. Seu pagamento foi confirmado com sucesso e sua vaga exclusiva está garantida!<br/><br/>
<strong>🔑 SEUS DADOS DE ACESSO:</strong><br/>
• <strong>Link da Área de Membros:</strong> <a href="{LINK_ACESSO}" style="color: #D4AF37;">{LINK_ACESSO}</a><br/>
• <strong>E-mail:</strong> {EMAIL_ALUNO}<br/>
• <strong>Senha Provisória:</strong> {SENHA_TEMPORARIA}<br/><br/>
Recomendamos que você assista imediatamente à aula de <em>Boas-Vindas & Alinhamento de Expectativas</em> no Módulo 1.<br/><br/>
Bons estudos e nos vemos no topo!<br/>
<em>Equipe Formação VIP PRO</em>`
    },
    {
      id: 'tpl_new_lesson',
      title: 'Notificação de Nova Aula / Módulo Liberado',
      category: 'Conteúdo',
      subject: '🚀 Novo Módulo Liberado: {NOME_MODULO}',
      preheader: 'Uma nova estratégia acabou de entrar na sua área de membros...',
      body: `Fala, <strong>{NOME_ALUNO}</strong>!<br/><br/>
Acabamos de liberar um novo conteúdo de alto nível para acelerar seus resultados:<br/><br/>
📚 <strong>Módulo:</strong> {NOME_MODULO}<br/>
🎬 <strong>Nova Aula:</strong> {NOME_AULA}<br/><br/>
Acesse agora mesmo e não perca tempo:<br/>
<a href="{LINK_ACESSO}" style="display:inline-block; padding: 12px 24px; background-color: #E5A83B; color: #000; font-weight: bold; text-decoration: none; border-radius: 8px; margin-top: 10px;">ASSISTIR AULA AGORA &rarr;</a>`
    },
    {
      id: 'tpl_certificate',
      title: 'Certificado de Conclusão Disponível',
      category: 'Certificado',
      subject: '🏆 Seu Certificado Oficial da Formação VIP PRO está pronto!',
      preheader: 'Você concluiu 100% da formação. Baixe seu certificado...',
      body: `Parabéns pela dedicação, <strong>{NOME_ALUNO}</strong>! 🎓<br/><br/>
Você concluiu 100% das aulas e módulos da <strong>Formação VIP PRO</strong> e agora faz parte do grupo seleto de alunos certificados.<br/><br/>
Clique no link abaixo para visualizar, baixar e compartilhar seu certificado oficial no LinkedIn:<br/><br/>
<a href="{LINK_CERTIFICADO}" style="display:inline-block; padding: 12px 24px; background-color: #E5A83B; color: #000; font-weight: bold; text-decoration: none; border-radius: 8px;">BAIXAR MEU CERTIFICADO VIP &rarr;</a>`
    },
    {
      id: 'tpl_recovery',
      title: 'Recuperação de Acesso e Senha',
      category: 'Recuperação',
      subject: '🔐 Instruções para redefinir sua senha',
      preheader: 'Solicitação de redefinição de senha na área VIP...',
      body: `Olá, <strong>{NOME_ALUNO}</strong>.<br/><br/>
Recebemos um pedido para redefinir a senha da sua conta na <strong>Formação VIP PRO</strong>.<br/><br/>
Para criar uma nova senha, clique no botão abaixo:<br/>
<a href="{LINK_REDEFINIR_SENHA}" style="display:inline-block; padding: 12px 24px; background-color: #E5A83B; color: #000; font-weight: bold; text-decoration: none; border-radius: 8px; margin-top: 10px;">REDEFINIR MINHA SENHA</a><br/><br/>
Se você não solicitou essa troca, ignore este e-mail.`
    }
  ]);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl_welcome');
  const [activeTabMode, setActiveTabMode] = useState<'editor' | 'preview'>('preview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  const handleUpdateActiveTemplate = (field: keyof EmailTemplate, value: string) => {
    setTemplates(prev => prev.map(t => t.id === activeTemplate.id ? { ...t, [field]: value } : t));
  };

  const handleSendTest = () => {
    setToastMessage(`E-mail de teste enviado com sucesso para o administrador!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E5A83B]/10 border border-[#E5A83B]/30 flex items-center justify-center">
            <Mail className="w-6 h-6 text-[#E5A83B]" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Templates de E-mail Automáticos</h2>
            <p className="text-xs text-[#8E9BB0]">
              Personalize os e-mails transacionais enviados aos seus alunos (Boas-vindas, Liberação de Aulas e Certificados).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSendTest}
            className="px-4 py-2.5 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-[#E5A83B] border border-[#E5A83B]/40 font-bold text-xs flex items-center gap-2 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Disparar E-mail de Teste</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List */}
        <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            Modelos de E-mail
          </h3>

          <div className="space-y-2">
            {templates.map(tpl => {
              const isSelected = selectedTemplateId === tpl.id;
              return (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition ${
                    isSelected
                      ? 'bg-[#151922] border-[#E5A83B] text-white shadow-sm'
                      : 'bg-[#08090C] border-[#1D2230] text-[#8E9BB0] hover:border-[#E5A83B]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{tpl.title}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isSelected ? 'bg-[#E5A83B] text-black' : 'bg-[#1D2230] text-[#8E9BB0]'
                    }`}>
                      {tpl.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#8E9BB0] truncate mt-1">{tpl.subject}</p>
                </button>
              );
            })}
          </div>

          {/* Dynamic Tags Helper */}
          <div className="pt-4 border-t border-[#1D2230] space-y-2">
            <span className="text-[10px] font-bold text-[#8E9BB0] uppercase font-mono block">
              TAGS DINÂMICAS DISPONÍVEIS:
            </span>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-[#E5A83B]">
              <span className="p-1 rounded bg-[#151922] border border-[#1D2230]">{'{NOME_ALUNO}'}</span>
              <span className="p-1 rounded bg-[#151922] border border-[#1D2230]">{'{EMAIL_ALUNO}'}</span>
              <span className="p-1 rounded bg-[#151922] border border-[#1D2230]">{'{LINK_ACESSO}'}</span>
              <span className="p-1 rounded bg-[#151922] border border-[#1D2230]">{'{SENHA_TEMPORARIA}'}</span>
              <span className="p-1 rounded bg-[#151922] border border-[#1D2230]">{'{NOME_CURSO}'}</span>
            </div>
          </div>
        </div>

        {/* Editor / Live Preview Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1D2230] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white uppercase font-mono">{activeTemplate.title}</span>
              </div>

              <div className="flex items-center gap-1 bg-[#151922] p-1 rounded-xl border border-[#1D2230]">
                <button
                  type="button"
                  onClick={() => setActiveTabMode('preview')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTabMode === 'preview' ? 'bg-[#E5A83B] text-black' : 'text-[#8E9BB0] hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Prévia Real</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTabMode('editor')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTabMode === 'editor' ? 'bg-[#E5A83B] text-black' : 'text-[#8E9BB0] hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar Texto & HTML</span>
                </button>
              </div>
            </div>

            {/* Subject Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#8E9BB0] uppercase font-mono">Assunto do E-mail</label>
              <input
                type="text"
                value={activeTemplate.subject}
                onChange={(e) => handleUpdateActiveTemplate('subject', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white focus:border-[#E5A83B] focus:outline-none"
              />
            </div>

            {/* Mode 1: Real Visual Email Preview */}
            {activeTabMode === 'preview' ? (
              <div className="rounded-2xl border border-[#1D2230] overflow-hidden bg-white text-gray-900 shadow-xl">
                {/* Email Client Header */}
                <div className="p-4 bg-gray-100 border-b border-gray-200 text-xs space-y-1">
                  <p><strong className="text-gray-600">De:</strong> Formação VIP PRO &lt;suporte@formacaovip.pro&gt;</p>
                  <p><strong className="text-gray-600">Para:</strong> aluno.vip@exemplo.com.br</p>
                  <p><strong className="text-gray-600">Assunto:</strong> {activeTemplate.subject.replace('{NOME_MODULO}', 'Escala & Automação').replace('{NOME_AULA}', 'Como Duplicar Vendas')}</p>
                </div>

                {/* Email Body */}
                <div className="p-8 max-w-xl mx-auto space-y-6">
                  {/* Brand Header */}
                  <div className="text-center pb-4 border-b border-gray-100">
                    <div className="inline-flex items-center justify-center p-3 bg-black rounded-2xl mb-2">
                      <Crown className="w-6 h-6 text-[#E5A83B]" />
                    </div>
                    <h3 className="font-extrabold text-lg text-black tracking-tight">FORMAÇÃO VIP PRO</h3>
                    <p className="text-[10px] text-gray-400 font-mono tracking-widest">EXCLUSIVE MEMBERSHIP AREA</p>
                  </div>

                  <div 
                    className="text-sm text-gray-700 leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ 
                      __html: activeTemplate.body
                        .replace(/{NOME_ALUNO}/g, 'Rodrigo Medeiros')
                        .replace(/{EMAIL_ALUNO}/g, 'rodrigo.medeiros@gmail.com')
                        .replace(/{LINK_ACESSO}/g, 'https://membros.formacaovip.pro')
                        .replace(/{SENHA_TEMPORARIA}/g, 'vip@2026')
                        .replace(/{NOME_MODULO}/g, 'Módulo 04: Funil Perpétuo')
                        .replace(/{NOME_AULA}/g, 'Estratégia de Conversão Rápida')
                        .replace(/{LINK_CERTIFICADO}/g, '#')
                        .replace(/{LINK_REDEFINIR_SENHA}/g, '#')
                    }} 
                  />

                  {/* Footer */}
                  <div className="pt-6 border-t border-gray-100 text-center text-[10px] text-gray-400">
                    <p>© 2026 Formação VIP PRO. Todos os direitos reservados.</p>
                    <p>Enviado com carinho pela sua equipe de mentores.</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Mode 2: HTML / Textarea Editor */
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#8E9BB0] uppercase font-mono">Conteúdo HTML do E-mail</label>
                <textarea
                  rows={12}
                  value={activeTemplate.body}
                  onChange={(e) => handleUpdateActiveTemplate('body', e.target.value)}
                  className="w-full p-4 rounded-xl bg-[#08090C] border border-[#1D2230] font-mono text-xs text-emerald-400 focus:border-[#E5A83B] focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
