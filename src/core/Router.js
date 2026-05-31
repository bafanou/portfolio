import EventEmitter from './EventEmitter.js';

// =============================================================
//  Router — routing SPA custom (aucun framework).
//  - Matching de routes statiques et dynamiques (/work/:slug).
//  - Interception des clics sur les liens internes (<a data-link>).
//  - Navigation via l'History API (pas de rechargement complet).
//  - Monte / démonte les pages proprement (init / destroy).
//
//  Émet 'before' { from, to } et 'after' { page, route, params }
//  → permettra de brancher les transitions shader en Phase 4.
// =============================================================

// Convertit un motif de route ('/work/:slug') en RegExp + liste de clés.
function compile(path) {
  const keys = [];
  const pattern = path
    .replace(/\/$/, '') // retire le slash final
    .replace(/:(\w+)/g, (_, key) => {
      keys.push(key);
      return '([^/]+)';
    });
  return { regex: new RegExp(`^${pattern || '/'}$`), keys };
}

export default class Router extends EventEmitter {
  // routes : [{ path: '/', Page: Home }, { path: '/work/:slug', Page: Project }]
  // container : élément DOM où monter les pages.
  // notFound : classe Page de secours (optionnelle).
  // context : objet partagé injecté dans chaque page (couche WebGL, sizes…).
  constructor({ routes, container, notFound = null, context = null }) {
    super();

    this.container = container;
    this.notFound = notFound;
    this.context = context;
    this.routes = routes.map((route) => ({ ...route, ...compile(route.path) }));

    this.currentPage = null;
    this.currentPath = null;

    // Vrai pendant le 1er rendu (preloader couvre déjà l'écran → pas de transition).
    this._initial = true;
    // Verrou : empêche de relancer une navigation tant qu'une autre est en cours.
    this._navigating = false;

    this._onClick = this._onClick.bind(this);
    this._onPopState = this._onPopState.bind(this);
  }

  // Démarre le router : écoute les clics + l'historique, puis rend la route courante.
  start() {
    document.addEventListener('click', this._onClick);
    window.addEventListener('popstate', this._onPopState);
    this._render(window.location.pathname, { replace: true });
  }

  // Trouve la route correspondant à `path` et extrait ses paramètres.
  _match(path) {
    const clean = path.replace(/\/+$/, '') || '/';
    for (const route of this.routes) {
      const result = route.regex.exec(clean);
      if (result) {
        const params = {};
        route.keys.forEach((key, i) => {
          params[key] = decodeURIComponent(result[i + 1]);
        });
        return { route, params };
      }
    }
    return null;
  }

  // Navigue vers `path` (met à jour l'URL puis rend).
  navigate(path, { replace = false } = {}) {
    if (this._navigating) return; // ignore les clics rapides
    if (path === this.currentPath) return;
    if (replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
    this._render(path, { replace });
  }

  // Monte la page correspondant à `path` (asynchrone : joue les transitions).
  async _render(path, _opts = {}) {
    if (this._navigating) return;
    this._navigating = true;

    const match = this._match(path);
    const Page = match ? match.route.Page : this.notFound;
    const params = match ? match.params : {};

    if (!Page) {
      console.warn(`[Router] Aucune route pour : ${path}`);
      this._navigating = false;
      return;
    }

    this.emit('before', { from: this.currentPath, to: path });

    // Pré-instancie la nouvelle page pour lire sa couleur de transition.
    // Le constructeur ne fait pas de travail lourd (init() vient après mount()).
    const newPage = new Page({ params, router: this, context: this.context });
    const transition = this.context && this.context.transition;
    const transitionColor =
      (newPage.backgroundStops && newPage.backgroundStops[0]) || '#9281C0';

    const isInitial = this._initial;
    this._initial = false;

    // ----- Phase IN (sauf au 1er chargement — le preloader couvre déjà) -----
    if (transition && !isInitial) await transition.playIn(transitionColor);

    // Démontage de la page précédente (sous l'overlay) + montage de la nouvelle.
    if (this.currentPage) {
      this.currentPage.destroy();
    }
    newPage.mount(this.container);
    this.currentPage = newPage;
    this.currentPath = path;

    this.emit('after', { page: newPage, route: match ? match.route : null, params });

    // ----- Phase OUT (retire l'overlay vers le coin opposé) -----
    if (transition && !isInitial) await transition.playOut();

    this._navigating = false;
  }

  // Intercepte les clics sur les liens internes.
  _onClick(event) {
    const link = event.target.closest('a[data-link], a[href^="/"]');
    if (!link) return;

    // Laisse passer : nouvel onglet, ancres, liens externes, target défini.
    const href = link.getAttribute('href');
    if (
      !href ||
      href.startsWith('http') ||
      href.startsWith('#') ||
      link.target === '_blank' ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }

    event.preventDefault();
    this.navigate(href);
  }

  _onPopState() {
    this._render(window.location.pathname);
  }

  destroy() {
    document.removeEventListener('click', this._onClick);
    window.removeEventListener('popstate', this._onPopState);
    if (this.currentPage) this.currentPage.destroy();
    super.destroy();
  }
}
