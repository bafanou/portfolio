// =============================================================
//  math.js — fonctions mathématiques pures (interpolation, etc.)
// =============================================================

// Interpolation linéaire entre `a` et `b` selon `t` ∈ [0, 1].
export const lerp = (a, b, t) => a + (b - a) * t;

// Contraint `value` entre `min` et `max`.
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Re-mappe `value` de l'intervalle [inMin, inMax] vers [outMin, outMax].
export const map = (value, inMin, inMax, outMin, outMax) =>
  outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);

// Lissage type « lerp temporel » indépendant du framerate.
// `factor` ∈ [0, 1] (ex. 0.1), `dt` en ms.
export const damp = (a, b, factor, dt) => lerp(a, b, 1 - Math.pow(1 - factor, dt / 16.6667));

// Modulo positif (gère les valeurs négatives).
export const mod = (n, m) => ((n % m) + m) % m;

// Easings utiles (équivalents JS des courbes CSS).
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
