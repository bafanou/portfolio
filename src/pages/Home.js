import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import BasePage from './BasePage.js';
import { prefersReducedMotion } from '@/utils/device.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

// =============================================================
//  Home (/) — page d'accueil.
//  Hero WebGL (HeroSphere) + intro texte (reveal SplitText) +
//  panneaux projets en avant + CTA contact. Scroll horizontal.
//  La page POSSÈDE le hero : init() le monte, destroy() le démonte.
// =============================================================

export default class Home extends BasePage {
  // Couleurs de fond traversées au scroll (rampe violette).
  // 3 stops pour 3 panneaux (hero, about, cta).
  // Volontairement dans la plage SOMBRE pour garantir la lisibilité
  // du texte blanc sur les panneaux about (photo + bio) et cta.
  get backgroundStops() {
    return ['#5C5792', '#2D2845', '#3D3560'];
  }

  render() {
    return `
      <section class="panel panel--hero">
        <h1 class="hero__title" data-hero-title>
          <span class="hero__line">Benoît</span>
          <span class="hero__line">Anthime</span>
          <span class="hero__line hero__line--accent">Fanou</span>
        </h1>

        <div class="hero__statement" data-hero-statement>
          <span class="hero__statement-line">Je <em>code</em>,</span>
          <span class="hero__statement-line hero__statement-line--indent">je <em>conçois</em>,</span>
          <span class="hero__statement-line">je rends ça <em>vivant</em>.</span>
        </div>
      </section>

      <section class="panel panel--about">
        <div class="about__photo" data-reveal>
          <img
            class="about__img"
            src="/images/profile/portrait.jpg"
            alt="Portrait — Benoît Anthime Fanou"
            onerror="this.remove()"
            loading="lazy"
          />
          <span class="about__photo-initials" aria-hidden="true">BAF</span>
        </div>

        <div class="about__content">
          <p class="u-mono about__label" data-reveal>Étudiant · Alternance Assistant Chef de Projet ERP</p>

          <h2 class="about__title" data-reveal>
            Étudiant en <em>Master Informatique</em><br />
            à <em>Montbéliard</em>.
          </h2>

          <p class="about__bio" data-reveal>
            <em>Curieux</em> et <em>passionné</em> par les
            <em>nouvelles technologies</em>, j'aime
            <em>apprendre continuellement</em>,
            <em>relever de nouveaux défis</em> et
            <em>transformer des idées</em> en solutions concrètes.
          </p>
        </div>
      </section>

      <section class="panel panel--cta">
        <p class="u-mono" data-reveal>Une idée en tête ?</p>
        <a class="cta__link" href="/contact" data-link data-cursor="Écrire" data-reveal>
          <span class="u-hero">Travaillons<br />ensemble</span>
        </a>
      </section>
    `;
  }

  init() {
    // Le décor (cercles) est persistant et géré par App ; la page ne gère
    // que son contenu DOM (nom, intro, reveals).
    this._triggers = [];
    this._splits = [];

    this._prepareIntro();
    this._setupScrollReveals();
  }

  // Prépare l'intro (état caché). Jouée par reveal() après le preloader.
  _prepareIntro() {
    if (prefersReducedMotion()) return; // pas d'animation : tout reste visible

    // Découpe chaque ligne du nom en caractères (reveal masqué staggeré).
    const nameLines = this.el.querySelectorAll('.hero__line');
    this._splits = [...nameLines].map(
      (line) => new SplitText(line, { type: 'chars', charsClass: 'char' })
    );
    this._chars = this._splits.flatMap((s) => s.chars);

    // Même traitement pour les 3 lignes du statement (« Je code, je conçois, … »).
    const statementLines = this.el.querySelectorAll('.hero__statement-line');
    this._statementSplits = [...statementLines].map(
      (line) => new SplitText(line, { type: 'chars', charsClass: 'char' })
    );
    this._statementChars = this._statementSplits.flatMap((s) => s.chars);

    gsap.set(this._chars, { yPercent: 115 });
    gsap.set(this._statementChars, { yPercent: 115 });
  }

  // Joue l'animation d'entrée.
  reveal() {
    if (prefersReducedMotion() || !this._chars) return;

    gsap
      .timeline({ defaults: { ease: 'power4.out' } })
      .to(this._chars, { yPercent: 0, duration: 1, stagger: 0.022 })
      .to(
        this._statementChars,
        { yPercent: 0, duration: 0.9, stagger: 0.018 },
        '-=0.55'
      );
  }

  // Reveals au scroll des éléments [data-reveal].
  _setupScrollReveals() {
    const horizontal = this.context.isHorizontal;
    const items = this.el.querySelectorAll('[data-reveal]');

    items.forEach((item) => {
      gsap.set(item, { opacity: 0, [horizontal ? 'x' : 'y']: 40 });
      const trigger = ScrollTrigger.create({
        trigger: item,
        horizontal,
        start: horizontal ? 'left 85%' : 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(item, { opacity: 1, x: 0, y: 0, duration: 0.9, ease: 'power3.out' });
        },
      });
      this._triggers.push(trigger);
    });
  }

  destroy() {
    if (this._triggers) this._triggers.forEach((t) => t.kill());
    if (this._splits) this._splits.forEach((s) => s.revert());
    if (this._statementSplits) this._statementSplits.forEach((s) => s.revert());

    super.destroy();
  }
}
