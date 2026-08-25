import React, { useState } from 'react';
import { 
  ShieldCheck, 
  BarChart3, 
  Users, 
  BookOpen, 
  Layers, 
  PlaySquare, 
  FileText, 
  Tag, 
  Settings, 
  Palette, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Crown, 
  Sparkles,
  Save,
  RefreshCw,
  Video,
  Upload,
  Lock,
  Unlock,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../services/store';
import { Course, Module, Lesson, Material, User, LoginCustomization, VideoType } from '../types';
import { AdminUserDashboard } from './AdminUserDashboard';
import { BrandingCustomizer } from './BrandingCustomizer';

export const AdminPanel: React.FC = () => {
  const { 
    courses, 
    users, 
    loginConfig, 
    saveCourse, 
    deleteCourse, 
    toggleCoursePublish,
    saveModule,
    deleteModule,
    saveLesson,
    deleteLesson,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    toggleUserRole,
    updateLoginConfig,
    resetLoginConfig,
    allCertificates
  } = useStore();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'dashboard' | 'users' | 'branding' | 'courses' | 'modules_lessons' | 'materials' | 'categories' | 'login_customizer'
  >('dashboard');

  // Selected course for module/lesson editing
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  // Course Form Modal state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);

  // Module Form Modal state
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [editingModule, setEditingModule] = useState<Partial<Module> | null>(null);

  // Lesson Form Modal state
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedModuleIdForLesson, setSelectedModuleIdForLesson] = useState<string>('');
  const [editingLesson, setEditingLesson] = useState<Partial<Lesson> | null>(null);

  // Login customizer live draft state
  const [draftLogin, setDraftLogin] = useState<LoginCustomization>({ ...loginConfig });
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [loginCustomizerTab, setLoginCustomizerTab] = useState<'fundo' | 'logo' | 'conteudo' | 'login' | 'avancado'>('fundo');
  const [savedLoginToast, setSavedLoginToast] = useState(false);

  // Course Save Handler
  const handleSaveCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse?.title) return;

    const courseToSave: Course = {
      id: editingCourse.id || `course-${Date.now()}`,
      title: editingCourse.title,
      description: editingCourse.description || '',
      category: editingCourse.category || 'Geral',
      level: editingCourse.level || 'Mastery',
      instructor: editingCourse.instructor || {
        name: 'Renato Nardin',
        role: 'Founder & CEO',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      thumbnailUrl: editingCourse.thumbnailUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      bannerUrl: editingCourse.bannerUrl || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80',
      isPublished: editingCourse.isPublished ?? true,
      order: editingCourse.order || courses.length + 1,
      modules: editingCourse.modules || []
    };

    saveCourse(courseToSave);
    setShowCourseModal(false);
    setEditingCourse(null);
  };

  // Module Save Handler
  const handleSaveModuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule?.title || !selectedCourse) return;

    const moduleToSave: Module = {
      id: editingModule.id || `mod-${Date.now()}`,
      courseId: selectedCourse.id,
      title: editingModule.title,
      description: editingModule.description || '',
      order: editingModule.order || selectedCourse.modules.length + 1,
      lessons: editingModule.lessons || []
    };

    saveModule(selectedCourse.id, moduleToSave);
    setShowModuleModal(false);
    setEditingModule(null);
  };

  // Lesson Save Handler
  const handleSaveLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson?.title || !selectedCourse || !selectedModuleIdForLesson) return;

    const lessonToSave: Lesson = {
      id: editingLesson.id || `les-${Date.now()}`,
      moduleId: selectedModuleIdForLesson,
      courseId: selectedCourse.id,
      title: editingLesson.title,
      description: editingLesson.description || '',
      duration: editingLesson.duration || '15:00',
      order: editingLesson.order || 1,
      videoType: (editingLesson.videoType as VideoType) || 'youtube',
      videoUrl: editingLesson.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: editingLesson.thumbnailUrl || selectedCourse.thumbnailUrl,
      materials: editingLesson.materials || []
    };

    saveLesson(selectedCourse.id, selectedModuleIdForLesson, lessonToSave);
    setShowLessonModal(false);
    setEditingLesson(null);
  };

  // Save Login Customization
  const handleSaveLoginConfig = () => {
    updateLoginConfig(draftLogin);
    setSavedLoginToast(true);
    setTimeout(() => setSavedLoginToast(false), 2500);
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1D2230] pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-xs font-black text-[#D4AF37] uppercase tracking-widest font-mono">
              PAINEL ADMINISTRATIVO VIP
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Gestão Master da Plataforma
          </h1>
          <p className="text-xs text-[#A7AFBF]">
            Gerenciamento completo de cursos, módulos, videoaulas, alunos, certificados e personalização visual.
          </p>
        </div>

        {/* Global Stats Counter */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-[#151922] border border-[#1D2230] text-center">
            <span className="text-[10px] text-[#A7AFBF] uppercase font-mono block">Cursos</span>
            <span className="text-sm font-extrabold text-white">{courses.length}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#151922] border border-[#1D2230] text-center">
            <span className="text-[10px] text-[#A7AFBF] uppercase font-mono block">Alunos</span>
            <span className="text-sm font-extrabold text-white">{users.length}</span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#1D2230] pb-2 custom-scrollbar">
        {[
          { id: 'dashboard', label: 'DASHBOARD', icon: BarChart3 },
          { id: 'users', label: 'USUÁRIOS & DASHBOARD VIP', icon: Users },
          { id: 'branding', label: 'LOGO & FAVICON', icon: Crown },
          { id: 'courses', label: 'CURSOS & FORMAÇÕES', icon: BookOpen },
          { id: 'modules_lessons', label: 'MÓDULOS & AULAS', icon: PlaySquare },
          { id: 'materials', label: 'MATERIAIS & ARQUIVOS', icon: FileText },
          { id: 'login_customizer', label: 'TELA DE LOGIN (PERSONALIZAÇÃO)', icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-[#151922] text-[#D4AF37] border border-[#D4AF37]/50 shadow-sm'
                  : 'text-[#A7AFBF] hover:text-white hover:bg-[#151922]/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ADMIN DASHBOARD */}
      {activeAdminTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              onClick={() => setActiveAdminTab('users')}
              className="p-5 rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/60 transition space-y-2 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#A7AFBF] uppercase font-mono">Total de Alunos</span>
                <span className="text-[10px] text-[#D4AF37] font-bold group-hover:underline">Ver Painel &rarr;</span>
              </div>
              <p className="text-3xl font-black text-white">{users.length}</p>
              <p className="text-[11px] text-emerald-400 font-medium">Dashboard VIP Premium Ativo</p>
            </div>
            <div 
              onClick={() => setActiveAdminTab('courses')}
              className="p-5 rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/60 transition space-y-2 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#A7AFBF] uppercase font-mono">Cursos Publicados</span>
                <span className="text-[10px] text-[#D4AF37] font-bold group-hover:underline">Gerenciar &rarr;</span>
              </div>
              <p className="text-3xl font-black text-[#D4AF37]">{courses.filter(c => c.isPublished).length}</p>
              <p className="text-[11px] text-[#A7AFBF]">De um total de {courses.length} formações</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#151922] border border-[#1D2230] space-y-2">
              <span className="text-[10px] font-bold text-[#A7AFBF] uppercase font-mono">Certificados Emitidos</span>
              <p className="text-3xl font-black text-white">{allCertificates.length}</p>
              <p className="text-[11px] text-emerald-400 font-medium">Autenticação ativa SHA-256</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#151922] border border-[#1D2230] space-y-2">
              <span className="text-[10px] font-bold text-[#A7AFBF] uppercase font-mono">Disponibilidade Sistema</span>
              <p className="text-3xl font-black text-white">99.98%</p>
              <p className="text-[11px] text-emerald-400 font-medium">SaaS Cloud Operational</p>
            </div>
          </div>

          {/* Quick Overview Table */}
          <div className="p-6 rounded-3xl bg-[#151922] border border-[#1D2230] space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              Status Rápido das Formações
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#A7AFBF]">
                <thead className="bg-[#0D0F12] text-white uppercase font-mono text-[10px] border-b border-[#1D2230]">
                  <tr>
                    <th className="p-3">Curso</th>
                    <th className="p-3">Categoria</th>
                    <th className="p-3">Instrutor</th>
                    <th className="p-3">Módulos</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D2230]">
                  {courses.map(course => (
                    <tr key={course.id} className="hover:bg-[#1D2230]/30 transition">
                      <td className="p-3 font-bold text-white flex items-center gap-3">
                        <img src={course.thumbnailUrl} alt="" className="w-10 h-7 rounded object-cover" />
                        <span className="truncate max-w-xs">{course.title}</span>
                      </td>
                      <td className="p-3">{course.category}</td>
                      <td className="p-3">{course.instructor.name}</td>
                      <td className="p-3">{course.modules.length} Módulos</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          course.isPublished ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {course.isPublished ? 'PUBLICADO' : 'RASCUNHO'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedCourseId(course.id);
                            setActiveAdminTab('modules_lessons');
                          }}
                          className="px-3 py-1 bg-[#0D0F12] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-lg transition text-[11px] font-bold border border-[#1D2230]"
                        >
                          Gerenciar Aulas
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USUÁRIOS & ALUNOS (DASHBOARD PREMIUM) */}
      {activeAdminTab === 'users' && (
        <AdminUserDashboard
          users={users}
          courses={courses}
          allCertificates={allCertificates}
          onToggleStatus={toggleUserStatus}
          onToggleRole={toggleUserRole}
          onCreateUser={createUser}
          onUpdateUser={updateUser}
          onDeleteUser={deleteUser}
        />
      )}

      {/* TAB 3: LOGO & FAVICON (BRANDING CUSTOMIZER) */}
      {activeAdminTab === 'branding' && (
        <BrandingCustomizer />
      )}

      {/* TAB 3: CURSOS */}
      {activeAdminTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Gerenciamento de Cursos</h2>
              <p className="text-xs text-[#A7AFBF]">Crie novas formações, edite detalhes ou altere status de publicação</p>
            </div>
            <button
              onClick={() => {
                setEditingCourse({
                  title: '',
                  description: '',
                  category: 'Negócios & Estratégia',
                  level: 'Mastery',
                  isPublished: true,
                  thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
                  bannerUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80',
                  instructor: {
                    name: 'Renato Nardin',
                    role: 'Venture Executive',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                  },
                  modules: []
                });
                setShowCourseModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F5D76E] text-black font-bold text-xs flex items-center gap-2 shadow-gold-glow"
            >
              <Plus className="w-4 h-4" />
              <span>NOVO CURSO</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="rounded-2xl bg-[#151922] border border-[#1D2230] overflow-hidden p-5 space-y-4 shadow-card-dark flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white font-mono uppercase">
                      {course.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-[#A7AFBF] line-clamp-2 mt-1">{course.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#A7AFBF] pt-2 border-t border-[#1D2230] font-mono">
                    <span>{course.modules.length} Módulos</span>
                    <span className={course.isPublished ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                      {course.isPublished ? 'PUBLICADO' : 'RASCUNHO'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1D2230]">
                  <button
                    onClick={() => {
                      setEditingCourse({ ...course });
                      setShowCourseModal(true);
                    }}
                    className="py-1.5 rounded-lg bg-[#0D0F12] hover:bg-[#1D2230] text-xs font-semibold text-white border border-[#1D2230]"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => toggleCoursePublish(course.id)}
                    className="py-1.5 rounded-lg bg-[#0D0F12] hover:bg-[#1D2230] text-xs font-semibold text-[#D4AF37] border border-[#1D2230]"
                  >
                    {course.isPublished ? 'Ocultar' : 'Publicar'}
                  </button>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-400 border border-rose-500/20"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MÓDULOS & AULAS */}
      {activeAdminTab === 'modules_lessons' && (
        <div className="space-y-6">
          {/* Select Course dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#151922] border border-[#1D2230]">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#D4AF37] uppercase font-mono">SELECIONE O CURSO PARA GERENCIAR:</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full sm:w-96 h-10 px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setEditingModule({
                  title: '',
                  description: '',
                  order: selectedCourse?.modules.length ? selectedCourse.modules.length + 1 : 1,
                  lessons: []
                });
                setShowModuleModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F5D76E] text-black font-bold text-xs flex items-center gap-2 shadow-gold-glow"
            >
              <Plus className="w-4 h-4" />
              <span>ADICIONAR MÓDULO</span>
            </button>
          </div>

          {/* Module List & Lessons */}
          {selectedCourse && (
            <div className="space-y-6">
              {selectedCourse.modules.length === 0 ? (
                <div className="py-12 text-center text-[#A7AFBF] text-xs bg-[#151922] rounded-2xl border border-[#1D2230]">
                  Nenhum módulo criado para este curso. Clique em "Adicionar Módulo".
                </div>
              ) : (
                selectedCourse.modules.map((mod, modIdx) => (
                  <div
                    key={mod.id}
                    className="p-6 rounded-3xl bg-[#151922] border border-[#1D2230] space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1D2230] pb-4">
                      <div>
                        <span className="text-[10px] font-bold text-[#D4AF37] uppercase font-mono">
                          MÓDULO 0{modIdx + 1}
                        </span>
                        <h3 className="text-base font-bold text-white">{mod.title}</h3>
                        {mod.description && <p className="text-xs text-[#A7AFBF]">{mod.description}</p>}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedModuleIdForLesson(mod.id);
                            setEditingLesson({
                              title: '',
                              description: '',
                              duration: '20:00',
                              videoType: 'youtube',
                              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                              thumbnailUrl: selectedCourse.thumbnailUrl,
                              order: mod.lessons.length + 1,
                              materials: []
                            });
                            setShowLessonModal(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#0D0F12] hover:bg-[#1D2230] text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Nova Aula</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingModule({ ...mod });
                            setShowModuleModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#0D0F12] text-[#A7AFBF] hover:text-white border border-[#1D2230]"
                          title="Editar Módulo"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteModule(selectedCourse.id, mod.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"
                          title="Excluir Módulo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Lessons inside this module */}
                    <div className="space-y-2">
                      {mod.lessons.length === 0 ? (
                        <p className="text-xs text-[#A7AFBF]/60 italic py-2">Nenhuma aula neste módulo.</p>
                      ) : (
                        mod.lessons.map((les, lesIdx) => (
                          <div
                            key={les.id}
                            className="p-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] flex items-center justify-between gap-3 hover:border-[#D4AF37]/40 transition"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="w-6 h-6 rounded-md bg-[#151922] text-[#D4AF37] flex items-center justify-center text-[10px] font-bold font-mono">
                                {lesIdx + 1}
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate">{les.title}</p>
                                <p className="text-[10px] text-[#A7AFBF] truncate">
                                  {les.videoType.toUpperCase()} • {les.duration} • {les.materials?.length || 0} materiais
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedModuleIdForLesson(mod.id);
                                  setEditingLesson({ ...les });
                                  setShowLessonModal(true);
                                }}
                                className="p-1.5 rounded-lg bg-[#151922] text-[#A7AFBF] hover:text-white border border-[#1D2230]"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteLesson(selectedCourse.id, mod.id, les.id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: MATERIAIS */}
      {activeAdminTab === 'materials' && (
        <div className="p-6 rounded-3xl bg-[#151922] border border-[#1D2230] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Central de Arquivos & Downloads</h2>
              <p className="text-xs text-[#A7AFBF]">Arquivos anexados às videoaulas para download pelos alunos</p>
            </div>
          </div>

          <div className="space-y-3">
            {courses.flatMap(c => c.modules.flatMap(m => m.lessons.flatMap(l => l.materials.map(mat => ({ ...mat, courseTitle: c.title, lessonTitle: l.title })))))
              .map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#151922] text-[#D4AF37] flex items-center justify-center text-[10px] font-mono font-bold">
                      {item.type}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{item.title}</p>
                      <p className="text-[10px] text-[#A7AFBF]">{item.courseTitle} &gt; {item.lessonTitle}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#D4AF37]">{item.size || 'Arquivo VIP'}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 6: TELA DE LOGIN (PERSONALIZAÇÃO EM TEMPO REAL) */}
      {activeAdminTab === 'login_customizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Controls Panel (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#151922] border border-[#1D2230] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D2230]">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#D4AF37]" />
                    Customizador da Tela de Login
                  </h2>
                  <p className="text-[11px] text-[#A7AFBF]">Edição em tempo real com preview instantâneo</p>
                </div>
                {savedLoginToast && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Salvo!
                  </span>
                )}
              </div>

              {/* Sub-tabs: FUNDO, LOGO, CONTEÚDO, LOGIN, AVANÇADO */}
              <div className="flex items-center gap-1 overflow-x-auto bg-[#0D0F12] p-1 rounded-xl border border-[#1D2230]">
                {(['fundo', 'logo', 'conteudo', 'login', 'avancado'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setLoginCustomizerTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition ${
                      loginCustomizerTab === tab 
                        ? 'bg-[#D4AF37] text-black shadow-sm' 
                        : 'text-[#A7AFBF] hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab 1: FUNDO */}
              {loginCustomizerTab === 'fundo' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#A7AFBF]">Tipo de Fundo</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['image', 'mp4', 'youtube', 'gradient', 'solid'] as const).map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setDraftLogin(prev => ({ ...prev, backgroundType: type }))}
                          className={`py-2 rounded-xl text-xs font-bold uppercase border transition ${
                            draftLogin.backgroundType === type
                              ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]'
                              : 'bg-[#0D0F12] text-[#A7AFBF] border-[#1D2230]'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {draftLogin.backgroundType !== 'solid' && draftLogin.backgroundType !== 'gradient' && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#A7AFBF]">URL do Fundo ({draftLogin.backgroundType.toUpperCase()})</label>
                      <input
                        type="url"
                        value={draftLogin.backgroundUrl}
                        onChange={(e) => setDraftLogin(prev => ({ ...prev, backgroundUrl: e.target.value }))}
                        className="w-full h-10 px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  )}

                  {draftLogin.backgroundType === 'solid' && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#A7AFBF]">Cor Sólida (Hex)</label>
                      <input
                        type="color"
                        value={draftLogin.solidColor || '#08090C'}
                        onChange={(e) => setDraftLogin(prev => ({ ...prev, solidColor: e.target.value }))}
                        className="w-full h-10 p-1 rounded-xl bg-[#0D0F12] border border-[#1D2230] cursor-pointer"
                      />
                    </div>
                  )}

                  {draftLogin.backgroundType === 'gradient' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#A7AFBF]">Gradiente De</label>
                        <input
                          type="color"
                          value={draftLogin.gradientFrom || '#08090C'}
                          onChange={(e) => setDraftLogin(prev => ({ ...prev, gradientFrom: e.target.value }))}
                          className="w-full h-10 p-1 rounded-xl bg-[#0D0F12] border border-[#1D2230]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#A7AFBF]">Gradiente Para</label>
                        <input
                          type="color"
                          value={draftLogin.gradientTo || '#151922'}
                          onChange={(e) => setDraftLogin(prev => ({ ...prev, gradientTo: e.target.value }))}
                          className="w-full h-10 p-1 rounded-xl bg-[#0D0F12] border border-[#1D2230]"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-[#A7AFBF]">
                      <span>Opacidade do Overlay Escuro</span>
                      <span className="text-[#D4AF37] font-bold">{draftLogin.overlayOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="95"
                      value={draftLogin.overlayOpacity}
                      onChange={(e) => setDraftLogin(prev => ({ ...prev, overlayOpacity: Number(e.target.value) }))}
                      className="w-full accent-[#D4AF37]"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: LOGO & BRAND */}
              {loginCustomizerTab === 'logo' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#A7AFBF]">Título da Marca</label>
                    <input
                      type="text"
                      value={draftLogin.brandTitle}
                      onChange={(e) => setDraftLogin(prev => ({ ...prev, brandTitle: e.target.value }))}
                      className="w-full h-10 px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#A7AFBF]">Slogan Cinematográfico</label>
                    <textarea
                      rows={2}
                      value={draftLogin.brandSubtitle}
                      onChange={(e) => setDraftLogin(prev => ({ ...prev, brandSubtitle: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: CONTEÚDO */}
              {loginCustomizerTab === 'conteudo' && (
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-[#A7AFBF]">Benefícios em Destaque</label>
                  {draftLogin.brandHighlights.map((hl, i) => (
                    <input
                      key={i}
                      type="text"
                      value={hl}
                      onChange={(e) => {
                        const newHl = [...draftLogin.brandHighlights];
                        newHl[i] = e.target.value;
                        setDraftLogin(prev => ({ ...prev, brandHighlights: newHl }));
                      }}
                      className="w-full h-9 px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  ))}
                </div>
              )}

              {/* Tab 4: LOGIN FORM */}
              {loginCustomizerTab === 'login' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#A7AFBF]">Título do Formulário</label>
                    <input
                      type="text"
                      value={draftLogin.formTitle}
                      onChange={(e) => setDraftLogin(prev => ({ ...prev, formTitle: e.target.value }))}
                      className="w-full h-10 px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#A7AFBF]">Texto do Botão</label>
                    <input
                      type="text"
                      value={draftLogin.buttonText}
                      onChange={(e) => setDraftLogin(prev => ({ ...prev, buttonText: e.target.value }))}
                      className="w-full h-10 px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              )}

              {/* Tab 5: AVANÇADO */}
              {loginCustomizerTab === 'avancado' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-[#A7AFBF]">
                      <span>Desfoque de Fundo (Blur)</span>
                      <span className="text-[#D4AF37] font-bold">{draftLogin.overlayBlur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="12"
                      value={draftLogin.overlayBlur}
                      onChange={(e) => setDraftLogin(prev => ({ ...prev, overlayBlur: Number(e.target.value) }))}
                      className="w-full accent-[#D4AF37]"
                    />
                  </div>
                </div>
              )}

              {/* Save / Reset Actions */}
              <div className="flex items-center gap-3 pt-3 border-t border-[#1D2230]">
                <button
                  onClick={resetLoginConfig}
                  className="px-4 py-2.5 rounded-xl bg-[#0D0F12] hover:bg-[#1D2230] text-xs font-bold text-[#A7AFBF] hover:text-white border border-[#1D2230] flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restaurar Padrão</span>
                </button>
                <button
                  onClick={handleSaveLoginConfig}
                  className="flex-1 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F5D76E] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-gold-glow"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Personalização</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Live Preview Container (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Device Viewport Bar */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#151922] border border-[#1D2230]">
              <span className="text-xs font-bold text-[#D4AF37] uppercase font-mono flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                PREVIEW EM TEMPO REAL
              </span>

              <div className="flex items-center gap-1 bg-[#0D0F12] p-1 rounded-xl border border-[#1D2230]">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg transition ${
                    previewDevice === 'desktop' ? 'bg-[#D4AF37] text-black' : 'text-[#A7AFBF] hover:text-white'
                  }`}
                  title="Desktop Preview"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded-lg transition ${
                    previewDevice === 'tablet' ? 'bg-[#D4AF37] text-black' : 'text-[#A7AFBF] hover:text-white'
                  }`}
                  title="Tablet Preview"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg transition ${
                    previewDevice === 'mobile' ? 'bg-[#D4AF37] text-black' : 'text-[#A7AFBF] hover:text-white'
                  }`}
                  title="Mobile Preview"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulated Live Viewport Frame */}
            <div className="flex justify-center bg-[#08090C] p-4 rounded-3xl border border-[#1D2230] overflow-hidden min-h-[500px]">
              <div 
                className={`transition-all duration-300 rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl flex ${
                  previewDevice === 'desktop' ? 'w-full h-[520px]' : previewDevice === 'tablet' ? 'w-[480px] h-[520px]' : 'w-[320px] h-[520px] flex-col'
                }`}
              >
                {/* Simulated Left Cinema */}
                <div className={`relative ${previewDevice === 'mobile' ? 'h-40' : 'flex-1'} p-6 flex flex-col justify-between overflow-hidden`}>
                  {draftLogin.backgroundType === 'image' && (
                    <img src={draftLogin.backgroundUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  {draftLogin.backgroundType === 'gradient' && (
                    <div className="absolute inset-0 w-full h-full" style={{ background: `linear-gradient(135deg, ${draftLogin.gradientFrom}, ${draftLogin.gradientTo})` }} />
                  )}
                  {draftLogin.backgroundType === 'solid' && (
                    <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: draftLogin.solidColor }} />
                  )}

                  <div 
                    className="absolute inset-0" 
                    style={{ 
                      backgroundColor: '#08090C', 
                      opacity: draftLogin.overlayOpacity / 100, 
                      backdropFilter: `blur(${draftLogin.overlayBlur}px)` 
                    }} 
                  />

                  <div className="relative z-10 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-xs font-bold text-white font-mono">{draftLogin.brandTitle}</span>
                  </div>

                  <div className="relative z-10 my-auto space-y-2">
                    <h3 className="text-sm font-bold text-white leading-tight line-clamp-2">
                      {draftLogin.brandSubtitle}
                    </h3>
                  </div>
                </div>

                {/* Simulated Right Login Form */}
                <div className={`${previewDevice === 'mobile' ? 'flex-1' : 'w-64'} bg-[#0D0F12] p-4 flex flex-col justify-center space-y-3 border-l border-[#1D2230]`}>
                  <div>
                    <h4 className="text-xs font-bold text-white">{draftLogin.formTitle}</h4>
                    <p className="text-[9px] text-[#A7AFBF]">{draftLogin.formSubtitle}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="h-7 rounded-lg bg-[#151922] border border-[#1D2230] px-2 text-[10px] text-[#A7AFBF] flex items-center">
                      aluno@exemplo.com
                    </div>
                    <div className="h-7 rounded-lg bg-[#151922] border border-[#1D2230] px-2 text-[10px] text-[#A7AFBF] flex items-center">
                      ••••••••
                    </div>
                    <div className="h-8 rounded-lg bg-[#D4AF37] text-black font-bold text-[10px] flex items-center justify-center uppercase">
                      {draftLogin.buttonText}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create/Edit Course */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0D0F12] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1D2230]">
              <h3 className="text-base font-bold text-white">
                {editingCourse?.id ? 'Editar Formação' : 'Criar Nova Formação'}
              </h3>
              <button onClick={() => setShowCourseModal(false)} className="text-[#A7AFBF] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourseSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A7AFBF]">Título do Curso</label>
                <input
                  type="text"
                  required
                  value={editingCourse?.title || ''}
                  onChange={(e) => setEditingCourse(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A7AFBF]">Categoria</label>
                  <input
                    type="text"
                    value={editingCourse?.category || ''}
                    onChange={(e) => setEditingCourse(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A7AFBF]">Nível</label>
                  <select
                    value={editingCourse?.level || 'Mastery'}
                    onChange={(e) => setEditingCourse(prev => ({ ...prev, level: e.target.value as any }))}
                    className="w-full h-10 px-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                    <option value="Mastery">Mastery</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A7AFBF]">Descrição Completa</label>
                <textarea
                  rows={3}
                  value={editingCourse?.description || ''}
                  onChange={(e) => setEditingCourse(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A7AFBF]">Thumbnail URL (16:9)</label>
                  <input
                    type="url"
                    value={editingCourse?.thumbnailUrl || ''}
                    onChange={(e) => setEditingCourse(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A7AFBF]">Banner Hero URL</label>
                  <input
                    type="url"
                    value={editingCourse?.bannerUrl || ''}
                    onChange={(e) => setEditingCourse(prev => ({ ...prev, bannerUrl: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#151922] text-xs text-[#A7AFBF]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F5D76E] text-black font-bold text-xs"
                >
                  Salvar Formação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create/Edit Module */}
      {showModuleModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0D0F12] border border-[#D4AF37]/40 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">
              {editingModule?.id ? 'Editar Módulo' : 'Novo Módulo'}
            </h3>
            <form onSubmit={handleSaveModuleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A7AFBF]">Título do Módulo</label>
                <input
                  type="text"
                  required
                  value={editingModule?.title || ''}
                  onChange={(e) => setEditingModule(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Módulo 01: Fundamentos de Escala"
                  className="w-full h-10 px-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A7AFBF]">Descrição Breve</label>
                <textarea
                  rows={2}
                  value={editingModule?.description || ''}
                  onChange={(e) => setEditingModule(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModuleModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#151922] text-xs text-[#A7AFBF]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F5D76E] text-black font-bold text-xs"
                >
                  Salvar Módulo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create/Edit Lesson */}
      {showLessonModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0D0F12] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              {editingLesson?.id ? 'Editar Aula' : 'Nova Videoaula'}
            </h3>
            <form onSubmit={handleSaveLessonSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A7AFBF]">Título da Aula</label>
                <input
                  type="text"
                  required
                  value={editingLesson?.title || ''}
                  onChange={(e) => setEditingLesson(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Aula 01: O Mindset dos Negócios de Alta Performance"
                  className="w-full h-10 px-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A7AFBF]">Tipo de Vídeo</label>
                  <select
                    value={editingLesson?.videoType || 'youtube'}
                    onChange={(e) => setEditingLesson(prev => ({ ...prev, videoType: e.target.value as any }))}
                    className="w-full h-10 px-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="youtube">YouTube (URL / ID)</option>
                    <option value="vimeo">Vimeo</option>
                    <option value="mp4">Vídeo MP4 Direto</option>
                    <option value="url">URL Externa</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A7AFBF]">Duração (Ex: 24:15)</label>
                  <input
                    type="text"
                    value={editingLesson?.duration || '18:00'}
                    onChange={(e) => setEditingLesson(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A7AFBF]">URL do Vídeo</label>
                <input
                  type="url"
                  required
                  value={editingLesson?.videoUrl || ''}
                  onChange={(e) => setEditingLesson(prev => ({ ...prev, videoUrl: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full h-10 px-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A7AFBF]">Descrição Detalhada da Aula</label>
                <textarea
                  rows={3}
                  value={editingLesson?.description || ''}
                  onChange={(e) => setEditingLesson(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLessonModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#151922] text-xs text-[#A7AFBF]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F5D76E] text-black font-bold text-xs"
                >
                  Salvar Aula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
