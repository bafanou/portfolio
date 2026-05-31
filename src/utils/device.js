// =============================================================
//  device.js — détection device / capacités.
//  Sert à décider : WebGL complet vs simplifié, scroll
//  horizontal (desktop) vs vertical natif (mobile).
// =============================================================

// Breakpoint mobile aligné sur le SCSS ($breakpoints 'mobile').
const MOBILE_MAX = 768;

// Pointeur tactile sans souris fine ?
export const isTouch = () =>
  window.matchMedia('(hover: none) and (pointer: coarse)').matches;

// Largeur sous le breakpoint mobile ?
export const isMobile = () => window.innerWidth < MOBILE_MAX;

// L'utilisateur préfère-t-il moins d'animations ?
export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mode dev (Vite) — pour activer lil-gui / stats.js.
export const isDev = import.meta.env.DEV;
