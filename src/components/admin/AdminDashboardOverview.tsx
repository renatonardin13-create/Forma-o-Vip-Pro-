import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CreditCard, 
  DollarSign, 
  Calendar, 
  ShieldCheck, 
  Layers, 
  ArrowUpRight, 
  Filter,
  CheckCircle2,
  HardDrive,
  Database
} from 'lucide-react';
import { useStore } from '../../services/store';

export const AdminDashboardOverview: React.FC = () => {
  const { users, courses, digitalProducts, salesTransactions, setAdminTab } = useStore();
  const [dateRange, setDateRange] = useState('06 ago – 04 set');
  const [periodTab, setPeriodTab] = useState<'30d' | '7d' | 'today' | '90d'>('30d');
  const [plansFilter, setPlansFilter] = useState<'vendidos' | 'recorrencia'>('vendidos');

  // Calculate real metrics from store if available
  const totalUsers = users.length;
  const activeStudents = users.filter(u => u.role !== 'admin').length;
  const totalCourses = courses.length;
  const totalProducts = digitalProducts.length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#151922] border border-[#1D2230] shadow-card-dark">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-[#D4AF37] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30">
              Visão Geral
            </span>
            <span className="text-xs text-[#A7AFBF]">• Executivo</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Dashboard de Métricas
          </h1>
          <p className="text-xs text-[#A7AFBF]">
            Estatísticas consolidadas de vendas, alunos ativos e uso de armazenamento em nuvem.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs font-mono text-gray-300">
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{dateRange}</span>
          </div>
        </div>
      </div>

      {/* 4 Consolidated Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Vendas e Receita */}
        <div 
          onClick={() => setAdminTab('sales')}
          className="p-5 rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/60 transition space-y-3 cursor-pointer group shadow-card-dark flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono text-[#D4AF37] group-hover:underline flex items-center gap-1 font-bold">
              Ver Vendas &rarr;
            </span>
          </div>
          <div>
            <p className="text-2xl font-black text-white tracking-tight">R$ 0,00</p>
            <p className="text-xs font-bold text-white mt-0.5">Estatísticas de Vendas</p>
            <p className="text-[11px] text-[#A7AFBF] mt-1">0 transações no período</p>
          </div>
        </div>

        {/* Card 2: Alunos Ativos */}
        <div 
          onClick={() => setAdminTab('users')}
          className="p-5 rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/60 transition space-y-3 cursor-pointer group shadow-card-dark flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono text-blue-400 group-hover:underline flex items-center gap-1 font-bold">
              Gerenciar Alunos &rarr;
            </span>
          </div>
          <div>
            <p className="text-2xl font-black text-white tracking-tight">{activeStudents}</p>
            <p className="text-xs font-bold text-white mt-0.5">Alunos Ativos</p>
            <p className="text-[11px] text-emerald-400 mt-1 font-medium">{totalUsers} cadastrados no total</p>
          </div>
        </div>

        {/* Card 3: Uso de Armazenamento (Storage) */}
        <div 
          onClick={() => setAdminTab('digital_products')}
          className="p-5 rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/60 transition space-y-3 cursor-pointer group shadow-card-dark flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono text-purple-400 group-hover:underline flex items-center gap-1 font-bold">
              Supabase Storage &rarr;
            </span>
          </div>
          <div>
            <p className="text-2xl font-black text-white tracking-tight">26,52 MB</p>
            <p className="text-xs font-bold text-white mt-0.5">Armazenamento Privado</p>
            <p className="text-[11px] text-[#A7AFBF] mt-1">Bucket `ebooks` (Seguro)</p>
          </div>
        </div>

        {/* Card 4: MRR & Ticket Médio */}
        <div 
          onClick={() => setAdminTab('user_access')}
          className="p-5 rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/60 transition space-y-3 cursor-pointer group shadow-card-dark flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono text-emerald-400 group-hover:underline flex items-center gap-1 font-bold">
              Assinaturas &rarr;
            </span>
          </div>
          <div>
            <p className="text-2xl font-black text-white tracking-tight">R$ 0,00</p>
            <p className="text-xs font-bold text-white mt-0.5">MRR / Ticket Médio</p>
            <p className="text-[11px] text-[#A7AFBF] mt-1">0 assinaturas ativas</p>
          </div>
        </div>
      </div>

      {/* Main Charts Grid (Top: Revenue & Subscriptions Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Receita e volume de vendas (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#151922] border border-[#1D2230] space-y-6 shadow-card-dark flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
                Estatísticas de Vendas e Receita
              </h3>
              <p className="text-xs text-[#A7AFBF]">Últimos 30 dias</p>
            </div>

            <div className="flex items-center gap-1 bg-[#0D0F12] p-1 rounded-xl border border-[#1D2230]">
              {(['today', '7d', '30d', '90d'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPeriodTab(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition ${
                    periodTab === tab ? 'bg-[#D4AF37] text-black shadow-sm' : 'text-[#A7AFBF] hover:text-white'
                  }`}
                >
                  {tab === 'today' ? 'Hoje' : tab === '7d' ? '7d' : tab === '30d' ? '30d' : '90d'}
                </button>
              ))}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#151922] text-[#A7AFBF] text-xs font-mono border border-[#1D2230]">
                <Calendar className="w-3 h-3 text-[#D4AF37]" />
                <span>{dateRange}</span>
              </div>
            </div>
          </div>

          {/* Graph area visualization */}
          <div className="py-8 space-y-4">
            <div className="relative h-48 border-b border-[#1D2230] flex flex-col justify-between text-[10px] font-mono text-[#A7AFBF]">
              <div className="flex justify-between border-b border-[#1D2230]/40 pb-1"><span>R$ 4,00</span></div>
              <div className="flex justify-between border-b border-[#1D2230]/40 pb-1"><span>R$ 3,00</span></div>
              <div className="flex justify-between border-b border-[#1D2230]/40 pb-1"><span>R$ 2,00</span></div>
              <div className="flex justify-between border-b border-[#1D2230]/40 pb-1"><span>R$ 1,00</span></div>
              <div className="flex justify-between pb-1"><span>R$ 0,00</span></div>

              {/* Zero line */}
              <div className="absolute bottom-1 left-0 right-0 h-0.5 bg-[#D4AF37]"></div>
            </div>

            {/* X axis dates */}
            <div className="grid grid-cols-15 text-[9px] font-mono text-[#A7AFBF] text-center overflow-x-auto gap-1">
              <span>06/08</span>
              <span>08/08</span>
              <span>10/08</span>
              <span>12/08</span>
              <span>14/08</span>
              <span>16/08</span>
              <span>18/08</span>
              <span>20/08</span>
              <span>22/08</span>
              <span>24/08</span>
              <span>26/08</span>
              <span>28/08</span>
              <span>30/08</span>
              <span>01/09</span>
              <span>04/09</span>
            </div>
          </div>
        </div>

        {/* Status das assinaturas (1 col) */}
        <div className="p-6 rounded-3xl bg-[#151922] border border-[#1D2230] space-y-6 shadow-card-dark flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                Status das assinaturas
              </h3>
              <p className="text-xs text-[#A7AFBF]">Últimos 30 dias</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            {/* Donut chart simulation */}
            <div className="relative w-40 h-40 rounded-full border-4 border-[#1D2230] flex items-center justify-center bg-[#0D0F12]">
              <div className="text-center">
                <p className="text-3xl font-black text-white">0</p>
                <p className="text-[10px] font-mono text-[#A7AFBF] uppercase tracking-wider">ASSINATURAS</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#A7AFBF] font-medium pt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
              <span>sem dados</span>
              <span className="font-bold text-white ml-2">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Storage Usage Breakdown & Products Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Uso de Armazenamento Detalhado */}
        <div className="p-6 rounded-3xl bg-[#151922] border border-[#1D2230] space-y-6 shadow-card-dark flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-[#D4AF37]" />
              Uso de Armazenamento (Supabase Storage)
            </h3>
            <p className="text-xs text-[#A7AFBF]">Métricas dos arquivos protegidos</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#0D0F12] border border-[#1D2230] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Bucket Privado `ebooks`</p>
                  <p className="text-xs text-[#A7AFBF]">prod-depois-dos-60-real/depois-dos-60-50-cuidados.pdf</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-white">26,52 MB</span>
                <p className="text-[10px] font-mono text-emerald-400 uppercase">100% Sincronizado</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D0F12] border border-[#1D2230] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Módulos & Vídeos de Cursos</p>
                  <p className="text-xs text-[#A7AFBF]">HLS / YouTube Integrado</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-white">Otimizado</span>
                <p className="text-[10px] font-mono text-emerald-400 uppercase">Cloud Stream</p>
              </div>
            </div>
          </div>
        </div>

        {/* Planos que mais venderam */}
        <div className="p-6 rounded-3xl bg-[#151922] border border-[#1D2230] space-y-6 shadow-card-dark flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D4AF37]" />
                Planos que mais venderam
              </h3>
              <p className="text-xs text-[#A7AFBF]">Últimos 30 dias</p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <div className="flex items-center gap-1 bg-[#0D0F12] p-1 rounded-xl border border-[#1D2230]">
                <button
                  onClick={() => setPlansFilter('vendidos')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    plansFilter === 'vendidos' ? 'bg-[#D4AF37] text-black' : 'text-[#A7AFBF] hover:text-white'
                  }`}
                >
                  Mais vendidos
                </button>
                <button
                  onClick={() => setPlansFilter('recorrencia')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    plansFilter === 'recorrencia' ? 'bg-[#D4AF37] text-black' : 'text-[#A7AFBF] hover:text-white'
                  }`}
                >
                  Mais recorrência
                </button>
              </div>
            </div>
          </div>

          <div className="py-12 text-center text-xs text-[#A7AFBF] bg-[#0D0F12] rounded-2xl border border-[#1D2230]/60">
            Nenhuma venda registrada no período.
          </div>
        </div>
      </div>
    </div>
  );
};

