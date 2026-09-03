import { 
  Course, 
  LearningTrack, 
  Certificate, 
  CommunityPost, 
  LoginCustomization, 
  User, 
  BrandingConfig, 
  ProdutoCursoMapping, 
  Matricula, 
  WebhookLogRecord,
  MemberArea,
  DigitalProduct,
  UserAreaAccess,
  HeroBanner,
  SalesTransaction
} from '../types';

export const INITIAL_BRANDING: BrandingConfig = {
  logoUrl: '',
  logoType: 'both',
  brandName: 'FORMAÇÃO',
  brandBadge: 'VIP PRO',
  brandSubtext: 'EXCLUSIVE MEMBERSHIP',
  faviconUrl: 'https://api.iconify.design/lucide:crown.svg?color=%23D4AF37',
  pageTitle: 'FORMAÇÃO VIP PRO | Área de Membros Exclusiva'
};

export const INITIAL_USER: User = {
  id: 'usr_renato_01',
  name: 'Renato Nardin',
  email: 'renatonardin13@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  role: 'student',
  plan: 'VIP BLACK EXECUTIVE',
  registeredAt: '2025-01-15',
  lastAccessAt: 'Hoje às 12:40',
  status: 'active',
  stats: {
    activeCourses: 4,
    completedLessons: 48,
    studyTimeMinutes: 2205, // 36h 45m
    certificatesCount: 5,
  }
};

export const INITIAL_ADMIN_USER: User = {
  id: 'usr_admin_vip',
  name: 'Admin Formação VIP',
  email: 'admin@formacaovippro.com.br',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  role: 'admin',
  plan: 'MASTER ADMINISTRATOR',
  registeredAt: '2024-11-01',
  lastAccessAt: 'Hoje às 12:42',
  status: 'active',
  stats: {
    activeCourses: 6,
    completedLessons: 112,
    studyTimeMinutes: 4800,
    certificatesCount: 8,
  }
};

export const INITIAL_USERS_LIST: User[] = [
  INITIAL_USER,
  INITIAL_ADMIN_USER,
  {
    id: 'usr_camila_02',
    name: 'Dra. Camila Alcantara',
    email: 'camila.alcantara@medinvest.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    role: 'student',
    plan: 'VIP TITANIUM VITALÍCIO',
    registeredAt: '2025-02-10',
    lastAccessAt: 'Hoje às 10:15',
    status: 'active',
    stats: {
      activeCourses: 5,
      completedLessons: 64,
      studyTimeMinutes: 3120, // 52h
      certificatesCount: 4,
    }
  },
  {
    id: 'usr_lucas_03',
    name: 'Lucas Ferreira Mendes',
    email: 'lucas.fmendes@venturecorp.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    role: 'student',
    plan: 'VIP BLACK EXECUTIVE',
    registeredAt: '2025-02-18',
    lastAccessAt: 'Ontem às 21:40',
    status: 'active',
    stats: {
      activeCourses: 3,
      completedLessons: 32,
      studyTimeMinutes: 1450,
      certificatesCount: 2,
    }
  },
  {
    id: 'usr_beatriz_04',
    name: 'Beatriz Menezes Siqueira',
    email: 'beatriz.siqueira@growthpartners.br',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    role: 'student',
    plan: 'VIP ANUAL DIAMOND',
    registeredAt: '2025-03-01',
    lastAccessAt: 'Hoje às 08:30',
    status: 'active',
    stats: {
      activeCourses: 4,
      completedLessons: 41,
      studyTimeMinutes: 1980,
      certificatesCount: 3,
    }
  },
  {
    id: 'usr_rodrigo_05',
    name: 'Rodrigo Santoro Bittencourt',
    email: 'rodrigo.santoro@alphacapital.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    role: 'student',
    plan: 'VIP TITANIUM VITALÍCIO',
    registeredAt: '2025-01-20',
    lastAccessAt: 'Há 3 dias',
    status: 'active',
    stats: {
      activeCourses: 6,
      completedLessons: 78,
      studyTimeMinutes: 3890,
      certificatesCount: 6,
    }
  },
  {
    id: 'usr_juliana_06',
    name: 'Juliana Rocha Vasconcelos',
    email: 'juliana.vasconcelos@techscale.org',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    role: 'student',
    plan: 'VIP BLACK EXECUTIVE',
    registeredAt: '2025-03-12',
    lastAccessAt: 'Há 5 dias',
    status: 'active',
    stats: {
      activeCourses: 2,
      completedLessons: 18,
      studyTimeMinutes: 720,
      certificatesCount: 1,
    }
  },
  {
    id: 'usr_marcos_07',
    name: 'Marcos Vinicius Toledo',
    email: 'marcos.toledo@fintechsbr.com',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    role: 'student',
    plan: 'VIP ANUAL DIAMOND',
    registeredAt: '2025-02-05',
    lastAccessAt: 'Há 2 semanas',
    status: 'blocked',
    stats: {
      activeCourses: 1,
      completedLessons: 6,
      studyTimeMinutes: 180,
      certificatesCount: 0,
    }
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-negocios-digitais',
    title: 'Estratégias Avançadas de Negócios Digitais',
    description: 'Domine a estruturação de negócios escaláveis, funis perpétuos de alta conversão, retenção de clientes e liderança executiva para faturar múltiplos 7 dígitos.',
    category: 'Negócios & Estratégia',
    level: 'Mastery',
    featured: true,
    isPublished: true,
    order: 1,
    instructor: {
      name: 'Gabriel Arcuri',
      role: 'Founding Partner & Venture Strategist',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80',
    modules: [
      {
        id: 'mod-1',
        courseId: 'course-negocios-digitais',
        title: 'Módulo 01: Visão Estratégica & Fundamentos de Escala',
        description: 'Os princípios inegociáveis para construir uma empresa digital anti-frágil com margens elevadas.',
        order: 1,
        lessons: [
          {
            id: 'les-1-1',
            moduleId: 'mod-1',
            courseId: 'course-negocios-digitais',
            title: 'Aula 01: O Mindset dos Negócios de Alta Performance',
            order: 1,
            duration: '18:30',
            videoType: 'youtube',
            youtube_video_id: 'LXb3EKWsInQ',
            videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
            description: 'Nesta aula de abertura, detalhamos como estruturar seu modelo de pensamento e tomada de decisão estratégica nos primeiros ciclos de aceleração da sua empresa.',
            materials: [
              {
                id: 'mat-1',
                title: 'Planilha de Modelagem de Negócio 2026.xlsx',
                type: 'XLSX',
                size: '2.4 MB',
                url: '#download-mat-1',
                description: 'Planilha financeira com projeções de CAC, LTV e ponto de equilíbrio.'
              },
              {
                id: 'mat-2',
                title: 'Guia Executivo - Fundamentos de Escala.pdf',
                type: 'PDF',
                size: '4.8 MB',
                url: '#download-mat-2',
                description: 'Resumo com frameworks conceituais e plano de ação em 30 dias.'
              }
            ]
          },
          {
            id: 'les-1-2',
            moduleId: 'mod-1',
            courseId: 'course-negocios-digitais',
            title: 'Aula 02: Arquitetura de Ofertas Irresistíveis e High-Ticket',
            order: 2,
            duration: '24:15',
            videoType: 'youtube',
            youtube_video_id: 'L_LUpnjgPso',
            videoUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
            thumbnailUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80',
            description: 'Como desenhar esteiras de produtos onde a aquisição inicial paga o tráfego e o back-end gera margem de lucro líquida pura.',
            materials: [
              {
                id: 'mat-3',
                title: 'Framework de Criação de Ofertas.pdf',
                type: 'PDF',
                size: '1.9 MB',
                url: '#download-mat-3',
                description: 'Checklist de 10 passos para precificação e stacking de bônus.'
              }
            ]
          },
          {
            id: 'les-1-3',
            moduleId: 'mod-1',
            courseId: 'course-negocios-digitais',
            title: 'Aula 03: Unit Economics: LTV, CAC e Margem de Contribuição',
            order: 3,
            duration: '21:40',
            videoType: 'mp4',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
            description: 'Desvendando as métricas que os maiores fundos e operadores usam para avaliar a sustentabilidade e velocidade de crescimento.',
            materials: []
          }
        ]
      },
      {
        id: 'mod-2',
        courseId: 'course-negocios-digitais',
        title: 'Módulo 02: Engenharia de Tráfego & Funis de Conversão',
        description: 'Construção de campanhas de alta escala com previsibilidade de retorno sobre investimento publicitário.',
        order: 2,
        lessons: [
          {
            id: 'les-2-1',
            moduleId: 'mod-2',
            courseId: 'course-negocios-digitais',
            title: 'Aula 04: Estrutura de Campanhas Perpétuas no Meta Ads',
            order: 1,
            duration: '28:50',
            videoType: 'mp4',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=600&q=80',
            description: 'Como orquestrar orçamentos diários superiores a R$ 5.000 sem saturação rápida de criativos.',
            materials: [
              {
                id: 'mat-4',
                title: 'Pack de Copys & Criativos Validados.zip',
                type: 'ZIP',
                size: '14.2 MB',
                url: '#download-mat-4',
                description: 'Modelos de anúncios validados com mais de R$ 1M em investimento comprovado.'
              }
            ]
          },
          {
            id: 'les-2-2',
            moduleId: 'mod-2',
            courseId: 'course-negocios-digitais',
            title: 'Aula 05: Google Ads & YouTube Ads para Aquisição Qualificada',
            order: 2,
            duration: '26:10',
            videoType: 'mp4',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&w=600&q=80',
            description: 'Captura de demanda com intenção de compra imediata através de redes de pesquisa e canais de vídeo.',
            materials: []
          }
        ]
      },
      {
        id: 'mod-3',
        courseId: 'course-negocios-digitais',
        title: 'Módulo 03: Retenção, Comunidade e LTV Expansion',
        description: 'Transforme clientes em defensores fervorosos da marca e multiplique o faturamento recorrente.',
        order: 3,
        lessons: [
          {
            id: 'les-3-1',
            moduleId: 'mod-3',
            courseId: 'course-negocios-digitais',
            title: 'Aula 06: Onboarding Encantador & Primeiros 30 Dias do Cliente',
            order: 1,
            duration: '19:40',
            videoType: 'mp4',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
            description: 'Como zerar a taxa de churn nos primeiros 30 dias com rituais de boas-vindas inesquecíveis.',
            materials: [
              {
                id: 'mat-5',
                title: 'Manual de Onboarding e Rituais VIP.pdf',
                type: 'PDF',
                size: '3.1 MB',
                url: '#download-mat-5',
                description: 'Scripts de WhatsApp e régua de e-mails de ativação imediata.'
              }
            ]
          },
          {
            id: 'les-3-2',
            moduleId: 'mod-3',
            courseId: 'course-negocios-digitais',
            title: 'Aula 07: Estratégias de Upsell, Cross-Sell e Renovação',
            order: 2,
            duration: '25:00',
            videoType: 'mp4',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
            description: 'Momentos psicológicos exatos para ofertar o próximo nível de mentoria ou software.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'course-ia-produtividade',
    title: 'Inteligência Artificial para Negócios & Automação 10x',
    description: 'Implemente agentes autônomos, integrações de LLMs, automações no Make/N8N e fluxos inteligentes para reduzir 80% do trabalho operacional.',
    category: 'Inteligência Artificial & Automação',
    level: 'Avançado',
    featured: true,
    isPublished: true,
    order: 2,
    instructor: {
      name: 'Dra. Helena Vasconcelos',
      role: 'AI Researcher & Tech Lead',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80',
    modules: [
      {
        id: 'mod-ia-1',
        courseId: 'course-ia-produtividade',
        title: 'Módulo 01: Engenharia de Prompts Avançada & Gemini Pro',
        description: 'Técnicas de few-shot, chain-of-thought e estruturação de personas empresariais com IA.',
        order: 1,
        lessons: [
          {
            id: 'les-ia-1-1',
            moduleId: 'mod-ia-1',
            courseId: 'course-ia-produtividade',
            title: 'Aula 01: Arquitetura de Prompts Corporativos',
            order: 1,
            duration: '22:15',
            videoType: 'mp4',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80',
            description: 'Construindo diretrizes de sistema que eliminam alucinações e garantem respostas prontas para produção.',
            materials: [
              {
                id: 'mat-ia-1',
                title: 'Biblioteca de 120 Prompts Executivos.pdf',
                type: 'PDF',
                size: '5.6 MB',
                url: '#download-mat-ia-1',
                description: 'Coletânea pronta para copiar e colar para copy, finanças, código e atendimento.'
              }
            ]
          },
          {
            id: 'les-ia-1-2',
            moduleId: 'mod-ia-1',
            courseId: 'course-ia-produtividade',
            title: 'Aula 02: Automações com Webhooks e APIs de IA',
            order: 2,
            duration: '31:40',
            videoType: 'mp4',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
            description: 'Conectando formulários, CRMs e WhatsApp diretamente com modelos de linguagem para atendimento 24/7.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'course-alta-performance',
    title: 'Mindset de Elite & Gestão de Energia Executiva',
    description: 'Protocolos de neurociência, foco profundo, rotina inabalável e biohacking para manter clareza mental e energia máxima todos os dias.',
    category: 'Alta Performance & Liderança',
    level: 'Intermediário',
    featured: false,
    isPublished: true,
    order: 3,
    instructor: {
      name: 'Dr. Rodrigo Menezes',
      role: 'Neurocientista & Coach Executivo',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80',
    modules: [
      {
        id: 'mod-ap-1',
        courseId: 'course-alta-performance',
        title: 'Módulo 01: Otimização Circadiana & Sono Profundo',
        description: 'Como reconstruir seus ciclos de recuperação para acordar com foco absoluto sem cafeína excessiva.',
        order: 1,
        lessons: [
          {
            id: 'les-ap-1-1',
            moduleId: 'mod-ap-1',
            courseId: 'course-alta-performance',
            title: 'Aula 01: A Biologia do Foco Inabalável',
            order: 1,
            duration: '16:45',
            videoType: 'mp4',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
            description: 'Dopamina, noradrenalina e acetilcolina: modulando os neurotransmissores do trabalho de alto rendimento.',
            materials: [
              {
                id: 'mat-ap-1',
                title: 'Protocolo de Rotina Matinal e Noturna.pdf',
                type: 'PDF',
                size: '2.8 MB',
                url: '#download-mat-ap-1',
                description: 'Tabela de horários e suplementação funcional sugerida.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-copywriting-persuasao',
    title: 'Copywriting Magnético & Psicologia de Vendas',
    description: 'A arte e a ciência de escrever cartas de vendas, VSLs, anúncios e narrativas cinematográficas que geram conversão em massa.',
    category: 'Vendas & Copywriting',
    level: 'Avançado',
    featured: false,
    isPublished: true,
    order: 4,
    instructor: {
      name: 'Larissa Fontes',
      role: 'Head de Copywriting & Storyteller',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80',
    modules: [
      {
        id: 'mod-cp-1',
        courseId: 'course-copywriting-persuasao',
        title: 'Módulo 01: Gatilhos Psicológicos Primários',
        description: 'Os 7 condutores emocionais que destravam a decisão de compra instantânea.',
        order: 1,
        lessons: [
          {
            id: 'les-cp-1-1',
            moduleId: 'mod-cp-1',
            courseId: 'course-copywriting-persuasao',
            title: 'Aula 01: Storytelling com a Jornada do Herói em VSLs',
            order: 1,
            duration: '27:10',
            videoType: 'mp4',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
            description: 'Como prender a atenção nos primeiros 3 segundos e conduzir o prospect até o pitch irresistível.',
            materials: [
              {
                id: 'mat-cp-1',
                title: 'Template de Roteiro de VSL Milionária.docx',
                type: 'DOC',
                size: '1.2 MB',
                url: '#download-mat-cp-1',
                description: 'Estrutura passo a passo com marcações de tom e slides.'
              }
            ]
          }
        ]
      }
    ]
  }
];

export const INITIAL_LEARNING_TRACKS: LearningTrack[] = [
  {
    id: 'track-operador-milionario',
    title: 'Trilha do Fundador Digital 7D',
    subtitle: 'Do Zero à Escala de 7 Dígitos com Margem e Governança',
    description: 'Sequência ideal para quem precisa construir validação de produto, tráfego perpétuo e retenção sustentável.',
    iconName: 'Crown',
    color: '#D4AF37',
    courseIds: ['course-negocios-digitais', 'course-copywriting-persuasao', 'course-ia-produtividade']
  },
  {
    id: 'track-ia-automation',
    title: 'Trilha de Automação & IA Aplicada',
    subtitle: 'Multiplique a capacidade operacional do seu time',
    description: 'Formação técnica e prática para integrar agentes de IA e automatizar processos repetitivos.',
    iconName: 'Cpu',
    color: '#3B82F6',
    courseIds: ['course-ia-produtividade', 'course-negocios-digitais']
  },
  {
    id: 'track-executive-leadership',
    title: 'Trilha Liderança & Alta Performance',
    subtitle: 'Energia, foco e gestão de times autônomos',
    description: 'Desenvolva a resiliência psicológica e a postura executiva necessária para liderar mercados competitivos.',
    iconName: 'Zap',
    color: '#10B981',
    courseIds: ['course-alta-performance', 'course-negocios-digitais']
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-001',
    userId: 'usr_renato_01',
    courseId: 'course-negocios-digitais',
    courseTitle: 'Estratégias Avançadas de Negócios Digitais',
    studentName: 'Renato Nardin',
    issueDate: '2026-06-18',
    verificationCode: 'VIP-PRO-2026-RN-9941',
    workloadHours: 40
  },
  {
    id: 'cert-002',
    userId: 'usr_renato_01',
    courseId: 'course-ia-produtividade',
    courseTitle: 'Inteligência Artificial para Negócios & Automação 10x',
    studentName: 'Renato Nardin',
    issueDate: '2026-07-22',
    verificationCode: 'VIP-PRO-2026-RN-5812',
    workloadHours: 30
  },
  {
    id: 'cert-003',
    userId: 'usr_renato_01',
    courseId: 'course-alta-performance',
    courseTitle: 'Mindset de Elite & Gestão de Energia Executiva',
    studentName: 'Renato Nardin',
    issueDate: '2026-08-10',
    verificationCode: 'VIP-PRO-2026-RN-4177',
    workloadHours: 20
  },
  {
    id: 'cert-004',
    userId: 'usr_renato_01',
    courseId: 'course-copywriting-persuasao',
    courseTitle: 'Copywriting Magnético & Psicologia de Vendas',
    studentName: 'Renato Nardin',
    issueDate: '2026-08-19',
    verificationCode: 'VIP-PRO-2026-RN-3319',
    workloadHours: 25
  },
  {
    id: 'cert-005',
    userId: 'usr_renato_01',
    courseId: 'course-negocios-digitais-v1',
    courseTitle: 'Formação em Liderança e Negociação Estratégica',
    studentName: 'Renato Nardin',
    issueDate: '2026-08-24',
    verificationCode: 'VIP-PRO-2026-RN-1002',
    workloadHours: 15
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorName: 'Renato Nardin',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    authorRole: 'Membro VIP Diamond',
    title: 'Implementação do Funil Perpétuo no Módulo 2 bateu ROI 4.8x essa semana! 🚀',
    content: 'Fala comunidade VIP! Apliquei a esteira de upsell ensinada na Aula 02 do Módulo 1 em conjunto com a segmentação do Meta Ads. O resultado foi surpreendente: reduzimos o CAC em 34% e o LTV subiu quase 50%. Deixei o framework documentado para quem quiser trocar uma ideia nos comentários!',
    tag: 'Resultados & Cases',
    likes: 42,
    likedByMe: true,
    createdAt: 'Há 2 horas',
    comments: [
      {
        id: 'c-1',
        authorName: 'Larissa Fontes',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        content: 'Parabéns Renato! A copy de transição no checkout faz toda a diferença.',
        createdAt: 'Há 1 hora'
      },
      {
        id: 'c-2',
        authorName: 'Marcos Silveira',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        content: 'Sensacional! Você usou VSL de quantos minutos no order bump?',
        createdAt: 'Há 30 min'
      }
    ]
  },
  {
    id: 'post-2',
    authorName: 'Helena Vasconcelos',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    authorRole: 'Instrutora Master',
    title: 'Novo Script de Automação com Gemini 2.5 adicionado aos Materiais!',
    content: 'Subimos um novo workflow no Make/N8N para qualificação automática de leads via WhatsApp com pontuação de propensão de compra. Podem baixar diretamente na aba de Materiais da plataforma.',
    tag: 'Novidades & Atualizações',
    likes: 67,
    likedByMe: false,
    createdAt: 'Ontem às 18:30',
    comments: []
  }
];

export const INITIAL_LOGIN_CUSTOMIZATION: LoginCustomization = {
  backgroundType: 'image',
  backgroundUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&q=80',
  solidColor: '#08090C',
  gradientFrom: '#08090C',
  gradientTo: '#151922',
  overlayOpacity: 75,
  overlayBlur: 2,
  brandTitle: 'FORMAÇÃO VIP PRO',
  brandSubtitle: 'Sua jornada para o próximo nível começa aqui.',
  brandHighlights: [
    'Acesso ilimitado a mais de 100 horas de conteúdo em alta definição',
    'Materiais executivos, planilhas validadas e frameworks práticos',
    'Comunidade exclusiva de networking com os maiores operadores do país',
    'Certificados oficiais reconhecidos com código único de validação'
  ],
  formTitle: 'Entrar na Área VIP',
  formSubtitle: 'Utilize sua conta para continuar.',
  buttonText: 'ENTRAR NA ÁREA VIP',
  buttonColor: '#D4AF37',
  cardTransparency: 90,
  cardBlur: 16,
  cardBorderRadius: 16
};

export const INITIAL_PRODUTOS_CURSOS: ProdutoCursoMapping[] = [
  {
    id: 'map_01',
    produto_id: 'PPA882194',
    produto_nome: 'Formação VIP PRO Master - Vitalício',
    curso_id: 'course-negocios-digitais',
    curso_nome: 'Formação VIP PRO: Estratégias & Escala Digital',
    plataforma: 'perfectpay',
    ativo: true,
    created_at: '2025-01-10'
  },
  {
    id: 'map_02',
    produto_id: 'PPA773102',
    produto_nome: 'Clube Black VIP Anual',
    curso_id: 'course-vsl-milionaria',
    curso_nome: 'Copywriting & VSLs de Alta Conversão',
    plataforma: 'perfectpay',
    ativo: true,
    created_at: '2025-01-15'
  },
  {
    id: 'map_03',
    produto_id: 'KW-PROD-991',
    produto_nome: 'Mentoria Tráfego Escala 100k',
    curso_id: 'course-trafego-pago-mastery',
    curso_nome: 'Tráfego Pago de Alta Performance',
    plataforma: 'kiwify',
    ativo: true,
    created_at: '2025-02-01'
  },
  {
    id: 'map_04',
    produto_id: 'KW-PROD-105',
    produto_nome: 'Design & UI/UX para Infoprodutos',
    curso_id: 'course-ui-ux-design',
    curso_nome: 'Design & Interfaces de Alta Conversão',
    plataforma: 'kiwify',
    ativo: true,
    created_at: '2025-02-12'
  }
];

export const INITIAL_MATRICULAS: Matricula[] = [
  {
    id: 'mat_01',
    user_id: 'usr_renato_01',
    produto_id: 'PPA882194',
    produto_nome: 'Formação VIP PRO Master',
    curso_id: 'course-negocios-digitais',
    curso_nome: 'Formação VIP PRO: Estratégias & Escala Digital',
    plataforma_origem: 'perfectpay',
    status: 'ativo',
    data_liberacao: '2025-01-15 14:32:00'
  },
  {
    id: 'mat_02',
    user_id: 'usr_camila_02',
    produto_id: 'KW-PROD-991',
    produto_nome: 'Mentoria Tráfego Escala 100k',
    curso_id: 'course-trafego-pago-mastery',
    curso_nome: 'Tráfego Pago de Alta Performance',
    plataforma_origem: 'kiwify',
    status: 'ativo',
    data_liberacao: '2025-02-10 10:15:00'
  }
];

export const INITIAL_WEBHOOK_LOGS: WebhookLogRecord[] = [
  {
    id: 'log_01',
    plataforma: 'perfectpay',
    evento: 'compra_aprovada',
    email_comprador: 'rodrigo.medeiros@gmail.com',
    nome_comprador: 'Rodrigo Medeiros',
    produto_id: 'PPA882194',
    produto_nome: 'Formação VIP PRO Master',
    status_processamento: 'sucesso',
    sucesso: true,
    mensagem_detalhe: 'Acesso liberado com sucesso para curso Formação VIP PRO. E-mail de boas-vindas com senha temporária disparado via Resend.',
    payload_bruto: {
      sale_status_enum: 'approved',
      token: 'pp_sec_live_9a87f2e1c4d5b6a0',
      product: { code: 'PPA882194', name: 'Formação VIP PRO Master' },
      customer: { name: 'Rodrigo Medeiros', email: 'rodrigo.medeiros@gmail.com' }
    },
    created_at: 'Hoje, às 14:32:10'
  },
  {
    id: 'log_02',
    plataforma: 'kiwify',
    evento: 'compra_aprovada',
    email_comprador: 'mariana.silva@exemplo.com.br',
    nome_comprador: 'Mariana Silva',
    produto_id: 'KW-PROD-991',
    produto_nome: 'Mentoria Tráfego Escala 100k',
    status_processamento: 'sucesso',
    sucesso: true,
    mensagem_detalhe: 'Matrícula ativada para aluna existente no Supabase. Curso Tráfego Pago liberado.',
    payload_bruto: {
      order_status: 'paid',
      signature: 'kiwify_sec_live_example_token_9912',
      Product: { product_id: 'KW-PROD-991', product_name: 'Mentoria Tráfego Escala 100k' },
      Customer: { full_name: 'Mariana Silva', email: 'mariana.silva@exemplo.com.br' }
    },
    created_at: 'Hoje, às 11:15:45'
  }
];

// ==========================================
// MÓDULO 30: INITIAL MEMBER AREAS
// ==========================================

export const INITIAL_MEMBER_AREAS: MemberArea[] = [
  {
    id: 'area-formacao-vip',
    name: 'Formação VIP PRO',
    slug: 'formacao-vip',
    type: 'vip',
    description: 'Área master com formações executivas em escala de negócios, inteligência artificial, tráfego pago de alto volume e mentorias exclusivas.',
    logoUrl: '',
    faviconUrl: 'https://api.iconify.design/lucide:crown.svg?color=%23D4AF37',
    coverUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    primaryColor: '#D4AF37',
    secondaryColor: '#151922',
    status: 'active',
    welcomeText: 'Bem-vindo ao ecossistema executivo Formação VIP PRO. Acesse suas masterclasses e acelere sua operação digital.',
    heroTitle: 'FORMAÇÃO VIP PRO',
    heroSubtitle: 'Aceleradora de Negócios Digitais & Inteligência Executiva',
    heroCtaText: 'Continuar Minha Formação',
    heroCtaLink: '#conteudos',
    productCount: 4,
    studentCount: 148,
    order: 1,
    createdAt: '2025-01-01',
    updatedAt: '2026-08-25',
    loginCustomization: { ...INITIAL_LOGIN_CUSTOMIZATION }
  },
  {
    id: 'area-ebooks',
    name: 'E-books & Playbooks de Elite',
    slug: 'ebooks',
    type: 'ebooks',
    description: 'Biblioteca digital com livros, guias passo a passo, frameworks de copywriting, contratos jurídicos e playbooks práticos.',
    logoUrl: '',
    faviconUrl: 'https://api.iconify.design/lucide:book-open.svg?color=%23D4AF37',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1507842229451-7f01be7f7396?auto=format&fit=crop&w=1600&q=80',
    primaryColor: '#E6A23C',
    secondaryColor: '#1A1612',
    status: 'active',
    welcomeText: 'Acesse manuais práticos e playbooks em alta resolução direto na sua biblioteca virtual.',
    heroTitle: 'BIBLIOTECA DE E-BOOKS VIP',
    heroSubtitle: 'Playbooks, Frameworks e Manuais Estratégicos em PDF',
    heroCtaText: 'Explorar E-books',
    heroCtaLink: '#ebooks',
    productCount: 3,
    studentCount: 96,
    order: 2,
    createdAt: '2025-02-01',
    updatedAt: '2026-08-25',
    loginCustomization: {
      ...INITIAL_LOGIN_CUSTOMIZATION,
      brandTitle: 'BIBLIOTECA VIP DE E-BOOKS',
      brandSubtitle: 'PLAYBOOKS E FRAMEWORKS EM ALTA DEFINIÇÃO',
      brandHighlights: [
        'Acesso instantâneo a mais de 30 E-books e Manuais em PDF',
        'Leitor interativo direto no navegador sem necessidade de download',
        'Atualizações constantes de frameworks e modelos de contratos'
      ],
      formTitle: 'Portal dos E-books',
      formSubtitle: 'Entre com seu e-mail de compra para ler seus livros digitais.',
      backgroundType: 'image',
      backgroundUrl: 'https://images.unsplash.com/photo-1507842229451-7f01be7f7396?auto=format&fit=crop&w=1600&q=80'
    }
  },
  {
    id: 'area-aplicativos',
    name: 'Aplicativos & SaaS PRO',
    slug: 'aplicativos',
    type: 'aplicativos',
    description: 'Central de ferramentas web, aplicativos de produtividade, calculadoras de ROI e sistemas em nuvem para membros VIP.',
    logoUrl: '',
    faviconUrl: 'https://api.iconify.design/lucide:smartphone.svg?color=%23D4AF37',
    coverUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
    primaryColor: '#3B82F6',
    secondaryColor: '#0E1726',
    status: 'active',
    welcomeText: 'Aplicativos exclusivos para automatizar sua rotina, espionar criativos e calcular métricas operacionais.',
    heroTitle: 'SUITE DE APLICATIVOS VIP',
    heroSubtitle: 'SaaS, Ferramentas Web e Automações em Nuvem',
    heroCtaText: 'Acessar Ferramentas',
    heroCtaLink: '#apps',
    productCount: 3,
    studentCount: 82,
    order: 3,
    createdAt: '2025-02-15',
    updatedAt: '2026-08-25',
    loginCustomization: {
      ...INITIAL_LOGIN_CUSTOMIZATION,
      brandTitle: 'SUITE DE APLICATIVOS PRO',
      brandSubtitle: 'AUTOMAÇÃO, ESPIONAGEM E GESTÃO EM NUVEM',
      brandHighlights: [
        'Acesso a ferramentas proprietárias e utilitários SaaS exclusivos',
        'Calculadoras avançadas de margem e esteira de tráfego',
        'APIs integradas prontas para uso em sua empresa'
      ],
      formTitle: 'Login de Aplicativos',
      formSubtitle: 'Digite suas credenciais para desbloquear o acesso aos sistemas.',
      backgroundType: 'image',
      backgroundUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80'
    }
  },
  {
    id: 'area-ferramentas',
    name: 'Central de Ferramentas & Scripts',
    slug: 'ferramentas',
    type: 'ferramentas',
    description: 'Scripts de clonagem segura de páginas, geradores de quizzes interativos, analisadores de criativos e automações de webhooks.',
    logoUrl: '',
    faviconUrl: 'https://api.iconify.design/lucide:wrench.svg?color=%23D4AF37',
    coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    primaryColor: '#10B981',
    secondaryColor: '#061D15',
    status: 'active',
    welcomeText: 'Kits operacionais de código, geradores de landing pages e clonadores de oferta.',
    heroTitle: 'HUB DE FERRAMENTAS & SCRIPTS',
    heroSubtitle: 'Clonadores de Ofertas, Geradores de Quiz e Espionagem de Tráfego',
    heroCtaText: 'Abrir Ferramentas',
    heroCtaLink: '#ferramentas',
    productCount: 3,
    studentCount: 74,
    order: 4,
    createdAt: '2025-03-01',
    updatedAt: '2026-08-25',
    loginCustomization: {
      ...INITIAL_LOGIN_CUSTOMIZATION,
      brandTitle: 'CENTRAL DE FERRAMENTAS VIP',
      brandSubtitle: 'SCRIPTS, AUTOMAÇÕES E ENGENHARIA DE VENDAS',
      formTitle: 'Área de Ferramentas',
      backgroundType: 'image',
      backgroundUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80'
    }
  },
  {
    id: 'area-produtos-digitais',
    name: 'Produtos Digitais & PLRs Prontos',
    slug: 'produtos-digitais',
    type: 'produtos_digitais',
    description: 'Catálogo de produtos digitais validados, templates de páginas, criativos em PSD/Canva e pacotes completos para revenda.',
    logoUrl: '',
    faviconUrl: 'https://api.iconify.design/lucide:package.svg?color=%23D4AF37',
    coverUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80',
    primaryColor: '#8B5CF6',
    secondaryColor: '#160E28',
    status: 'active',
    welcomeText: 'Esteiras de produtos completas prontas para ativação em tráfego pago.',
    heroTitle: 'CATÁLOGO DE PRODUTOS DIGITAIS',
    heroSubtitle: 'Funis Prontos, Ofertas Validadas e Templates Editáveis',
    heroCtaText: 'Explorar Catálogo',
    heroCtaLink: '#produtos',
    productCount: 2,
    studentCount: 65,
    order: 5,
    createdAt: '2025-03-10',
    updatedAt: '2026-08-25',
    loginCustomization: {
      ...INITIAL_LOGIN_CUSTOMIZATION,
      brandTitle: 'ECOSSISTEMA DE PRODUTOS DIGITAIS',
      brandSubtitle: 'KITS DE ATIVAÇÃO RÁPIDA DE OFERTAS',
      formTitle: 'Login de Produtos',
      backgroundType: 'image',
      backgroundUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80'
    }
  }
];

// ==========================================
// MÓDULO 30: INITIAL DIGITAL PRODUCTS
// ==========================================

export const INITIAL_DIGITAL_PRODUCTS: DigitalProduct[] = [
  // --- PRODUTOS DA FORMAÇÃO VIP (Cursos) ---
  {
    id: 'prod-curso-negocios',
    areaId: 'area-formacao-vip',
    title: 'Aceleração de Negócios Digitais & Escala 100k',
    shortDescription: 'Masterclass executiva com estratégias de aquisição de tráfego pago, LTV e criação de ofertas high-ticket.',
    fullDescription: 'O treinamento definitivo para quem busca construir uma máquina previsível de aquisição e retenção no mercado digital.',
    type: 'curso',
    category: 'Estratégia & Escala',
    coverUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80',
    author: {
      name: 'Renato Nardin',
      role: 'Founder & CEO Formação VIP',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    status: 'published',
    order: 1,
    publishedAt: '2025-01-10',
    courseId: 'course-negocios-digitais',
    featured: true,
    badge: 'MAIS ASSISTIDO',
    accessLevel: 'vip'
  },
  {
    id: 'prod-curso-ia',
    areaId: 'area-formacao-vip',
    title: 'Inteligência Artificial Aplicada a Negócios & Automação',
    shortDescription: 'Domine a engenharia de prompts, agentes autônomos e fluxos automáticos para multiplicar a produtividade da sua equipe.',
    fullDescription: 'Como integrar LLMs, n8n, webhooks e automações avançadas no dia a dia da sua operação digital.',
    type: 'curso',
    category: 'Inteligência Artificial',
    coverUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    author: {
      name: 'Dr. Leonardo Vasconcelos',
      role: 'Head de Engenharia de IA',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    status: 'published',
    order: 2,
    publishedAt: '2025-01-20',
    courseId: 'course-ia-produtividade',
    featured: true,
    badge: 'DESTAQUE',
    accessLevel: 'vip'
  },
  {
    id: 'prod-curso-trafego',
    areaId: 'area-formacao-vip',
    title: 'Tráfego Pago de Alto Volume & Escala de Criativos',
    shortDescription: 'Estratégias avançadas no Meta Ads, Google Ads e TikTok Ads para investimentos de 5 a 6 dígitos diários.',
    fullDescription: 'Aprenda como testar 50 criativos por semana e escalar campanhas com ROAS positivo consistente.',
    type: 'curso',
    category: 'Tráfego & Performance',
    coverUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    author: {
      name: 'Matheus Albuquerque',
      role: 'Senior Media Buyer ($15M+ geridos)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    },
    status: 'published',
    order: 3,
    publishedAt: '2025-02-05',
    courseId: 'course-trafego-avancado',
    featured: false,
    accessLevel: 'vip'
  },

  // --- PRODUTOS DA ÁREA DE E-BOOKS ---
  {
    id: 'prod-ebook-copywriting',
    areaId: 'area-ebooks',
    title: 'O Livro Negro do Copywriting de Alta Conversão',
    shortDescription: '150 páginas com 37 estruturas psicológicas, gatilhos de fechamento e modelos prontos de VSLs e páginas de captura.',
    fullDescription: 'Um compêndio definitivo de persuasão aplicada ao mercado digital brasileiro, com exemplos práticos desmontados linha a linha.',
    type: 'ebook',
    category: 'Copywriting',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1507842229451-7f01be7f7396?auto=format&fit=crop&w=1600&q=80',
    author: {
      name: 'Renato Nardin',
      role: 'Copywriter & Estrategista',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    status: 'published',
    order: 1,
    publishedAt: '2025-02-01',
    featured: true,
    badge: 'BEST SELLER',
    ebook: {
      pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
      pageCount: 154,
      fileSize: '18.4 MB',
      allowDownload: true,
      previewChapters: 3
    }
  },
  {
    id: 'prod-ebook-funis',
    areaId: 'area-ebooks',
    title: 'Playbook de Funis de Tráfego Direto & Esteiras High-Ticket',
    shortDescription: 'Mapas mentais e diagramas de 12 funis comprovados para produtos de R$ 97 até R$ 5.000.',
    fullDescription: 'Documentação detalhada dos funis mais lucrativos do mercado com taxas médias de conversão por etapa.',
    type: 'ebook',
    category: 'Funis & Estratégia',
    coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
    author: {
      name: 'Lucas Ferreira Mendes',
      role: 'Growth Hacker',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    },
    status: 'published',
    order: 2,
    publishedAt: '2025-02-10',
    featured: true,
    badge: 'ESSENCIAL',
    ebook: {
      pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
      pageCount: 88,
      fileSize: '12.1 MB',
      allowDownload: true
    }
  },
  {
    id: 'prod-ebook-juridico',
    areaId: 'area-ebooks',
    title: 'Guia Jurídico & Contratos Blindados para Produtores e Coprodutores',
    shortDescription: 'Minutas contratuais completas, cláusulas de proteção de dados (LGPD) e acordos de confidencialidade.',
    fullDescription: 'Garanta a segurança patrimonial da sua empresa com modelos prontos revisados por advogados especialistas em direito digital.',
    type: 'ebook',
    category: 'Jurídico & Compliance',
    coverUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1600&q=80',
    author: {
      name: 'Dra. Camila Alcantara',
      role: 'Consultora Jurídica Digital',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    status: 'published',
    order: 3,
    publishedAt: '2025-02-20',
    featured: false,
    ebook: {
      pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
      pageCount: 64,
      fileSize: '8.7 MB',
      allowDownload: true
    }
  },

  // --- PRODUTOS DA ÁREA DE APLICATIVOS ---
  {
    id: 'prod-app-spy',
    areaId: 'area-aplicativos',
    title: 'SpyOffers PRO — Radar de Ofertas Validadas',
    shortDescription: 'Sistema web para rastrear criativos em alta escala no Meta Ads e descobrir landing pages de alta conversão.',
    fullDescription: 'Filtre anúncios ativos há mais de 30 dias no Facebook Ad Library, baixe vídeos em alta definição e analise o código-fonte das páginas.',
    type: 'aplicativo',
    category: 'Espionagem & Análise',
    coverUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
    author: {
      name: 'Equipe Tech VIP',
      role: 'Engenharia de Software',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    status: 'published',
    order: 1,
    publishedAt: '2025-02-15',
    featured: true,
    badge: 'EXCLUSIVO VIP',
    app: {
      appUrl: '#spy-offers',
      appType: 'web',
      version: 'v3.2.0 PRO',
      screenshots: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
      ],
      systemRequirements: 'Compatível com todos os navegadores modernos (Chrome, Safari, Edge, Firefox)'
    }
  },
  {
    id: 'prod-app-cloner',
    areaId: 'area-aplicativos',
    title: 'SiteCloner PRO — Clonador & Otimizador de Páginas',
    shortDescription: 'Clone qualquer página de vendas externa em segundos, baixe os assets e substitua links de checkout automaticamente.',
    fullDescription: 'Gera arquivos HTML/CSS/JS limpos com substituição de tags, links e scripts de tracking para subida rápida na sua hospedagem.',
    type: 'aplicativo',
    category: 'Landing Pages',
    coverUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80',
    author: {
      name: 'Equipe Tech VIP',
      role: 'Engenharia de Software',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    status: 'published',
    order: 2,
    publishedAt: '2025-02-25',
    featured: true,
    app: {
      appUrl: '#site-cloner',
      appType: 'web',
      version: 'v2.8.5',
      screenshots: [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
      ]
    }
  },
  {
    id: 'prod-app-quiz',
    areaId: 'area-aplicativos',
    title: 'QuizBuilder Interativo — Motor de Funil Gamificado',
    shortDescription: 'Crie questionários interativos com pontuação dinâmica, segmentação de lead e redirecionamento de checkout condicional.',
    fullDescription: 'Aumente as taxas de conversão de tráfego frio em até 300% com funis interativos de diagnóstico e recomendação personalizada.',
    type: 'aplicativo',
    category: 'Conversão & Gamificação',
    coverUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
    author: {
      name: 'Equipe Tech VIP',
      role: 'Engenharia de Software',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    status: 'published',
    order: 3,
    publishedAt: '2025-03-01',
    featured: false,
    app: {
      appUrl: '#quiz-builder',
      appType: 'web',
      version: 'v1.5.0'
    }
  },

  // --- PRODUTOS DA CENTRAL DE FERRAMENTAS ---
  {
    id: 'prod-tool-webhook-hub',
    areaId: 'area-ferramentas',
    title: 'Webhook & Postback Gateway — PerfectPay / Kiwify',
    shortDescription: 'Roteador inteligente de eventos de venda em tempo real com disparo automático de senhas e matrículas no Supabase.',
    fullDescription: 'Configure URLs de webhook, monitore logs de requisições e faça reprocessamento manual de transações recusadas com 1 clique.',
    type: 'ferramenta',
    category: 'Integrações',
    coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    author: {
      name: 'Renato Nardin',
      role: 'Arquiteto de Soluções',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    status: 'published',
    order: 1,
    publishedAt: '2025-03-05',
    featured: true,
    tool: {
      toolUrl: '#webhook-hub',
      instructions: 'Insira a URL de webhook gerada no painel de configurações da sua plataforma de checkout.'
    }
  },
  {
    id: 'prod-tool-video-host',
    areaId: 'area-ferramentas',
    title: 'Hospedagem & Player Seguro Antidownload',
    shortDescription: 'Proteção de vídeo com reprodução via IFrame API YouTube e MP4 com escudo contra cliques e marca d’água dinâmica.',
    fullDescription: 'Impeça que alunos vazem ou baixem seus vídeos com o player blindado Formação VIP PRO.',
    type: 'ferramenta',
    category: 'Streaming & Vídeo',
    coverUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1600&q=80',
    author: {
      name: 'Equipe Tech VIP',
      role: 'Streaming Core',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    status: 'published',
    order: 2,
    publishedAt: '2025-03-12',
    featured: false,
    tool: {
      toolUrl: '#video-hosting',
      instructions: 'Cadastre o ID do YouTube ou a URL do arquivo MP4 direto no gerenciador de aulas.'
    }
  },

  // --- PRODUTOS DA ÁREA DE PRODUTOS DIGITAIS ---
  {
    id: 'prod-digital-kit-vendas',
    areaId: 'area-produtos-digitais',
    title: 'Kit de Páginas de Vendas em Tailwind & React',
    shortDescription: 'Pacote com 15 templates responsivos de alta conversão, seções de garantia, FAQ interativo e checkout integrado.',
    fullDescription: 'Código-fonte limpo pronto para subir no Vercel ou hospedagem tradicional.',
    type: 'arquivo',
    category: 'Templates & UI Kits',
    coverUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80',
    author: {
      name: 'Design Studio VIP',
      role: 'Product Design',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
    },
    status: 'published',
    order: 1,
    publishedAt: '2025-03-15',
    featured: true,
    file: {
      fileUrl: 'https://example.com/downloads/kit-paginas-vip.zip',
      fileName: 'kit-paginas-vendas-vip-v4.zip',
      fileSize: '45.8 MB',
      fileType: 'ZIP'
    }
  },
  {
    id: 'prod-depois-dos-60-real',
    areaId: 'area-ebooks',
    title: 'Depois dos 60: 50 cuidados que todo idoso e sua família precisam conhecer',
    shortDescription: 'Guia prático com 50 cuidados essenciais para melhorar a segurança, a prevenção, a autonomia e a qualidade de vida na terceira idade.',
    fullDescription: 'Guia prático com 50 cuidados essenciais para melhorar a segurança, a prevenção, a autonomia e a qualidade de vida na terceira idade. Este material consolida orientações sobre segurança doméstica, prevenção de quedas, medicação e bem-estar físico e mental.',
    type: 'ebook',
    category: 'Saúde & Bem-estar',
    status: 'published',
    order: 10,
    publishedAt: '2025-01-01',
    ebook: {
      pageCount: 50,
      fileFormat: 'PDF',
      pdfUrl: '' // PENDENTE
    },
    storagePath: 'prod-depois-dos-60-real/depois-dos-60-50-cuidados.pdf',
    coverUrl: 'https://api.iconify.design/lucide:book-open.svg?color=%23D4AF37',
    bannerUrl: '', // PENDENTE
    accessLevel: 'vip',
    author: {
      name: 'PENDENTE',
      role: 'Especialista',
      avatar: '' // PENDENTE
    }
  }
];

// ==========================================
// MÓDULO 30: INITIAL USER AREA ACCESSES
// ==========================================

export const INITIAL_USER_AREA_ACCESSES: UserAreaAccess[] = [
  // Renato Nardin (Acesso a Formação VIP, E-books, Aplicativos, Ferramentas, Produtos)
  {
    id: 'acc-renato-01',
    userId: 'usr_renato_01',
    areaId: 'area-formacao-vip',
    startDate: '2025-01-15',
    status: 'active',
    grantedBy: 'Sistema / Compra PerfectPay',
    createdAt: '2025-01-15',
    updatedAt: '2025-01-15'
  },
  {
    id: 'acc-renato-02',
    userId: 'usr_renato_01',
    areaId: 'area-ebooks',
    startDate: '2025-02-01',
    status: 'active',
    grantedBy: 'Sistema / Compra Kiwify',
    createdAt: '2025-02-01',
    updatedAt: '2025-02-01'
  },
  {
    id: 'acc-renato-03',
    userId: 'usr_renato_01',
    areaId: 'area-aplicativos',
    startDate: '2025-02-15',
    status: 'active',
    grantedBy: 'Admin Manual',
    createdAt: '2025-02-15',
    updatedAt: '2025-02-15'
  },
  {
    id: 'acc-renato-04',
    userId: 'usr_renato_01',
    areaId: 'area-ferramentas',
    startDate: '2025-03-01',
    status: 'active',
    grantedBy: 'Admin Manual',
    createdAt: '2025-03-01',
    updatedAt: '2025-03-01'
  },
  {
    id: 'acc-renato-05',
    userId: 'usr_renato_01',
    areaId: 'area-produtos-digitais',
    startDate: '2025-03-10',
    status: 'active',
    grantedBy: 'Admin Manual',
    createdAt: '2025-03-10',
    updatedAt: '2025-03-10'
  },

  // Dra. Camila Alcantara (Acesso a Formação VIP e E-books)
  {
    id: 'acc-camila-01',
    userId: 'usr_camila_02',
    areaId: 'area-formacao-vip',
    startDate: '2025-02-10',
    status: 'active',
    grantedBy: 'Sistema / Compra PerfectPay',
    createdAt: '2025-02-10',
    updatedAt: '2025-02-10'
  },
  {
    id: 'acc-camila-02',
    userId: 'usr_camila_02',
    areaId: 'area-ebooks',
    startDate: '2025-02-10',
    status: 'active',
    grantedBy: 'Sistema / Compra Kiwify',
    createdAt: '2025-02-10',
    updatedAt: '2025-02-10'
  },

  // Lucas Ferreira Mendes (Acesso a E-books e Aplicativos)
  {
    id: 'acc-lucas-01',
    userId: 'usr_lucas_03',
    areaId: 'area-ebooks',
    startDate: '2025-02-18',
    status: 'active',
    grantedBy: 'Sistema / Compra Kiwify',
    createdAt: '2025-02-18',
    updatedAt: '2025-02-18'
  },
  {
    id: 'acc-lucas-02',
    userId: 'usr_lucas_03',
    areaId: 'area-aplicativos',
    startDate: '2025-02-18',
    status: 'active',
    grantedBy: 'Admin Manual',
    createdAt: '2025-02-18',
    updatedAt: '2025-02-18'
  }
];

export const INITIAL_HERO_BANNERS: HeroBanner[] = [
  {
    id: 'banner-1',
    title: 'ESTRATÉGIAS AVANÇADAS PARA VENDER MAIS',
    subtitle: '🔥 NOVO TREINAMENTO EXCLUSIVO',
    description: 'Aprenda estratégias práticas para aumentar suas vendas e transformar conhecimento em resultados reais com funis de alta conversão.',
    ctaText: 'ACESSAR AGORA →',
    ctaLink: '/course-detail',
    desktopImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    productImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    targetType: 'curso',
    targetId: 'course-negocios-digitais',
    memberAreaId: 'all',
    category: 'LANÇAMENTOS',
    order: 1,
    status: 'active',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    openInNewTab: false,
    stats: {
      impressions: 1420,
      clicks: 312
    },
    customization: {
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
  },
  {
    id: 'banner-2',
    title: 'DOMINANDO INTELIGÊNCIA ARTIFICIAL',
    subtitle: '⚡ AULAS PRÁTICAS DE AUTOMAÇÃO',
    description: 'Descubra como integrar ferramentas de IA Generativa nos seus processos diários e multiplicar sua produtividade em até 10x.',
    ctaText: 'ASSISTIR AULAS →',
    ctaLink: '/course-detail',
    desktopImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    productImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    targetType: 'curso',
    targetId: 'course-ia-produtividade',
    memberAreaId: 'all',
    category: 'AULAS NOVAS',
    order: 2,
    status: 'active',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    openInNewTab: false,
    stats: {
      impressions: 980,
      clicks: 215
    },
    customization: {
      textPosition: 'left',
      overlayOpacity: 80,
      imagePosition: 'right',
      bannerHeight: 'normal',
      slideDurationSeconds: 8,
      showIndicators: true,
      showArrows: true,
      autoplay: true,
      ctaColor: '#D4AF37'
    }
  },
  {
    id: 'banner-3',
    title: 'KIT VIP DE APLICATIVOS DE ALTA PERFORMANCE',
    subtitle: '💎 BÔNUS EXCLUSIVO VIP',
    description: 'Ferramentas de web scraping, gestão financeira e copy writing liberadas para todos os alunos do plano Black Executive.',
    ctaText: 'BAIXAR AGORA →',
    ctaLink: 'https://example.com',
    desktopImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    productImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    targetType: 'aplicativo',
    memberAreaId: 'all',
    category: 'APLICATIVOS',
    order: 3,
    status: 'active',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    openInNewTab: true,
    stats: {
      impressions: 740,
      clicks: 189
    },
    customization: {
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
  }
];

export const INITIAL_SALES_TRANSACTIONS: SalesTransaction[] = [
  {
    id: 'tx_101',
    transactionId: 'kiwify_txn_99812374',
    productId: 'prod-negocios-digitais',
    productName: 'Negócios Digitais de Alta Escala',
    userId: 'usr_renato_01',
    customerName: 'Renato Nardin',
    customerEmail: 'renatonardin13@gmail.com',
    amount: 997.00,
    currency: 'BRL',
    status: 'approved',
    provider: 'kiwify',
    origin: 'checkout_direto',
    createdAt: '2026-02-15 14:20:10',
    updatedAt: '2026-02-15 14:20:10'
  },
  {
    id: 'tx_102',
    transactionId: 'pp_txn_88419203',
    productId: 'prod-ia-produtividade',
    productName: 'Inteligência Artificial & Automação Avançada',
    userId: 'usr_camila_02',
    customerName: 'Dra. Camila Alcantara',
    customerEmail: 'camila.alcantara@medinvest.com',
    amount: 497.00,
    currency: 'BRL',
    status: 'approved',
    provider: 'perfectpay',
    origin: 'checkout_direto',
    createdAt: '2026-02-18 09:12:45',
    updatedAt: '2026-02-18 09:12:45'
  }
];


