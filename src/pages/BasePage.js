// =============================================================
//  BasePage — classe abstraite de toutes les pages.
//  Cycle de vie : mount() → init() → (update(dt))* → destroy().
//  Le Router se charge d'appeler mount() et destroy().
// =============================================================

export default class BasePage {
  // context : couche partagée (scene, camera, sizes, time, assets, app…).
  constructor({ params = {}, router = null, context = null } = {}) {
    this.params = params;
    this.router = router;
    this.context = context;
    this.el = null;
    this.name = this.constructor.name;
  }

  // Couleur(s) de fond de la page. Un seul stop = couleur unie ; plusieurs
  // = rampe traversée au scroll. App lisse la transition entre pages.
  get backgroundStops() {
    return ['#5C5792'];
  }

  // true = masque les cercles pêche du décor sur cette page.
  // Override sur les pages où l'image principale doit primer (ex. Project).
  get hideCircles() {
    return false;
  }

  // Retourne le markup HTML de la page. À surcharger.
  render() {
    return '';
  }

  // Crée l'élément racine, injecte le markup, puis appelle init().
  mount(container) {
    this.el = document.createElement('section');
    this.el.className = 'page';
    this.el.dataset.page = this.name.toLowerCase();
    this.el.innerHTML = this.render();
    container.appendChild(this.el);
    this.init();
  }

  // Hook : branchements d'events, animations d'entrée. À surcharger.
  init() {}

  // Hook : boucle d'animation (si la page s'abonne au 'tick' de Time). À surcharger.
  update(_dt) {}

  // Nettoyage : retire le DOM et libère les ressources. À étendre via super.destroy().
  destroy() {
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
    this.el = null;
  }
}
