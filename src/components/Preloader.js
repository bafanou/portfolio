import gsap from 'gsap';

// =============================================================
//  Preloader — overlay de chargement.
//  Disques violets (rampe du design system) qui orbitent et se
//  chevauchent en boucle, + compteur 0→100 %. Sortie premium.
//  run() retourne une promesse résolue une fois l'overlay disparu.
// =============================================================

export default class Preloader {
  constructor() {
    this.el = document.createElement('div');
    this.el.className = 'preloader';
    this.el.innerHTML = `
      <div class="preloader__discs" data-discs>
        <span class="disc disc--deep"></span>
        <span class="disc disc--accent"></span>
        <span class="disc disc--mauve"></span>
      </div>
      <div class="preloader__meta">
        <span class="preloader__count u-mono"><span data-count>0</span>%</span>
      </div>`;
    document.body.appendChild(this.el);

    this.countEl = this.el.querySelector('[data-count]');
    this._progress = { value: 0 };
    this._loop = this._startLoop();
  }

  // Animation continue des disques (orbites désynchronisées + rotation douce).
  _startLoop() {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to('.disc--deep', { x: 42, y: -28, duration: 2.0, ease: 'sine.inOut' }, 0)
      .to('.disc--accent', { x: -38, y: 22, duration: 2.4, ease: 'sine.inOut' }, 0)
      .to('.disc--mauve', { x: 18, y: 38, duration: 1.8, ease: 'sine.inOut' }, 0);

    // Rotation lente de l'ensemble (indépendante, en boucle infinie).
    this._spin = gsap.to('[data-discs]', {
      rotate: 360,
      duration: 14,
      ease: 'none',
      repeat: -1,
    });

    return tl;
  }

  _render() {
    this.countEl.textContent = Math.round(this._progress.value * 100);
  }

  // loadPromise : promesse des assets critiques (peut être instantanée).
  async run(loadPromise = Promise.resolve()) {
    const minDuration = 0.8; // assez court pour ne pas faire attendre l'utilisateur
    const start = performance.now();

    gsap.to(this._progress, {
      value: 0.9,
      duration: minDuration,
      ease: 'power1.inOut',
      onUpdate: () => this._render(),
    });

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    await Promise.all([loadPromise, fontsReady]);

    const elapsed = (performance.now() - start) / 1000;
    if (elapsed < minDuration) {
      await new Promise((resolve) => setTimeout(resolve, (minDuration - elapsed) * 1000));
    }

    gsap.killTweensOf(this._progress);
    await gsap.to(this._progress, {
      value: 1,
      duration: 0.4,
      ease: 'power2.out',
      onUpdate: () => this._render(),
    });

    await this._exit();
  }

  async _exit() {
    // Les disques convergent au centre et grandissent, puis l'overlay s'efface.
    await gsap
      .timeline({ defaults: { ease: 'power3.inOut' } })
      .to('.disc', { x: 0, y: 0, scale: 1.6, duration: 0.6 }, 0)
      .to('.preloader__meta', { autoAlpha: 0, y: -16, duration: 0.4 }, 0)
      .to('.preloader__discs', { scale: 2.4, autoAlpha: 0, duration: 0.7 }, '-=0.2')
      .to(this.el, { autoAlpha: 0, duration: 0.5 }, '-=0.3');
    this.destroy();
  }

  destroy() {
    if (this._loop) this._loop.kill();
    if (this._spin) this._spin.kill();
    if (this.el && this.el.parentNode) this.el.parentNode.removeChild(this.el);
    this.el = null;
  }
}
