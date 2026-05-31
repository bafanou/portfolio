import EventEmitter from './EventEmitter.js';

// =============================================================
//  Sizes — UN SEUL listener resize pour toute l'application.
//  Émet 'resize' { width, height, pixelRatio }.
//  Le pixelRatio est CAPÉ à 2 (cf. README, perf non négociable).
// =============================================================

export default class Sizes extends EventEmitter {
  constructor() {
    super();

    this._measure();

    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
  }

  _measure() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;
    // Capé à 2 partout (perf).
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
  }

  _onResize() {
    this._measure();
    this.emit('resize', {
      width: this.width,
      height: this.height,
      aspect: this.aspect,
      pixelRatio: this.pixelRatio,
    });
  }

  destroy() {
    window.removeEventListener('resize', this._onResize);
    super.destroy();
  }
}
