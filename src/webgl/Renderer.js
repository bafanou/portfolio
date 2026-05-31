import * as THREE from 'three';

// =============================================================
//  Renderer — wrapper du WebGLRenderer three.js.
//  RÈGLE ABSOLUE : UNE SEULE instance pour toute l'application.
//  Le canvas est créé par App et passé en paramètre (les classes
//  WebGL ne touchent jamais le DOM directement — cf. README).
// =============================================================

export default class Renderer {
  constructor({ canvas, sizes, clearColor = 0x0b0a12 }) {
    this.sizes = sizes;

    this.instance = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });

    this.instance.setClearColor(clearColor, 1);

    // Couleur réutilisable (évite une allocation par frame).
    this._clear = new THREE.Color();

    this.resize();
  }

  // Définit la couleur de fond à partir de composantes sRGB [0..1].
  setClearRGB(r, g, b) {
    this.instance.setClearColor(this._clear.setRGB(r, g, b, THREE.SRGBColorSpace), 1);
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    // pixelRatio déjà capé à 2 dans Sizes (perf non négociable).
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  render(scene, camera) {
    this.instance.render(scene, camera);
  }

  dispose() {
    this.instance.dispose();
  }
}
