import * as THREE from 'three';
import BaseObject from './BaseObject.js';
import { isMobile } from '@/utils/device.js';

// =============================================================
//  Background — décor WebGL persistant (façon patrickheng).
//  Cercles sombres (#0B0A12) flottants sur le fond coloré.
//
//  IMPORTANT : composition pensée pour LAISSER LE CENTRE CLAIR
//  (les titres y vivent). Tous les cercles vivent sur les bords
//  (haut, bas, droite) ou hors-cadre, jamais dans la bande centrale.
//
//  - Drift continu (X/Y désynchronisé) + pulsation d'échelle.
//  - Parallaxe horizontale liée au scroll → continuité.
//  Objet UNIQUE jamais démonté entre les pages.
// =============================================================

// Pêche chaleureux : complémentaire chaud aux violets du fond.
// Verrouillé en design : ne pas remplacer sans demander.
const CIRCLE_COLOR = new THREE.Color('#f4b89a');

// Frustum visible à z=0 (aspect ~1.78) : x ∈ [-3.7, 3.7], y ∈ [-2.07, 2.07].
// Bande centrale réservée aux titres ≈ x ∈ [-2.5, 2.5], y ∈ [-1, 1].
// Tout ce qui suit est volontairement HORS de cette bande.
const LAYOUT = [
  // --- 1 ancre (gros cercle), POSITIONNÉE LOIN À DROITE, partiellement hors-cadre ---
  { x: 4.6, y: 0.0, z: -0.3, r: 1.4, parallax: 3.4, speedY: 0.18, ampY: 0.18, ampX: 0, pulse: 0 },

  // --- 2 accents moyens, en hauteur ou en bas, sur les bords ---
  { x: -3.3, y: 1.45, z: 0.3, r: 0.5, parallax: 1.0, speedY: 0.32, ampY: 0.22, ampX: 0.08, pulse: 0.05 },
  { x: 3.1, y: -1.65, z: -0.2, r: 0.55, parallax: 2.6, speedY: 0.4, ampY: 0.22, ampX: 0.1, pulse: 0.05 },

  // --- Petites boules sur la BANDE HAUTE ---
  { x: -1.9, y: 1.8, z: 0.4, r: 0.2, parallax: 1.2, speedY: 0.7, ampY: 0.28, ampX: 0.14, pulse: 0.06 },
  { x: 0.6, y: 1.95, z: -0.3, r: 0.14, parallax: 1.5, speedY: 0.9, ampY: 0.32, ampX: 0.16, pulse: 0.05 },
  { x: 2.4, y: 1.7, z: 0.2, r: 0.22, parallax: 2.0, speedY: 0.6, ampY: 0.28, ampX: 0.12, pulse: 0.06 },

  // --- Petites boules sur la BANDE BASSE ---
  { x: -2.8, y: -1.75, z: 0.4, r: 0.18, parallax: 1.1, speedY: 0.75, ampY: 0.28, ampX: 0.14, pulse: 0.05 },
  { x: -1.2, y: -1.9, z: 0.1, r: 0.16, parallax: 1.4, speedY: 0.9, ampY: 0.32, ampX: 0.16, pulse: 0.06 },
  { x: 1.6, y: -1.85, z: 0.3, r: 0.25, parallax: 2.1, speedY: 0.55, ampY: 0.22, ampX: 0.1, pulse: 0.05 },

  // --- Une petite au loin à droite (équilibre) ---
  { x: 6.2, y: -0.7, z: -0.5, r: 0.3, parallax: 4.0, speedY: 0.5, ampY: 0.22, ampX: 0.08, pulse: 0.05 },
];

// Disposition allégée pour mobile (4 cercles).
const LAYOUT_MOBILE = [LAYOUT[0], LAYOUT[3], LAYOUT[6], LAYOUT[8]];

export default class Background extends BaseObject {
  init() {
    this.group = new THREE.Group();
    this.circles = [];

    // Géométrie partagée (réutilisée, mise à l'échelle par cercle) → perf.
    this._geometry = new THREE.CircleGeometry(1, 64);

    const layout = isMobile() ? LAYOUT_MOBILE : LAYOUT;

    layout.forEach((def) => {
      const material = new THREE.MeshBasicMaterial({ color: CIRCLE_COLOR });
      const circle = new THREE.Mesh(this._geometry, material);
      circle.position.set(def.x, def.y, def.z);
      circle.scale.setScalar(def.r);
      circle.userData = {
        ...def,
        phaseY: Math.random() * Math.PI * 2,
        phaseX: Math.random() * Math.PI * 2,
        phaseP: Math.random() * Math.PI * 2,
      };
      this.group.add(circle);
      this.circles.push(circle);
    });

    this.scene.add(this.group);
    this.mesh = this.group;
  }

  update(_delta, elapsed, state) {
    // Visibilité globale (certaines pages cachent les cercles → focus image).
    this.group.visible = state ? state.showCircles !== false : true;
    if (!this.group.visible) return;

    const t = elapsed * 0.001;
    const progress = state && state.scroll ? state.scroll.progress : 0;
    const mouse = state && state.mouse ? state.mouse : { x: 0, y: 0 };

    this.circles.forEach((circle) => {
      const u = circle.userData;
      circle.position.y = u.y + Math.sin(t * u.speedY + u.phaseY) * u.ampY;
      circle.position.x =
        u.x - progress * u.parallax + Math.sin(t * u.speedY * 0.7 + u.phaseX) * u.ampX;
      if (u.pulse > 0) {
        const s = u.r * (1 + Math.sin(t * 1.6 + u.phaseP) * u.pulse);
        circle.scale.setScalar(s);
      }
    });

    // Parallaxe souris très subtil sur l'ensemble.
    this.group.position.x = mouse.x * 0.06;
    this.group.position.y = mouse.y * 0.06;
  }

  destroy() {
    this.circles.forEach((circle) => circle.material.dispose());
    this._geometry.dispose();
    if (this.scene) this.scene.remove(this.group);
    this.circles = [];
    this.mesh = null;
  }
}
