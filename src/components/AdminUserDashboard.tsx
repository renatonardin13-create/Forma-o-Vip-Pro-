import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  Award, 
  TrendingUp, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Shield, 
  ShieldAlert, 
  Crown, 
  Sparkles, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  BookOpen, 
  Calendar, 
  Mail, 
  ChevronRight, 
  X, 
  Save, 
  Lock, 
  Unlock, 
  RefreshCw,
  BarChart2,
  GraduationCap
} from 'lucide-react';
import { User, Course, Certificate } from '../types';

interface AdminUserDashboardProps {
  users: User[];
  courses: Course[];
  allCertificates: Certificate[];
  onToggleStatus: (userId: string) => void;
  onToggleRole: (userId: string) => void;
  onCreateUser: (user: User) => void;
  onUpdateUser: (userId: string, data: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
}

export const AdminUserDashboard: React.FC<AdminUserDashboardProps> = ({
  users,
  courses,
  allCertificates,
  onToggleStatus,
  onToggleRole,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
}) => {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'admin'>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'studyTime' | 'lessons' | 'name'>('recent');

  // Modals / Drawers
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // New User Form State
  const generateTempPassword = () => {
    return 'vip-' + Math.random().toString(36).substring(2, 10) + '!';
  };

  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    tempPassword: generateTempPassword(),
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    role: 'student' as 'student' | 'admin',
    plan: 'VIP BLACK EXECUTIVE',
    status: 'active' as 'active' | 'blocked'
  });

  // Calculate Aggregated Metrics
  const metrics = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const totalStudyTimeMinutes = users.reduce((acc, u) => acc + (u.stats?.studyTimeMinutes || 0), 0);
    const totalCompletedLessons = users.reduce((acc, u) => acc + (u.stats?.completedLessons || 0), 0);
    const totalCertificates = allCertificates.length;
    const totalHours = Math.round(totalStudyTimeMinutes / 60);

    // Plan distribution
    const planCounts: Record<string, number> = {};
    users.forEach(u => {
      const planName = u.plan || 'Plano Padrão';
      planCounts[planName] = (planCounts[planName] || 0) + 1;
    });

    return {
      totalUsers,
      activeUsers,
      totalHours,
      totalCompletedLessons,
      totalCertificates,
      planCounts
    };
  }, [users, allCertificates]);

  // Filtered and Sorted Users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.plan.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesPlan = planFilter === 'all' || u.plan === planFilter;

      return matchesSearch && matchesStatus && matchesRole && matchesPlan;
    }).sort((a, b) => {
      if (sortBy === 'studyTime') {
        return (b.stats?.studyTimeMinutes || 0) - (a.stats?.studyTimeMinutes || 0);
      }
      if (sortBy === 'lessons') {
        return (b.stats?.completedLessons || 0) - (a.stats?.completedLessons || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      // 'recent'
      return b.registeredAt.localeCompare(a.registeredAt);
    });
  }, [users, searchTerm, statusFilter, roleFilter, planFilter, sortBy]);

  // Top Performing Students (Ranking)
  const topStudents = useMemo(() => {
    return [...users]
      .filter(u => u.role === 'student')
      .sort((a, b) => (b.stats?.studyTimeMinutes || 0) - (a.stats?.studyTimeMinutes || 0))
      .slice(0, 3);
  }, [users]);

  // Unique plans for filter dropdown
  const uniquePlans = useMemo(() => {
    const plans = new Set(users.map(u => u.plan));
    return Array.from(plans);
  }, [users]);

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Nome', 'Email', 'Papel', 'Plano', 'Status', 'Cadastro', 'Horas de Estudo', 'Aulas Concluidas', 'Certificados'];
    const rows = filteredUsers.map(u => [
      u.id,
      `"${u.name}"`,
      `"${u.email}"`,
      u.role === 'admin' ? 'Administrador' : 'Aluno VIP',
      `"${u.plan}"`,
      u.status === 'active' ? 'Ativo' : 'Bloqueado',
      u.registeredAt,
      Math.round((u.stats?.studyTimeMinutes || 0) / 60),
      u.stats?.completedLessons || 0,
      u.stats?.certificatesCount || 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_alunos_vip_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit New User
  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    const user: User = {
      id: `usr_${Date.now()}`,
      name: newUserForm.name,
      email: newUserForm.email,
      avatar: newUserForm.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      role: newUserForm.role,
      plan: newUserForm.plan,
      registeredAt: new Date().toISOString().split('T')[0],
      lastAccessAt: 'Nunca acessou',
      status: newUserForm.status,
      stats: {
        activeCourses: 2,
        completedLessons: 0,
        studyTimeMinutes: 0,
        certificatesCount: 0
      }
    };

    onCreateUser(user);
    setShowCreateModal(false);
    setNewUserForm({
      name: '',
      email: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      role: 'student',
      plan: 'VIP BLACK EXECUTIVE',
      status: 'active'
    });
  };

  // Submit Edit User
  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    onUpdateUser(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      avatar: editingUser.avatar,
      plan: editingUser.plan,
      role: editingUser.role,
      status: editingUser.status
    });

    if (selectedUserForDetail?.id === editingUser.id) {
      setSelectedUserForDetail({ ...selectedUserForDetail, ...editingUser });
    }

    setEditingUser(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. EXECUTIVE KPIS HEADER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/40 transition space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-[#D4AF37]">
            <Users className="w-16 h-16 -mr-4 -mt-4" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#A7AFBF] uppercase font-mono tracking-wider">Total de Alunos</span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              +18% Mês
            </span>
          </div>
          <p className="text-3xl font-black text-white">{metrics.totalUsers}</p>
          <p className="text-[11px] text-[#A7AFBF] flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-bold">{metrics.activeUsers}</span> alunos com acesso ativo
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/40 transition space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-[#D4AF37]">
            <Clock className="w-16 h-16 -mr-4 -mt-4" />
          </div>
          <span className="text-[10px] font-bold text-[#A7AFBF] uppercase font-mono tracking-wider">Tempo de Estudo</span>
          <p className="text-3xl font-black text-[#D4AF37]">{metrics.totalHours}<span className="text-sm font-normal text-[#A7AFBF]">h</span></p>
          <p className="text-[11px] text-[#A7AFBF]">Média de {(metrics.totalHours / (metrics.totalUsers || 1)).toFixed(1)}h por aluno VIP</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/40 transition space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-[#D4AF37]">
            <BookOpen className="w-16 h-16 -mr-4 -mt-4" />
          </div>
          <span className="text-[10px] font-bold text-[#A7AFBF] uppercase font-mono tracking-wider">Aulas Concluídas</span>
          <p className="text-3xl font-black text-white">{metrics.totalCompletedLessons}</p>
          <p className="text-[11px] text-emerald-400 font-medium">94.2% Taxa de Retenção</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/40 transition space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-[#D4AF37]">
            <Award className="w-16 h-16 -mr-4 -mt-4" />
          </div>
          <span className="text-[10px] font-bold text-[#A7AFBF] uppercase font-mono tracking-wider">Diplomas Emitidos</span>
          <p className="text-3xl font-black text-[#D4AF37]">{metrics.totalCertificates}</p>
          <p className="text-[11px] text-[#A7AFBF]">Autenticados com Hash SHA-256</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/40 transition space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-[#D4AF37]">
            <Crown className="w-16 h-16 -mr-4 -mt-4" />
          </div>
          <span className="text-[10px] font-bold text-[#A7AFBF] uppercase font-mono tracking-wider">NPS & Satisfação</span>
          <p className="text-3xl font-black text-white">99.4%</p>
          <p className="text-[11px] text-emerald-400 font-medium">Excelente (Top 1% SaaS)</p>
        </div>
      </div>

      {/* 2. ANALYTICS: RANKING VIP & DISTRIBUIÇÃO DE PLANOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 3 Alunos VIP (Hall da Fama) */}
        <div className="p-6 rounded-3xl bg-[#151922] border border-[#1D2230] space-y-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Hall da Fama dos Alunos VIP</h3>
                <p className="text-xs text-[#A7AFBF]">Estudantes com maior dedicação e horas acumuladas</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#D4AF37] px-2.5 py-1 rounded-lg bg-[#0D0F12] border border-[#1D2230]">
              TOP PERFORMERS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topStudents.map((student, idx) => {
              const medals = ['🥇 1º Lugar', '🥈 2º Lugar', '🥉 3º Lugar'];
              const borders = ['border-[#D4AF37]/60 bg-gradient-to-b from-[#D4AF37]/10 to-transparent', 'border-gray-500/40', 'border-amber-700/40'];
              
              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedUserForDetail(student)}
                  className={`p-4 rounded-2xl bg-[#0D0F12] border ${borders[idx]} hover:border-[#D4AF37] transition cursor-pointer space-y-3 relative group`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#D4AF37] font-mono">{medals[idx]}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">ATIVO</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img 
                      src={student.avatar} 
                      alt={student.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-[#1D2230] group-hover:scale-105 transition" 
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-extrabold text-white truncate">{student.name}</h4>
                      <p className="text-[10px] text-[#A7AFBF] truncate">{student.plan}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1D2230] text-[11px] font-mono">
                    <div>
                      <span className="text-[9px] text-[#A7AFBF] block">HORAS</span>
                      <span className="font-bold text-white">{Math.round((student.stats?.studyTimeMinutes || 0) / 60)}h</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#A7AFBF] block">AULAS</span>
                      <span className="font-bold text-[#D4AF37]">{student.stats?.completedLessons || 0}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distribuição por Planos */}
        <div className="p-6 rounded-3xl bg-[#151922] border border-[#1D2230] space-y-5 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Planos & Categorias VIP</h3>
            </div>
            <p className="text-xs text-[#A7AFBF]">Distribuição da base por nível de acesso</p>
          </div>

          <div className="space-y-3">
            {Object.entries(metrics.planCounts).map(([planName, count]) => {
              const numCount = Number(count);
              const percentage = Math.round((numCount / (metrics.totalUsers || 1)) * 100);
              return (
                <div key={planName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white font-semibold truncate max-w-[180px]">{planName}</span>
                    <span className="text-[#D4AF37] font-bold">{numCount} ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#0D0F12] overflow-hidden border border-[#1D2230]">
                    <div 
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#1D2230] flex items-center justify-between text-[11px] text-[#A7AFBF]">
            <span>Total da Base VIP</span>
            <span className="font-mono font-bold text-white">{metrics.totalUsers} Membros</span>
          </div>
        </div>
      </div>

      {/* 3. GERENCIADOR DE USUÁRIOS: SEARCH, FILTERS & ACTION BAR */}
      <div className="p-6 rounded-3xl bg-[#151922] border border-[#1D2230] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D4AF37]" />
              Gerenciamento Master de Usuários
            </h2>
            <p className="text-xs text-[#A7AFBF]">
              Controle de acessos, edição cadastral, auditoria de progresso e emissão de diplomas
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-[#0D0F12] hover:bg-[#1D2230] border border-[#1D2230] text-xs font-bold text-[#A7AFBF] hover:text-white flex items-center gap-2 transition"
              title="Baixar lista em formato CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F5D76E] text-black font-bold text-xs flex items-center gap-2 transition shadow-gold-glow"
            >
              <Plus className="w-4 h-4" />
              <span>NOVO ALUNO VIP</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 rounded-2xl bg-[#0D0F12] border border-[#1D2230]">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-[#A7AFBF] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou plano..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white placeholder-[#A7AFBF]/50 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-9 px-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-[#A7AFBF] focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="all">Status: Todos</option>
            <option value="active">Apenas Ativos</option>
            <option value="blocked">Apenas Bloqueados</option>
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="h-9 px-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-[#A7AFBF] focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="all">Papel: Todos</option>
            <option value="student">Apenas Alunos VIP</option>
            <option value="admin">Apenas Administradores</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-9 px-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-[#A7AFBF] focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="recent">Mais Recentes</option>
            <option value="studyTime">Mais Horas de Estudo</option>
            <option value="lessons">Mais Aulas Assistidas</option>
            <option value="name">Alfabético (A-Z)</option>
          </select>
        </div>

        {/* 4. TABELA DE USUÁRIOS */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#A7AFBF]">
            <thead className="bg-[#0D0F12] text-white uppercase font-mono text-[10px] border-b border-[#1D2230]">
              <tr>
                <th className="p-3.5">Membro / Usuário</th>
                <th className="p-3.5">Plano de Acesso</th>
                <th className="p-3.5">Papel</th>
                <th className="p-3.5">Engajamento</th>
                <th className="p-3.5">Último Acesso</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2230]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-[#A7AFBF]">
                    Nenhum aluno encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#1D2230]/30 transition group">
                    {/* User Info */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={u.avatar} 
                            alt={u.name} 
                            className="w-10 h-10 rounded-xl object-cover border border-[#1D2230]" 
                          />
                          {u.status === 'active' && (
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#151922] absolute -bottom-0.5 -right-0.5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{u.name}</span>
                            {u.role === 'admin' && (
                              <Crown className="w-3.5 h-3.5 text-[#D4AF37]" title="Administrador Master" />
                            )}
                          </div>
                          <span className="text-[11px] text-[#A7AFBF] block">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-lg bg-[#0D0F12] border border-[#1D2230] text-[10px] font-mono font-bold text-white uppercase whitespace-nowrap">
                        {u.plan}
                      </span>
                    </td>

                    {/* Role */}
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        u.role === 'admin' 
                          ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40' 
                          : 'bg-[#0D0F12] text-[#A7AFBF] border border-[#1D2230]'
                      }`}>
                        {u.role === 'admin' ? 'ADMIN' : 'ALUNO'}
                      </span>
                    </td>

                    {/* Engagement */}
                    <td className="p-3.5">
                      <div className="space-y-1 font-mono text-[11px]">
                        <span className="text-white font-bold">{Math.round((u.stats?.studyTimeMinutes || 0) / 60)}h</span>
                        <span className="text-[#A7AFBF]"> • {u.stats?.completedLessons || 0} aulas</span>
                      </div>
                    </td>

                    {/* Last Access */}
                    <td className="p-3.5 font-mono text-[11px]">
                      {u.lastAccessAt || 'Sem registro'}
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        u.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        {u.status === 'active' ? 'ATIVO' : 'BLOQUEADO'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {/* View details */}
                      <button
                        onClick={() => setSelectedUserForDetail(u)}
                        className="px-2.5 py-1 rounded-lg bg-[#0D0F12] hover:bg-[#1D2230] text-[#D4AF37] border border-[#1D2230] text-[11px] font-bold transition"
                        title="Ver ficha completa do aluno"
                      >
                        Ficha
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => setEditingUser({ ...u })}
                        className="p-1.5 rounded-lg bg-[#0D0F12] hover:bg-[#1D2230] text-[#A7AFBF] hover:text-white border border-[#1D2230] transition inline-flex items-center"
                        title="Editar Usuário"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle Status (Lock/Unlock) */}
                      <button
                        onClick={() => onToggleStatus(u.id)}
                        className={`p-1.5 rounded-lg border transition inline-flex items-center ${
                          u.status === 'active'
                            ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20'
                        }`}
                        title={u.status === 'active' ? 'Bloquear Acesso' : 'Desbloquear Acesso'}
                      >
                        {u.status === 'active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setUserToDelete(u)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition inline-flex items-center"
                        title="Excluir Usuário"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. MODAL: FICHA DETALHADA DO ALUNO (DRAWER / OVERLAY) */}
      {selectedUserForDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#151922] border border-[#1D2230] rounded-3xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1D2230] pb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedUserForDetail.avatar} 
                  alt={selectedUserForDetail.name} 
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4AF37]/50" 
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">{selectedUserForDetail.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      selectedUserForDetail.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {selectedUserForDetail.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#A7AFBF] flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3 h-3 text-[#D4AF37]" />
                    {selectedUserForDetail.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserForDetail(null)}
                className="p-2 rounded-xl bg-[#0D0F12] text-[#A7AFBF] hover:text-white border border-[#1D2230]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overview Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-center space-y-1">
                <span className="text-[10px] text-[#A7AFBF] uppercase font-mono">Horas Estudadas</span>
                <p className="text-xl font-bold text-[#D4AF37]">{Math.round((selectedUserForDetail.stats?.studyTimeMinutes || 0) / 60)}h</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-center space-y-1">
                <span className="text-[10px] text-[#A7AFBF] uppercase font-mono">Aulas Assistidas</span>
                <p className="text-xl font-bold text-white">{selectedUserForDetail.stats?.completedLessons || 0}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-center space-y-1">
                <span className="text-[10px] text-[#A7AFBF] uppercase font-mono">Certificados</span>
                <p className="text-xl font-bold text-emerald-400">{selectedUserForDetail.stats?.certificatesCount || 0}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-center space-y-1">
                <span className="text-[10px] text-[#A7AFBF] uppercase font-mono">Cursos Ativos</span>
                <p className="text-xl font-bold text-white">{selectedUserForDetail.stats?.activeCourses || 1}</p>
              </div>
            </div>

            {/* Registration Details */}
            <div className="p-4 rounded-2xl bg-[#0D0F12] border border-[#1D2230] space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#1D2230]/50">
                <span className="text-[#A7AFBF]">Plano de Acesso:</span>
                <span className="font-bold text-white font-mono">{selectedUserForDetail.plan}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1D2230]/50">
                <span className="text-[#A7AFBF]">Papel no Sistema:</span>
                <span className="font-bold text-[#D4AF37] font-mono uppercase">{selectedUserForDetail.role === 'admin' ? 'Administrador Master' : 'Aluno VIP'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1D2230]/50">
                <span className="text-[#A7AFBF]">Data de Cadastro:</span>
                <span className="font-mono text-white">{selectedUserForDetail.registeredAt}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#A7AFBF]">Último Acesso:</span>
                <span className="font-mono text-white">{selectedUserForDetail.lastAccessAt || 'Hoje'}</span>
              </div>
            </div>

            {/* Quick Actions inside Drawer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#1D2230]">
              <button
                onClick={() => {
                  onToggleRole(selectedUserForDetail.id);
                  setSelectedUserForDetail(prev => prev ? ({ ...prev, role: prev.role === 'admin' ? 'student' : 'admin' }) : null);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#0D0F12] hover:bg-[#1D2230] border border-[#1D2230] text-xs font-bold text-[#A7AFBF] hover:text-white flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Alternar Aluno / Admin</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const u = selectedUserForDetail;
                    setSelectedUserForDetail(null);
                    setEditingUser({ ...u });
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0D0F12] hover:bg-[#1D2230] text-white border border-[#1D2230] text-xs font-bold flex items-center gap-2"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar Dados</span>
                </button>
                <button
                  onClick={() => {
                    onToggleStatus(selectedUserForDetail.id);
                    setSelectedUserForDetail(prev => prev ? ({ ...prev, status: prev.status === 'active' ? 'blocked' : 'active' }) : null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    selectedUserForDetail.status === 'active'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {selectedUserForDetail.status === 'active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{selectedUserForDetail.status === 'active' ? 'Bloquear' : 'Ativar'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: CADASTRAR NOVO ALUNO */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#151922] border border-[#1D2230] rounded-3xl p-6 space-y-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#1D2230] pb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                  Cadastrar Novo Aluno VIP
                </h3>
                <p className="text-xs text-[#A7AFBF]">Adicione um novo membro manualmente à plataforma</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-xl bg-[#0D0F12] text-[#A7AFBF] hover:text-white border border-[#1D2230]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A7AFBF]">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João Roberto Alencar"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A7AFBF]">E-mail de Acesso</label>
                <input
                  type="email"
                  required
                  placeholder="aluno@email.com"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#A7AFBF]">Senha Temporária Gerada</label>
                  <button
                    type="button"
                    onClick={() => setNewUserForm(prev => ({ ...prev, tempPassword: generateTempPassword() }))}
                    className="text-[10px] text-[#D4AF37] hover:underline font-mono"
                  >
                    🔄 Gerar nova senha
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={newUserForm.tempPassword}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, tempPassword: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs font-mono text-[#D4AF37] font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(newUserForm.tempPassword);
                      alert('Senha copiada para a área de transferência!');
                    }}
                    className="px-3 h-10 rounded-xl bg-[#0D0F12] text-xs font-bold text-white border border-[#1D2230] hover:border-[#D4AF37] transition whitespace-nowrap"
                  >
                    Copiar
                  </button>
                </div>
                <p className="text-[10px] text-[#A7AFBF]">Esta senha é gerada automaticamente para cadastro manual e envio ao aluno.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A7AFBF]">Plano de Acesso</label>
                  <select
                    value={newUserForm.plan}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, plan: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="VIP BLACK EXECUTIVE">VIP BLACK EXECUTIVE</option>
                    <option value="VIP TITANIUM VITALÍCIO">VIP TITANIUM VITALÍCIO</option>
                    <option value="VIP ANUAL DIAMOND">VIP ANUAL DIAMOND</option>
                    <option value="MEMBRO PREMIUM VIP">MEMBRO PREMIUM VIP</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A7AFBF]">Papel</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, role: e.target.value as any }))}
                    className="w-full h-10 px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="student">Aluno VIP</option>
                    <option value="admin">Administrador Master</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A7AFBF]">URL do Avatar (Foto de Perfil)</label>
                <input
                  type="url"
                  value={newUserForm.avatar}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, avatar: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#1D2230]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0D0F12] text-xs font-bold text-[#A7AFBF] hover:text-white border border-[#1D2230]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F5D76E] text-black text-xs font-black shadow-gold-glow"
                >
                  CRIAR ALUNO VIP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: EDITAR USUÁRIO */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#151922] border border-[#1D2230] rounded-3xl p-6 space-y-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#1D2230] pb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#D4AF37]" />
                  Editar Cadastro do Usuário
                </h3>
                <p className="text-xs text-[#A7AFBF]">Atualize as credenciais e permissões de acesso</p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-2 rounded-xl bg-[#0D0F12] text-[#A7AFBF] hover:text-white border border-[#1D2230]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A7AFBF]">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                  className="w-full h-10 px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A7AFBF]">E-mail</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser(prev => prev ? ({ ...prev, email: e.target.value }) : null)}
                  className="w-full h-10 px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A7AFBF]">Plano</label>
                  <input
                    type="text"
                    value={editingUser.plan}
                    onChange={(e) => setEditingUser(prev => prev ? ({ ...prev, plan: e.target.value }) : null)}
                    className="w-full h-10 px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A7AFBF]">Papel</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser(prev => prev ? ({ ...prev, role: e.target.value as any }) : null)}
                    className="w-full h-10 px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="student">Aluno VIP</option>
                    <option value="admin">Administrador Master</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A7AFBF]">Status da Conta</label>
                <select
                  value={editingUser.status}
                  onChange={(e) => setEditingUser(prev => prev ? ({ ...prev, status: e.target.value as any }) : null)}
                  className="w-full h-10 px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="active">Ativo (Acesso Liberado)</option>
                  <option value="blocked">Bloqueado (Acesso Suspenso)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A7AFBF]">URL da Imagem de Avatar</label>
                <input
                  type="url"
                  value={editingUser.avatar}
                  onChange={(e) => setEditingUser(prev => prev ? ({ ...prev, avatar: e.target.value }) : null)}
                  className="w-full h-10 px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#1D2230]">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-[#0D0F12] text-xs font-bold text-[#A7AFBF] hover:text-white border border-[#1D2230]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F5D76E] text-black text-xs font-black shadow-gold-glow flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>SALVAR ALTERAÇÕES</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. MODAL: CONFIRMAR EXCLUSÃO DE USUÁRIO */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#151922] border border-rose-500/30 rounded-3xl p-6 space-y-5 shadow-2xl animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Excluir Usuário Permanentemente?</h3>
              <p className="text-xs text-[#A7AFBF]">
                Você está prestes a remover <span className="font-bold text-white">{userToDelete.name}</span> ({userToDelete.email}). Esta ação não poderá ser desfeita.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl bg-[#0D0F12] text-xs font-bold text-[#A7AFBF] hover:text-white border border-[#1D2230]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteUser(userToDelete.id);
                  setUserToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black transition"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
