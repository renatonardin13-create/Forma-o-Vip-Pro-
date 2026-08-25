import { Course, LearningTrack, Certificate, CommunityPost, LoginCustomization, User, BrandingConfig, ProdutoCursoMapping, Matricula, WebhookLogRecord } from '../types';

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
            videoType: 'mp4',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
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
            videoType: 'mp4',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
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
