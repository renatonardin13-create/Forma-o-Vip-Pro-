import React, { useState, useEffect } from 'react';
import { useStore } from './services/store';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ShieldAlert } from 'lucide-react';
import { StudentDashboard } from './components/StudentDashboard';
import { CourseCatalog } from './components/CourseCatalog';
import { CourseDetail } from './components/CourseDetail';
import { VideoPlayer } from './components/VideoPlayer';
import { LearningTracksView } from './components/LearningTracksView';
import { CertificatesView } from './components/CertificatesView';
import { MaterialsView } from './components/MaterialsView';
import { CommunityView } from './components/CommunityView';
import { SupportView } from './components/SupportView';
import { AdminPanel } from './components/AdminPanel';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { LoginScreen } from './components/LoginScreen';
import { AreaLoginScreen } from './components/AreaLoginScreen';
import { MemberAreaView } from './components/MemberAreaView';
import { AccessDeniedScreen } from './components/AccessDeniedScreen';
import { UserProfileModal } from './components/UserProfileModal';
import { FirstLoginPasswordModal } from './components/FirstLoginPasswordModal';

export default function App() {
  const { 
    currentUser, 
    login,
    logout, 
    memberAreas, 
    checkUserAreaAccess,
    adminTab,
    setAdminTab,
    initializeAuth
  } = useStore();

  useEffect(() => {
    initializeAuth();
  }, []);
  
  // URL routing state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname.replace(/^\/+|\/+$/g, '');
  });

  // Navigation state for Student Portal
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Layout UI state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Admin Layout State
  const [mobileAdminSidebarOpen, setMobileAdminSidebarOpen] = useState(false);
  const [isAdminCollapsed, setIsAdminCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('vip_admin_sidebar_collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('vip_admin_sidebar_collapsed', String(isAdminCollapsed));
  }, [isAdminCollapsed]);

  // Sync URL changes (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
      setCurrentPath(path);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToRoute = (path: string) => {
    const cleanPath = path.replace(/^\/+|\/+$/g, '');
    window.history.pushState({}, '', `/${cleanPath}`);
    setCurrentPath(cleanPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine if URL matches a Member Area slug (e.g. /formacao-vip, /ebooks, /aplicativos)
  const isSystemRoute = currentPath === '' || currentPath === 'aluno' || currentPath === 'admin';
  const matchedArea = !isSystemRoute ? memberAreas.find(a => a.slug.toLowerCase() === currentPath.toLowerCase()) : null;

  // 1. ROUTE: DEDICATED MEMBER AREA (/{slug})
  if (matchedArea) {
    // If not logged in, render area-specific custom Login screen
    if (!currentUser) {
      return (
        <AreaLoginScreen
          area={matchedArea}
          onLogin={(email, pass) => login(email, pass)}
          onSwitchDemo={(role) => {
            if (role === 'student') login('aluno@vip.com');
            else login('admin@formacaovip.com');
          }}
          onGoToGeneralStudentArea={() => navigateToRoute('aluno')}
        />
      );
    }

    // If logged in, check permission for this area
    const hasAccess = currentUser.role === 'admin' || checkUserAreaAccess(currentUser.id, matchedArea.id);

    if (!hasAccess) {
      return (
        <AccessDeniedScreen
          area={matchedArea}
          currentUser={currentUser}
          onGoBack={() => navigateToRoute('aluno')}
          onLogout={logout}
        />
      );
    }

    // User has access -> render dedicated catalog view
    return (
      <MemberAreaView
        area={matchedArea}
        onSelectCourse={(courseId) => {
          setActiveCourseId(courseId);
          setCurrentView('course-detail');
          navigateToRoute('aluno');
        }}
        onSwitchArea={(slug) => navigateToRoute(slug)}
        onGoToAdmin={() => navigateToRoute('admin')}
        onGoToGeneralStudentArea={() => navigateToRoute('aluno')}
        onLogout={logout}
      />
    );
  }

  // 2. ROUTE: ADMIN PANEL (/admin)
  if (currentPath === 'admin') {
    if (!currentUser) {
      return (
        <LoginScreen 
          onLoginSuccess={() => {
            navigateToRoute('admin');
          }} 
        />
      );
    }

    // AUTH CHECK: Only admins can access the admin panel
    if (currentUser.role !== 'admin') {
      return (
        <div className="min-h-screen bg-[#08090C] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#0D0F12] border border-[#1D2230] rounded-3xl p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
              <ShieldAlert className="w-10 h-10 text-rose-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Acesso Restrito</h2>
              <p className="text-sm text-[#8E9BB0] leading-relaxed">
                Você não tem permissão para acessar esta área. Esta página é exclusiva para administradores do sistema.
              </p>
            </div>
            <button
              onClick={() => navigateToRoute('aluno')}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#D4AF37] text-black font-bold hover:bg-[#F5D76E] transition shadow-lg shadow-[#D4AF37]/20"
            >
              Voltar para Área do Aluno
            </button>
          </div>
        </div>
      );
    }

    // Admin Layout with fixed left sidebar and responsive content
    return (
      <div className="min-h-screen bg-[#08090C] text-white flex font-sans">
        {/* Fixed Left Vertical Admin Sidebar */}
        <AdminSidebar
          activeTab={adminTab}
          setActiveTab={setAdminTab}
          isOpenMobile={mobileAdminSidebarOpen}
          setIsOpenMobile={setMobileAdminSidebarOpen}
          onGoToStudentArea={() => navigateToRoute('aluno')}
          onLogout={logout}
          isCollapsed={isAdminCollapsed}
          setIsCollapsed={setIsAdminCollapsed}
        />

        {/* Main Content Area (shifted based on sidebar width) */}
        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isAdminCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}>
          {/* Admin Top Header */}
          <AdminHeader
            onToggleMobileMenu={() => setMobileAdminSidebarOpen(prev => !prev)}
            onGoToStudentArea={() => navigateToRoute('aluno')}
            activeTab={adminTab}
          />

          {/* Admin Page Content */}
          <main className="flex-1 w-full p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto overflow-x-hidden">
            <AdminPanel />
          </main>
        </div>
      </div>
    );
  }

  // 3. ROUTE: GENERAL STUDENT PORTAL (/aluno or /)
  // If user is not logged in, show global Login Screen
  if (!currentUser) {
    return (
      <LoginScreen 
        onLoginSuccess={() => {
          setCurrentView('dashboard');
        }} 
      />
    );
  }

  // Course & Lesson navigation handlers
  const handleOpenCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    setCurrentView('course-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLesson = (courseId: string, lessonId: string) => {
    setActiveCourseId(courseId);
    setActiveLessonId(lessonId);
    setCurrentView('video-player');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: string) => {
    if (view === 'admin') {
      navigateToRoute('admin');
      return;
    }
    setCurrentView(view);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-white flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={currentView as any}
        setActiveTab={handleNavigate}
        isOpenMobile={mobileSidebarOpen}
        setIsOpenMobile={setMobileSidebarOpen}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenCourse={handleOpenCourse}
      />

      {/* Main Content Wrapper (shifted on desktop to account for w-72 fixed sidebar) */}
      <div className="flex-1 flex flex-col lg:pl-72 min-h-screen">
        {/* Top Header */}
        <Header 
          onToggleMobileMenu={() => setMobileSidebarOpen(prev => !prev)}
          onOpenProfile={() => setShowProfileModal(true)}
          onSelectCourse={handleOpenCourse}
          onSelectLesson={handleOpenLesson}
          onNavigateTab={handleNavigate}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full min-h-[calc(100vh-5rem)] pb-16 overflow-x-hidden">
          {/* VIEW: DASHBOARD (HOME) */}
          {currentView === 'dashboard' && (
            <StudentDashboard
              onOpenCourse={handleOpenCourse}
              onOpenLesson={handleOpenLesson}
              onNavigateTab={handleNavigate}
            />
          )}

          {/* VIEW: MEUS CURSOS */}
          {currentView === 'my-courses' && (
            <CourseCatalog
              mode="my-courses"
              onOpenCourse={handleOpenCourse}
              onOpenLesson={handleOpenLesson}
            />
          )}

          {/* VIEW: TODOS OS CURSOS */}
          {currentView === 'all-courses' && (
            <CourseCatalog
              mode="all-courses"
              onOpenCourse={handleOpenCourse}
              onOpenLesson={handleOpenLesson}
            />
          )}

          {/* VIEW: CONTINUAR ASSISTINDO */}
          {currentView === 'continue-watching' && (
            <CourseCatalog
              mode="continue-watching"
              onOpenCourse={handleOpenCourse}
              onOpenLesson={handleOpenLesson}
            />
          )}

          {/* VIEW: FAVORITOS */}
          {currentView === 'favorites' && (
            <CourseCatalog
              mode="favorites"
              onOpenCourse={handleOpenCourse}
              onOpenLesson={handleOpenLesson}
            />
          )}

          {/* VIEW: TRILHAS DE APRENDIZADO */}
          {(currentView === 'tracks' || currentView === 'learning-tracks') && (
            <LearningTracksView onOpenCourse={handleOpenCourse} />
          )}

          {/* VIEW: CERTIFICADOS */}
          {currentView === 'certificates' && (
            <CertificatesView />
          )}

          {/* VIEW: MATERIAIS */}
          {currentView === 'materials' && (
            <MaterialsView />
          )}

          {/* VIEW: COMUNIDADE */}
          {currentView === 'community' && (
            <CommunityView />
          )}

          {/* VIEW: SUPORTE */}
          {currentView === 'support' && (
            <SupportView />
          )}

          {/* VIEW: CURSO DETALHE (MÓDULOS) */}
          {currentView === 'course-detail' && activeCourseId && (
            <CourseDetail
              courseId={activeCourseId}
              onBack={() => setCurrentView('all-courses')}
              onOpenLesson={handleOpenLesson}
            />
          )}

          {/* VIEW: PLAYER DE VÍDEO & AULA ATIVA */}
          {currentView === 'video-player' && activeCourseId && activeLessonId && (
            <VideoPlayer
              courseId={activeCourseId}
              lessonId={activeLessonId}
              onBack={() => {
                if (activeCourseId) {
                  setCurrentView('course-detail');
                } else {
                  setCurrentView('dashboard');
                }
              }}
              onSelectLesson={(courseId, lessonId) => {
                setActiveCourseId(courseId);
                setActiveLessonId(lessonId);
              }}
            />
          )}

          {/* VIEW: PAINEL ADMINISTRATIVO */}
          {currentView === 'admin' && (
            <AdminPanel />
          )}
        </main>
      </div>

      {/* User Profile Modal */}
      {showProfileModal && (
        <UserProfileModal onClose={() => setShowProfileModal(false)} />
      )}

      {/* Forced Password Reset on First Access Modal */}
      <FirstLoginPasswordModal />
    </div>
  );
}
