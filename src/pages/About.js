import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BasePage from './BasePage.js';

gsap.registerPlugin(ScrollTrigger);

// =============================================================
//  About (/about) — page parcours & compétences.
//  Panneau 1 : Parcours (Formation + Expérience), 2 colonnes.
//  Panneau 2 : Compétences (6 catégories, grille 3×2).
// =============================================================

const FORMATION = [
  {
    date: '2025 — 2027',
    role: 'Master en Informatique',
    detail: 'Parcours Produit Service Multimédia',
    place: 'Université Marie-Louis-Pasteur, Montbéliard',
  },
  {
    date: '2024 — 2025',
    role: 'Licence en Informatique',
    detail: 'Parcours Produit Service Multimédia',
    place: 'Université Marie-Louis-Pasteur, Montbéliard',
  },
  {
    date: '2021 — 2024',
    role: 'Licence en Informatique',
    detail: 'Internet et Multimédia',
    place: 'Université Abomey-Calavi, Bénin',
  },
];

const EXPERIENCE = [
  {
    date: 'Janv. 2023 - auj.',
    role: 'Développeur Web & Marketing Digital',
    detail: 'Freelance',
    place: 'Conception, développement, SEO',
  },
  {
    date: 'Mars 2025 - Juin 2025',
    role: 'Stage Dév. Web · Assistant Marketing',
    detail: 'Reine Eli - France',
    place: 'Développement et personnalisation d un site e-commerce WordPress Elementor Pro - WooCommerce',
  },

 {
    date: 'Février 2023 - Avril 2024',
    role: 'Assistant Multimédia . Web (CDD)',
    detail: ' Novo Image, Cotonou Benin',
    place: 'Développement web full-stack . Création de prototypes UI UX (Figma, Adobe XD, Photoshop)',
  },
];

// 7 catégories — l'essentiel par bloc.
const SKILLS = [
  {
    n: '01',
    name: 'WordPress',
    list: 'Elementor Pro · Theme Builder · WooCommerce · ACF · Yoast · Rank Math · Wordfence',
  },
  {
    n: '02',
    name: 'Langages',
    list: 'HTML · CSS · JavaScript · PHP · Laravel · Python · MySQL · C++',
  },
  {
    n: '03',
    name: 'Design',
    list: 'Figma · Pack Adobe (PS, AI, ID, XD) · Canva · Responsive & prototypage',
  },
  {
    n: '04',
    name: 'Photo · Vidéo',
    list: 'Photographie · Montage vidéo  Premiere Pro · DaVinci Resolve · Lightroom',
  },
  {
    n: '05',
    name: 'SEO · SEA',
    list: 'Google Search Console · SEMrush · Ahrefs · Wincher · Ubersuggest',
  },
  {
    n: '06',
    name: 'IA · Automatisation',
    list: 'n8n · Claude Code · ChatGPT · Midjourney · DALL·E · RunwayML',
  },
  {
    n: '07',
    name: 'Game · IoT · Réseau',
    list: 'Unity · Arduino · Administration réseau informatique',
  },
];

export default class About extends BasePage {
  // 2 panneaux → fond volontairement sombre (variantes plus foncées du
  // violet profond) pour garantir la lisibilité du texte blanc.
  get backgroundStops() {
    return ['#2D2845', '#3D3560'];
  }

  render() {
    const renderEntries = (entries) =>
      entries
        .map(
          (e) => `
        <li class="about__entry">
          <span class="u-mono about__date">${e.date}</span>
          <p class="about__role">${e.role}</p>
          <p class="about__detail">${e.detail}</p>
          <p class="about__place">${e.place}</p>
        </li>`
        )
        .join('');

    const renderSkills = SKILLS.map(
      (s) => `
      <article class="about__skill" data-reveal>
        <span class="u-mono about__skill-n">${s.n}</span>
        <h3 class="about__skill-name">${s.name}</h3>
        <p class="about__skill-list">${s.list}</p>
      </article>`
    ).join('');

    return `
      <section class="panel panel--journey">
        <header class="about__header">
          <p class="u-mono about__label" data-reveal>Parcours</p>
          <h2 class="about__title" data-reveal>
            Formation &amp; <em>expérience</em>.
          </h2>
        </header>

        <div class="about__columns">
          <div class="about__col" data-reveal>
            <h3 class="u-mono about__col-title">Formation</h3>
            <ul class="about__list">
              ${renderEntries(FORMATION)}
            </ul>
          </div>

          <div class="about__col" data-reveal>
            <h3 class="u-mono about__col-title">Expérience</h3>
            <ul class="about__list">
              ${renderEntries(EXPERIENCE)}
            </ul>
          </div>
        </div>
      </section>

      <section class="panel panel--skills">
        <header class="about__header">
          <p class="u-mono about__label" data-reveal>Compétences</p>
          <h2 class="about__title" data-reveal>
            Stack &amp; <em>outils</em>.
          </h2>
        </header>

        <div class="about__skills">
          ${renderSkills}
        </div>
      </section>
    `;
  }

  init() {
    this._triggers = [];
    this._setupScrollReveals();
  }

  _setupScrollReveals() {
    const horizontal = this.context.isHorizontal;
    const items = this.el.querySelectorAll('[data-reveal]');

    items.forEach((item) => {
      gsap.set(item, { opacity: 0, [horizontal ? 'x' : 'y']: 30 });
      const t = ScrollTrigger.create({
        trigger: item,
        horizontal,
        start: horizontal ? 'left 90%' : 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(item, { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'power3.out' });
        },
      });
      this._triggers.push(t);
    });
  }

  destroy() {
    if (this._triggers) this._triggers.forEach((t) => t.kill());
    super.destroy();
  }
}
