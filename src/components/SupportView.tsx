import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Send, CheckCircle2, Crown, Sparkles, ChevronDown, ChevronUp, Mail, ShieldAlert } from 'lucide-react';

export const SupportView: React.FC = () => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Dúvida sobre Conteúdo');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSent, setTicketSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Como funciona a emissão dos certificados oficiais da Área VIP?',
      a: 'Assim que você concluir 100% das aulas de qualquer curso da plataforma, o certificado é emitido automaticamente com seu nome e código único de validação na aba CERTIFICADOS.'
    },
    {
      q: 'Posso assistir às aulas pelo smartphone ou tablet?',
      a: 'Sim! A Formação VIP Pro é totalmente responsiva e otimizada para todos os tamanhos de tela (smartphones, tablets, notebooks e smart TVs via navegador).'
    },
    {
      q: 'Como solicitar materiais adicionais ou sugerir novos temas de aulas?',
      a: 'Você pode enviar uma mensagem diretamente pelo formulário de Suporte Executivo abaixo ou postar sua sugestão na Comunidade VIP.'
    },
    {
      q: 'Qual o tempo médio de resposta do suporte ao aluno?',
      a: 'Como membro VIP, você possui atendimento prioritário com tempo de resposta de no máximo 2 horas em dias úteis.'
    }
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;
    setTicketSent(true);
    setTimeout(() => {
      setTicketSubject('');
      setTicketMessage('');
      setTicketSent(false);
    }, 4000);
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#1D2230] pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest font-mono">CONCIERGE & ATENDIMENTO</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          Suporte Executivo ao Membro VIP
        </h1>
        <p className="text-xs lg:text-sm text-[#A7AFBF]">
          Canal exclusivo para dúvidas acadêmicas, suporte técnico à plataforma e atendimento personalizado.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Ticket Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 lg:p-8 rounded-3xl bg-[#151922] border border-[#1D2230] space-y-5 shadow-card-dark">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                Abrir Chamado Prioritário
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] font-bold font-mono">
                SLA &lt; 2h
              </span>
            </div>

            {ticketSent ? (
              <div className="py-8 text-center space-y-3 bg-[#0D0F12] rounded-2xl border border-emerald-500/30 p-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-white">Chamado Enviado com Sucesso!</h3>
                <p className="text-xs text-[#A7AFBF]">
                  Nossa equipe de especialistas entrará em contato em breve via e-mail e notificações da plataforma.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A7AFBF]">Assunto do Chamado</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Ex: Dúvida sobre a planilha do Módulo 1"
                    className="w-full h-10 px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white placeholder-[#A7AFBF]/50 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A7AFBF]">Categoria de Atendimento</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Dúvida sobre Conteúdo">Dúvida sobre Conteúdo & Aulas</option>
                    <option value="Suporte Técnico">Suporte Técnico & Acesso à Plataforma</option>
                    <option value="Certificados">Certificados & Validação</option>
                    <option value="Financeiro">Plano VIP & Faturamento</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A7AFBF]">Mensagem Detalhada</label>
                  <textarea
                    required
                    rows={5}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Descreva sua solicitação com o máximo de detalhes para agilizar seu atendimento..."
                    className="w-full p-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white placeholder-[#A7AFBF]/50 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:from-[#F5D76E] hover:to-[#D4AF37] text-black font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-gold-glow transition"
                >
                  <Send className="w-4 h-4" />
                  <span>ENVIAR CHAMADO PRIORITÁRIO</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: FAQ Accordion (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
            Perguntas Frequentes (FAQ)
          </h2>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="rounded-2xl bg-[#151922] border border-[#1D2230] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[#1D2230]/40 transition"
                >
                  <span className="text-xs font-bold text-white pr-2">{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#A7AFBF] flex-shrink-0" />
                  )}
                </button>

                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-[#A7AFBF] leading-relaxed border-t border-[#1D2230]/60 bg-[#0D0F12]/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#0D0F12] border border-[#D4AF37]/30 space-y-2 mt-4">
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase font-mono tracking-wider">CANAL DIRETO VIP</span>
            <p className="text-xs text-white font-semibold">Atendimento Concierge WhatsApp</p>
            <p className="text-[11px] text-[#A7AFBF]">Disponível de Segunda a Sexta, das 09h às 19h para membros VIP Pro.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
