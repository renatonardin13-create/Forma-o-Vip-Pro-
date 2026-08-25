import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  DollarSign, 
  RefreshCw, 
  ShieldCheck,
  ExternalLink,
  Package,
  User,
  Calendar,
  Webhook
} from 'lucide-react';
import { useStore } from '../services/store';
import { SalesTransaction } from '../types';

export const AdminSalesManager: React.FC = () => {
  const { salesTransactions = [], digitalProducts = [], users = [] } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');

  const filteredTransactions = (salesTransactions as SalesTransaction[]).filter(tx => {
    const matchesSearch = 
      tx.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.transactionId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    const matchesProvider = selectedProvider === 'all' || tx.provider === selectedProvider;

    return matchesSearch && matchesStatus && matchesProvider;
  });

  const totalRevenue = (salesTransactions as SalesTransaction[])
    .filter(tx => tx.status === 'approved')
    .reduce((acc, tx) => acc + (tx.amount || 0), 0);

  const totalSalesCount = (salesTransactions as SalesTransaction[]).filter(tx => tx.status === 'approved').length;

  return (
    <div id="admin-sales-manager" className="space-y-6">
      {/* Webhook Gateway Abstraction Info Banner */}
      <div className="bg-gradient-to-r from-[#151922] to-[#0D0F12] border border-[#D4AF37]/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37] shrink-0">
            <Webhook className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">PaymentWebhookProvider (Arquitetura Pronta)</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">Ativo & Seguro</span>
            </div>
            <p className="text-xs text-gray-300 mt-1 max-w-2xl">
              Webhook preparado para receber confirmações de pagamento idempotentes (via <code className="text-[#D4AF37]">transaction_id</code>) de provedores como Kiwify, Perfect Pay, Hotmart, Eduzz e Stripe.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-mono text-gray-400">
              <span className="bg-[#08090C] px-2.5 py-1 rounded-lg border border-[#1D2230]">Endpoint: <strong className="text-white">/api/webhooks/payment</strong></span>
              <span className="bg-[#08090C] px-2.5 py-1 rounded-lg border border-[#1D2230]">Status: <strong className="text-[#D4AF37]">Webhook preparado, aguardando configuração do provedor.</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-[#0D0F12] border border-[#1D2230] space-y-1">
          <span className="text-xs text-gray-400 font-mono uppercase tracking-wider block">Faturamento Aprovado</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-gray-500 block">Total líquido processado</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D0F12] border border-[#1D2230] space-y-1">
          <span className="text-xs text-gray-400 font-mono uppercase tracking-wider block">Vendas Aprovadas</span>
          <div className="text-2xl font-black text-white font-mono">
            {totalSalesCount}
          </div>
          <span className="text-[11px] text-gray-500 block">Transações confirmadas</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D0F12] border border-[#1D2230] space-y-1">
          <span className="text-xs text-gray-400 font-mono uppercase tracking-wider block">Total de Transações</span>
          <div className="text-2xl font-black text-[#D4AF37] font-mono">
            {salesTransactions.length}
          </div>
          <span className="text-[11px] text-gray-500 block">Inclui pendentes e reembolsos</span>
        </div>
      </div>

      {/* Filters Header */}
      <div className="bg-[#0D0F12] border border-[#1D2230] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por cliente, e-mail ou transação..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#151922] border border-[#222738] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-[#151922] border border-[#222738] text-white text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">Todos os Status</option>
              <option value="approved">Aprovadas</option>
              <option value="pending">Pendentes</option>
              <option value="cancelled">Canceladas</option>
              <option value="refunded">Reembolsadas</option>
              <option value="chargeback">Chargeback</option>
            </select>

            {/* Provider Filter */}
            <select
              value={selectedProvider}
              onChange={e => setSelectedProvider(e.target.value)}
              className="bg-[#151922] border border-[#222738] text-white text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">Todas as Origens / Gateways</option>
              <option value="kiwify">Kiwify</option>
              <option value="perfectpay">Perfect Pay</option>
              <option value="hotmart">Hotmart</option>
              <option value="stripe">Stripe</option>
              <option value="manual">Manual (Admin)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#0D0F12] border border-[#1D2230] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1D2230] bg-[#151922]/70 text-gray-400 text-xs uppercase font-bold tracking-wider">
                <th className="py-4 px-6">Transação / ID</th>
                <th className="py-4 px-6">Cliente</th>
                <th className="py-4 px-6">Produto</th>
                <th className="py-4 px-6">Valor</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Gateway / Origem</th>
                <th className="py-4 px-6 text-right">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2230] text-sm">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    Nenhuma transação encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-[#151922]/40 transition-colors">
                    {/* ID */}
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs text-[#D4AF37] font-bold block">{tx.transactionId}</span>
                      <span className="text-[10px] text-gray-500 font-mono">{tx.id}</span>
                    </td>

                    {/* Cliente */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-xs">{tx.customerName}</div>
                      <div className="text-[11px] text-gray-400 font-mono">{tx.customerEmail}</div>
                    </td>

                    {/* Produto */}
                    <td className="py-4 px-6">
                      <span className="font-semibold text-white text-xs">{tx.productName}</span>
                    </td>

                    {/* Valor */}
                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-emerald-400 text-xs">
                        R$ {(tx.amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                        tx.status === 'approved' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                        tx.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                        tx.status === 'refunded' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' :
                        'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}>
                        {tx.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                        {tx.status === 'pending' && <Clock className="w-3 h-3" />}
                        {tx.status === 'refunded' && <RefreshCw className="w-3 h-3" />}
                        {tx.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                        {tx.status}
                      </span>
                    </td>

                    {/* Provider */}
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-[#151922] border border-[#1D2230] text-gray-300 rounded-lg text-[10px] font-mono uppercase">
                        {tx.provider || tx.origin || 'Webhook'}
                      </span>
                    </td>

                    {/* Data */}
                    <td className="py-4 px-6 text-right font-mono text-xs text-gray-400">
                      {tx.createdAt}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
