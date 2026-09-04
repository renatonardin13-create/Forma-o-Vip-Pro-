import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Trash2, 
  Power, 
  Clock, 
  Check, 
  X, 
  User as UserIcon, 
  Layers, 
  Calendar, 
  AlertTriangle, 
  RefreshCw,
  Ban,
  Unlock,
  CheckCircle2,
  Package,
  Pencil
} from 'lucide-react';
import { useStore } from '../services/store';
import { UserAreaAccess, User, MemberArea } from '../types';

export const UserAccessManager: React.FC = () => {
  const { 
    userAreaAccesses, 
    users, 
    memberAreas, 
    digitalProducts,
    grantUserAreaAccess, 
    updateUserAreaAccess,
    revokeUserAreaAccess, 
    blockUserAreaAccess, 
    deleteUserAreaAccess 
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [grantUserId, setGrantUserId] = useState<string>('');
  const [grantAreaId, setGrantAreaId] = useState<string>('');
  const [grantProductId, setGrantProductId] = useState<string>('');
  const [grantExpiration, setGrantExpiration] = useState<string>('');

  // Estados do Modal de Edição de Acesso
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAccess, setEditingAccess] = useState<UserAreaAccess | null>(null);
  const [editUserId, setEditUserId] = useState<string>('');
  const [editAreaId, setEditAreaId] = useState<string>('');
  const [editProductId, setEditProductId] = useState<string>('');
  const [editStatus, setEditStatus] = useState<'active' | 'revoked' | 'blocked'>('active');
  const [editExpiration, setEditExpiration] = useState<string>('');
  const [editGrantedBy, setEditGrantedBy] = useState<string>('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenGrantModal = () => {
    setGrantUserId(users[0]?.id || '');
    setGrantAreaId(memberAreas[0]?.id || '');
    setGrantProductId('');
    setGrantExpiration('');
    setShowGrantModal(true);
  };

  const handleGrantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantUserId || !grantAreaId) {
      alert('Selecione o Usuário e a Área de Membros.');
      return;
    }

    grantUserAreaAccess({
      userId: grantUserId,
      areaId: grantAreaId,
      productId: grantProductId || undefined,
      expirationDate: grantExpiration || undefined,
      grantedBy: 'Admin via Painel'
    });

    setShowGrantModal(false);
    showToast('Acesso concedido com sucesso!');
  };

  const handleOpenEditModal = (acc: UserAreaAccess) => {
    setEditingAccess(acc);
    setEditUserId(acc.userId);
    setEditAreaId(acc.areaId);
    setEditProductId(acc.productId || '');
    setEditStatus(acc.status);
    setEditExpiration(acc.expirationDate || '');
    setEditGrantedBy(acc.grantedBy || 'Admin via Painel');
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccess) return;
    if (!editUserId || !editAreaId) {
      alert('Selecione o Usuário e a Área de Membros.');
      return;
    }

    updateUserAreaAccess(editingAccess.id, {
      userId: editUserId,
      areaId: editAreaId,
      productId: editProductId || undefined,
      status: editStatus,
      expirationDate: editExpiration || undefined,
      grantedBy: editGrantedBy || 'Admin via Painel'
    });

    setShowEditModal(false);
    setEditingAccess(null);
    showToast('Acesso atualizado com sucesso!');
  };

  const filteredAccesses = userAreaAccesses.filter(acc => {
    const user = users.find(u => u.id === acc.userId);
    const area = memberAreas.find(a => a.id === acc.areaId || a.slug === acc.areaId);

    const matchesSearch = 
      user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area?.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.areaId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesArea = selectedAreaFilter === 'all' || acc.areaId === selectedAreaFilter || area?.id === selectedAreaFilter;
    const matchesStatus = selectedStatusFilter === 'all' || acc.status === selectedStatusFilter;

    return matchesSearch && matchesArea && matchesStatus;
  });

  return (
    <div id="user-access-manager" className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0D0F12] border border-[#D4AF37]/50 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4">
          <Check className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Card */}
      <div className="bg-[#0D0F12] border border-[#1D2230] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Controle de Acessos & Permissões por Área
              </h2>
            </div>
            <p className="text-gray-400 text-sm max-w-2xl">
              Gerencie a liberação granular de acessos por área de membros e produtos específicos. Revogue, bloqueie ou defina prazos de expiração.
            </p>
          </div>

          <button
            id="btn-grant-access"
            onClick={handleOpenGrantModal}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-black font-bold rounded-xl hover:opacity-95 shadow-lg shadow-[#D4AF37]/20 transition-all text-sm shrink-0"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            + CONCEDER ACESSO
          </button>
        </div>

        {/* Filters */}
        <div className="mt-8 pt-6 border-t border-[#1D2230] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por aluno, email ou área..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#151922] border border-[#222738] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Area Filter */}
            <select
              value={selectedAreaFilter}
              onChange={e => setSelectedAreaFilter(e.target.value)}
              className="bg-[#151922] border border-[#222738] text-white text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">Todas as Áreas ({memberAreas.length})</option>
              {memberAreas.map(a => (
                <option key={a.id} value={a.id}>{a.name} (/{a.slug})</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              className="bg-[#151922] border border-[#222738] text-white text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativo</option>
              <option value="revoked">Revogado</option>
              <option value="blocked">Bloqueado</option>
              <option value="expired">Expirado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table of Accesses */}
      <div className="bg-[#0D0F12] border border-[#1D2230] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1D2230] bg-[#151922]/70 text-gray-400 text-xs uppercase font-bold tracking-wider">
                <th className="py-4 px-6">Aluno</th>
                <th className="py-4 px-6">Área de Membros</th>
                <th className="py-4 px-6">Produto / Escopo</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Validade / Expiração</th>
                <th className="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2230] text-sm">
              {filteredAccesses.map(acc => {
                const user = users.find(u => u.id === acc.userId);
                const area = memberAreas.find(a => a.id === acc.areaId || a.slug === acc.areaId);
                const product = acc.productId ? digitalProducts.find(p => p.id === acc.productId) : null;

                const isStatusActive = acc.status === 'active';
                const isBlocked = acc.status === 'blocked';
                const isRevoked = acc.status === 'revoked';

                return (
                  <tr key={acc.id} className="hover:bg-[#151922]/40 transition-colors">
                    {/* Aluno */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
                          alt={user?.name}
                          className="w-9 h-9 rounded-full object-cover border border-[#D4AF37]/30"
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{user?.name || 'Aluno Desconhecido'}</div>
                          <div className="text-xs text-gray-400 font-mono">{user?.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Área */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#D4AF37]" />
                        <div>
                          <div className="font-semibold text-white">{area?.name || (acc.areaId ? `Área (${acc.areaId})` : 'Área não especificada')}</div>
                          <div className="text-xs text-[#D4AF37] font-mono">/{area?.slug || acc.areaId}</div>
                        </div>
                      </div>
                    </td>

                    {/* Produto / Escopo */}
                    <td className="py-4 px-6">
                      {product ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#151922] text-gray-300 border border-[#222738]">
                          <Package className="w-3.5 h-3.5 text-blue-400" />
                          {product.title}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Toda a Área (Acesso Total)
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isStatusActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : isBlocked
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isStatusActive ? 'bg-emerald-400' : isBlocked ? 'bg-rose-400' : 'bg-amber-400'
                        }`} />
                        {acc.status}
                      </span>
                    </td>

                    {/* Expiração */}
                    <td className="py-4 px-6 text-xs text-gray-300">
                      {acc.expirationDate ? (
                        <div className="flex items-center gap-1.5 text-amber-300">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Expira em: {new Date(acc.expirationDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Vitalício (Sem expiração)</span>
                        </div>
                      )}
                    </td>

                    {/* Ações */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Botão de Editar Acesso */}
                        <button
                          id={`btn-edit-access-${acc.id}`}
                          onClick={() => handleOpenEditModal(acc)}
                          title="Editar Acesso"
                          className="p-1.5 rounded-lg bg-[#151922] hover:bg-[#D4AF37]/20 text-gray-400 hover:text-[#D4AF37] border border-[#222738] hover:border-[#D4AF37]/40 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {isStatusActive ? (
                          <>
                            <button
                              onClick={() => { revokeUserAreaAccess(acc.id); showToast('Acesso revogado.'); }}
                              title="Revogar Acesso"
                              className="p-1.5 rounded-lg bg-[#151922] hover:bg-amber-500/20 text-gray-400 hover:text-amber-400 border border-[#222738] transition-colors"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => { blockUserAreaAccess(acc.id); showToast('Bloquear Acesso'); }}
                              title="Bloquear Acesso"
                              className="p-1.5 rounded-lg bg-[#151922] hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 border border-[#222738] transition-colors"
                            >
                              <Power className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              grantUserAreaAccess({
                                userId: acc.userId,
                                areaId: acc.areaId,
                                productId: acc.productId,
                                expirationDate: acc.expirationDate
                              });
                              showToast('Acesso reativado com sucesso.');
                            }}
                            title="Reativar Acesso"
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => { deleteUserAreaAccess(acc.id); showToast('Registro de acesso excluído.'); }}
                          title="Excluir Registro"
                          className="p-1.5 rounded-lg bg-[#151922] hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 border border-[#222738] transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAccesses.length === 0 && (
          <div className="p-12 text-center">
            <ShieldCheck className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">Nenhum acesso registrado</h3>
            <p className="text-xs text-gray-400 mt-1">Conceda acessos a alunos ou limpe os filtros de busca.</p>
          </div>
        )}
      </div>

      {/* MODAL CONCEDER ACESSO */}
      {showGrantModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0F12] border border-[#222738] rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-[#1D2230] flex items-center justify-between bg-[#08090C] rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Conceder Acesso a Área de Membros</h3>
                  <p className="text-xs text-gray-400">Libere o acesso individual para o aluno selecionado.</p>
                </div>
              </div>
              <button onClick={() => setShowGrantModal(false)} className="text-gray-400 hover:text-white p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGrantSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Selecione o Aluno *
                </label>
                <select
                  required
                  value={grantUserId}
                  onChange={e => setGrantUserId(e.target.value)}
                  className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email}) - {u.role === 'admin' ? 'ADMIN' : 'ALUNO'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Selecione a Área de Membros *
                </label>
                <select
                  required
                  value={grantAreaId}
                  onChange={e => {
                    setGrantAreaId(e.target.value);
                    setGrantProductId('');
                  }}
                  className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  {memberAreas.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} (/{a.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Escopo de Acesso
                </label>
                <select
                  value={grantProductId}
                  onChange={e => setGrantProductId(e.target.value)}
                  className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="">Acesso Completo a Toda a Área</option>
                  {digitalProducts
                    .filter(p => p.areaId === grantAreaId)
                    .map(p => (
                      <option key={p.id} value={p.id}>
                        Apenas ao Produto: {p.title} ({p.type})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Data de Expiração (Opcional - deixe vazio para Vitalício)
                </label>
                <input
                  type="date"
                  value={grantExpiration}
                  onChange={e => setGrantExpiration(e.target.value)}
                  className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-4 border-t border-[#1D2230] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowGrantModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#151922] text-gray-300 text-sm font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-black font-bold text-sm hover:opacity-95 shadow-lg"
                >
                  Confirmar Acesso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR ACESSO */}
      {showEditModal && editingAccess && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0F12] border border-[#D4AF37]/40 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-[#1D2230] flex items-center justify-between bg-[#08090C] rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37]">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Editar Acesso & Permissão</h3>
                  <p className="text-xs text-gray-400">Atualize área, produto, status ou prazo de expiração.</p>
                </div>
              </div>
              <button 
                onClick={() => { setShowEditModal(false); setEditingAccess(null); }} 
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-[#151922] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Aluno Associado *
                </label>
                <select
                  required
                  value={editUserId}
                  onChange={e => setEditUserId(e.target.value)}
                  className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email}) - {u.role === 'admin' ? 'ADMIN' : 'ALUNO'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Área de Membros *
                </label>
                <select
                  required
                  value={editAreaId}
                  onChange={e => {
                    setEditAreaId(e.target.value);
                    setEditProductId('');
                  }}
                  className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  {memberAreas.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} (/{a.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Escopo de Acesso / Produto
                </label>
                <select
                  value={editProductId}
                  onChange={e => setEditProductId(e.target.value)}
                  className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="">Toda a Área (Acesso Total)</option>
                  {digitalProducts
                    .filter(p => p.areaId === editAreaId)
                    .map(p => (
                      <option key={p.id} value={p.id}>
                        Apenas ao Produto: {p.title} ({p.type})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Status do Acesso *
                  </label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as any)}
                    className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="active">Ativo (Liberado)</option>
                    <option value="blocked">Bloqueado (Suspenso)</option>
                    <option value="revoked">Revogado (Cancelado)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Origem / Concedido por
                  </label>
                  <input
                    type="text"
                    value={editGrantedBy}
                    onChange={e => setEditGrantedBy(e.target.value)}
                    placeholder="Ex: Admin via Painel"
                    className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-300">
                    Data de Expiração
                  </label>
                  {editExpiration && (
                    <button
                      type="button"
                      onClick={() => setEditExpiration('')}
                      className="text-[11px] text-[#D4AF37] hover:underline"
                    >
                      Tornar Vitalício
                    </button>
                  )}
                </div>
                <input
                  type="date"
                  value={editExpiration}
                  onChange={e => setEditExpiration(e.target.value)}
                  className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  {editExpiration ? 'O acesso será encerrado automaticamente após esta data.' : 'Deixe vazio para conceder acesso vitalício sem expiração.'}
                </p>
              </div>

              <div className="pt-4 border-t border-[#1D2230] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditingAccess(null); }}
                  className="px-4 py-2.5 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-gray-300 text-sm font-semibold border border-[#222738] transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-black font-bold text-sm hover:opacity-95 shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
