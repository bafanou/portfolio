import { damp } from '@/utils/math.js';

// =============================================================
//  Cursor — curseur custom qui suit le pointeur avec lissage (lerp).
//  S'agrandit au survol des éléments interactifs ; affiche un label
//  contextuel via l'attribut [data-cursor]. Désactivé sur tactile.
// =============================================================

export default class Cursor {
  // time : instance Time (abonnement au tick). getPointer : () => {x, y} en px.
  constructor({ time, getPointer }) {
    this.time = time;
    this.getPointer = getPointer;

    this.el = document.createElement('div');
    this.el.className = 'cursor';
    this.el.innerHTML = '<span class="cursor__label" data-label></span>';
    document.body.appendChild(this.el);
    this.labelEl = this.el.querySelector('[data-label]');

    // Masque le curseur natif tant que le curseur custom est actif.
    document.documentElement.classList.add('has-cursor');

    const p = getPointer();
    this.pos = { x: p.x, y: p.y };

    this._tick = this._tick.bind(this);
    this._onOver = this._onOver.bind(this);
    this._onOut = this._onOut.bind(this);

    this._unsub = this.time.on('tick', this._tick);
    document.addEventListener('pointerover', this._onOver);
    document.addEventListener('pointerout', this._onOut);
  }

  _tick({ delta }) {
    const target = this.getPointer();
    this.pos.x = damp(this.pos.x, target.x, 0.2, delta);
    this.pos.y = damp(this.pos.y, target.y, 0.2, delta);
    this.el.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0) translate(-50%, -50%)`;
  }

  _onOver(event) {
    const target = event.target.closest('a, button, [data-cursor]');
    if (!target) return;
    this.el.classList.add('is-active');
    const label = target.getAttribute('data-cursor');
    if (label) {
      this.labelEl.textContent = label;
      this.el.classList.add('has-label');
    }
  }

  _onOut(event) {
    const target = event.target.closest('a, button, [data-cursor]');
    if (!target) return;
    this.el.classList.remove('is-active', 'has-label');
    this.labelEl.textContent = '';
  }

  destroy() {
    if (this._unsub) this._unsub();
    document.removeEventListener('pointerover', this._onOver);
    document.removeEventListener('pointerout', this._onOut);
    document.documentElement.classList.remove('has-cursor');
    if (this.el && this.el.parentNode) this.el.parentNode.removeChild(this.el);
  }
}
