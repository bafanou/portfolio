import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Time from '@/core/Time.js';
import Sizes from '@/core/Sizes.js';
import Router from '@/core/Router.js';
import AssetLoader from '@/core/AssetLoader.js';
import Renderer from '@/webgl/Renderer.js';
import Camera from '@/webgl/Camera.js';
import Scene from '@/webgl/Scene.js';
import Background from '@/webgl/objects/Background.js';
import Navigation from '@/components/Navigation.js';
import Preloader from '@/components/Preloader.js';
import Transition from '@/components/Transition.js';
import Home from '@/pages/Home.js';
import Work from '@/pages/Work.js';
import Project from '@/pages/Project.js';
import About from '@/pages/About.js';
import Contact from '@/pages/Contact.js';
import { isDev, isMobile } from '@/utils/device.js';

gsap.registerPlugin(ScrollTrigger);

// =============================================================
//  App — orchestrateur principal.
//  Possède les singletons globaux + la couche WebGL partagée.
//  - UNE seule horloge (Time/gsap.ticker) : Lenis → page → scène → rendu.
//  - UN seul resize (Sizes) : caméra → renderer → scène → ScrollTrigger.
//  - UN seul mousemove global : pointeur (px) + souris normalisée (shaders).
//  - Scroll HORIZONTAL desktop (Lenis), vertical natif sur mobile.
// =============================================================

export default class App {
  constructor(root) {
    this.root = root; // [data-app]
    this.pageContainer = root.querySelector('[data-page]');

    this.isHorizontal = !isMobile(); // mode de scroll décidé au chargement
    document.documentElement.classList.add(this.isHorizontal ? 'is-horizontal' : 'is-vertical');

    // ----- Singletons globaux -----
    this.time = new Time();
    this.sizes = new Sizes();
    this.assets = new AssetLoader();

    // États partagés (lus par le shader hero notamment).
    this.pointer = { x: this.sizes.width / 2, y: this.sizes.height / 2 };
    this.mouse = { x: 0, y: 0 }; // normalisé [-1, 1]
    this.scroll = { progress: 0, velocity: 0 };

    // Fond coloré (rampe violette douce) piloté par le scroll.
    this._bgStops = ['#5C5792', '#9281C0', '#BE9CC7'].map((h) => this._hexToRgb(h));
    this._bgCurrent = this._hexToRgb('#5C5792');
    this._bgLight = false;

    // Visibilité des cercles du décor (chaque page peut décider).
    this.showCircles = true;

    // ----- Couche WebGL (instances UNIQUES) -----
    this._initWebGL();

    // ----- Smooth scroll -----
    this._initScroll();

    // ----- Composants persistants -----
    this.nav = new Navigation({ root: document.body, app: this });
    // Curseur custom désactivé : on garde le curseur natif du navigateur.
    this.cursor = null;
    // Overlay de transition de page (couleur différente par destination).
    this.transition = new Transition();

    // ----- Router (reçoit `this` comme contexte partagé) -----
    this._initRouter();

    // ----- Boucles centralisées -----
    this._bindEvents();

    if (isDev) window.__APP__ = this;

    // ----- Preloader puis démarrage -----
    this.preloader = new Preloader();
    this._start();
  }

  _initWebGL() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'webgl';
    this.root.prepend(this.canvas); // derrière le contenu DOM

    this.camera = new Camera({ sizes: this.sizes });
    this.renderer = new Renderer({ canvas: this.canvas, sizes: this.sizes });
    this.scene = new Scene();

    // Décor persistant (cercles), commun à toutes les pages → continuité.
    this.background = new Background({
      scene: this.scene.instance,
      sizes: this.sizes,
      camera: this.camera,
    });
    this.background.init();
    this.scene.add(this.background);
  }

  // Hex '#RRGGBB' → [r, g, b] sRGB ∈ [0, 1].
  _hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  // Interpole une rampe de couleurs selon p ∈ [0, 1].
  _rampColor(stops, p) {
    if (stops.length === 1) return stops[0];
    const x = Math.min(Math.max(p, 0), 1) * (stops.length - 1);
    const i = Math.min(Math.floor(x), stops.length - 2);
    const f = x - i;
    const a = stops[i];
    const b = stops[i + 1];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  }

  // Met à jour la couleur de fond (suivi lissé) + bascule du contraste texte.
  _updateBackground(delta) {
    const target = this._rampColor(this._bgStops, this.scroll.progress);
    const a = 1 - Math.pow(1 - 0.08, delta / 16.67); // lissage indépendant du fps
    const cur = this._bgCurrent;
    cur[0] += (target[0] - cur[0]) * a;
    cur[1] += (target[1] - cur[1]) * a;
    cur[2] += (target[2] - cur[2]) * a;
    this.renderer.setClearRGB(cur[0], cur[1], cur[2]);

    // Contraste : texte sombre sur fond clair, off-white sinon.
    const lum = 0.2126 * cur[0] + 0.7152 * cur[1] + 0.0722 * cur[2];
    const light = lum > 0.42;
    if (light !== this._bgLight) {
      this._bgLight = light;
      document.documentElement.dataset.bg = light ? 'light' : 'dark';
    }
  }

  _initScroll() {
    if (!this.isHorizontal) {
      // Mobile : scroll vertical natif. On suit juste la progression.
      this._onNativeScroll = () => {
        const max = document.documentElement.scrollHeight - this.sizes.height;
        this.scroll.progress = max > 0 ? window.scrollY / max : 0;
      };
      window.addEventListener('scroll', this._onNativeScroll, { passive: true });
      return;
    }

    // Desktop : Lenis en mode HORIZONTAL (droite → gauche au scroll).
    this.lenis = new Lenis({
      orientation: 'horizontal',
      gestureOrientation: 'both',
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
    });

    // Synchro obligatoire avec ScrollTrigger.
    this.lenis.on('scroll', () => {
      this.scroll.progress = this.lenis.progress || 0;
      this.scroll.velocity = this.lenis.velocity || 0;
      ScrollTrigger.update();
    });
  }

  _initRouter() {
    this.router = new Router({
      container: this.pageContainer,
      context: this, // les pages accèdent à scene, camera, sizes, assets, scroll…
      routes: [
        { path: '/', Page: Home },
        { path: '/work', Page: Work },
        { path: '/work/:slug', Page: Project },
        { path: '/about', Page: About },
        { path: '/contact', Page: Contact },
      ],
      notFound: Home,
    });

    this.router.on('after', ({ page }) => {
      this.nav.setActive(this.router.currentPath);
      // Nouvelle gamme de couleurs de fond → transition douce (suivi lissé).
      if (page.backgroundStops) {
        this._bgStops = page.backgroundStops.map((h) => this._hexToRgb(h));
      }
      // Visibilité des cercles du décor (Project page les cache).
      this.showCircles = !page.hideCircles;
      // Nom de page exposé en data-attribute → CSS peut adapter (ex. hide scroll).
      document.documentElement.dataset.pageName = page.constructor.name.toLowerCase();
      // Recalcule les triggers après changement de contenu.
      ScrollTrigger.refresh();
      if (this.lenis) this.lenis.scrollTo(0, { immediate: true });
      // Reveal immédiat lors des navigations (le 1er chargement passe par le preloader).
      if (!this._firstLoad && page.reveal) page.reveal();
    });
  }

  _bindEvents() {
    // Boucle d'animation UNIQUE.
    this.time.on('tick', ({ delta, elapsed }) => {
      if (this.lenis) this.lenis.raf(elapsed);
      if (this.router.currentPage) this.router.currentPage.update(delta);
      this.scene.update(delta, elapsed, {
        mouse: this.mouse,
        scroll: this.scroll,
        showCircles: this.showCircles,
      });
      this._updateBackground(delta);
      this.renderer.render(this.scene.instance, this.camera.instance);
    });

    // Resize UNIQUE.
    this.sizes.on('resize', () => {
      this.camera.resize();
      this.renderer.resize();
      this.scene.resize();
      if (this.lenis) this.lenis.resize();
      ScrollTrigger.refresh();
    });

    // Mousemove global UNIQUE.
    this._onPointerMove = this._onPointerMove.bind(this);
    window.addEventListener('mousemove', this._onPointerMove, { passive: true });
  }

  _onPointerMove(event) {
    this.pointer.x = event.clientX;
    this.pointer.y = event.clientY;
    this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
    this.mouse.y = -((event.clientY / this.sizes.height) * 2 - 1);
  }

  async _start() {
    this._firstLoad = true;
    this.router.start(); // monte Home (intro en attente)

    // Aucun asset critique lourd pour l'instant (hero procédural) :
    // le preloader attend surtout les polices + une durée minimale.
    await this.preloader.run(this.assets.load([]));

    this._firstLoad = false;
    ScrollTrigger.refresh();
    if (this.router.currentPage && this.router.currentPage.reveal) {
      this.router.currentPage.reveal();
    }
  }

  destroy() {
    window.removeEventListener('mousemove', this._onPointerMove);
    if (this._onNativeScroll) window.removeEventListener('scroll', this._onNativeScroll);
    this.router.destroy();
    this.nav.destroy();
    if (this.cursor) this.cursor.destroy();
    if (this.transition) this.transition.destroy();
    if (this.lenis) this.lenis.destroy();
    ScrollTrigger.getAll().forEach((t) => t.kill());
    this.scene.dispose();
    this.renderer.dispose();
    this.camera.dispose();
    this.assets.dispose();
    this.time.destroy();
    this.sizes.destroy();
    if (this.canvas && this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
  }
}
