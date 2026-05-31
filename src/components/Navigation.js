// =============================================================
//  Navigation — chrome persistant (hors scroll track).
//  - Brand en haut à gauche.
//  - Menu en bas à gauche (liens [data-link] interceptés par le Router).
//  - Bouton flèche en bas à droite : indique le scroll horizontal et,
//    au clic, fait défiler d'un panneau (Lenis sur desktop, natif sinon).
// =============================================================

const LINKS = [
  ['/work', 'Work'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

export default class Navigation {
  // app : référence à l'orchestrateur (pour Lenis / scrollTo).
  constructor({ root = document.body, app = null } = {}) {
    this.app = app;

    this.el = document.createElement('nav');
    this.el.className = 'nav';
    this.el.innerHTML = `
      <a class="nav__brand" href="/" data-link data-cursor="Accueil">BAF</a>

      <ul class="nav__menu">
        ${LINKS.map(
          ([href, label]) =>
            `<li><a href="${href}" data-link data-cursor="${label}">${label}</a></li>`
        ).join('')}
      </ul>

      <button class="nav__scroll" type="button" data-scroll-next aria-label="Faire défiler">
        <svg class="nav__scroll-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle class="nav__scroll-ring-bg" cx="50" cy="50" r="46" />
          <circle class="nav__scroll-ring-fg" cx="50" cy="50" r="46" data-progress />
        </svg>
        <svg class="nav__scroll-arrow" viewBox="0 0 32 32" aria-hidden="true">
          <line x1="8" y1="16" x2="22" y2="16" />
          <polyline points="17,11 22,16 17,21" />
        </svg>
      </button>`;
    root.appendChild(this.el);

    this.scrollBtn = this.el.querySelector('[data-scroll-next]');
    this._onScrollClick = this._onScrollClick.bind(this);
    this.scrollBtn.addEventListener('click', this._onScrollClick);

    // Anneau de progression : remplit le cercle au fur et à mesure du scroll.
    this._progressRing = this.el.querySelector('[data-progress]');
    if (this._progressRing) {
      this._ringLength = 2 * Math.PI * 46; // circonférence du cercle (r=46)
      this._progressRing.style.strokeDasharray = this._ringLength;
      this._progressRing.style.strokeDashoffset = this._ringLength;

      if (this.app && this.app.time) {
        this._unsubProgress = this.app.time.on('tick', () => {
          const raw = (this.app.scroll && this.app.scroll.progress) || 0;
          const p = Math.min(Math.max(raw, 0), 1);
          this._progressRing.style.strokeDashoffset = this._ringLength * (1 - p);
        });
      }
    }
  }

  // Fait avancer le scroll d'un panneau (axe X desktop, Y mobile).
  _onScrollClick() {
    const app = this.app;
    if (app && app.lenis) {
      app.lenis.scrollTo(app.lenis.scroll + window.innerWidth, { duration: 1.1 });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  }

  setActive(path) {
    this.el.querySelectorAll('.nav__menu a').forEach((a) => {
      const href = a.getAttribute('href');
      const active = href === path || (href === '/work' && path.startsWith('/work'));
      a.classList.toggle('is-active', active);
    });
  }

  destroy() {
    this.scrollBtn.removeEventListener('click', this._onScrollClick);
    if (this._unsubProgress) this._unsubProgress();
    if (this.el && this.el.parentNode) this.el.parentNode.removeChild(this.el);
  }
}
