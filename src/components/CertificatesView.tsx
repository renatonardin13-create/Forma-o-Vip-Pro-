import React, { useState } from 'react';
import { Award, Crown, CheckCircle2, Download, Printer, ExternalLink, X, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '../services/store';
import { Certificate } from '../types';

export const CertificatesView: React.FC = () => {
  const { certificates, currentUser } = useStore();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (cert: Certificate) => {
    const certText = `=========================================================\nFORMAÇÃO VIP PRO — CERTIFICADO OFICIAL DE CONCLUSÃO\n=========================================================\nCertificamos que\n\n${cert.studentName}\n\nConcluiu com êxito a formação:\n"${cert.courseTitle}"\n\nCarga Horária: ${cert.workloadHours} horas\nData de Emissão: ${cert.issueDate}\nCódigo Único de Verificação: ${cert.verificationCode}\n\nEmitido por Formação VIP Pro — Todos os direitos reservados.`;
    const blob = new Blob([certText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Certificado_${cert.verificationCode}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#1D2230] pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest font-mono">FORMAÇÃO VIP PRO</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          Meus Certificados Oficiais
        </h1>
        <p className="text-xs lg:text-sm text-[#A7AFBF]">
          Certificados autenticados com código de verificação criptográfico emitidos ao finalizar 100% de cada formação.
        </p>
      </div>

      {/* Grid of Certificates */}
      {certificates.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#0D0F12] border border-[#1D2230] p-8 space-y-3">
          <Award className="w-12 h-12 text-[#A7AFBF]/40 mx-auto" />
          <h3 className="text-base font-bold text-white">Nenhum certificado emitido ainda</h3>
          <p className="text-xs text-[#A7AFBF] max-w-sm mx-auto">
            Complete 100% das aulas de um curso para desbloquear automaticamente seu diploma VIP.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/60 overflow-hidden p-6 space-y-5 shadow-card-dark transition group hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#0D0F12] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Award className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3 h-3" />
                  VERIFICADO
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase font-mono tracking-wider">
                  DIPLOMA EXECUTIVO
                </span>
                <h3 className="text-base font-bold text-white leading-snug group-hover:text-[#F5D76E] transition">
                  {cert.courseTitle}
                </h3>
                <p className="text-xs text-[#A7AFBF]">
                  Aluno: <span className="text-white font-medium">{cert.studentName}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-[#1D2230] flex items-center justify-between text-[11px] text-[#A7AFBF] font-mono">
                <span>{cert.workloadHours} Horas</span>
                <span>Emissão: {cert.issueDate}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="py-2 px-3 rounded-xl bg-[#0D0F12] hover:bg-[#1D2230] border border-[#1D2230] text-xs font-bold text-white hover:border-[#D4AF37]/40 transition flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Visualizar</span>
                </button>
                <button
                  onClick={() => handleDownload(cert)}
                  className="py-2 px-3 rounded-xl bg-[#D4AF37] hover:bg-[#F5D76E] text-black text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Diploma Modal Preview */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#0D0F12] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-[#151922] text-[#A7AFBF] hover:text-white border border-[#1D2230]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Diploma Certificate Canvas */}
            <div className="border border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-[#151922] to-[#08090C] text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl" />

              <div className="flex items-center justify-center gap-2">
                <Crown className="w-6 h-6 text-[#D4AF37]" />
                <span className="text-sm font-extrabold tracking-widest text-[#D4AF37] font-mono">FORMAÇÃO VIP PRO</span>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-[#A7AFBF] tracking-widest uppercase font-mono">CERTIFICADO OFICIAL DE CONCLUSÃO</p>
                <p className="text-xs text-[#A7AFBF]">Certificamos para os devidos fins que</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5D76E] tracking-wide font-display">
                  {selectedCert.studentName}
                </h2>
                <p className="text-xs text-[#A7AFBF] max-w-lg mx-auto pt-2 leading-relaxed">
                  concluiu integralmente a formação executiva avançada em <strong>"{selectedCert.courseTitle}"</strong>, cumprindo a carga horária estabelecida de <strong>{selectedCert.workloadHours} horas</strong> de estudos práticos e avaliações.
                </p>
              </div>

              {/* Seal and Signatures */}
              <div className="pt-6 border-t border-[#1D2230] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#A7AFBF]">
                <div className="text-left">
                  <p className="text-white font-bold">Conselho Executivo VIP</p>
                  <p className="text-[10px]">Formação VIP Pro Academy</p>
                </div>

                <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] flex items-center justify-center bg-[#0D0F12] shadow-gold-glow">
                  <Award className="w-8 h-8 text-[#D4AF37]" />
                </div>

                <div className="text-right">
                  <p className="text-white font-bold">Código de Autenticidade:</p>
                  <p className="text-[10px] text-[#D4AF37]">{selectedCert.verificationCode}</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-[#151922] hover:bg-[#1D2230] border border-[#1D2230] text-xs font-bold text-white flex items-center gap-2 transition"
              >
                <Printer className="w-4 h-4 text-[#D4AF37]" />
                <span>Imprimir</span>
              </button>
              <button
                onClick={() => handleDownload(selectedCert)}
                className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F5D76E] text-black text-xs font-bold flex items-center gap-2 transition shadow-gold-glow"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Certificado</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
