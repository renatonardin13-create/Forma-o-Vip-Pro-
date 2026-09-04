// =======================================================================
// CONTEÚDO ESTRUTURADO DOS E-BOOKS OFICIAIS DA PLATAFORMA
// =======================================================================

export interface EbookChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle?: string;
  summary: string;
  highlights: string[];
  paragraphs: string[];
  protocolOrTip?: {
    label: string;
    description: string;
  };
}

export interface EbookContentRecord {
  productId: string;
  title: string;
  author: string;
  authorRole: string;
  category: string;
  totalPages: number;
  edition: string;
  isbn?: string;
  chapters: EbookChapter[];
}

export const EBOOK_CONTENTS: Record<string, EbookContentRecord> = {
  'prod-depois-dos-60-real': {
    productId: 'prod-depois-dos-60-real',
    title: 'Depois dos 60: 50 cuidados que todo idoso e sua família precisam conhecer',
    author: 'Renato Nardin & Equipe Médica',
    authorRole: 'Especialistas em Longevidade Ativa & Cuidados Geriátricos',
    category: 'Saúde & Bem-estar',
    totalPages: 50,
    edition: '1ª Edição Oficial Homologada (2025)',
    chapters: [
      {
        id: 'cap-60-1',
        chapterNumber: 1,
        title: 'Segurança Residencial & Blindagem Contra Quedas',
        subtitle: 'Cuidados 01 a 10: O ambiente seguro como salvaguarda da autonomia',
        summary: 'Mais de 70% das quedas em pessoas acima de 60 anos ocorrem dentro do próprio lar. Pequenas adaptações estruturais eliminam riscos críticos e preservam a mobilidade.',
        highlights: [
          'Remoção total de tapetes soltos ou fixação obrigatória com fitas antiderrapantes de alta aderência.',
          'Iluminação contínua com sensores de movimento entre a cama e o banheiro para trajetos noturnos.',
          'Instalação de barras de apoio em aço inox normatizadas no box, ao lado do vaso sanitário e em corredores.',
          'Eliminação de fios soltos, desníveis de piso e organizadores no caminho das passagens principais.'
        ],
        paragraphs: [
          'O envelhecimento natural do corpo humano traz alterações sutis na acuidade visual, no equilíbrio vestibular e na propriocepção motora. Em um ambiente residencial que não foi repensado para essa nova fase, objetos banais tornam-se obstáculos perigosos.',
          'Estudos geriátricos confirmam que uma queda em idade madura não representa apenas um trauma físico momentâneo: ela pode desencadear a chamada "Síndrome do Medo de Cair", que restringe a mobilidade da pessoa por receio e acelera a perda de massa muscular.',
          'Para proteger quem você ama, inicie com uma vistoria cômodo por cômodo. Avalie calçados: aposente chinelos desgastados e pantufas largas sem calcanhar fechado. Dê preferência a tênis com solado de borracha antiderrapante e fechos práticos.',
          'No banheiro, o piso deve contar com piso antiderrapante ou tapetes emborrachados com ventosas fixas. A cadeira de banho articulada é um investimento indispensável de dignidade e segurança durante a higiene diária.'
        ],
        protocolOrTip: {
          label: 'Protocolo de Ouro #01',
          description: 'Mantenha um interruptor de luz de fácil alcance logo ao lado da cabeceira e uma luz guia noturna de 2W acesa na rota até o banheiro.'
        }
      },
      {
        id: 'cap-60-2',
        chapterNumber: 2,
        title: 'Polifarmácia & Gestão Inteligente de Medicamentos',
        subtitle: 'Cuidados 11 a 20: Prevenção de interações e controle rigoroso de dosagens',
        summary: 'O uso de múltiplos medicamentos prescritos exige um protocolo visual e metódico para evitar duplicidades, esquecimentos e reações adversas graves.',
        highlights: [
          'Criação de mapa visual ou tabela de horários afixada na porta da geladeira com caixas codificadas por cores.',
          'Revisão semestral integrada de todos os remédios com o médico geriatra ou clínico de referência.',
          'Proibição estrita da automedicação, inclusive de chás "naturais" e analgésicos que sobrecarregam rins e fígado.',
          'Armazenamento longe do calor e da umidade (nunca no armário do banheiro).'
        ],
        paragraphs: [
          'A polifarmácia — caracterizada pelo uso concomitante de cinco ou mais princípios ativos — é uma realidade para a maioria das pessoas na maturidade. O que muitos ignoram é que o metabolismo hepático e a taxa de filtração glomerular reduzem com a idade, alterando o tempo de depuração dos fármacos no organismo.',
          'Misturar remédios em horários desencontrados ou duplicar doses por lapso de memória é uma das principais causas de internações emergenciais evitáveis. Sintomas como tontura, sonolência excessiva e confusão mental súbita muitas vezes não são declínio cognitivo, mas sim efeitos colaterais de interações medicamentosas.',
          'Utilize organizadores semanais de comprimidos divididos por períodos (Manhã, Almoço, Noite, Dormir). Delegue a um familiar ou cuidador responsável o abastecimento semanal dos compartimentos sempre no mesmo dia.',
          'Tenha sempre uma foto nítida e atualizada da receita de uso contínuo salva no celular dos familiares para qualquer atendimento de urgência.'
        ],
        protocolOrTip: {
          label: 'Protocolo de Ouro #02',
          description: 'Nunca parta comprimidos sem sulco e nunca dissolva cápsulas gelatinosas sem autorização explícita do médico assistente.'
        }
      },
      {
        id: 'cap-60-3',
        chapterNumber: 3,
        title: 'Nutrição Funcional, Hidratação & Combate à Sarcopenia',
        subtitle: 'Cuidados 21 a 30: Preservando a força muscular, vitalidade celular e imunidade',
        summary: 'A sarcopenia (perda acelerada de massa e força muscular) e a desidratação silenciosa são os dois maiores inimigos da vitalidade na terceira idade.',
        highlights: [
          'Meta diária de hidratação: 30ml a 35ml de água por quilo de peso corporal fracionados ao longo do dia.',
          'Aporte de proteínas de alto valor biológico em todas as refeições principais (ovos, carnes magras, peixes, laticínios).',
          'Atenção aos níveis sanguíneos de Vitamina D3, Vitamina B12 e Ferro, com reposição guiada por exames.',
          'Adoção de texturas adaptadas quando houver dificuldade de mastigação ou episódios de disfagia (engasgos).'
        ],
        paragraphs: [
          'Com o passar dos anos, o centro cerebral que comanda o reflexo da sede sofre uma dessensibilização progressiva. A pessoa madura não sente sede com a mesma facilidade que um jovem, entrando facilmente em estados subclínicos de desidratação.',
          'A desidratação em idosos provoca queda de pressão ao levantar (hipotensão postural), letargia, constipação intestinal crônica e aumenta exponencialmente o risco de infecções do trato urinário que causam desorientação rápida.',
          'Aliada à hidratação, a nutrição deve combater a sarcopenia. A manutenção da musculatura dos membros inferiores e do core é o que sustenta a capacidade de levantar de uma cadeira sem auxílio e caminhar com passadas firmes.',
          'Incorpore fontes ricas em fibras solúveis e insolúveis, azeite de oliva extravirgem com polifenóis antioxidantes e vegetais folhosos verde-escuros para manter a microbiota intestinal saudável e ativa.'
        ],
        protocolOrTip: {
          label: 'Protocolo de Ouro #03',
          description: 'Mantenha uma garrafa graduada de água fresca sempre visível no campo de visão e ofereça pequenos goles a cada 45 minutos.'
        }
      },
      {
        id: 'cap-60-4',
        chapterNumber: 4,
        title: 'Estímulo Cognitivo, Memória & Socialização Positiva',
        subtitle: 'Cuidados 31 a 40: Neuroplasticidade contínua, sono de qualidade e preservação do afeto',
        summary: 'O cérebro continua capaz de criar novas conexões sinápticas por toda a vida quando exposto a novidades intelectuais e laços afetivos significativos.',
        highlights: [
          'Prática diária de desafios mentais diversificados: leitura reflexiva, palavras cruzadas, xadrez ou instrumentos musicais.',
          'Higiene do sono rigorosa com desligamento de telas 1 hora antes de dormir e ambiente silencioso.',
          'Combate enérgico ao isolamento social através de grupos de convivência, oficinas e encontros familiares frequentes.',
          'Diferenciação clara entre lapsos de memória benignos e sinais precoces de demência vascular ou Alzheimer.'
        ],
        paragraphs: [
          'A neurociência moderna derrubou o mito de que o cérebro idoso é incapaz de aprender. A neuroplasticidade permanece ativa, desde que seja estimulada por tarefas que exijam esforço cognitivo genuíno e aprendizado de novas habilidades.',
          'Repetir sempre a mesma atividade mecânica não gera novas sinapses. Aprender a mexer em um novo aplicativo, aprender uma nova receita culinária ou cultivar um novo idioma ativa circuitos neuronais adormecidos e cria uma valiosa reserva cognitiva.',
          'A solidão é um fator de risco tão nocivo à saúde cardiovascular e mental quanto o tabagismo. O sentimento de pertencimento, a troca de afeto e a valorização das memórias autobiográficas mantêm os neurotransmissores do bem-estar em níveis protetores.',
          'Preste atenção ao sono: a apneia do sono e o despertar frequente fragmentam os ciclos de sono profundo (onde ocorre a consolidação da memória e a limpeza das toxinas cerebrais), devendo ser investigados por polissonografia se houver ronco intenso.'
        ],
        protocolOrTip: {
          label: 'Protocolo de Ouro #04',
          description: 'Incentive a pessoa a contar histórias do seu passado em detalhes, rever álbuns de fotos e manter um diário de gratidão ou anotações diárias.'
        }
      },
      {
        id: 'cap-60-5',
        chapterNumber: 5,
        title: 'Autonomia, Dignidade & Direitos da Pessoa Idosa',
        subtitle: 'Cuidados 41 a 50: Cuidar sem anular, proteção patrimonial e amor responsável',
        summary: 'O maior respeito que uma família pode oferecer é apoiar a independência do idoso, ouvindo suas decisões e resguardando sua integridade em todas as esferas.',
        highlights: [
          'Respeito absoluto à tomada de decisão individual sempre que a capacidade de discernimento estiver preservada.',
          'Proteção contra golpes virtuais e financeiros cada vez mais direcionados à terceira idade.',
          'Divisão equilibrada das tarefas de cuidado entre os membros da família para evitar a exaustão do cuidador principal.',
          'Planejamento antecipado de diretrizes de saúde com diálogo aberto, transparente e compassivo.'
        ],
        paragraphs: [
          'Há uma linha tênue entre cuidar e infantilizar. Cuidadores e familiares bem-intencionados frequentemente cometem o equívoco de tomar todas as decisões pela pessoa madura, retirando-lhe a palavra, o poder de escolha das próprias roupas, alimentação e rotina.',
          'Essa superproteção gera sentimentos de inutilidade e depressão reativa. O idoso deve ser estimulado a fazer por conta própria tudo aquilo que suas condições físicas e cognitivas permitirem, mesmo que demore mais tempo para concluir a tarefa.',
          'No ambiente digital, oriente pacientemente sobre a atuação de estelionatários: ensine a nunca repassar senhas bancárias por telefone, desconfiar de mensagens de parentes pedindo dinheiro urgente pelo WhatsApp e evitar clicar em links suspeitos com promessas milagrosas.',
          'Por fim, cuide de quem cuida. O cuidador familiar precisa de pausas regulares, apoio psicológico e divisão de responsabilidades com outros parentes. O cuidado sustentável e amoroso só é possível quando o cuidador também está saudável e acolhido.'
        ],
        protocolOrTip: {
          label: 'Protocolo de Ouro #05',
          description: 'Nunca tome uma decisão médica ou de vida importante pelo idoso lúcido sem consultá-lo e validar seus desejos fundamentais.'
        }
      }
    ]
  },

  'prod-ebook-copywriting': {
    productId: 'prod-ebook-copywriting',
    title: 'O Livro Negro do Copywriting de Alta Conversão',
    author: 'Renato Nardin',
    authorRole: 'Copywriter & Estrategista Digital de Alta Performance',
    category: 'Marketing & Vendas',
    totalPages: 154,
    edition: 'Edição Definitiva Masterclass',
    chapters: [
      {
        id: 'cap-copy-1',
        chapterNumber: 1,
        title: 'A Psicologia da Decisão & As 3 Camadas de Consciência',
        subtitle: 'Decifrando o cérebro reptiliano antes de digitar a primeira linha',
        summary: 'Toda venda é uma transação emocional justificada pela lógica. Se a sua copy não dialoga com o medo de perder ou o desejo visceral de transformação, você está apenas queimando tráfego.',
        highlights: [
          'Os 5 níveis de consciência de Eugene Schwartz adaptados para a era do scroll infinito.',
          'A tríade neurológica: Reptiliano (Sobrevivência), Límbico (Sentimento) e Neocórtex (Racionalização).',
          'Como identificar o "Inimigo Comum" que une o leitor à sua solução em menos de 15 segundos.',
          'A fórmula da Proposta Única de Vendas (PUV) irresistível sem jargões genéricos.'
        ],
        paragraphs: [
          'No mercado atual, o bem mais escasso do mundo não é o dinheiro, é a atenção focada. O seu prospect médio é bombardeado por mais de 5.000 estímulos publicitários diários. Seu cérebro desenvolveu uma barreira biológica automática de defesa.',
          'Se a abertura do seu anúncio ou página soar como "mais um vendedor querendo me empurrar um produto", a mente do leitor fecha instantaneamente. O grande segredo dos copywriters de 8 dígitos é entrar na conversa que já está acontecendo na cabeça do cliente.',
          'Mapeie com precisão cirúrgica: qual é a dor das 3 da manhã? O que faz o seu cliente perder o sono? Quando você descreve o problema dele com mais clareza do que ele mesmo conseguiria formular, ele deduz inconscientemente que você tem a solução ideal.'
        ],
        protocolOrTip: {
          label: 'Script Prático de Abertura',
          description: '"Se você está cansado de [Dor Específica] mesmo já tendo tentado [Solução Comum Fracassada], os próximos 3 minutos vão mudar sua perspectiva."'
        }
      },
      {
        id: 'cap-copy-2',
        chapterNumber: 2,
        title: '37 Ganchos de Quebra de Padrão & Retenção Máxima',
        subtitle: 'Dominando os primeiros 5 segundos que definem o ROI da sua campanha',
        summary: 'A quebra de padrão cria um vácuo de curiosidade que obriga o cérebro a permanecer focado na sua mensagem.',
        highlights: [
          'Ganchos contrários ao senso comum: dizendo o oposto do que o nicho espera ouvir.',
          'Aberturas cinematográficas "In Media Res" (iniciando no clímax do conflito).',
          'Uso de loops abertos (Open Loops) que prendem o espectador até a oferta final.'
        ],
        paragraphs: [
          'Seu hook tem um único trabalho: comprar os próximos 10 segundos de atenção. Nada mais. Não tente vender o produto no gancho. Venda apenas o próximo parágrafo.',
          'Utilize a quebra de crença: "Tudo o que te disseram sobre emagrecimento nos últimos 10 anos está 100% errado, e a culpa não é sua". A surpresa paralisa o senso crítico e desperta a curiosidade primária.'
        ]
      },
      {
        id: 'cap-copy-3',
        chapterNumber: 3,
        title: 'A Anatomia da VSL Irresistível de 12 Minutos',
        subtitle: 'Estrutura passo a passo do roteiro com conversão acima de 3.5%',
        summary: 'O roteiro cinematográfico que conduz o espectador da dor aguda à euforia da compra sem pausas cansativas.',
        highlights: [
          'Minuto 0 a 2: Gancho magnético e promessa ousada com prova irrefutável.',
          'Minuto 2 a 5: A história de origem e o mecanismo único da falha comum.',
          'Minuto 5 a 8: Revelação do Mecanismo Único de Cura e demonstração lógica.',
          'Minuto 8 a 12: Apresentação da oferta irresistível, ancoragem de preço e garantia tripla.'
        ],
        paragraphs: [
          'A VSL moderna não suporta rodeios ou introduções monótonas. O ritmo de edição e a densidade das revelações mantêm o espectador hipnotizado.',
          'Ao introduzir o seu mecanismo único, batize-o com um nome memorável e proprietário. Isso impede a comparação de preços com concorrentes genéricos do mercado.'
        ]
      }
    ]
  },

  'prod-ebook-funis': {
    productId: 'prod-ebook-funis',
    title: 'Playbook de Funis de Tráfego Direto & Esteiras High-Ticket',
    author: 'Renato Nardin & Equipe Growth',
    authorRole: 'Especialistas em Escala & Aquisição Paga',
    category: 'Negócios & Escala',
    totalPages: 128,
    edition: 'Manual Operacional de Escala (2025)',
    chapters: [
      {
        id: 'cap-funil-1',
        chapterNumber: 1,
        title: 'Engenharia de CAC Negativo no Front-End',
        subtitle: 'Como financiar a aquisição infinita de clientes pagantes',
        summary: 'O objetivo de um bom produto de entrada (tripwire) não é o lucro imediato, mas pagar integralmente os custos de tráfego para que seus upsells entrem com margem líquida de 100%.',
        highlights: [
          'Precificação estratégica de produtos front-end entre R$ 19,90 e R$ 47,00.',
          'Otimização de Order Bump para taxas de adesão superiores a 45%.',
          'Upsells de 1 clique (One Click Upsell) que elevam o ticket médio imediatamente.'
        ],
        paragraphs: [
          'O empreendedor digital amador tenta lucrar no primeiro clique. O operador de alta escala sabe que quem consegue pagar mais caro para adquirir um cliente domina o mercado.',
          'Ao estruturar uma esteira com 2 Order Bumps altamente complementares e um Upsell complementar imediato, você transforma um checkout de R$ 27 em um faturamento médio por comprador superior a R$ 85,00.'
        ]
      },
      {
        id: 'cap-funil-2',
        chapterNumber: 2,
        title: 'A Esteira High-Ticket no WhatsApp & Fechamento Consultivo',
        subtitle: 'Transformando compradores de e-books em clientes de mentorias de 5k+',
        summary: 'Scripts e cadências de prospecção consultiva que identificam os clientes VIP mais qualificados da sua base.',
        highlights: [
          'Filtro de qualificação silencioso nas primeiras 48 horas pós-compra.',
          'Abordagem humanizada via WhatsApp sem parecer telemarketing.',
          'A sessão estratégica de diagnóstico que fecha mentorias de ticket elevado.'
        ],
        paragraphs: [
          'Todo cliente que comprou seu material digital já demonstrou intenção real e confiança no seu método. Um percentual de 3% a 7% dessa base tem poder aquisitivo para contratar sua implementação direta ou mentoria individual.'
        ]
      }
    ]
  },

  'prod-ebook-juridico': {
    productId: 'prod-ebook-juridico',
    title: 'Guia Jurídico & Contratos Blindados para Infoprodutores',
    author: 'Assessoria Jurídica Digital VIP',
    authorRole: 'Advogados Especialistas em Direito Digital & Propriedade Intelectual',
    category: 'Jurídico & Compliance',
    totalPages: 96,
    edition: '2ª Edição Revisada e Atualizada com Marco da IA',
    chapters: [
      {
        id: 'cap-jur-1',
        chapterNumber: 1,
        title: 'Contratos de Coprodução Blindados & Divisão de Royalties',
        subtitle: 'Evitando as 7 maiores disputas judiciais entre especialistas e lançadores',
        summary: 'Cláusulas indispensáveis para definir titularidade de base de leads, contas de anúncios, domínio de marca e regras claras de rescisão contratual.',
        highlights: [
          'Definição inegociável da propriedade intelectual do método versus operação.',
          'Regras de não concorrência (Non-Compete) e não aliciamento (Non-Solicitation).',
          'Gestão transparente do fluxo de caixa e provisionamento de impostos em conta PJ.'
        ],
        paragraphs: [
          'Sociedades informais baseadas em conversas de WhatsApp são uma bomba-relógio no marketing digital. Assim que o faturamento atinge seis ou sete dígitos, as divergências sobre quem investiu mais ou quem é dono da marca surgem com força destrutiva.',
          'Um contrato de coprodução profissional delimita exatamente as responsabilidades, prazos, critérios de auditoria financeira e o que acontece com os produtos e funis ativos caso haja rompimento unilateral.'
        ]
      },
      {
        id: 'cap-jur-2',
        chapterNumber: 2,
        title: 'Adequação LGPD & Políticas de Reembolso Anti-Chargeback',
        subtitle: 'Como proteger seu gateway contra bloqueios cautelares e contestações',
        summary: 'Diretrizes práticas para manter seus termos de uso em conformidade com o Código de Defesa do Consumidor e as operadoras de cartão.',
        highlights: [
          'Termos de aceite explícito no checkout com logs de consentimento e IP.',
          'Procedimento formal de atendimento de reembolso dentro dos 7 dias legais.',
          'Dossiê comprobatório de entrega de infoproduto para reversão de chargeback.'
        ],
        paragraphs: [
          'Os gateways de pagamento monitoram rigorosamente a taxa de estorno (chargeback). Manter essa taxa abaixo de 1% é vital para a sobrevivência da sua operação e liberação rápida dos saques.'
        ]
      }
    ]
  }
};

/**
 * Helper para obter o conteúdo estruturado de qualquer produto
 */
export function getEbookStructuredContent(product: {
  id: string;
  title: string;
  category?: string;
  shortDescription?: string;
  fullDescription?: string;
  author?: { name?: string; role?: string };
  ebook?: { pageCount?: number };
}): EbookContentRecord {
  // Se houver conteúdo específico cadastrado, retorna diretamente
  if (EBOOK_CONTENTS[product.id]) {
    return EBOOK_CONTENTS[product.id];
  }

  // Fallback inteligente para produtos personalizados
  const totalPages = product.ebook?.pageCount || 48;
  return {
    productId: product.id,
    title: product.title,
    author: product.author?.name || 'Renato Nardin & Especialistas',
    authorRole: product.author?.role || 'Instrutores Oficiais VIP',
    category: product.category || 'Conhecimento Estratégico',
    totalPages: totalPages,
    edition: 'Edição Digital Interativa VIP',
    chapters: [
      {
        id: `${product.id}-cap-1`,
        chapterNumber: 1,
        title: 'Introdução & Fundamentos Práticos',
        subtitle: `Diretrizes fundamentais sobre ${product.title}`,
        summary: product.shortDescription || 'Metodologia testada e comprovada em cenários de alta performance.',
        highlights: [
          'Visão panorâmica dos princípios mais importantes.',
          'Identificação dos pontos de atenção imediata.',
          'Plano de ação recomendado para implementação.'
        ],
        paragraphs: [
          product.fullDescription || product.shortDescription || 'Bem-vindo ao material oficial de capacitação e desenvolvimento.',
          'Este guia foi estruturado com foco em aplicabilidade prática e clareza de execução. Siga os capítulos em sequência e utilize as ferramentas complementares disponíveis na plataforma.'
        ],
        protocolOrTip: {
          label: 'Orientação de Leitura',
          description: 'Recomendamos a leitura atenta com anotações e aplicação progressiva de cada módulo.'
        }
      },
      {
        id: `${product.id}-cap-2`,
        chapterNumber: 2,
        title: 'Metodologia Avançada & Casos Práticos',
        subtitle: 'Passo a passo detalhado de implementação',
        summary: 'Aprofundamento nas técnicas que diferenciam iniciantes de profissionais experientes.',
        highlights: [
          'Eliminação de gargalos operacionais comuns.',
          'Métricas e indicadores-chave para acompanhar o progresso.',
          'Estudo de casos de sucesso replicáveis.'
        ],
        paragraphs: [
          'A consistência é o elemento central do sucesso. Ao aplicar os conceitos deste capítulo, documente seus resultados e ajuste os processos de acordo com a sua realidade específica.',
          'Mantenha contato com a comunidade de membros na plataforma para tirar dúvidas e compartilhar aprendizados.'
        ]
      },
      {
        id: `${product.id}-cap-3`,
        chapterNumber: 3,
        title: 'Recomendações Finais & Checklist de Execução',
        subtitle: 'Garantindo resultados sustentáveis e duradouros',
        summary: 'Checklist prático para consolidar o aprendizado e manter a evolução contínua.',
        highlights: [
          'Revisão periódica dos conceitos-chave.',
          'Definição de metas de curto e médio prazo.',
          'Próximos passos na esteira de desenvolvimento.'
        ],
        paragraphs: [
          'Parabéns por concluir este estudo. O conhecimento só se transforma em poder quando colocado em movimento.',
          'Acesse os demais módulos e conteúdos disponíveis na sua área de membros para continuar sua jornada.'
        ]
      }
    ]
  };
}
