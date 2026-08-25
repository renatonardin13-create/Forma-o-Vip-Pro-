import { useState, useEffect } from 'react';
import { 
  User, 
  Course, 
  Module, 
  Lesson, 
  StudentProgress, 
  Certificate, 
  LearningTrack, 
  CommunityPost, 
  LoginCustomization,
  Material,
  BrandingConfig,
  Matricula,
  ProdutoCursoMapping,
  WebhookLogRecord
} from '../types';
import { 
  INITIAL_USER, 
  INITIAL_ADMIN_USER, 
  INITIAL_USERS_LIST,
  INITIAL_COURSES, 
  INITIAL_CERTIFICATES, 
  INITIAL_LEARNING_TRACKS, 
  INITIAL_COMMUNITY_POSTS, 
  INITIAL_LOGIN_CUSTOMIZATION,
  INITIAL_BRANDING,
  INITIAL_PRODUTOS_CURSOS,
  INITIAL_MATRICULAS,
  INITIAL_WEBHOOK_LOGS
} from '../data/mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'vip_pro_current_user',
  USERS_LIST: 'vip_pro_users_list',
  COURSES: 'vip_pro_courses',
  PROGRESS: 'vip_pro_progress',
  CERTIFICATES: 'vip_pro_certificates',
  TRACKS: 'vip_pro_tracks',
  COMMUNITY: 'vip_pro_community',
  LOGIN_CONFIG: 'vip_pro_login_config',
  FAVORITES: 'vip_pro_favorites',
  BRANDING: 'vip_pro_branding',
  MATRICULAS: 'vip_pro_matriculas',
  PRODUTOS_CURSOS: 'vip_pro_produtos_cursos',
  WEBHOOK_LOGS: 'vip_pro_webhook_logs',
};

// DOM synchronization helper for dynamic favicon and page title
function applyBrandingToDOM(branding: BrandingConfig) {
  if (typeof document === 'undefined') return;
  if (branding.pageTitle) {
    document.title = branding.pageTitle;
  }
  if (branding.faviconUrl) {
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0]?.appendChild(link);
    }
    link.type = branding.faviconUrl.includes('.svg') ? 'image/svg+xml' : 'image/png';
    link.href = branding.faviconUrl;
  }
}

// Memory cache fallback for items that exceed localStorage quota
const memoryStorageFallback: Record<string, string> = {};

// Initial setup helper
function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key) || memoryStorageFallback[key] || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(key) : null);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (e: any) {
    // If quota exceeded or storage error, save to sessionStorage and memory cache
    console.warn(`Storage quota or write warning for key "${key}". Activating safe fallback.`, e?.message);
    try {
      const serialized = JSON.stringify(value);
      memoryStorageFallback[key] = serialized;
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(key, serialized);
      }
    } catch (fallbackError) {
      // Keep in memory
      memoryStorageFallback[key] = JSON.stringify(value);
    }
  }
}

// Global state container with reactive subscribers
class StoreManager {
  private currentUser: User | null;
  private users: User[];
  private courses: Course[];
  private progress: Record<string, StudentProgress>; // key: `${userId}_${courseId}`
  private certificates: Certificate[];
  private tracks: LearningTrack[];
  private communityPosts: CommunityPost[];
  private loginConfig: LoginCustomization;
  private favoriteCourseIds: string[];
  private branding: BrandingConfig;
  private matriculas: Matricula[];
  private produtosCursos: ProdutoCursoMapping[];
  private webhookLogs: WebhookLogRecord[];
  private adminTab: string = 'dashboard';
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.currentUser = loadStorage<User | null>(STORAGE_KEYS.CURRENT_USER, INITIAL_USER);
    this.users = loadStorage<User[]>(STORAGE_KEYS.USERS_LIST, INITIAL_USERS_LIST);
    this.courses = loadStorage<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    this.matriculas = loadStorage<Matricula[]>(STORAGE_KEYS.MATRICULAS, INITIAL_MATRICULAS);
    this.produtosCursos = loadStorage<ProdutoCursoMapping[]>(STORAGE_KEYS.PRODUTOS_CURSOS, INITIAL_PRODUTOS_CURSOS);
    this.webhookLogs = loadStorage<WebhookLogRecord[]>(STORAGE_KEYS.WEBHOOK_LOGS, INITIAL_WEBHOOK_LOGS);
    this.progress = loadStorage<Record<string, StudentProgress>>(STORAGE_KEYS.PROGRESS, {
      [`${INITIAL_USER.id}_course-negocios-digitais`]: {
        courseId: 'course-negocios-digitais',
        completedLessonIds: ['les-1-1', 'les-1-2', 'les-1-3', 'les-2-1'],
        lastLessonId: 'les-2-2',
        lastAccessedAt: new Date().toISOString(),
        totalStudyTimeMinutes: 120,
        notes: {
          'les-1-1': 'Importante: Rever a parte de alinhamento de métricas LTV e CAC com o time financeiro todo início de mês.'
        }
      },
      [`${INITIAL_USER.id}_course-ia-produtividade`]: {
        courseId: 'course-ia-produtividade',
        completedLessonIds: ['les-ia-1-1'],
        lastLessonId: 'les-ia-1-2',
        lastAccessedAt: new Date().toISOString(),
        totalStudyTimeMinutes: 45,
        notes: {}
      }
    });
    this.certificates = loadStorage<Certificate[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    this.tracks = loadStorage<LearningTrack[]>(STORAGE_KEYS.TRACKS, INITIAL_LEARNING_TRACKS);
    this.communityPosts = loadStorage<CommunityPost[]>(STORAGE_KEYS.COMMUNITY, INITIAL_COMMUNITY_POSTS);
    this.loginConfig = loadStorage<LoginCustomization>(STORAGE_KEYS.LOGIN_CONFIG, INITIAL_LOGIN_CUSTOMIZATION);
    this.favoriteCourseIds = loadStorage<string[]>(STORAGE_KEYS.FAVORITES, ['course-negocios-digitais', 'course-ia-produtividade']);
    this.branding = loadStorage<BrandingConfig>(STORAGE_KEYS.BRANDING, INITIAL_BRANDING);
    applyBrandingToDOM(this.branding);
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // Getters
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public getUsers(): User[] {
    return this.users;
  }

  public getCourses(): Course[] {
    return this.courses;
  }

  public getCourse(id: string): Course | undefined {
    return this.courses.find(c => c.id === id);
  }

  public getLearningTracks(): LearningTrack[] {
    return this.tracks;
  }

  public getCertificates(): Certificate[] {
    if (!this.currentUser) return [];
    return this.certificates.filter(c => c.userId === this.currentUser?.id);
  }

  public getAllCertificates(): Certificate[] {
    return this.certificates;
  }

  public getCommunityPosts(): CommunityPost[] {
    return this.communityPosts;
  }

  public getLoginConfig(): LoginCustomization {
    return this.loginConfig;
  }

  public getFavorites(): string[] {
    return this.favoriteCourseIds;
  }

  public isFavorite(courseId: string): boolean {
    return this.favoriteCourseIds.includes(courseId);
  }

  public toggleFavorite(courseId: string): void {
    if (this.favoriteCourseIds.includes(courseId)) {
      this.favoriteCourseIds = this.favoriteCourseIds.filter(id => id !== courseId);
    } else {
      this.favoriteCourseIds.push(courseId);
    }
    saveStorage(STORAGE_KEYS.FAVORITES, this.favoriteCourseIds);
    this.notify();
  }

  // Auth Operations
  public login(email: string, _password?: string): boolean {
    const foundUser = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      if (foundUser.status === 'blocked') {
        throw new Error('Esta conta está bloqueada pelo administrador.');
      }
      foundUser.lastAccessAt = new Date().toLocaleString('pt-BR');
      this.currentUser = { ...foundUser };
      saveStorage(STORAGE_KEYS.CURRENT_USER, this.currentUser);
      saveStorage(STORAGE_KEYS.USERS_LIST, this.users);
      this.notify();
      return true;
    }
    // Auto-create student if valid format
    if (email.includes('@')) {
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: email.toLowerCase().includes('admin') ? 'admin' : 'student',
        plan: 'MEMBRO PREMIUM VIP',
        registeredAt: new Date().toISOString().split('T')[0],
        lastAccessAt: new Date().toLocaleString('pt-BR'),
        status: 'active',
        stats: {
          activeCourses: 1,
          completedLessons: 0,
          studyTimeMinutes: 0,
          certificatesCount: 0,
        }
      };
      this.users.push(newUser);
      this.currentUser = newUser;
      saveStorage(STORAGE_KEYS.CURRENT_USER, this.currentUser);
      saveStorage(STORAGE_KEYS.USERS_LIST, this.users);
      this.notify();
      return true;
    }
    return false;
  }

  public logout(): void {
    this.currentUser = null;
    saveStorage(STORAGE_KEYS.CURRENT_USER, null);
    this.notify();
  }

  public switchDemoAccount(type: 'student' | 'admin'): void {
    if (type === 'admin') {
      const admin = this.users.find(u => u.role === 'admin') || INITIAL_ADMIN_USER;
      this.currentUser = admin;
    } else {
      const student = this.users.find(u => u.role === 'student' && u.email === 'renatonardin13@gmail.com') || INITIAL_USER;
      this.currentUser = student;
    }
    saveStorage(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    this.notify();
  }

  public updateProfile(updated: Partial<User>): void {
    if (!this.currentUser) return;
    this.currentUser = { ...this.currentUser, ...updated };
    this.users = this.users.map(u => u.id === this.currentUser?.id ? this.currentUser! : u);
    saveStorage(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    saveStorage(STORAGE_KEYS.USERS_LIST, this.users);
    this.notify();
  }

  // Progress tracking
  public getCourseProgress(courseId: string): { 
    completedLessonIds: string[];
    totalLessons: number;
    percentage: number;
    lastLessonId?: string;
  } {
    const course = this.getCourse(courseId);
    if (!course) return { completedLessonIds: [], totalLessons: 0, percentage: 0 };
    
    let allLessons: Lesson[] = [];
    course.modules.forEach(m => {
      allLessons = [...allLessons, ...m.lessons];
    });
    
    const totalLessons = allLessons.length;
    if (totalLessons === 0) return { completedLessonIds: [], totalLessons: 0, percentage: 0 };

    if (!this.currentUser) return { completedLessonIds: [], totalLessons, percentage: 0 };

    const key = `${this.currentUser.id}_${courseId}`;
    const prog = this.progress[key];
    const completedLessonIds = prog?.completedLessonIds || [];
    const percentage = Math.round((completedLessonIds.length / totalLessons) * 100);

    return {
      completedLessonIds,
      totalLessons,
      percentage: Math.min(100, percentage),
      lastLessonId: prog?.lastLessonId || allLessons[0]?.id
    };
  }

  public markLessonCompleted(courseId: string, lessonId: string): void {
    if (!this.currentUser) return;
    const key = `${this.currentUser.id}_${courseId}`;
    const existing = this.progress[key] || {
      courseId,
      completedLessonIds: [],
      lastLessonId: lessonId,
      lastAccessedAt: new Date().toISOString(),
      totalStudyTimeMinutes: 0
    };

    if (!existing.completedLessonIds.includes(lessonId)) {
      existing.completedLessonIds.push(lessonId);
      existing.lastLessonId = lessonId;
      existing.lastAccessedAt = new Date().toISOString();
      existing.totalStudyTimeMinutes += 20; // add study time

      this.progress[key] = { ...existing };
      saveStorage(STORAGE_KEYS.PROGRESS, this.progress);

      // Check if course completed to issue certificate
      const course = this.getCourse(courseId);
      if (course) {
        let allLessonCount = 0;
        course.modules.forEach(m => allLessonCount += m.lessons.length);
        if (existing.completedLessonIds.length >= allLessonCount && allLessonCount > 0) {
          this.issueCertificateForCourse(course);
        }
      }

      this.recalculateUserStats();
      this.notify();
    }
  }

  public unmarkLessonCompleted(courseId: string, lessonId: string): void {
    if (!this.currentUser) return;
    const key = `${this.currentUser.id}_${courseId}`;
    const existing = this.progress[key];
    if (existing) {
      existing.completedLessonIds = existing.completedLessonIds.filter(id => id !== lessonId);
      this.progress[key] = { ...existing };
      saveStorage(STORAGE_KEYS.PROGRESS, this.progress);
      this.recalculateUserStats();
      this.notify();
    }
  }

  public recordLastAccessedLesson(courseId: string, lessonId: string): void {
    if (!this.currentUser) return;
    const key = `${this.currentUser.id}_${courseId}`;
    const existing = this.progress[key] || {
      courseId,
      completedLessonIds: [],
      lastLessonId: lessonId,
      lastAccessedAt: new Date().toISOString(),
      totalStudyTimeMinutes: 0
    };
    existing.lastLessonId = lessonId;
    existing.lastAccessedAt = new Date().toISOString();
    this.progress[key] = { ...existing };
    saveStorage(STORAGE_KEYS.PROGRESS, this.progress);
    this.notify();
  }

  public saveLessonNote(courseId: string, lessonId: string, noteText: string): void {
    if (!this.currentUser) return;
    const key = `${this.currentUser.id}_${courseId}`;
    const existing = this.progress[key] || {
      courseId,
      completedLessonIds: [],
      lastLessonId: lessonId,
      lastAccessedAt: new Date().toISOString(),
      totalStudyTimeMinutes: 0,
      notes: {}
    };
    if (!existing.notes) existing.notes = {};
    existing.notes[lessonId] = noteText;
    this.progress[key] = { ...existing };
    saveStorage(STORAGE_KEYS.PROGRESS, this.progress);
    this.notify();
  }

  public getLessonNote(courseId: string, lessonId: string): string {
    if (!this.currentUser) return '';
    const key = `${this.currentUser.id}_${courseId}`;
    return this.progress[key]?.notes?.[lessonId] || '';
  }

  private issueCertificateForCourse(course: Course): void {
    if (!this.currentUser) return;
    const alreadyHas = this.certificates.some(c => c.userId === this.currentUser?.id && c.courseId === course.id);
    if (!alreadyHas) {
      const newCert: Certificate = {
        id: `cert-${Date.now()}`,
        userId: this.currentUser.id,
        courseId: course.id,
        courseTitle: course.title,
        studentName: this.currentUser.name,
        issueDate: new Date().toISOString().split('T')[0],
        verificationCode: `VIP-PRO-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        workloadHours: course.modules.reduce((acc, m) => acc + m.lessons.length * 2, 10)
      };
      this.certificates.unshift(newCert);
      saveStorage(STORAGE_KEYS.CERTIFICATES, this.certificates);
    }
  }

  private recalculateUserStats(): void {
    if (!this.currentUser) return;
    let totalCompleted = 0;
    let activeCourseCount = 0;
    let totalMinutes = 0;

    Object.entries(this.progress).forEach(([key, prog]) => {
      if (key.startsWith(`${this.currentUser?.id}_`)) {
        if (prog.completedLessonIds.length > 0 || prog.lastLessonId) {
          activeCourseCount++;
        }
        totalCompleted += prog.completedLessonIds.length;
        totalMinutes += prog.totalStudyTimeMinutes || (prog.completedLessonIds.length * 25);
      }
    });

    const userCertCount = this.certificates.filter(c => c.userId === this.currentUser?.id).length;

    this.currentUser.stats = {
      activeCourses: Math.max(1, activeCourseCount),
      completedLessons: totalCompleted,
      studyTimeMinutes: Math.max(totalMinutes, 120),
      certificatesCount: userCertCount
    };

    saveStorage(STORAGE_KEYS.CURRENT_USER, this.currentUser);
  }

  // Admin: Courses Management
  public saveCourse(course: Course): void {
    const index = this.courses.findIndex(c => c.id === course.id);
    if (index >= 0) {
      this.courses[index] = course;
    } else {
      this.courses.push(course);
    }
    saveStorage(STORAGE_KEYS.COURSES, this.courses);
    this.notify();
  }

  public deleteCourse(courseId: string): void {
    this.courses = this.courses.filter(c => c.id !== courseId);
    saveStorage(STORAGE_KEYS.COURSES, this.courses);
    this.notify();
  }

  public toggleCoursePublish(courseId: string): void {
    const course = this.getCourse(courseId);
    if (course) {
      course.isPublished = !course.isPublished;
      this.saveCourse(course);
    }
  }

  // Admin: Module & Lesson Operations
  public saveModule(courseId: string, module: Module): void {
    const course = this.getCourse(courseId);
    if (!course) return;
    const modIndex = course.modules.findIndex(m => m.id === module.id);
    if (modIndex >= 0) {
      course.modules[modIndex] = module;
    } else {
      course.modules.push(module);
    }
    this.saveCourse(course);
  }

  public deleteModule(courseId: string, moduleId: string): void {
    const course = this.getCourse(courseId);
    if (!course) return;
    course.modules = course.modules.filter(m => m.id !== moduleId);
    this.saveCourse(course);
  }

  public saveLesson(courseId: string, moduleId: string, lesson: Lesson): void {
    const course = this.getCourse(courseId);
    if (!course) return;
    const module = course.modules.find(m => m.id === moduleId);
    if (!module) return;
    const lessonIndex = module.lessons.findIndex(l => l.id === lesson.id);
    if (lessonIndex >= 0) {
      module.lessons[lessonIndex] = lesson;
    } else {
      module.lessons.push(lesson);
    }
    this.saveCourse(course);
  }

  public deleteLesson(courseId: string, moduleId: string, lessonId: string): void {
    const course = this.getCourse(courseId);
    if (!course) return;
    const module = course.modules.find(m => m.id === moduleId);
    if (!module) return;
    module.lessons = module.lessons.filter(l => l.id !== lessonId);
    this.saveCourse(course);
  }

  // Admin: Users Management
  public createUser(user: User): void {
    this.users.unshift(user);
    saveStorage(STORAGE_KEYS.USERS_LIST, this.users);
    this.notify();
  }

  public updateUser(userId: string, data: Partial<User>): void {
    this.users = this.users.map(u => u.id === userId ? { ...u, ...data } : u);
    if (this.currentUser?.id === userId) {
      this.currentUser = { ...this.currentUser, ...data };
      saveStorage(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    }
    saveStorage(STORAGE_KEYS.USERS_LIST, this.users);
    this.notify();
  }

  public deleteUser(userId: string): void {
    this.users = this.users.filter(u => u.id !== userId);
    saveStorage(STORAGE_KEYS.USERS_LIST, this.users);
    this.notify();
  }

  public toggleUserStatus(userId: string): void {
    this.users = this.users.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? 'blocked' : 'active';
        return { ...u, status: nextStatus };
      }
      return u;
    });
    saveStorage(STORAGE_KEYS.USERS_LIST, this.users);
    this.notify();
  }

  public toggleUserRole(userId: string): void {
    this.users = this.users.map(u => {
      if (u.id === userId) {
        const nextRole = u.role === 'admin' ? 'student' : 'admin';
        return { ...u, role: nextRole };
      }
      return u;
    });
    saveStorage(STORAGE_KEYS.USERS_LIST, this.users);
    this.notify();
  }

  // Community Management
  public addCommunityPost(title: string, content: string, tag: string): void {
    if (!this.currentUser) return;
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: this.currentUser.name,
      authorAvatar: this.currentUser.avatar,
      authorRole: this.currentUser.role === 'admin' ? 'Administrador Master' : 'Membro VIP',
      title,
      content,
      tag: tag || 'Discussão Geral',
      likes: 0,
      likedByMe: false,
      createdAt: 'Agora mesmo',
      comments: []
    };
    this.communityPosts.unshift(newPost);
    saveStorage(STORAGE_KEYS.COMMUNITY, this.communityPosts);
    this.notify();
  }

  public togglePostLike(postId: string): void {
    this.communityPosts = this.communityPosts.map(p => {
      if (p.id === postId) {
        const likedByMe = !p.likedByMe;
        const likes = likedByMe ? p.likes + 1 : Math.max(0, p.likes - 1);
        return { ...p, likedByMe, likes };
      }
      return p;
    });
    saveStorage(STORAGE_KEYS.COMMUNITY, this.communityPosts);
    this.notify();
  }

  public addCommentToPost(postId: string, commentText: string): void {
    if (!this.currentUser) return;
    this.communityPosts = this.communityPosts.map(p => {
      if (p.id === postId) {
        const newComment = {
          id: `c-${Date.now()}`,
          authorName: this.currentUser!.name,
          authorAvatar: this.currentUser!.avatar,
          content: commentText,
          createdAt: 'Agora mesmo'
        };
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    });
    saveStorage(STORAGE_KEYS.COMMUNITY, this.communityPosts);
    this.notify();
  }

  // Login Screen Customizer
  public updateLoginConfig(newConfig: Partial<LoginCustomization>): void {
    this.loginConfig = { ...this.loginConfig, ...newConfig };
    saveStorage(STORAGE_KEYS.LOGIN_CONFIG, this.loginConfig);
    this.notify();
  }

  public resetLoginConfig(): void {
    this.loginConfig = { ...INITIAL_LOGIN_CUSTOMIZATION };
    saveStorage(STORAGE_KEYS.LOGIN_CONFIG, this.loginConfig);
    this.notify();
  }

  // Branding (Logo & Favicon) Manager
  public getBrandingConfig(): BrandingConfig {
    return this.branding;
  }

  public updateBrandingConfig(newConfig: Partial<BrandingConfig>): void {
    this.branding = { ...this.branding, ...newConfig };
    saveStorage(STORAGE_KEYS.BRANDING, this.branding);
    applyBrandingToDOM(this.branding);
    this.notify();
  }

  public resetBrandingConfig(): void {
    this.branding = { ...INITIAL_BRANDING };
    saveStorage(STORAGE_KEYS.BRANDING, this.branding);
    applyBrandingToDOM(this.branding);
    this.notify();
  }

  public getAdminTab(): string {
    return this.adminTab;
  }

  public setAdminTab(tab: string): void {
    this.adminTab = tab;
    this.notify();
  }

  // Matrículas & Access Control
  public getMatriculas(): Matricula[] {
    return this.matriculas;
  }

  public getMatriculasForUser(userId: string): Matricula[] {
    return this.matriculas.filter(m => m.user_id === userId);
  }

  public saveMatricula(matricula: Matricula): void {
    const idx = this.matriculas.findIndex(m => m.id === matricula.id || (m.user_id === matricula.user_id && m.curso_id === matricula.curso_id));
    if (idx >= 0) {
      this.matriculas[idx] = { ...this.matriculas[idx], ...matricula, updated_at: new Date().toISOString() };
    } else {
      this.matriculas.unshift({ ...matricula, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
    saveStorage(STORAGE_KEYS.MATRICULAS, this.matriculas);
    this.notify();
  }

  public updateMatriculaStatus(id: string, status: 'ativo' | 'revogado' | 'reembolsado' | 'bloqueado'): void {
    this.matriculas = this.matriculas.map(m => m.id === id ? { ...m, status, updated_at: new Date().toISOString() } : m);
    saveStorage(STORAGE_KEYS.MATRICULAS, this.matriculas);
    this.notify();
  }

  // Produtos x Cursos Mapping
  public getProdutosCursos(): ProdutoCursoMapping[] {
    return this.produtosCursos;
  }

  public saveProdutoCursoMapping(mapping: ProdutoCursoMapping): void {
    const idx = this.produtosCursos.findIndex(m => m.id === mapping.id);
    if (idx >= 0) {
      this.produtosCursos[idx] = { ...mapping };
    } else {
      this.produtosCursos.unshift({ ...mapping, id: mapping.id || `map_${Date.now()}`, created_at: new Date().toISOString() });
    }
    saveStorage(STORAGE_KEYS.PRODUTOS_CURSOS, this.produtosCursos);
    this.notify();
  }

  public deleteProdutoCursoMapping(id: string): void {
    this.produtosCursos = this.produtosCursos.filter(m => m.id !== id);
    saveStorage(STORAGE_KEYS.PRODUTOS_CURSOS, this.produtosCursos);
    this.notify();
  }

  // Webhook Logs
  public getWebhookLogs(): WebhookLogRecord[] {
    return this.webhookLogs;
  }

  public addWebhookLog(log: WebhookLogRecord): void {
    this.webhookLogs.unshift(log);
    if (this.webhookLogs.length > 50) {
      this.webhookLogs = this.webhookLogs.slice(0, 50);
    }
    saveStorage(STORAGE_KEYS.WEBHOOK_LOGS, this.webhookLogs);
    this.notify();
  }

  public clearWebhookLogs(): void {
    this.webhookLogs = [];
    saveStorage(STORAGE_KEYS.WEBHOOK_LOGS, this.webhookLogs);
    this.notify();
  }

  // Password reset for first access (precisa_trocar_senha)
  public completeFirstAccessPasswordChange(newPassword: string): void {
    if (!this.currentUser) return;
    const updated = { ...this.currentUser, precisa_trocar_senha: false };
    this.currentUser = updated;
    this.users = this.users.map(u => u.id === updated.id ? { ...u, precisa_trocar_senha: false } : u);
    saveStorage(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    saveStorage(STORAGE_KEYS.USERS_LIST, this.users);
    this.notify();
  }

  // Simulate or process Webhook Execution
  public processWebhookSimulation(params: {
    platform: 'kiwify' | 'perfectpay';
    eventType: 'approved' | 'refund' | 'chargeback' | 'invalid_token' | 'waiting_payment';
    buyerEmail: string;
    buyerName: string;
    productId: string;
    productName: string;
    token?: string;
  }): { success: boolean; message: string; log: WebhookLogRecord; userCreated?: boolean; tempPassword?: string } {
    const { platform, eventType, buyerEmail, buyerName, productId, productName, token } = params;
    const cleanEmail = buyerEmail.trim().toLowerCase();
    const cleanName = buyerName.trim() || cleanEmail.split('@')[0];

    // Security validation test
    const expectedToken = platform === 'kiwify' ? 'kiwify_sec_live_example_token_9912' : 'pp_sec_live_9a87f2e1c4d5b6a0';
    if (eventType === 'invalid_token' || (token && token !== expectedToken)) {
      const errorLog: WebhookLogRecord = {
        id: `log_${Date.now()}`,
        plataforma: platform,
        evento: 'unauthorized',
        email_comprador: cleanEmail,
        nome_comprador: cleanName,
        produto_id: productId,
        produto_nome: productName,
        status_processamento: 'erro',
        sucesso: false,
        mensagem_detalhe: '401 Unauthorized: Token de segurança inválido ou ausente.',
        payload_bruto: { token: token || 'INVALID', platform },
        created_at: 'Agora mesmo'
      };
      this.addWebhookLog(errorLog);
      return { success: false, message: 'Rejeitado com status 401 Unauthorized (Token Inválido).', log: errorLog };
    }

    if (eventType === 'waiting_payment') {
      const waitLog: WebhookLogRecord = {
        id: `log_${Date.now()}`,
        plataforma: platform,
        evento: 'aguardando_pagamento',
        email_comprador: cleanEmail,
        nome_comprador: cleanName,
        produto_id: productId,
        produto_nome: productName,
        status_processamento: 'ignorado',
        sucesso: true,
        mensagem_detalhe: 'Boleto/PIX gerado. Evento registrado sem conceder acesso até aprovação.',
        payload_bruto: { status: 'waiting_payment', platform, email: cleanEmail },
        created_at: 'Agora mesmo'
      };
      this.addWebhookLog(waitLog);
      return { success: true, message: 'Evento logado (sem liberação de acesso até confirmação).', log: waitLog };
    }

    if (eventType === 'refund' || eventType === 'chargeback') {
      const targetUser = this.users.find(u => u.email.toLowerCase() === cleanEmail);
      if (targetUser) {
        this.matriculas = this.matriculas.map(m => {
          if (m.user_id === targetUser.id) {
            return { ...m, status: eventType === 'chargeback' ? 'revogado' : 'reembolsado' };
          }
          return m;
        });
        saveStorage(STORAGE_KEYS.MATRICULAS, this.matriculas);
      }
      const revokeLog: WebhookLogRecord = {
        id: `log_${Date.now()}`,
        plataforma: platform,
        evento: eventType,
        email_comprador: cleanEmail,
        nome_comprador: cleanName,
        produto_id: productId,
        produto_nome: productName,
        status_processamento: 'revogado',
        sucesso: true,
        mensagem_detalhe: `Acesso do aluno ${cleanEmail} revogado com sucesso devido a ${eventType}. Matrícula inativada.`,
        payload_bruto: { status: eventType, customer: { email: cleanEmail, name: cleanName }, product: { id: productId, name: productName } },
        created_at: 'Agora mesmo'
      };
      this.addWebhookLog(revokeLog);
      return { success: true, message: `Acesso revogado com sucesso para ${cleanEmail}.`, log: revokeLog };
    }

    // Approved purchase
    // 1. Map to course
    const mapping = this.produtosCursos.find(m => m.produto_id === productId || m.produto_nome.toLowerCase().includes(productName.toLowerCase()));
    const courseId = mapping ? mapping.curso_id : 'course-negocios-digitais';
    const courseName = mapping ? mapping.curso_nome : (productName || 'Formação VIP PRO');

    // 2. Find or create user
    let user = this.users.find(u => u.email.toLowerCase() === cleanEmail);
    let userCreated = false;
    let tempPassword = '';

    if (!user) {
      userCreated = true;
      tempPassword = 'Vip#' + Math.floor(100000 + Math.random() * 900000) + '!';
      user = {
        id: `usr_${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
        role: 'student',
        plan: 'MEMBRO VIP (WEBHOOK)',
        registeredAt: new Date().toISOString().split('T')[0],
        lastAccessAt: 'Nunca acessou',
        status: 'active',
        precisa_trocar_senha: true,
        stats: {
          activeCourses: 1,
          completedLessons: 0,
          studyTimeMinutes: 0,
          certificatesCount: 0
        }
      };
      this.users.unshift(user);
      saveStorage(STORAGE_KEYS.USERS_LIST, this.users);
    }

    // 3. Register matricula
    const newMatricula: Matricula = {
      id: `mat_${Date.now()}`,
      user_id: user.id,
      produto_id: productId,
      produto_nome: productName,
      curso_id: courseId,
      curso_nome: courseName,
      plataforma_origem: platform,
      status: 'ativo',
      data_liberacao: new Date().toISOString()
    };
    this.saveMatricula(newMatricula);

    // 4. Log
    const successLog: WebhookLogRecord = {
      id: `log_${Date.now()}`,
      plataforma: platform,
      evento: 'compra_aprovada',
      email_comprador: cleanEmail,
      nome_comprador: cleanName,
      produto_id: productId,
      produto_nome: productName,
      status_processamento: 'sucesso',
      sucesso: true,
      mensagem_detalhe: userCreated
        ? `Novo aluno criado no Supabase Auth. Senha provisória gerada (${tempPassword}). Matrícula liberada para '${courseName}'. E-mail de boas-vindas enviado via Resend.`
        : `Aluno já existente. Matrícula adicional vinculada ao curso '${courseName}'.`,
      payload_bruto: {
        event: 'compra_aprovada',
        platform,
        product: { id: productId, name: productName },
        customer: { email: cleanEmail, name: cleanName },
        token: expectedToken
      },
      created_at: 'Agora mesmo'
    };
    this.addWebhookLog(successLog);

    return {
      success: true,
      message: `Acesso liberado com sucesso para ${cleanEmail} no curso ${courseName}!`,
      log: successLog,
      userCreated,
      tempPassword
    };
  }
}

export const store = new StoreManager();

// React hook to access Store and re-render on updates
export function useStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, []);

  return {
    currentUser: store.getCurrentUser(),
    users: store.getUsers(),
    courses: store.getCourses(),
    learningTracks: store.getLearningTracks(),
    certificates: store.getCertificates(),
    allCertificates: store.getAllCertificates(),
    communityPosts: store.getCommunityPosts(),
    loginConfig: store.getLoginConfig(),
    branding: store.getBrandingConfig(),
    favorites: store.getFavorites(),
    matriculas: store.getMatriculas(),
    produtosCursos: store.getProdutosCursos(),
    webhookLogs: store.getWebhookLogs(),
    getMatriculasForUser: (userId: string) => store.getMatriculasForUser(userId),
    saveMatricula: (matricula: Matricula) => store.saveMatricula(matricula),
    updateMatriculaStatus: (id: string, status: 'ativo' | 'revogado' | 'reembolsado' | 'bloqueado') => store.updateMatriculaStatus(id, status),
    saveProdutoCursoMapping: (mapping: ProdutoCursoMapping) => store.saveProdutoCursoMapping(mapping),
    deleteProdutoCursoMapping: (id: string) => store.deleteProdutoCursoMapping(id),
    addWebhookLog: (log: WebhookLogRecord) => store.addWebhookLog(log),
    clearWebhookLogs: () => store.clearWebhookLogs(),
    completeFirstAccessPasswordChange: (newPassword: string) => store.completeFirstAccessPasswordChange(newPassword),
    processWebhookSimulation: (params: Parameters<typeof store.processWebhookSimulation>[0]) => store.processWebhookSimulation(params),
    getCourse: (courseId: string) => store.getCourse(courseId),
    isFavorite: (courseId: string) => store.isFavorite(courseId),
    toggleFavorite: (courseId: string) => store.toggleFavorite(courseId),
    login: (email: string, pass?: string) => store.login(email, pass),
    logout: () => store.logout(),
    switchDemoAccount: (type: 'student' | 'admin') => store.switchDemoAccount(type),
    updateProfile: (data: Partial<User>) => store.updateProfile(data),
    getCourseProgress: (courseId: string) => store.getCourseProgress(courseId),
    markLessonCompleted: (courseId: string, lessonId: string) => store.markLessonCompleted(courseId, lessonId),
    unmarkLessonCompleted: (courseId: string, lessonId: string) => store.unmarkLessonCompleted(courseId, lessonId),
    recordLastAccessedLesson: (courseId: string, lessonId: string) => store.recordLastAccessedLesson(courseId, lessonId),
    saveLessonNote: (courseId: string, lessonId: string, text: string) => store.saveLessonNote(courseId, lessonId, text),
    getLessonNote: (courseId: string, lessonId: string) => store.getLessonNote(courseId, lessonId),
    saveCourse: (course: Course) => store.saveCourse(course),
    deleteCourse: (courseId: string) => store.deleteCourse(courseId),
    toggleCoursePublish: (courseId: string) => store.toggleCoursePublish(courseId),
    saveModule: (courseId: string, module: Module) => store.saveModule(courseId, module),
    deleteModule: (courseId: string, moduleId: string) => store.deleteModule(courseId, moduleId),
    saveLesson: (courseId: string, moduleId: string, lesson: Lesson) => store.saveLesson(courseId, moduleId, lesson),
    deleteLesson: (courseId: string, moduleId: string, lessonId: string) => store.deleteLesson(courseId, moduleId, lessonId),
    createUser: (user: User) => store.createUser(user),
    updateUser: (userId: string, data: Partial<User>) => store.updateUser(userId, data),
    deleteUser: (userId: string) => store.deleteUser(userId),
    toggleUserStatus: (userId: string) => store.toggleUserStatus(userId),
    toggleUserRole: (userId: string) => store.toggleUserRole(userId),
    addCommunityPost: (title: string, content: string, tag: string) => store.addCommunityPost(title, content, tag),
    togglePostLike: (postId: string) => store.togglePostLike(postId),
    addCommentToPost: (postId: string, comment: string) => store.addCommentToPost(postId, comment),
    updateLoginConfig: (config: Partial<LoginCustomization>) => store.updateLoginConfig(config),
    resetLoginConfig: () => store.resetLoginConfig(),
    updateBranding: (config: Partial<BrandingConfig>) => store.updateBrandingConfig(config),
    resetBranding: () => store.resetBrandingConfig(),
    adminTab: store.getAdminTab(),
    setAdminTab: (tab: string) => store.setAdminTab(tab),
  };
}
