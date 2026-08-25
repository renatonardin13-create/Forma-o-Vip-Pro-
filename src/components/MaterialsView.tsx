import React, { useState } from 'react';
import { FileText, Download, Search, Filter, Crown, Sparkles, BookOpen } from 'lucide-react';
import { useStore } from '../services/store';
import { Material } from '../types';

export const MaterialsView: React.FC = () => {
  const { courses } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('Todos');

  // Collect all materials across all courses and lessons
  const allMaterials: { courseTitle: string; lessonTitle: string; material: Material }[] = [];
  courses.forEach(c => {
    c.modules.forEach(m => {
      m.lessons.forEach(l => {
        l.materials.forEach(mat => {
          allMaterials.push({
            courseTitle: c.title,
            lessonTitle: l.title,
            material: mat
          });
        });
      });
    });
  });

  const types = ['Todos', 'PDF', 'ZIP', 'DOC', 'XLSX', 'PPT'];

  const filtered = allMaterials.filter(item => {
    if (selectedType !== 'Todos' && item.material.type !== selectedType) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.material.title.toLowerCase().includes(q) ||
        item.courseTitle.toLowerCase().includes(q) ||
        item.lessonTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDownload = (mat: Material, courseTitle: string) => {
    const content = `FORMAÇÃO VIP PRO\nMaterial Exclusivo: ${mat.title}\nCurso: ${courseTitle}\nTipo: ${mat.type}\n\nArquivo oficial liberado na área de membros.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = mat.title.endsWith('.txt') ? mat.title : `${mat.title}.txt`;
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
          Central de Materiais & Arquivos VIP
        </h1>
        <p className="text-xs lg:text-sm text-[#A7AFBF]">
          Acesse e baixe planilhas de modelagem, templates de copy, apresentações e apostilas executivas.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0D0F12] p-4 rounded-2xl border border-[#1D2230]">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7AFBF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar material por nome..."
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white placeholder-[#A7AFBF]/50 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedType === t
                  ? 'bg-[#D4AF37] text-black shadow-sm'
                  : 'bg-[#151922] text-[#A7AFBF] hover:text-white border border-[#1D2230]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, idx) => (
          <div
            key={`${item.material.id}-${idx}`}
            className="p-5 rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/50 transition flex flex-col justify-between space-y-4 shadow-card-dark"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-[#0D0F12] border border-[#D4AF37]/30 text-[10px] font-extrabold text-[#D4AF37] font-mono">
                  {item.material.type}
                </span>
                <span className="text-[10px] text-[#A7AFBF] font-mono">{item.material.size || '3.2 MB'}</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white line-clamp-1">{item.material.title}</h4>
                <p className="text-xs text-[#A7AFBF] mt-1 line-clamp-2">{item.material.description || 'Material complementar da aula.'}</p>
              </div>

              <div className="text-[10px] text-[#A7AFBF] bg-[#0D0F12] p-2.5 rounded-xl border border-[#1D2230] space-y-0.5">
                <p className="text-[#D4AF37] font-semibold truncate">{item.courseTitle}</p>
                <p className="truncate text-[#A7AFBF]">{item.lessonTitle}</p>
              </div>
            </div>

            <button
              onClick={() => handleDownload(item.material, item.courseTitle)}
              className="w-full py-2.5 rounded-xl bg-[#0D0F12] hover:bg-[#D4AF37] text-white hover:text-black border border-[#1D2230] hover:border-transparent text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>BAIXAR ARQUIVO</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
