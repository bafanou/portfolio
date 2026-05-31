import * as THREE from 'three';

// =============================================================
//  Camera — caméra perspective principale + comportements.
//  (Parallaxe curseur, recul au scroll : ajoutés en Phase 3.)
// =============================================================

export default class Camera {
  constructor({ sizes, fov = 45, near = 0.1, far = 100 }) {
    this.sizes = sizes;

    this.instance = new THREE.PerspectiveCamera(fov, sizes.aspect, near, far);
    this.instance.position.set(0, 0, 5);
    this.instance.lookAt(0, 0, 0);
  }

  resize() {
    this.instance.aspect = this.sizes.aspect;
    this.instance.updateProjectionMatrix();
  }

  // Pas de ressource GPU à libérer pour une caméra ; présent par symétrie.
  dispose() {}
}
