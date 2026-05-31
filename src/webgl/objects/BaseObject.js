// =============================================================
//  BaseObject — classe abstraite de tout objet WebGL.
//  Cycle de vie : init() → (update(dt))* → resize()? → destroy().
//  destroy() DOIT libérer geometry / material / textures (cf. README).
// =============================================================

export default class BaseObject {
  // scene  : THREE.Scene cible (passée en paramètre, jamais récupérée via le DOM).
  // sizes  : instance Sizes (dimensions + pixelRatio).
  // camera : instance Camera (utile pour les calculs plein écran).
  constructor({ scene, sizes = null, camera = null } = {}) {
    this.scene = scene;
    this.sizes = sizes;
    this.camera = camera;
    this.mesh = null;
  }

  // Crée geometry / material / mesh et ajoute à la scène. À surcharger.
  init() {}

  // Boucle d'animation. `state` = { mouse, scroll }. À surcharger.
  update(_delta, _elapsed, _state) {}

  // Recalcul sur resize (optionnel). À surcharger si besoin.
  resize() {}

  // Libère proprement les ressources GPU.
  destroy() {
    if (!this.mesh) return;

    if (this.scene) this.scene.remove(this.mesh);

    this.mesh.geometry?.dispose();

    const material = this.mesh.material;
    if (Array.isArray(material)) {
      material.forEach((m) => this._disposeMaterial(m));
    } else {
      this._disposeMaterial(material);
    }

    this.mesh = null;
  }

  // Dispose un material et ses textures éventuelles.
  _disposeMaterial(material) {
    if (!material) return;
    for (const value of Object.values(material)) {
      if (value && value.isTexture) value.dispose();
    }
    material.dispose();
  }
}
