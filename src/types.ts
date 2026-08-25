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
  curso_id: string;
  curso_nome: string;
  plataforma: 'kiwify' | 'perfectpay' | 'todas';
  ativo: boolean;
  created_at?: string;
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
