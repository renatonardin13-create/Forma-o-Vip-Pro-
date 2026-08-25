import React, { useState } from 'react';
import { useStore } from './services/store';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
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
import { LoginScreen } from './components/LoginScreen';
import { UserProfileModal } from './components/UserProfileModal';
import { FirstLoginPasswordModal } from './components/FirstLoginPasswordModal';

export default function App() {
  const { currentUser, logout } = useStore();
  
  // Navigation state
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Layout UI state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // If user is not logged in, show cinematic Login Screen
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
    setCurrentView(view);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setCurrentView('all-courses');
    }
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
