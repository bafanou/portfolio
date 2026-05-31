import * as THREE from 'three';

// =============================================================
//  Scene — enveloppe d'une THREE.Scene + gestion des objets.
//  Chaque page peut posséder sa propre Scene (montée/démontée).
//  Diffuse update() et resize() à tous les objets enregistrés.
// =============================================================

export default class Scene {
  constructor() {
    this.instance = new THREE.Scene();
    this.objects = new Set(); // BaseObject enregistrés
  }

  // Enregistre un objet déjà initialisé (son mesh est ajouté dans son init()).
  add(object) {
    this.objects.add(object);
    return object;
  }

  remove(object) {
    object.destroy();
    this.objects.delete(object);
  }

  // state : { mouse: {x,y}, scroll: { progress, velocity } }
  update(delta, elapsed, state) {
    for (const object of this.objects) {
      object.update(delta, elapsed, state);
    }
  }

  resize() {
    for (const object of this.objects) {
      object.resize();
    }
  }

  // Libère tous les objets (appelé au démontage d'une page).
  dispose() {
    for (const object of this.objects) {
      object.destroy();
    }
    this.objects.clear();
  }
}
