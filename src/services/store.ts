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
  WebhookLogRecord,
  AulaProgressRecord,
  HeroBanner,
  SalesTransaction
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
  INITIAL_WEBHOOK_LOGS,
  INITIAL_MEMBER_AREAS,
  INITIAL_DIGITAL_PRODUCTS,
  INITIAL_USER_AREA_ACCESSES,
  INITIAL_HERO_BANNERS,
  INITIAL_SALES_TRANSACTIONS
} from '../data/mockData';
import { MemberArea, DigitalProduct, UserAreaAccess } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

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
  PROGRESSO_AULAS: 'vip_pro_progresso_aulas',
  MEMBER_AREAS: 'vip_pro_member_areas',
  DIGITAL_PRODUCTS: 'vip_pro_digital_products',
  USER_AREA_ACCESSES: 'vip_pro_user_area_accesses',
  HERO_BANNERS: 'vip_pro_hero_banners',
  SALES_TRANSACTIONS: 'vip_pro_sales_transactions',
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
  private progressoAulas: Record<string, AulaProgressRecord>; // key: `${userId}_${lessonId}`
  private memberAreas: MemberArea[];
  private digitalProducts: DigitalProduct[];
  private userAreaAccesses: UserAreaAccess[];
  private supabaseAccesses: UserAreaAccess[] = [];
  private supabaseMatriculas: Matricula[] = [];
  private accessesLoaded: boolean = false;
  private heroBanners: HeroBanner[];
  private salesTransactions: SalesTransaction[];
  private activeAreaSlug: string = 'formacao-vip';
  private adminTab: string = 'dashboard';
  private listeners: Set<() => void> = new Set();
  private authInitialized: boolean = false;

  constructor() {
    this.currentUser = loadStorage<User | null>(STORAGE_KEYS.CURRENT_USER, INITIAL_USER);
    this.users = loadStorage<User[]>(STORAGE_KEYS.USERS_LIST, INITIAL_USERS_LIST);
    this.courses = loadStorage<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    this.matriculas = loadStorage<Matricula[]>(STORAGE_KEYS.MATRICULAS, INITIAL_MATRICULAS);
    this.produtosCursos = loadStorage<ProdutoCursoMapping[]>(STORAGE_KEYS.PRODUTOS_CURSOS, INITIAL_PRODUTOS_CURSOS);
    this.webhookLogs = loadStorage<WebhookLogRecord[]>(STORAGE_KEYS.WEBHOOK_LOGS, INITIAL_WEBHOOK_LOGS);
    this.progressoAulas = loadStorage<Record<string, AulaProgressRecord>>(STORAGE_KEYS.PROGRESSO_AULAS, {});
    this.memberAreas = loadStorage<MemberArea[]>(STORAGE_KEYS.MEMBER_AREAS, INITIAL_MEMBER_AREAS);
    this.digitalProducts = loadStorage<DigitalProduct[]>(STORAGE_KEYS.DIGITAL_PRODUCTS, INITIAL_DIGITAL_PRODUCTS);
    this.userAreaAccesses = loadStorage<UserAreaAccess[]>(STORAGE_KEYS.USER_AREA_ACCESSES, INITIAL_USER_AREA_ACCESSES);
    this.heroBanners = loadStorage<HeroBanner[]>(STORAGE_KEYS.HERO_BANNERS, INITIAL_HERO_BANNERS);
    this.salesTransactions = loadStorage<SalesTransaction[]>(STORAGE_KEYS.SALES_TRANSACTIONS, INITIAL_SALES_TRANSACTIONS);
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

  public getSalesTransactions(): SalesTransaction[] {
    return this.salesTransactions;
  }

  public addSalesTransaction(tx: SalesTransaction): void {
    const exists = this.salesTransactions.some(t => t.transactionId === tx.transactionId);
    if (!exists) {
      this.salesTransactions.unshift(tx);
      saveStorage(STORAGE_KEYS.SALES_TRANSACTIONS, this.salesTransactions);
      this.notify();
    }
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
        role: email.toLowerCase() === 'admin@formacaovippro.com.br' ? 'admin' : 'student',
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
    
    // Also logout from Supabase if configured
    if (isSupabaseConfigured()) {
      supabase.auth.signOut().catch(err => console.error('Supabase signout error:', err));
    }
    
    this.notify();
  }

  /**
   * FASE 2.2: Carrega produtos digitais do Supabase com fallback para Mock
   */
  public async initializeProducts(): Promise<void> {
    if (!isSupabaseConfigured()) {
      console.log('[Store] Supabase não configurado. Utilizando produtos do Mock.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('digital_products')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Mapeamento explícito de snake_case (Supabase) para camelCase (TypeScript)
        const mappedProducts: DigitalProduct[] = data.map(item => ({
          id: item.id,
          areaId: item.area_id,
          title: item.title,
          shortDescription: item.short_description || '',
          fullDescription: item.full_description || '',
          type: item.type as any,
          category: item.category || 'Geral',
          coverUrl: item.cover_url || '',
          bannerUrl: item.banner_url || '',
          mobileBannerUrl: item.mobile_banner_url || '',
          logoUrl: item.logo_url || '',
          thumbnailUrl: item.thumbnail_url || '',
          trailerUrl: item.trailer_url || '',
          author: item.author || { name: 'Renato Nardin', role: 'Especialista VIP', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80' },
          status: (item.status as any) || 'published',
          order: item.order_index || 0,
          publishedAt: item.published_at || new Date().toISOString(),
          courseId: item.course_id || undefined,
          ebook: item.ebook || undefined,
          app: item.app || undefined,
          tool: item.tool || undefined,
          file: item.file || undefined,
          link: item.link || undefined,
          featured: item.featured || false,
          badge: item.badge || '',
          accessLevel: (item.access_level as any) || 'vip',
          price: item.price ? Number(item.price) : undefined,
          salesStrategy: (item.sales_strategy as any) || 'sales_page',
          salesPageUrl: item.sales_page_url || undefined,
          checkoutUrl: item.checkout_url || undefined
        }));

        this.digitalProducts = mappedProducts;
        // Salva no cache do localStorage (cache de leitura)
        saveStorage(STORAGE_KEYS.DIGITAL_PRODUCTS, this.digitalProducts);
        this.notify();
        console.log(`[Store] Sucesso: ${mappedProducts.length} produtos carregados do Supabase.`);
      } else {
        console.log('[Store] Supabase retornou lista vazia de produtos. Mantendo Fallback.');
      }
    } catch (err) {
      console.error('[Store] Erro ao carregar produtos do Supabase, mantendo Fallback:', err);
    }
  }

  /**
   * FASE 2.5C: Carrega mapeamentos de produtos_cursos do Supabase
   */
  public async initializeProdutosCursos(): Promise<void> {
    if (!isSupabaseConfigured()) return;

    try {
      const { data, error } = await supabase
        .from('produtos_cursos')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        this.produtosCursos = data.map(item => ({
          id: item.id,
          produto_id: item.produto_id,
          produto_nome: item.produto_nome,
          curso_id: item.curso_id,
          curso_nome: item.curso_nome,
          plataforma: item.plataforma as any,
          ativo: item.ativo ?? true,
          area_id: item.area_id,
          digital_product_id: item.digital_product_id,
          created_at: item.created_at
        }));
        
        saveStorage(STORAGE_KEYS.PRODUTOS_CURSOS, this.produtosCursos);
        this.notify();
        console.log(`[Store] Sucesso: ${this.produtosCursos.length} mapeamentos carregados do Supabase.`);
      }
    } catch (err) {
      console.error('[Store] Erro ao carregar mapeamentos do Supabase:', err);
    }
  }

  /**
   * FASE 2.3: Carrega acessos e matrículas do Supabase para o usuário atual
   */
  public async initializeAccess(userId: string): Promise<void> {
    if (!isSupabaseConfigured() || !userId) return;

    try {
      // 1. Buscar acessos às áreas/produtos
      const { data: accessData, error: accessError } = await supabase
        .from('user_area_accesses')
        .select('*')
        .eq('user_id', userId);

      if (accessError) throw accessError;

      if (accessData) {
        this.supabaseAccesses = accessData.map(item => ({
          id: item.id,
          userId: item.user_id,
          areaId: item.area_id,
          productId: item.product_id || undefined,
          startDate: item.start_date,
          expirationDate: item.expiration_date || undefined,
          status: item.status as any,
          grantedBy: item.granted_by || 'system',
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));
      }

      // 2. Buscar matrículas (cursos)
      const { data: matData, error: matError } = await supabase
        .from('matriculas')
        .select('*')
        .eq('user_id', userId);

      if (matError) throw matError;

      if (matData) {
        this.supabaseMatriculas = matData.map(item => ({
          id: item.id,
          user_id: item.user_id,
          produto_id: item.produto_id || undefined,
          produto_nome: item.produto_nome || '',
          curso_id: item.curso_id,
          curso_nome: item.curso_nome || '',
          plataforma_origem: item.plataforma_origem as any,
          status: item.status as any,
          data_liberacao: item.data_liberacao,
          created_at: item.created_at,
          updated_at: item.updated_at
        }));
      }

      this.accessesLoaded = true;
      this.notify();
      console.log(`[Store] Sucesso: ${this.supabaseAccesses.length} acessos e ${this.supabaseMatriculas.length} matrículas carregados do Supabase.`);
    } catch (err) {
      console.error('[Store] Erro ao carregar acessos do Supabase:', err);
    }
  }

  /**
   * Supabase Integration: Check for existing session and listen for auth changes
   */
  public async initializeAuth(): Promise<void> {
    if (this.authInitialized || !isSupabaseConfigured()) return;
    this.authInitialized = true;

    // FASE 2.2: Inicializa produtos em paralelo com a auth
    this.initializeProducts().catch(err => console.error('[Store] Product init error:', err));
    this.initializeProdutosCursos().catch(err => console.error('[Store] Mapping init error:', err));

    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      this.handleSupabaseUser(session.user);
      // FASE 2.3: Inicializa acessos após autenticação
      this.initializeAccess(session.user.id).catch(err => console.error('[Store] Access init error:', err));
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Supabase Auth Event:', event);
      if (session?.user) {
        this.handleSupabaseUser(session.user);
        // FASE 2.3: Recarrega acessos se o usuário mudar ou logar
        this.initializeAccess(session.user.id).catch(err => console.error('[Store] Access init event error:', err));
      } else if (event === 'SIGNED_OUT') {
        this.currentUser = null;
        this.supabaseAccesses = [];
        this.supabaseMatriculas = [];
        this.accessesLoaded = false;
        saveStorage(STORAGE_KEYS.CURRENT_USER, null);
        this.notify();
      }
    });
  }

  private handleSupabaseUser(supabaseUser: any): void {
    // Check if user already exists in our list
    const existingUser = this.users.find(u => u.email.toLowerCase() === supabaseUser.email?.toLowerCase());
    
    if (existingUser) {
      // Map Supabase ID if not already done (gradual migration)
      // For now, we use email as the primary link between systems
      this.currentUser = { ...existingUser };
      saveStorage(STORAGE_KEYS.CURRENT_USER, this.currentUser);
      this.notify();
    } else {
      // Auto-create student based on Supabase info
      const newUser: User = {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0].toUpperCase() || 'ALUNO VIP',
        email: supabaseUser.email || '',
        avatar: supabaseUser.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'student', // Default for new signups
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
      saveStorage(STORAGE_KEYS.USERS_LIST, this.users);
      saveStorage(STORAGE_KEYS.CURRENT_USER, this.currentUser);
      this.notify();
    }
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

  public saveAulaProgress(
    lessonId: string, 
    courseId: string, 
    percentual: number, 
    segundos: number, 
    duracao: number,
    forceCompleted?: boolean
  ): void {
    if (!this.currentUser) return;
    const userKey = `${this.currentUser.id}_${lessonId}`;
    const isCompleted = forceCompleted || percentual >= 90;
    
    const record: AulaProgressRecord = {
      user_id: this.currentUser.id,
      aula_id: lessonId,
      course_id: courseId,
      percentual_assistido: Math.min(100, Math.max(0, Math.round(percentual))),
      segundos_assistidos: Math.round(segundos),
      duracao_total: Math.round(duracao),
      concluido: isCompleted,
      updated_at: new Date().toISOString()
    };

    this.progressoAulas[userKey] = record;
    saveStorage(STORAGE_KEYS.PROGRESSO_AULAS, this.progressoAulas);

    // If completed, ensure standard lesson completion is marked
    if (isCompleted) {
      this.markLessonCompleted(courseId, lessonId);
    }
  }

  public getAulaProgress(lessonId: string): AulaProgressRecord | null {
    if (!this.currentUser) return null;
    const userKey = `${this.currentUser.id}_${lessonId}`;
    return this.progressoAulas[userKey] || null;
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

  public async saveProdutoCursoMapping(mapping: ProdutoCursoMapping): Promise<void> {
    // 1. Atualiza estado local primeiro para feedback instantâneo
    const idx = this.produtosCursos.findIndex(m => m.id === mapping.id);
    
    // Gera ID se não existir
    const mappingId = mapping.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `map_${Date.now()}`);
    
    const mappingToSave: ProdutoCursoMapping = { 
      ...mapping, 
      id: mappingId,
      created_at: mapping.created_at || new Date().toISOString() 
    };

    if (idx >= 0) {
      this.produtosCursos[idx] = mappingToSave;
    } else {
      this.produtosCursos.unshift(mappingToSave);
    }
    
    saveStorage(STORAGE_KEYS.PRODUTOS_CURSOS, this.produtosCursos);
    this.notify();

    // 2. Persiste no Supabase se configurado
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('produtos_cursos')
          .upsert({
            id: mappingToSave.id,
            produto_id: mappingToSave.produto_id,
            produto_nome: mappingToSave.produto_nome,
            curso_id: mappingToSave.curso_id || null,
            curso_nome: mappingToSave.curso_nome || null,
            plataforma: mappingToSave.plataforma,
            area_id: mappingToSave.area_id || null,
            digital_product_id: mappingToSave.digital_product_id || null,
            ativo: mappingToSave.ativo ?? true
          });

        if (error) throw error;
        console.log('[Store] Mapeamento salvo no Supabase com sucesso.');
      } catch (err) {
        console.error('[Store] Erro ao salvar mapeamento no Supabase:', err);
      }
    }
  }

  public async deleteProdutoCursoMapping(id: string): Promise<void> {
    // 1. Atualiza estado local
    this.produtosCursos = this.produtosCursos.filter(m => m.id !== id);
    saveStorage(STORAGE_KEYS.PRODUTOS_CURSOS, this.produtosCursos);
    this.notify();

    // 2. Remove do Supabase se configurado
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('produtos_cursos')
          .delete()
          .eq('id', id);

        if (error) throw error;
        console.log('[Store] Mapeamento removido do Supabase com sucesso.');
      } catch (err) {
        console.error('[Store] Erro ao excluir mapeamento no Supabase:', err);
      }
    }
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

  // ==========================================
  // MÓDULO 30: MÉTODOS DE ÁREAS DE MEMBROS
  // ==========================================

  public getMemberAreas(): MemberArea[] {
    return this.memberAreas.map(area => {
      const products = this.digitalProducts.filter(p => p.areaId === area.id);
      const accesses = this.userAreaAccesses.filter(a => a.areaId === area.id && a.status === 'active');
      return {
        ...area,
        productCount: products.length,
        studentCount: accesses.length
      };
    });
  }

  public getMemberAreaBySlug(slug: string): MemberArea | undefined {
    const cleanSlug = slug.replace(/^\/+/, '').toLowerCase();
    const area = this.memberAreas.find(a => a.slug.toLowerCase() === cleanSlug);
    if (!area) return undefined;
    const products = this.digitalProducts.filter(p => p.areaId === area.id);
    const accesses = this.userAreaAccesses.filter(a => a.areaId === area.id && a.status === 'active');
    return {
      ...area,
      productCount: products.length,
      studentCount: accesses.length
    };
  }

  public getMemberAreaById(id: string): MemberArea | undefined {
    const area = this.memberAreas.find(a => a.id === id);
    if (!area) return undefined;
    const products = this.digitalProducts.filter(p => p.areaId === area.id);
    const accesses = this.userAreaAccesses.filter(a => a.areaId === area.id && a.status === 'active');
    return {
      ...area,
      productCount: products.length,
      studentCount: accesses.length
    };
  }

  public saveMemberArea(areaData: Partial<MemberArea> & { name: string; slug: string }): MemberArea {
    const isNew = !areaData.id || !this.memberAreas.some(a => a.id === areaData.id);
    const cleanSlug = areaData.slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');

    let savedArea: MemberArea;

    if (isNew) {
      savedArea = {
        id: areaData.id || `area-${cleanSlug}-${Date.now()}`,
        name: areaData.name,
        slug: cleanSlug,
        type: areaData.type || 'vip',
        description: areaData.description || '',
        logoUrl: areaData.logoUrl || '',
        faviconUrl: areaData.faviconUrl || 'https://api.iconify.design/lucide:crown.svg?color=%23D4AF37',
        coverUrl: areaData.coverUrl || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
        bannerUrl: areaData.bannerUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
        mobileBannerUrl: areaData.mobileBannerUrl || '',
        primaryColor: areaData.primaryColor || '#D4AF37',
        secondaryColor: areaData.secondaryColor || '#151922',
        status: areaData.status || 'active',
        welcomeText: areaData.welcomeText || `Bem-vindo à área de membros ${areaData.name}.`,
        heroTitle: areaData.heroTitle || areaData.name.toUpperCase(),
        heroSubtitle: areaData.heroSubtitle || areaData.description || 'Área de Membros Exclusiva',
        heroCtaText: areaData.heroCtaText || 'Explorar Conteúdos',
        heroCtaLink: areaData.heroCtaLink || '#conteudos',
        order: areaData.order !== undefined ? areaData.order : this.memberAreas.length + 1,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        loginCustomization: areaData.loginCustomization || {
          ...INITIAL_LOGIN_CUSTOMIZATION,
          brandTitle: areaData.name.toUpperCase(),
          brandSubtitle: areaData.description?.toUpperCase() || 'ÁREA DE MEMBROS EXCLUSIVA',
          formTitle: `Portal ${areaData.name}`
        }
      };
      this.memberAreas.push(savedArea);
    } else {
      const idx = this.memberAreas.findIndex(a => a.id === areaData.id);
      savedArea = {
        ...this.memberAreas[idx],
        ...areaData,
        slug: cleanSlug,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      this.memberAreas[idx] = savedArea;
    }

    saveStorage(STORAGE_KEYS.MEMBER_AREAS, this.memberAreas);
    this.notify();
    return savedArea;
  }

  public deleteMemberArea(id: string): boolean {
    this.memberAreas = this.memberAreas.filter(a => a.id !== id);
    saveStorage(STORAGE_KEYS.MEMBER_AREAS, this.memberAreas);
    this.notify();
    return true;
  }

  public duplicateMemberArea(id: string): MemberArea | null {
    const original = this.memberAreas.find(a => a.id === id);
    if (!original) return null;

    const newSlug = `${original.slug}-copia-${Date.now().toString().slice(-4)}`;
    const newArea: MemberArea = {
      ...original,
      id: `area-${newSlug}`,
      name: `${original.name} (Cópia)`,
      slug: newSlug,
      order: this.memberAreas.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    this.memberAreas.push(newArea);
    saveStorage(STORAGE_KEYS.MEMBER_AREAS, this.memberAreas);

    // Also duplicate products for this area
    const originalProducts = this.digitalProducts.filter(p => p.areaId === original.id);
    originalProducts.forEach(prod => {
      const duplicatedProd: DigitalProduct = {
        ...prod,
        id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        areaId: newArea.id,
        title: `${prod.title}`
      };
      this.digitalProducts.push(duplicatedProd);
    });
    saveStorage(STORAGE_KEYS.DIGITAL_PRODUCTS, this.digitalProducts);

    this.notify();
    return newArea;
  }

  public toggleMemberAreaStatus(id: string): void {
    const area = this.memberAreas.find(a => a.id === id);
    if (area) {
      area.status = area.status === 'active' ? 'inactive' : 'active';
      area.updatedAt = new Date().toISOString().split('T')[0];
      saveStorage(STORAGE_KEYS.MEMBER_AREAS, this.memberAreas);
      this.notify();
    }
  }

  public getActiveAreaSlug(): string {
    return this.activeAreaSlug;
  }

  public setActiveAreaSlug(slug: string): void {
    this.activeAreaSlug = slug;
    this.notify();
  }

  // ==========================================
  // MÓDULO 30: MÉTODOS DE PRODUTOS DIGITAIS
  // ==========================================

  public getDigitalProducts(areaId?: string): DigitalProduct[] {
    if (areaId) {
      return this.digitalProducts.filter(p => p.areaId === areaId);
    }
    return this.digitalProducts;
  }

  public getDigitalProductById(id: string): DigitalProduct | undefined {
    return this.digitalProducts.find(p => p.id === id);
  }

  public saveDigitalProduct(productData: Partial<DigitalProduct> & { title: string; areaId: string; type: any }): DigitalProduct {
    const isNew = !productData.id || !this.digitalProducts.some(p => p.id === productData.id);
    let savedProduct: DigitalProduct;

    if (isNew) {
      savedProduct = {
        id: productData.id || `prod-${Date.now()}`,
        areaId: productData.areaId,
        title: productData.title,
        shortDescription: productData.shortDescription || '',
        fullDescription: productData.fullDescription || '',
        type: productData.type || 'curso',
        category: productData.category || 'Geral',
        coverUrl: productData.coverUrl || 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80',
        bannerUrl: productData.bannerUrl || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80',
        mobileBannerUrl: productData.mobileBannerUrl || '',
        logoUrl: productData.logoUrl || '',
        thumbnailUrl: productData.thumbnailUrl || '',
        trailerUrl: productData.trailerUrl || '',
        author: productData.author || {
          name: 'Renato Nardin',
          role: 'Especialista VIP',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
        },
        status: productData.status || 'published',
        order: productData.order !== undefined ? productData.order : this.digitalProducts.length + 1,
        publishedAt: productData.publishedAt || new Date().toISOString().split('T')[0],
        courseId: productData.courseId,
        ebook: productData.ebook,
        app: productData.app,
        tool: productData.tool,
        file: productData.file,
        link: productData.link,
        featured: productData.featured || false,
        badge: productData.badge,
        accessLevel: productData.accessLevel || 'vip'
      };
      this.digitalProducts.push(savedProduct);
    } else {
      const idx = this.digitalProducts.findIndex(p => p.id === productData.id);
      savedProduct = {
        ...this.digitalProducts[idx],
        ...productData
      };
      this.digitalProducts[idx] = savedProduct;
    }

    saveStorage(STORAGE_KEYS.DIGITAL_PRODUCTS, this.digitalProducts);
    this.notify();
    return savedProduct;
  }

  public deleteDigitalProduct(id: string): boolean {
    this.digitalProducts = this.digitalProducts.filter(p => p.id !== id);
    saveStorage(STORAGE_KEYS.DIGITAL_PRODUCTS, this.digitalProducts);
    this.notify();
    return true;
  }

  public toggleDigitalProductStatus(id: string): void {
    const prod = this.digitalProducts.find(p => p.id === id);
    if (prod) {
      prod.status = prod.status === 'published' ? 'draft' : 'published';
      saveStorage(STORAGE_KEYS.DIGITAL_PRODUCTS, this.digitalProducts);
      this.notify();
    }
  }

  // ==========================================
  // MÓDULO 30: MÉTODOS DE CONTROLE DE ACESSO
  // ==========================================

  public getUserAreaAccesses(userId?: string, areaId?: string): UserAreaAccess[] {
    let list = this.userAreaAccesses;
    if (userId) {
      list = list.filter(a => a.userId === userId);
    }
    if (areaId) {
      list = list.filter(a => a.areaId === areaId);
    }
    return list;
  }

  public checkUserAreaAccess(userId: string, areaIdOrSlug: string): boolean {
    // Admin always has access to all areas
    const user = this.users.find(u => u.id === userId);
    if (user && user.role === 'admin') return true;

    // Find area by ID or slug
    const area = this.memberAreas.find(a => a.id === areaIdOrSlug || a.slug.toLowerCase() === areaIdOrSlug.toLowerCase());
    if (!area) return false;

    // Check if area is active
    if (area.status !== 'active') return false;

    // FASE 2.3: Prioridade Supabase
    if (this.accessesLoaded && isSupabaseConfigured()) {
      // Check for explicit area access (productId IS NULL)
      const hasSupabaseAreaAccess = this.supabaseAccesses.some(
        acc => acc.areaId === area.id && !acc.productId && acc.status === 'active' && (!acc.expirationDate || new Date(acc.expirationDate) > new Date())
      );
      if (hasSupabaseAreaAccess) return true;

      // Also check if user has any individual product access in this area? 
      const areaProducts = this.digitalProducts.filter(p => p.areaId === area.id);
      const hasSupabaseMatricula = areaProducts.some(p => {
        if (p.courseId && this.supabaseMatriculas.some(m => m.curso_id === p.courseId && m.status === 'ativo')) return true;
        if (this.supabaseMatriculas.some(m => m.produto_id === p.id && m.status === 'ativo')) return true;
        if (this.supabaseAccesses.some(a => a.productId === p.id && a.status === 'active')) return true;
        return false;
      });

      if (hasSupabaseMatricula) return true;

      // SE chegamos aqui e o usuário é o do Supabase, NÃO caímos no fallback do Mock
      // para evitar que manipulação local conceda acesso.
      const isSupabaseUser = userId && !userId.startsWith('usr_');
      if (isSupabaseUser) return false;
    }

    // FALLBACK: Mock/localStorage
    // Check explicit user_area_access
    const hasExplicitAccess = this.userAreaAccesses.some(
      acc => acc.userId === userId && acc.areaId === area.id && acc.status === 'active'
    );

    if (hasExplicitAccess) return true;

    // Also verify if student has matricula in any course or product assigned to this area
    const areaProducts = this.digitalProducts.filter(p => p.areaId === area.id);
    const userMatriculas = this.matriculas.filter(m => m.user_id === userId && m.status === 'ativo');

    const hasMatriculaInArea = areaProducts.some(p => {
      if (p.courseId && userMatriculas.some(m => m.curso_id === p.courseId)) return true;
      if (userMatriculas.some(m => m.produto_id === p.id)) return true;
      return false;
    });

    return hasMatriculaInArea;
  }

  public hasProductAccess(userId: string, productId: string): boolean {
    if (!userId) return false;
    const user = this.users.find(u => u.id === userId);
    if (user && user.role === 'admin') return true;

    const product = this.digitalProducts.find(p => p.id === productId);
    if (!product) return false;

    // FREE ACCESS: If product is free, anyone logged in can access
    if (product.accessLevel === 'free') return true;

    // FASE 2.3: Prioridade Supabase
    if (this.accessesLoaded && isSupabaseConfigured()) {
      // 1. Check for individual product access
      const hasSupabaseExplicit = this.supabaseAccesses.some(
        acc => acc.productId === productId && acc.status === 'active' && (!acc.expirationDate || new Date(acc.expirationDate) > new Date())
      );
      if (hasSupabaseExplicit) return true;

      // 2. Check for area-wide access (product_id is null in the access record)
      if (product.areaId) {
        const hasAreaWideAccess = this.supabaseAccesses.some(
          acc => acc.areaId === product.areaId && !acc.productId && acc.status === 'active' && (!acc.expirationDate || new Date(acc.expirationDate) > new Date())
        );
        if (hasAreaWideAccess) return true;
      }

      // 3. Check matriculas for specific product or course
      if (product.courseId && this.supabaseMatriculas.some(m => m.curso_id === product.courseId && m.status === 'ativo')) return true;
      if (this.supabaseMatriculas.some(m => m.produto_id === productId && m.status === 'ativo')) return true;

      // SE chegamos aqui e o usuário é o do Supabase, NÃO caímos no fallback do Mock
      const isSupabaseUser = userId && !userId.startsWith('usr_');
      if (isSupabaseUser) return false;
    }

    // FALLBACK: Mock/localStorage
    // Check explicit user_area_access with specific productId
    const hasExplicit = this.userAreaAccesses.some(
      acc => acc.userId === userId && acc.productId === productId && acc.status === 'active' && (!acc.expirationDate || new Date(acc.expirationDate) > new Date())
    );
    if (hasExplicit) return true;

    // Check area-wide access (product_id is null)
    if (product.areaId) {
      const hasAreaWide = this.userAreaAccesses.some(
        acc => acc.userId === userId && acc.areaId === product.areaId && !acc.productId && acc.status === 'active' && (!acc.expirationDate || new Date(acc.expirationDate) > new Date())
      );
      if (hasAreaWide) return true;
    }

    // Check matriculas for specific product or course
    const userMatriculas = this.matriculas.filter(m => m.user_id === userId && m.status === 'ativo');
    if (product.courseId && userMatriculas.some(m => m.curso_id === product.courseId)) return true;
    if (userMatriculas.some(m => m.produto_id === productId)) return true;

    return false;
  }

  public grantUserAreaAccess(data: { userId: string; areaId: string; productId?: string; expirationDate?: string; grantedBy?: string }): UserAreaAccess {
    // Check if access already exists
    const existingIndex = this.userAreaAccesses.findIndex(
      a => a.userId === data.userId && a.areaId === data.areaId && (data.productId ? a.productId === data.productId : !a.productId)
    );

    let savedAccess: UserAreaAccess;

    if (existingIndex >= 0) {
      savedAccess = {
        ...this.userAreaAccesses[existingIndex],
        status: 'active',
        expirationDate: data.expirationDate,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      this.userAreaAccesses[existingIndex] = savedAccess;
    } else {
      savedAccess = {
        id: `acc-${Date.now()}`,
        userId: data.userId,
        areaId: data.areaId,
        productId: data.productId,
        startDate: new Date().toISOString().split('T')[0],
        expirationDate: data.expirationDate,
        status: 'active',
        grantedBy: data.grantedBy || 'Painel Admin',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      this.userAreaAccesses.push(savedAccess);
    }

    saveStorage(STORAGE_KEYS.USER_AREA_ACCESSES, this.userAreaAccesses);
    this.notify();
    return savedAccess;
  }

  public revokeUserAreaAccess(id: string): void {
    const acc = this.userAreaAccesses.find(a => a.id === id);
    if (acc) {
      acc.status = 'revoked';
      acc.updatedAt = new Date().toISOString().split('T')[0];
      saveStorage(STORAGE_KEYS.USER_AREA_ACCESSES, this.userAreaAccesses);
      this.notify();
    }
  }

  public blockUserAreaAccess(id: string): void {
    const acc = this.userAreaAccesses.find(a => a.id === id);
    if (acc) {
      acc.status = 'blocked';
      acc.updatedAt = new Date().toISOString().split('T')[0];
      saveStorage(STORAGE_KEYS.USER_AREA_ACCESSES, this.userAreaAccesses);
      this.notify();
    }
  }

  public deleteUserAreaAccess(id: string): boolean {
    this.userAreaAccesses = this.userAreaAccesses.filter(a => a.id !== id);
    saveStorage(STORAGE_KEYS.USER_AREA_ACCESSES, this.userAreaAccesses);
    this.notify();
    return true;
  }

  // ==========================================
  // MÓDULO: HERO CAROUSEL PREMIUM BANNERS
  // ==========================================

  public getHeroBanners(memberAreaId?: string): HeroBanner[] {
    if (memberAreaId && memberAreaId !== 'all') {
      return this.heroBanners.filter(b => b.memberAreaId === 'all' || b.memberAreaId === memberAreaId);
    }
    return this.heroBanners;
  }

  public saveHeroBanner(bannerData: Partial<HeroBanner> & { title: string }): HeroBanner {
    const isNew = !bannerData.id || !this.heroBanners.some(b => b.id === bannerData.id);
    let saved: HeroBanner;

    if (isNew) {
      saved = {
        id: bannerData.id || `banner-${Date.now()}`,
        title: bannerData.title,
        subtitle: bannerData.subtitle || '🔥 NOVO DESTAQUE',
        description: bannerData.description || '',
        ctaText: bannerData.ctaText || 'ACESSAR AGORA →',
        ctaLink: bannerData.ctaLink || '#',
        desktopImage: bannerData.desktopImage || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80',
        mobileImage: bannerData.mobileImage || '',
        productImage: bannerData.productImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        targetType: bannerData.targetType || 'curso',
        targetId: bannerData.targetId,
        memberAreaId: bannerData.memberAreaId || 'all',
        category: bannerData.category || 'CURSOS',
        order: bannerData.order !== undefined ? bannerData.order : this.heroBanners.length + 1,
        status: bannerData.status || 'active',
        startDate: bannerData.startDate || new Date().toISOString().split('T')[0],
        endDate: bannerData.endDate || '2026-12-31',
        openInNewTab: bannerData.openInNewTab ?? false,
        stats: bannerData.stats || { impressions: 0, clicks: 0 },
        customization: bannerData.customization || {
          textPosition: 'left',
          overlayOpacity: 75,
          imagePosition: 'right',
          bannerHeight: 'normal',
          slideDurationSeconds: 8,
          showIndicators: true,
          showArrows: true,
          autoplay: true,
          ctaColor: '#D4AF37'
        }
      };
      this.heroBanners.push(saved);
    } else {
      const idx = this.heroBanners.findIndex(b => b.id === bannerData.id);
      saved = {
        ...this.heroBanners[idx],
        ...bannerData
      };
      this.heroBanners[idx] = saved;
    }

    saveStorage(STORAGE_KEYS.HERO_BANNERS, this.heroBanners);
    this.notify();
    return saved;
  }

  public deleteHeroBanner(id: string): void {
    this.heroBanners = this.heroBanners.filter(b => b.id !== id);
    saveStorage(STORAGE_KEYS.HERO_BANNERS, this.heroBanners);
    this.notify();
  }

  public toggleHeroBannerStatus(id: string): void {
    const b = this.heroBanners.find(x => x.id === id);
    if (b) {
      b.status = b.status === 'active' ? 'inactive' : 'active';
      saveStorage(STORAGE_KEYS.HERO_BANNERS, this.heroBanners);
      this.notify();
    }
  }

  public recordBannerImpression(id: string): void {
    const b = this.heroBanners.find(x => x.id === id);
    if (b) {
      if (!b.stats) b.stats = { impressions: 0, clicks: 0 };
      b.stats.impressions += 1;
      saveStorage(STORAGE_KEYS.HERO_BANNERS, this.heroBanners);
    }
  }

  public recordBannerClick(id: string): void {
    const b = this.heroBanners.find(x => x.id === id);
    if (b) {
      if (!b.stats) b.stats = { impressions: 0, clicks: 0 };
      b.stats.clicks += 1;
      saveStorage(STORAGE_KEYS.HERO_BANNERS, this.heroBanners);
      this.notify();
    }
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
    memberAreas: store.getMemberAreas(),
    digitalProducts: store.getDigitalProducts(),
    salesTransactions: store.getSalesTransactions(),
    addSalesTransaction: (tx: SalesTransaction) => store.addSalesTransaction(tx),
    userAreaAccesses: store.getUserAreaAccesses(),
    activeAreaSlug: store.getActiveAreaSlug(),
    setActiveAreaSlug: (slug: string) => store.setActiveAreaSlug(slug),
    getMemberAreaBySlug: (slug: string) => store.getMemberAreaBySlug(slug),
    getMemberAreaById: (id: string) => store.getMemberAreaById(id),
    saveMemberArea: (area: Partial<MemberArea> & { name: string; slug: string }) => store.saveMemberArea(area),
    deleteMemberArea: (id: string) => store.deleteMemberArea(id),
    duplicateMemberArea: (id: string) => store.duplicateMemberArea(id),
    toggleMemberAreaStatus: (id: string) => store.toggleMemberAreaStatus(id),
    getDigitalProductsByArea: (areaId?: string) => store.getDigitalProducts(areaId),
    getDigitalProductById: (id: string) => store.getDigitalProductById(id),
    saveDigitalProduct: (product: Partial<DigitalProduct> & { title: string; areaId: string; type: any }) => store.saveDigitalProduct(product),
    deleteDigitalProduct: (id: string) => store.deleteDigitalProduct(id),
    toggleDigitalProductStatus: (id: string) => store.toggleDigitalProductStatus(id),
    checkUserAreaAccess: (userId: string, areaIdOrSlug: string) => store.checkUserAreaAccess(userId, areaIdOrSlug),
    hasProductAccess: (userId: string, productId: string) => store.hasProductAccess(userId, productId),
    initializeAuth: () => store.initializeAuth(),
    initializeProducts: () => store.initializeProducts(),
    isSupabaseEnabled: isSupabaseConfigured(),
    grantUserAreaAccess: (data: { userId: string; areaId: string; productId?: string; expirationDate?: string; grantedBy?: string }) => 
      store.grantUserAreaAccess(data),
    revokeUserAreaAccess: (id: string) => store.revokeUserAreaAccess(id),
    blockUserAreaAccess: (id: string) => store.blockUserAreaAccess(id),
    deleteUserAreaAccess: (id: string) => store.deleteUserAreaAccess(id),
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
    saveAulaProgress: (lessonId: string, courseId: string, percentual: number, segundos: number, duracao: number, forceCompleted?: boolean) => 
      store.saveAulaProgress(lessonId, courseId, percentual, segundos, duracao, forceCompleted),
    getAulaProgress: (lessonId: string) => store.getAulaProgress(lessonId),
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
    heroBanners: store.getHeroBanners(),
    getHeroBanners: (areaId?: string) => store.getHeroBanners(areaId),
    saveHeroBanner: (banner: Partial<HeroBanner> & { title: string }) => store.saveHeroBanner(banner),
    deleteHeroBanner: (id: string) => store.deleteHeroBanner(id),
    toggleHeroBannerStatus: (id: string) => store.toggleHeroBannerStatus(id),
    recordBannerImpression: (id: string) => store.recordBannerImpression(id),
    recordBannerClick: (id: string) => store.recordBannerClick(id),
  };
}
