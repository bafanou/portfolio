import gsap from 'gsap';
import EventEmitter from './EventEmitter.js';

// =============================================================
//  Time — horloge UNIQUE de l'application.
//  On s'appuie sur gsap.ticker (un seul requestAnimationFrame pour
//  TOUT : GSAP, Lenis, rendu WebGL — cf. README, perf non négociable).
//  Émet 'tick' { delta, elapsed } à chaque frame.
// =============================================================

// Delta max (ms) : évite les sauts au retour d'onglet inactif.
const MAX_DELTA = 1000 / 30;

export default class Time extends EventEmitter {
  constructor() {
    super();

    this.elapsed = 0; // ms écoulées depuis le démarrage du ticker
    this.delta = 16; // ms depuis la frame précédente

    this._tick = this._tick.bind(this);

    // gsap.ticker est la seule source de rAF. lagSmoothing(0) = pas de
    // lissage artificiel du delta (on gère nous-mêmes le clamp).
    gsap.ticker.add(this._tick);
    gsap.ticker.lagSmoothing(0);
  }

  // Signature gsap.ticker : (time[s], deltaTime[ms], frame, elapsed[s]).
  _tick(time, deltaTime) {
    this.delta = Math.min(deltaTime, MAX_DELTA);
    this.elapsed = time * 1000; // s → ms (timestamp monotone pour Lenis)

    // Perf : on ne diffuse pas si l'onglet est masqué.
    if (document.visibilityState === 'visible') {
      this.emit('tick', { delta: this.delta, elapsed: this.elapsed });
    }
  }

  destroy() {
    gsap.ticker.remove(this._tick);
    super.destroy();
  }
}
