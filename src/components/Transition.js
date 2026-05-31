import gsap from 'gsap';

// =============================================================
//  Transition — overlay de transition de page.
//  Une couleur balaie l'écran depuis le coin BAS-GAUCHE (clip-path
//  circle) puis se retire vers le coin OPPOSÉ (haut-droite) une fois
//  la nouvelle page montée. La couleur est celle de la page d'arrivée.
//  Appelé par le Router : playIn(color) → swap page → playOut().
// =============================================================

// Durées (s). Total ~1.4s par navigation.
const DUR_IN = 0.7;
const DUR_OUT = 0.7;

export default class Transition {
  constructor() {
    this.el = document.createElement('div');
    this.el.className = 'transition';
    this.el.innerHTML = '<div class="transition__shape" data-shape></div>';
    document.body.appendChild(this.el);

    this.shape = this.el.querySelector('[data-shape]');

    // État initial : invisible.
    gsap.set(this.el, { autoAlpha: 0 });
    gsap.set(this.shape, { clipPath: 'circle(0% at 0% 100%)' });
  }

  // Phase IN : la couleur envahit l'écran depuis le coin bas-gauche.
  async playIn(color) {
    gsap.set(this.shape, {
      backgroundColor: color,
      clipPath: 'circle(0% at 0% 100%)',
    });
    gsap.set(this.el, { autoAlpha: 1 });

    await gsap.to(this.shape, {
      clipPath: 'circle(160% at 0% 100%)',
      duration: DUR_IN,
      ease: 'power3.inOut',
    });
  }

  // Phase OUT : l'overlay se rétracte vers le coin opposé (haut-droite),
  // révélant la nouvelle page.
  async playOut() {
    await gsap.to(this.shape, {
      clipPath: 'circle(0% at 100% 0%)',
      duration: DUR_OUT,
      ease: 'power3.inOut',
    });
    gsap.set(this.el, { autoAlpha: 0 });
  }

  destroy() {
    if (this.el && this.el.parentNode) this.el.parentNode.removeChild(this.el);
  }
}
