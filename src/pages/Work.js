import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BasePage from './BasePage.js';
import { projects } from '@/data/projects.js';

gsap.registerPlugin(ScrollTrigger);

// =============================================================
//  Work (/work) — un PROJET par PANNEAU (scroll horizontal).
//  Chaque panneau : index, miniature (placeholder si pas d'image),
//  grand titre, sous-titre, rôle/année. Lien vers le détail.
// =============================================================

export default class Work extends BasePage {
  // Arrivée sur Work : transition vers le mauve clair, scroll vers l'accent.
  get backgroundStops() {
    return ['#BE9CC7', '#9281C0'];
  }

  render() {
    const total = projects.length;
    const panels = projects
      .map((p, i) => {
        const num = String(i + 1).padStart(2, '0');
        const tot = String(total).padStart(2, '0');

        // Toutes les images du projet (cover + galerie) empilées dans le média.
        // Seule la 1re est visible au départ ; le slideshow alterne par crossfade.
        const allImages = [p.cover, ...(p.gallery || [])].filter(Boolean);
        const imagesMarkup = allImages
          .map(
            (src, idx) =>
              `<img class="project__img${idx === 0 ? ' is-active' : ''}" src="${src}" alt="${p.title} — vue ${idx + 1}" onerror="this.remove()" loading="lazy" />`
          )
          .join('');

        return `
          <section class="panel panel--project">
            <a class="project" href="/work/${p.slug}" data-link data-cursor="Voir">
              <span class="u-mono project__index" data-reveal>${num} / ${tot}</span>

              <div class="project__media" data-reveal data-slideshow="${allImages.length}">
                ${imagesMarkup}
                <span class="u-mono project__media-label">${p.category}</span>
              </div>

              <h2 class="project__title" data-reveal>${p.title}</h2>
              <p class="project__sub" data-reveal>${p.subtitle}</p>
              <span class="u-mono project__meta" data-reveal>${p.role}</span>
            </a>
          </section>`;
      })
      .join('');

    return panels;
  }

  init() {
    this._triggers = [];
    this._intervals = [];
    this._setupReveals();
    this._setupSlideshows();
  }

  // Slideshow : alterne les images de chaque projet avec crossfade.
  // Désynchronisé d'un projet à l'autre pour un rythme plus vivant.
  _setupSlideshows() {
    const medias = this.el.querySelectorAll('[data-slideshow]');
    medias.forEach((media, panelIdx) => {
      const imgs = media.querySelectorAll('.project__img');
      if (imgs.length <= 1) return;

      let idx = 0;
      // Décale le démarrage par panneau (évite que tout cycle en même temps).
      const delay = 4000;
      const stagger = (panelIdx * 600) % delay;

      const start = setTimeout(() => {
        const id = setInterval(() => {
          imgs[idx].classList.remove('is-active');
          idx = (idx + 1) % imgs.length;
          imgs[idx].classList.add('is-active');
        }, delay);
        this._intervals.push(id);
      }, stagger);
      // Stocke aussi le setTimeout au cas où la page se démonte avant son tick.
      this._intervals.push(start);
    });
  }

  // Reveal au scroll : chaque élément [data-reveal] apparaît quand son
  // panneau entre dans le viewport horizontal.
  _setupReveals() {
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
    if (this._intervals) {
      this._intervals.forEach((id) => {
        clearInterval(id);
        clearTimeout(id);
      });
    }
    super.destroy();
  }
}
