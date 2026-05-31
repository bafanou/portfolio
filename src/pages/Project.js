import gsap from 'gsap';
import BasePage from './BasePage.js';
import { getProjectBySlug } from '@/data/projects.js';
import { prefersReducedMotion } from '@/utils/device.js';

// =============================================================
//  Project (/work/:slug) — détail d'un projet.
//  Layout inspiré de patrickheng.com : fond crème côté image,
//  panneau coloré (accent) à droite, titre en bandes surlignées.
// =============================================================

export default class Project extends BasePage {
  get backgroundStops() {
    return ['#9281C0', '#5C5792'];
  }

  // Cache les cercles pêche du décor → focus total sur l'image du projet.
  get hideCircles() {
    return true;
  }

  render() {
    const project = getProjectBySlug(this.params.slug);

    if (!project) {
      return `
        <section class="panel">
          <p class="u-mono">404</p>
          <h1 class="u-hero">Projet introuvable</h1>
          <a href="/work" data-link data-cursor="Retour">← Retour au Work</a>
        </section>
      `;
    }

    // Mapping clé → libellé pour les liens externes.
    const LINK_LABELS = {
      live: 'Voir le site',
      figma: 'Voir la maquette Figma',
      video: 'Voir la vidéo',
      github: 'Voir le code',
    };
    const links = [];
    for (const [key, label] of Object.entries(LINK_LABELS)) {
      const url = project.links?.[key];
      if (url) {
        links.push(
          `<a class="detail__link" href="${url}" target="_blank" rel="noopener noreferrer" data-cursor="${label}">${label} ↗</a>`
        );
      }
    }
    const linksMarkup = links.length
      ? `<div class="detail__links">${links.join('')}</div>`
      : '';

    const stackLine = project.stack.length
      ? `<p class="detail__stack u-mono">Stack · ${project.stack.join(' · ')}</p>`
      : '';

    // Triangles décoratifs animés autour de l'image (cream area).
    // Tailles + variées (40 → 110 px), opacités hautes pour bien ressortir.
    const TRIANGLES = [
      { x: '3%', y: '5%', size: 80, rot: 18, op: 0.9 },
      { x: '85%', y: '8%', size: 110, rot: -22, op: 0.8 },
      { x: '1%', y: '44%', size: 60, rot: 42, op: 0.95 },
      { x: '93%', y: '50%', size: 90, rot: -12, op: 0.85 },
      { x: '8%', y: '84%', size: 70, rot: 30, op: 0.9 },
      { x: '82%', y: '85%', size: 85, rot: -38, op: 0.85 },
      { x: '40%', y: '2%', size: 55, rot: 60, op: 0.95 },
      { x: '50%', y: '93%', size: 50, rot: -50, op: 0.9 },
    ];
    const trianglesMarkup = TRIANGLES.map(
      (t) =>
        `<span class="detail__triangle" data-rot="${t.rot}" style="top:${t.y};left:${t.x};--tri-size:${t.size}px;--tri-op:${t.op};"></span>`
    ).join('');

    return `
      <section class="panel panel--detail">
        <div class="detail__media">
          <div class="detail__triangles" aria-hidden="true">${trianglesMarkup}</div>

          <div class="detail__media-frame">
            <img class="detail__img" src="${project.cover}" alt="${project.title}" onerror="this.remove()" />
            <div class="detail__media-placeholder" aria-hidden="true">
              <span class="u-mono detail__media-cat">${project.category}</span>
              <span class="detail__media-name">${project.title}</span>
            </div>
          </div>
        </div>

        <aside class="detail__info">
          <a class="detail__close" href="/work" data-link data-cursor="Fermer" aria-label="Fermer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </a>

          <div class="detail__inner">
            <p class="u-mono detail__cat">${project.category}</p>

            <h1 class="detail__title">
              <span class="detail__title-band">${project.title}</span>
            </h1>

            <p class="detail__sub">${project.subtitle}</p>

            <p class="detail__description">${project.description}</p>

            ${stackLine}
            ${linksMarkup}
          </div>
        </aside>
      </section>
    `;
  }

  init() {
    this._setupTriangles();
  }

  // Petits triangles flottants dans la zone crème autour de l'image
  // → décor vivant et premium, sans toucher à l'image elle-même.
  _setupTriangles() {
    if (prefersReducedMotion()) return;
    const triangles = this.el.querySelectorAll('.detail__triangle');
    this._triTweens = [];

    triangles.forEach((tri, i) => {
      const baseRot = parseFloat(tri.dataset.rot) || 0;
      gsap.set(tri, { rotation: baseRot, x: 0, y: 0 });

      const tween = gsap.to(tri, {
        x: gsap.utils.random(-25, 25),
        y: gsap.utils.random(-22, 22),
        rotation: baseRot + gsap.utils.random(-25, 25),
        duration: gsap.utils.random(5.5, 9),
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.25, // décalage = mouvement organique (pas en phase)
      });
      this._triTweens.push(tween);
    });
  }

  destroy() {
    if (this._triTweens) this._triTweens.forEach((t) => t.kill());
    super.destroy();
  }
}
