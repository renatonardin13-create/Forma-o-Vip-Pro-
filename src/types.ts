export type UserRole = 'admin' | 'student';

export interface UserStats {
  activeCourses: number;
  completedLessons: number;
  studyTimeMinutes: number;
  certificatesCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  plan: string;
  registeredAt: string;
  lastAccessAt: string;
  status: 'active' | 'blocked';
  stats: UserStats;
  precisa_trocar_senha?: boolean;
}

export type MaterialType = 'PDF' | 'ZIP' | 'DOC' | 'XLSX' | 'PPT' | 'LINK';

export interface Material {
  id: string;
  title: string;
  type: MaterialType;
  size?: string;
  url: string;
  description?: string;
}

export type VideoType = 'youtube' | 'vimeo' | 'mp4' | 'url';

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  order: number;
  duration: string; // e.g. "18:45"
  videoType: VideoType;
  videoUrl: string;
  youtube_video_id?: string;
  thumbnailUrl: string;
  description: string;
  materials: Material[];
}

export interface AulaProgressRecord {
  id?: string;
  user_id: string;
  aula_id: string;
  course_id?: string;
  percentual_assistido: number;
  segundos_assistidos: number;
  duracao_total: number;
  concluido: boolean;
  updated_at: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  thumbnailUrl: string;
  bannerUrl: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Mastery';
  featured?: boolean;
  isPublished: boolean;
  order: number;
  modules: Module[];
}

export interface StudentProgress {
  courseId: string;
  completedLessonIds: string[];
  lastLessonId?: string;
  lastAccessedAt: string;
  totalStudyTimeMinutes: number;
  notes?: Record<string, string>; // lessonId -> private note
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  issueDate: string;
  verificationCode: string;
  workloadHours: number;
}

export interface LearningTrack {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  color: string;
  courseIds: string[];
}

export interface CommunityComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  title: string;
  content: string;
  tag: string;
  likes: number;
  likedByMe: boolean;
  createdAt: string;
  comments: CommunityComment[];
}

export interface LoginCustomization {
  backgroundType: 'image' | 'mp4' | 'youtube' | 'gradient' | 'solid';
  backgroundUrl: string;
  solidColor: string;
  gradientFrom: string;
  gradientTo: string;
  overlayOpacity: number;
  overlayBlur: number;
  brandTitle: string;
  brandSubtitle: string;
  brandHighlights: string[];
  formTitle: string;
  formSubtitle: string;
  buttonText: string;
  buttonColor: string;
  cardTransparency: number;
  cardBlur: number;
  cardBorderRadius: number;
}

export interface BrandingConfig {
  logoUrl: string;
  logoType: 'image' | 'icon_text' | 'both';
  brandName: string;
  brandBadge: string;
  brandSubtext: string;
  faviconUrl: string;
  pageTitle: string;
}

export interface Matricula {
  id: string;
  user_id: string;
  produto_id?: string;
  produto_nome?: string;
  curso_id: string;
  curso_nome?: string;
  plataforma_origem: 'kiwify' | 'perfectpay' | 'hotmart' | 'eduzz' | 'manual';
  status: 'ativo' | 'revogado' | 'reembolsado' | 'bloqueado';
  data_liberacao: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProdutoCursoMapping {
  id: string;
  produto_id: string;
  produto_nome: string;
  curso_id?: string;
  curso_nome?: string;
  plataforma: 'kiwify' | 'perfectpay' | 'todas';
  ativo: boolean;
  created_at?: string;
  area_id?: string;
  digital_product_id?: string;
}

export interface WebhookLogRecord {
  id: string;
  plataforma: string;
  evento: string;
  email_comprador: string;
  nome_comprador: string;
  produto_id?: string;
  produto_nome?: string;
  status_processamento: 'sucesso' | 'erro' | 'ignorado' | 'revogado';
  sucesso: boolean;
  mensagem_detalhe: string;
  payload_bruto: any;
  created_at: string;
}

// ==========================================
// MÓDULO 30: MULTIÁREAS DE MEMBROS & CATÁLOGO FLEXÍVEL
// ==========================================

export type MemberAreaType = 
  | 'cursos' 
  | 'ebooks' 
  | 'aplicativos' 
  | 'produtos_digitais' 
  | 'ferramentas' 
  | 'vip' 
  | 'personalizada';

export interface MemberArea {
  id: string;
  name: string;
  slug: string;
  type: MemberAreaType;
  description: string;
  logoUrl?: string;
  faviconUrl?: string;
  coverUrl?: string;
  bannerUrl?: string;
  mobileBannerUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  status: 'active' | 'inactive';
  welcomeText?: string;
  loginCustomization: LoginCustomization;
  heroTitle?: string;
  heroSubtitle?: string;
  heroCtaText?: string;
  heroCtaLink?: string;
  productCount?: number;
  studentCount?: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type DigitalProductType = 
  | 'curso'
  | 'videoaula'
  | 'ebook'
  | 'aplicativo'
  | 'ferramenta'
  | 'arquivo'
  | 'link'
  | 'produto_digital'
  | 'personalizado';

export interface DigitalProduct {
  id: string;
  areaId: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  type: DigitalProductType;
  category: string;
  coverUrl: string; // Capa vertical independente
  bannerUrl: string; // Banner horizontal de destaque
  mobileBannerUrl?: string;
  logoUrl?: string;
  thumbnailUrl?: string;
  trailerUrl?: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  status: 'published' | 'draft' | 'archived';
  order: number;
  publishedAt: string;
  courseId?: string; // Se vinculado a curso estruturado
  storagePath?: string;
  ebook?: {
    pdfUrl?: string;
    pageCount?: number;
    fileSize?: string;
    fileFormat?: string;
    allowDownload?: boolean;
    previewChapters?: number;
  };
  app?: {
    appUrl?: string;
    accessUrl?: string;
    platform?: string;
    appType?: 'web' | 'pwa' | 'download' | 'external';
    screenshots?: string[];
    demoVideoUrl?: string;
    version?: string;
    systemRequirements?: string;
  };
  tool?: {
    toolUrl?: string;
    techStack?: string;
    instructions?: string;
    credentials?: string;
  };
  file?: {
    fileUrl?: string;
    downloadUrl?: string;
    fileName?: string;
    fileSize?: string;
    fileType?: string;
    fileFormat?: string;
  };
  link?: {
    targetUrl: string;
    openInNewTab?: boolean;
    buttonLabel?: string;
  };
  featured?: boolean;
  badge?: string;
  accessLevel?: 'free' | 'vip' | 'restricted';
  price?: number;
  salesStrategy?: 'sales_page' | 'presell' | 'modal';
  salesPageUrl?: string;
  presellUrl?: string;
  checkoutUrl?: string;
  autoLiberarAposCompra?: boolean;
}

export interface SalesTransaction {
  id: string;
  transactionId: string; // Idempotency key
  productId: string;
  productName: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: 'approved' | 'pending' | 'cancelled' | 'refunded' | 'chargeback' | 'expired';
  provider: string; // 'hotmart', 'kiwify', 'perfectpay', 'stripe', 'manual'
  origin: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string; // Para acesso temporário
}

export interface UserAreaAccess {
  id: string;
  userId: string;
  areaId: string;
  productId?: string;
  startDate: string;
  expirationDate?: string; // null ou string vazia = vitalício
  status: 'active' | 'revoked' | 'blocked';
  grantedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// MÓDULO: HERO CAROUSEL PREMIUM
// ==========================================

export type BannerCategory = 
  | 'CURSOS'
  | 'E-BOOKS'
  | 'APLICATIVOS'
  | 'FERRAMENTAS'
  | 'OFERTAS'
  | 'LANÇAMENTOS'
  | 'BÔNUS'
  | 'EVENTOS'
  | 'AULAS NOVAS'
  | 'PRODUTOS EXTERNOS'
  | 'CONTEÚDOS GRATUITOS';

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  desktopImage: string;
  mobileImage: string;
  productImage: string;
  targetType: 'produto_interno' | 'curso' | 'ebook' | 'aplicativo' | 'aula' | 'oferta' | 'link_externo';
  targetId?: string; // ID of course/product/aula if internal
  memberAreaId: string; // 'all' or specific member area ID
  category: BannerCategory;
  order: number;
  status: 'active' | 'inactive';
  startDate?: string;
  endDate?: string;
  openInNewTab: boolean;
  stats: {
    impressions: number;
    clicks: number;
  };
  customization?: {
    textPosition?: 'left' | 'center' | 'right';
    overlayOpacity?: number; // 0 to 100
    imagePosition?: 'right' | 'center' | 'bottom';
    bannerHeight?: 'normal' | 'large' | 'compact';
    slideDurationSeconds?: number; // 5, 8, 10, etc. (0 = disabled)
    showIndicators?: boolean;
    showArrows?: boolean;
    autoplay?: boolean;
    ctaColor?: string;
  };
}


