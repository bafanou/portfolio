// =============================================================
//  projects.js — source de données des projets.
//  Ordre = ordre d'affichage sur /work (un panneau par projet).
//  Catégories : 'WordPress' | 'Dev' | 'Design' | 'Game' | 'IoT'
// =============================================================

export const categories = ['WordPress', 'Dev', 'Design', 'Game', 'IoT'];

export const projects = [
  // ----- 01 ROSAL PARIS ----------------------------------------
  {
    slug: 'rosalparis',
    title: 'Rosal Paris',
    subtitle: 'Maroquinerie cuir E-commerce',
    year: 2025,
    category: 'WordPress',
    role: 'Conception · Intégration · Sécurité & maintenance',
    stack: ['WordPress', 'Elementor Pro', 'WooCommerce', 'Wordfence'],
    cover: '/images/projects/rosalparis/cover.png',
    gallery: ['/images/projects/rosalparis/01.png', '/images/projects/rosalparis/02.png'],
    description:
      "Site e-commerce sur-mesure pour une marque parisienne de maroquinerie cuir. Conception et intégration complètes sous WordPress + Elementor Pro, sécurisation (Wordfence, sauvegardes) et maintenance continue assurées pour la cliente.",
    links: {
      live: 'https://rosalparis.com',
    },
    featured: true,
  },

  // ----- 02 PERRUQUES ESTHÉTIQUES ------------------------------
  {
    slug: 'perruques-esthetiques',
    title: 'Perruques Esthétiques',
    subtitle: 'E-commerce perruques - Stage Reine Eli',
    year: 2025,
    category: 'WordPress',
    role: 'Développement WordPress (stage)',
    stack: ['WordPress', 'Elementor Pro', 'WooCommerce', 'SEO', 'Sécurité'],
    cover: '/images/projects/perruques-esthetiques/cover.png',
    gallery: [
      '/images/projects/perruques-esthetiques/01.png',
      '/images/projects/perruques-esthetiques/02.png',
      '/images/projects/perruques-esthetiques/03.png',
    ],
    description:
      "Site e-commerce développé pendant mon stage chez Reine Eli. L'occasion d'approfondir mes compétences en sécurité, optimisation des performances et bonnes pratiques de mise en production sur WordPress + Elementor Pro.",
    links: {
      live: 'https://www.perruques-esthetiques.fr',
    },
    featured: true,
  },

  // ----- 03 BLANDYGLOW -----------------------------------------
  {
    slug: 'blandyglow',
    title: 'Blandyglow',
    subtitle: 'Vente de perruques - WordPress',
    year: 2025,
    category: 'WordPress',
    role: 'Intégration & personnalisation',
    stack: ['WordPress', 'Custom Theme', 'WooCommerce'],
    cover: '/images/projects/blandyglow/cover.png',
    gallery: ['/images/projects/blandyglow/01.png'],
    description:
      "Site de vente de perruques bâti sur WordPress avec une personnalisation poussée d'un thème premium. Intégration design fidèle au brief, mise en place du catalogue WooCommerce et ajustements ergonomiques.",
    links: {
      live: 'https://www.blandyglow.com/',
    },
    featured: false,
  },

  // ----- 04 PILS — DASHBOARD ANALYTIQUE -----------------------
  {
    slug: 'pils',
    title: 'PILS',
    subtitle: 'Dashboard analytique - Gestion de RDV médicaux',
    year: 2025,
    category: 'Dev',
    role: 'Analyse de données & visualisation',
    stack: ['JavaScript', 'Charts', 'MySQL', 'KPI', 'Tableaux de bord'],
    cover: '/images/projects/pils/cover.png',
    gallery: [
      '/images/projects/pils/01.png',
      '/images/projects/pils/02.png',
    ],
    description:
      "Tableau de bord analytique pour le suivi des rendez-vous médicaux : évolution quotidienne des RDV (annulés, replacés par patient, replacés après appel, non replacés) et répartition par spécialité (Ophtalmologie, Pédiatrie, Pneumologie, Cardio...). Visualisations interactives pour piloter la gestion des plannings et faciliter la prise de décision.",
    links: {},
    featured: true,
  },

  // ----- 05 AUTORA ---------------------------------------------
  {
    slug: 'autora',
    title: 'AUTORA',
    subtitle: 'Véhicules d\'occasion - E-commerce full-stack',
    year: 2025,
    category: 'Dev',
    role: 'UI/UX & Développement full-stack',
    stack: ['Figma', 'React', 'PHP', 'MySQL'],
    cover: '/images/projects/autora/cover.png',
    gallery: [
      '/images/projects/autora/01.png',
      '/images/projects/autora/02.png',
      '/images/projects/autora/03.png',
      '/images/projects/autora/04.png',
    ],
    description:
      "Projet d'étude ambitieux : un site e-commerce dédié aux véhicules d'occasion, du brief à la mise en ligne. Maquette UI/UX sous Figma, puis développement avec React côté front et PHP/MySQL côté back. Un terrain idéal pour apprendre, expérimenter et progresser.",
    links: {
      figma:
        'https://www.figma.com/proto/SqYZ1tqh8IsVwIvbVigDNe/site-e-commerce?node-id=11147-7813&t=L1HXoMxaEorBsdnl-1',
    },
    featured: true,
  },

  // ----- 05 TOMATE ---------------------------------------------
  {
    slug: 'tomate',
    title: 'Tomate',
    subtitle: 'Maquette web - Exercice de design',
    year: 2024,
    category: 'Design',
    role: 'UI/UX Design',
    stack: ['Figma'],
    cover: '/images/projects/tomate/cover.png',
    gallery: ['/images/projects/tomate/01.png', '/images/projects/tomate/02.png'],
    description:
      "Maquette web d'entraînement, pensée comme un terrain d'expérimentation pour affiner mes réflexes UI/UX et explorer la composition, la typographie et la hiérarchie visuelle sur Figma.",
    links: {
      figma:
        'https://www.figma.com/proto/usbkU2Rs1Rwjhe8z3kIlBC/tomate?node-id=2-2&t=9FjMTIbm4nETmBa7-1',
    },
    featured: false,
  },

  // ----- 06 MAISON DE JEUX -------------------------------------
  {
    slug: 'maison-de-jeux',
    title: 'Maison de Jeux',
    subtitle: 'Maquette web - Exercice de design',
    year: 2024,
    category: 'Design',
    role: 'UI/UX Design',
    stack: ['Figma'],
    cover: '/images/projects/maison-de-jeux/cover.jpg',
    gallery: [],
    description:
      "Maquette d'une page commerciale pour une maison de jeux. Un exercice de design pour structurer une page claire, installer une ambiance forte et soigner les micro-interactions.", // cover .jpg (déjà bon)
    links: {
      figma:
        'https://www.figma.com/proto/qci6HYxDS3lpQ9748Ttv7r/Maison-de-jeux?node-id=15-2&t=Z5EL8YNjl8L7b6TF-1',
    },
    featured: false,
  },

  // ----- 07 JEU UNITY (MASTER 1 PSM) ---------------------------
  {
    slug: 'jeu-unity',
    title: 'Projet Unity',
    subtitle: 'Jeu vidéo 3D - Projet étude',
    year: 2025,
    category: 'Game',
    role: 'Game design & développement',
    stack: ['Unity', 'C#'],
    cover: '/images/projects/jeu-unity/cover.png',
    gallery: [],
    description:
      "Jeu vidéo développé sous Unity dans le cadre du Master 1 Produit Service Multimédia. Game design, level design, scripting C# et intégration des assets - une plongée concrète dans la création interactive 3D.",
    links: {
      video:
        'https://drive.google.com/file/d/1MU3CBoKis1rxHbXOvLXKteVcf8biydSN/view?usp=drive_link',
    },
    featured: true,
  },

  // ----- 08 ARDUINO --------------------------------------------
  {
    slug: 'arduino',
    title: 'Arduino - Auto-formation',
    subtitle: 'Électronique & IoT',
    year: 2024,
    category: 'IoT',
    role: 'Auto-formation & expérimentation',
    stack: ['Arduino', 'C++', 'Capteurs', 'Actionneurs'],
    cover: '/images/projects/arduino/cover.jpeg',
    gallery: [],
    description:
      "Auto-formation sur la plateforme Arduino : exploration des capteurs, actionneurs et microcontrôleurs autour d'un kit d'expérimentation. L'occasion de toucher au hardware et de poser les bases de l'IoT et de l'électronique programmable.",
    links: {},
    featured: false,
  },
];

// Projets mis en avant (utilisable plus tard sur la home si besoin).
export const featuredProjects = projects.filter((p) => p.featured);

// Récupère un projet par son slug.
export const getProjectBySlug = (slug) => projects.find((p) => p.slug === slug) ?? null;

// Projet précédent / suivant (navigation sur la page détail).
export const getAdjacentProjects = (slug) => {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  };
};
