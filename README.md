# Portfolio — Creative Developer

> Portfolio premium inspiré de [patrickheng.com](https://patrickheng.com) — WebGL immersif, animations cinématiques, expérience interactive de niveau Awwwards / FWA.

**Auteur** : Benoît Anthime FANOU
**Statut** : En développement
**Référence visuelle principale** : https://patrickheng.com

---

## Vision

Construire un portfolio creative developer haut de gamme, mettant en scène :

- Une expérience WebGL immersive en page d'accueil (scène 3D interactive avec shaders custom).
- Des transitions de page fluides en shader (distorsion, fade GLSL plein écran).
- Un smooth scroll "beurre" sur l'ensemble du site (Lenis).
- Une galerie de projets avec hover effects WebGL (plane + transition shader).
- Un design éditorial soigné (typographie large, beaucoup de blanc/négatif, animations subtiles).

**Public cible** : recruteurs tech pour alternance, agences créatives, clients freelance, partenaires entrepreneuriaux.

---

## Stack technique

### Core
- **Build tool** : Vite
- **Langage** : JavaScript (ES2022+) — pas de TypeScript pour cette V1.
- **Styling** : SCSS avec architecture 7-1 (abstracts, base, components, layout, pages, themes, vendors).

### WebGL / 3D
- **three** (v0.160+) — moteur 3D principal.
- **vite-plugin-glsl** — pour importer les shaders `.glsl` proprement.
- **postprocessing** — effets post-process (bloom, RGB shift, custom passes).
- Chargement des modèles 3D via `GLTFLoader` natif three.js.

### Animation & Scroll
- **gsap** + **gsap/ScrollTrigger** — toutes les animations DOM et timelines orchestrées.
- **gsap/SplitText** (ou alternative open-source `split-type`) — reveal de texte caractère par caractère.
- **lenis** (Studio Freight) — smooth scroll natif, synchronisé avec ScrollTrigger.

### Utilities (dev only)
- **lil-gui** — debug GUI (visible uniquement en mode dev).
- **stats.js** — moniteur FPS (dev only).

### Interdictions explicites (pour Claude Code)
- Pas de React / Vue / Svelte / Solid (vanilla pur).
- Pas de jQuery.
- Pas de Tailwind / Bootstrap / Bulma (CSS écrit à la main en SCSS).
- Pas de TypeScript pour la V1 (peut être migré plus tard).
- Pas de Next.js / Nuxt / Astro.

---

## Structure du projet

```
portfolio/
├── public/
│   ├── fonts/                  # Typos custom (WOFF2)
│   ├── images/                 # Posters projets, OG images
│   ├── models/                 # Fichiers GLTF/GLB
│   └── textures/               # Textures pour shaders
│
├── src/
│   ├── main.js                 # Point d'entrée
│   ├── App.js                  # Orchestrateur principal
│   │
│   ├── webgl/                  # Tout le WebGL
│   │   ├── Renderer.js         # Wrapper three.js renderer (UNE SEULE INSTANCE)
│   │   ├── Camera.js           # Caméra + comportements
│   │   ├── Scene.js            # Scène principale
│   │   ├── objects/            # Meshes custom
│   │   │   ├── BaseObject.js   # Classe abstraite (init/update/destroy)
│   │   │   ├── HeroSphere.js
│   │   │   ├── ProjectPlane.js
│   │   │   └── ...
│   │   └── shaders/            # Shaders GLSL
│   │       ├── hero/
│   │       │   ├── vertex.glsl
│   │       │   └── fragment.glsl
│   │       ├── transition/
│   │       └── ...
│   │
│   ├── pages/                  # Logique par page
│   │   ├── BasePage.js         # Classe abstraite
│   │   ├── Home.js
│   │   ├── About.js
│   │   ├── Work.js
│   │   ├── Project.js          # Page détail projet (dynamique)
│   │   └── Contact.js
│   │
│   ├── components/             # Composants DOM réutilisables
│   │   ├── Cursor.js           # Curseur custom (lerp)
│   │   ├── Navigation.js
│   │   ├── Preloader.js
│   │   ├── Transition.js       # Transition entre pages
│   │   └── Footer.js
│   │
│   ├── core/                   # Système interne
│   │   ├── Router.js           # Routing SPA custom (pas de framework)
│   │   ├── PageTransition.js
│   │   ├── AssetLoader.js      # Charge images, modèles, textures avec progression
│   │   ├── EventEmitter.js     # Pub/Sub global
│   │   ├── Sizes.js            # Listener resize global
│   │   └── Time.js             # requestAnimationFrame centralisé
│   │
│   ├── data/
│   │   └── projects.js         # Données projets (cf. format plus bas)
│   │
│   ├── styles/
│   │   ├── main.scss
│   │   ├── abstracts/          # variables, mixins, functions
│   │   ├── base/               # reset, typography, global
│   │   ├── components/
│   │   ├── layout/
│   │   └── pages/
│   │
│   └── utils/
│       ├── math.js             # lerp, clamp, map, easing
│       ├── dom.js              # helpers DOM
│       └── device.js           # detection mobile/desktop/touch
│
├── index.html
├── vite.config.js
├── package.json
├── .eslintrc.json
├── .prettierrc
├── README.md                   # Ce fichier
└── .gitignore
```

---

## Commandes

```bash
npm install              # Installer les dépendances
npm run dev              # Serveur dev (port 5173)
npm run build            # Build production dans /dist
npm run preview          # Tester le build localement
npm run lint             # ESLint
```

---

## Pages & Sections

### 1. Home (`/`)
- **Preloader** : compteur 0-100% pendant le chargement des assets critiques.
- **Décor WebGL** : cercles sombres flottants sur fond coloré (cf. section « Décor WebGL »), fond qui change de couleur au scroll.
- **Intro texte** : nom + tagline, reveal caractère par caractère.
- **Featured Projects** : 3 à 4 projets mis en avant, avec planes WebGL animés au hover.
- **CTA Contact** : transition vers `/contact` via effet shader plein écran.

### 2. About (`/about`)
- Biographie longue (background, vision, ambitions).
- Parcours (timeline animée au scroll).
- Compétences (tags animés).
- Photo de profil avec effet shader (RGB shift ou distorsion au hover).

### 3. Work (`/work`)
- Grille de TOUS les projets.
- Filtres par catégorie : `Dev`, `WordPress`, `Mobile`, `AR`, `3D / Game`.
- Hover : transition shader fluide entre poster statique et seconde texture.

### 4. Project (`/work/[slug]`)
- Hero du projet (titre + cover full screen).
- Description, rôle, stack technique.
- Galerie d'images / vidéos.
- Liens (live, GitHub si public).
- Navigation prev / next entre projets.

### 5. Contact (`/contact`)
- Email + réseaux sociaux (LinkedIn, GitHub, Malt si applicable).
- Formulaire (optionnel, envoi via Formspree ou Netlify Forms).
- Footer avec animation finale.

---

## Projets à afficher

### Projets techniques (confirmés)

1. **AUTORA** — Plateforme e-commerce de véhicules de luxe
   - Stack : React, PHP, MySQL
   - Rôle : Conception + Full-stack
   - Slug : `autora`
   - Catégorie : `Dev`

2. **EcoleManager** — SaaS de gestion scolaire pour l'Afrique francophone
   - Stack : à confirmer
   - Rôle : Conception + Dev
   - Slug : `ecolemanager`
   - Catégorie : `Dev`

3. **PassFort** — Gestionnaire de mots de passe Flutter
   - Stack : Flutter, Docker, Nginx
   - Rôle : Dev mobile + déploiement
   - Slug : `passfort`
   - Catégorie : `Mobile`

4. **ChronoView AR** — App AR d'exploration urbaine historique
   - Stack : AR.js, A-Frame, GitHub Pages
   - Slug : `chronoview-ar`
   - Catégorie : `AR`

5. **MOUV'PRINT** — App AR urbaine (projet groupe)
   - Stack : à confirmer
   - Slug : `mouvprint`
   - Catégorie : `AR`

6. **Le Laboratoire Maudit** — Escape game 3D Unity
   - Stack : Unity 6.2, C#
   - Slug : `laboratoire-maudit`
   - Catégorie : `3D / Game`

### Projets WordPress

> TODO Benoît : remplir les blocs ci-dessous avec les vraies infos de tes sites WordPress.

7. **[TODO — Projet WordPress 1]**
   - Stack : WordPress, WooCommerce, …
   - Slug : `Rosalparis`
   - Catégorie : `WordPress`

8. **[TODO — Projet WordPress 2]**
   - …

9. **[TODO — Projet WordPress 3]**
   - …

### Format des données projets

Dans `src/data/projects.js` :

```js
export const projects = [
  {
    slug: 'autora',
    title: 'AUTORA',
    subtitle: 'Luxury Vehicle E-Commerce',
    year: 2025,
    category: 'Dev', // Dev | WordPress | Mobile | AR | 3D / Game
    role: 'Conception & Développement Full-stack',
    stack: ['React', 'PHP', 'MySQL'],
    cover: '/images/projects/autora/cover.jpg',
    gallery: [
      '/images/projects/autora/01.jpg',
      '/images/projects/autora/02.jpg',
    ],
    description: 'Plateforme e-commerce dédiée aux véhicules de luxe...',
    links: {
      live: null,
      github: null,
    },
    featured: true, // affiché sur la home
  },
  // ...
];
```

---

## Design system

### Palette — VERROUILLÉE

Base sombre, inspirée de patrickheng.com mais réchauffée par une rampe de violets doux.
Valeurs exposées en variables CSS custom (`--color-*`) dans `src/styles/base/_root.scss`.

| Rôle              | Variable CSS        | Hex       | Usage                                  |
| ----------------- | ------------------- | --------- | -------------------------------------- |
| Fond              | `--color-bg`        | `#0B0A12` | Fond global (near-black violacé)       |
| Surface           | `--color-surface`   | `#15131F` | Cartes, panneaux, overlays             |
| Texte             | `--color-text`      | `#ECEAF2` | Texte principal (off-white)            |
| Texte secondaire  | `--color-muted`     | `#837E9C` | Labels, légendes, années               |
| Violet profond    | `--color-v-deep`    | `#5C5792` | Bord de gradient, états pressés        |
| Violet médian     | `--color-accent`    | `#9281C0` | Accent par défaut (liens, focus)       |
| Violet clair      | `--color-v-light`   | `#9F8DC3` | Variations, hover doux                 |
| Mauve clair       | `--color-v-hover`   | `#BE9CC7` | Accent au survol, fin de gradient      |

> Rampe `#5C5792 → #BE9CC7` réutilisée telle quelle pour le gradient + fresnel du shader hero.
> Le fond sombre fait ressortir les violets en mode « premium / Awwwards ».

### Typographie
- **Display / Hero** : serif moderne — `PP Editorial New`, `Migra`, ou alternative libre `Fraunces`.
- **Body / UI** : sans-serif neutre — `Neue Haas Grotesk`, ou libre `Inter`.
- **Mono** (labels, années) : `JetBrains Mono`.

### Echelle typo (clamp pour responsive natif)

```scss
:root {
  --fs-hero:  clamp(4rem, 12vw, 14rem);
  --fs-h1:    clamp(2.5rem, 6vw, 6rem);
  --fs-h2:    clamp(1.75rem, 3.5vw, 3rem);
  --fs-body:  clamp(0.95rem, 1.1vw, 1.125rem);
  --fs-small: 0.85rem;
}
```

### Espacements
- Grille de 12 colonnes, gouttières `clamp(16px, 2vw, 32px)`.
- Section padding vertical : `clamp(80px, 12vh, 200px)`.

### Curseur custom
- Curseur natif masqué (`cursor: none` sur `body`).
- Petit cercle qui suit avec un `lerp` (smoothing).
- Hover sur lien/projet : agrandissement + label contextuel (`View`, `Open`, `→`).

---

## Comportements & Animations attendus

### Smooth scroll (Lenis) — SCROLL HORIZONTAL

- **Direction : tout le site défile horizontalement** (la molette / le geste fait avancer le contenu de la droite vers la gauche). Décision verrouillée.
- Lenis configuré en mode horizontal (`orientation: 'horizontal'`, `gestureOrientation: 'both'`).
- Config : `lerp: 0.1`, `wheelMultiplier: 1`, `smoothTouch: false`.
- Synchroniser obligatoirement avec ScrollTrigger (ScrollTrigger en mode `horizontal: true` sur les triggers) :
  ```js
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  ```
- **Mobile (`< 768px`)** : fallback en scroll vertical natif (l'horizontal au doigt est peu ergonomique). Le layout passe en colonne unique.

### Preloader
- Bloque l'entrée tant que les assets critiques ne sont pas chargés (modèles 3D, textures hero, fonts).
- Pourcentage en temps réel.
- Animation de sortie : split text + reveal de la scène WebGL.

### Transitions de page
- Architecture SPA custom (`Router.js`) — jamais de rechargement complet.
- Transition : plane shader fullscreen avec distorsion noise, durée ~1s.
- La nouvelle page est préchargée en arrière-plan pendant la transition.

### Décor WebGL — cercles (révisé en Phase 3)

> Direction validée avec Benoît : on abandonne la sphère/icosaèdre déformé
> au profit d'un décor façon patrickheng.

- **Cercles pêche chaleureux** (`#F4B89A`) flottant en complémentaire chaud sur
  un **fond coloré** violet (`src/webgl/objects/Background.js`). Objet WebGL
  unique et persistant sur toutes les pages → continuité de l'animation.
- **Drift continu** (oscillation douce) + parallaxe horizontale liée au scroll.
- **Fond coloré piloté par le scroll** : traverse la rampe violette
  (`#5C5792 → #9281C0 → #BE9CC7`), géré dans `App.js` (suivi lissé).
- **Transition de couleur au changement de page** : chaque page déclare ses
  `backgroundStops` ; App lisse la transition (ex. arrivée sur Work).
- **Contraste auto** : `<html data-bg="light">` bascule le texte en sombre quand
  le fond devient clair.
- **Sur mobile** : moins de cercles.

### Hover projets (Work)
- Chaque carte projet a un plane WebGL superposé.
- Au hover : transition shader (distorsion + révélation seconde texture).
- Vélocité scroll → distorsion shader (effet "drag").

### Reveal au scroll
- Textes : SplitText GSAP (caractère ou mot) avec stagger.
- Images : `clip-path` animé OU `fade + translateY`.
- Trigger : `ScrollTrigger` avec `start: 'top 80%'`.

### Responsive
- **Mobile** (`< 768px`) : WebGL simplifié, scroll natif, layouts en colonne unique.
- **Tablet** (`768px - 1024px`) : version intermédiaire.
- **Desktop** (`>= 1024px`) : expérience complète.

---

## Conventions de code

### JavaScript
- ES Modules uniquement (`import` / `export`).
- Classes ES6 pour tout composant WebGL ou logique stateful.
- Fonctions pures pour les utils.
- Pas de variables globales sauf `window.__APP__` pour debug.
- Préférer la composition à l'héritage profond.

### Architecture WebGL
- UNE SEULE instance de `WebGLRenderer` partagée pour toute l'app.
- Chaque page peut avoir sa propre scène, montée/démontée via `init()` et `destroy()`.
- Tous les objets WebGL étendent `BaseObject` avec `init()`, `update(dt)`, `destroy()`.

### Shaders
- Fichiers `.glsl` séparés, importés via `vite-plugin-glsl`.
- Conventions de nommage :
  - `u` (uniform) : `uTime`, `uMouse`, `uResolution`
  - `v` (varying) : `vUv`, `vNormal`
  - `a` (attribute) : `aPosition`, `aNormal`
- Commentaire d'en-tête obligatoire expliquant le rôle du shader.

### SCSS
- Variables CSS custom (`--`) pour les valeurs runtime (couleurs, échelles).
- Variables SCSS (`$`) pour les valeurs compile-time (breakpoints, mixins).
- BEM modifié : `.block__element.is-state` (états en `is-*` ou `has-*`).

### Naming de fichiers
- WebGL / classes : `PascalCase.js` → `HeroSphere.js`.
- Utils / helpers : `camelCase.js` → `math.js`.
- SCSS partials : `_kebab-case.scss` → `_typography.scss`.

### Performance (non négociable)
- `Math.min(window.devicePixelRatio, 2)` partout.
- Pas de rendu si l'onglet est inactif (`document.visibilityState`).
- Textures > 500KB → compression KTX2 ou Basis.
- UN SEUL `requestAnimationFrame` pour toute l'app (centralisé dans `core/Time.js`).
- Disposer (`geometry.dispose()`, `material.dispose()`, `texture.dispose()`) quand on quitte une page.

---

## Roadmap de développement

### Phase 1 — Setup (Jour 1)
- [x] Init Vite + structure de dossiers exacte ci-dessus.
- [x] Config ESLint (flat config `eslint.config.js`), Prettier, `vite-plugin-glsl`.
- [x] Setup SCSS avec variables CSS de base (palette verrouillée).
- [x] Router SPA custom minimal.

### Phase 2 — Core WebGL
- [x] Classe `Renderer` (three.js wrapper, instance unique).
- [x] Classe `Camera`.
- [x] `core/Time.js` (rAF centralisé — refactoré en Phase 3 sur `gsap.ticker`).
- [x] `core/AssetLoader.js` avec progression.
- [x] Premier shader fullscreen de test (retiré en Phase 3, remplacé par le hero).

### Phase 3 — Home
- [x] Preloader animé (compteur 0-100 % + sortie).
- [x] Décor WebGL : cercles sombres flottants + fond coloré piloté au scroll (révisé : plus de sphère déformée).
- [x] Smooth scroll Lenis horizontal + synchro ScrollTrigger.
- [x] Animation intro texte (SplitText).
- [x] Curseur custom.

### Phase 4 — Work & Project
- [x] Work : un projet par panneau (révisé — pas de grille). Grand titre + miniature + déco triangle, scroll horizontal entre les projets.
- [x] Transition entre pages (révisé : DOM `clip-path` + GSAP au lieu d'un shader WebGL plein écran). Sweep depuis le coin bas-gauche, retrait vers le haut-droite ; couleur = `backgroundStops[0]` de la page d'arrivée. Composant `components/Transition.js`, orchestration dans `core/Router.js`.
- [x] Page détail projet (dynamique via slug) — split layout média / panneau coloré.
- [x] Navigation prev / next (en bas du panneau d'info).

### Phase 5 — About & Contact
- [ ] Page About complète.
- [ ] Page Contact.
- [ ] Footer.

### Phase 6 — Polish & Deploy
- [ ] Responsive complet (mobile / tablet).
- [ ] Optimisation perf (compression, lazy load).
- [ ] SEO + meta tags + OG images.
- [ ] Tests croisés navigateurs (Chrome, Safari, Firefox).
- [ ] Déploiement Vercel ou Netlify.

---

## Instructions spécifiques pour Claude Code

> Cette section est lue à chaque session. Respecte-la strictement.

### A toujours faire
1. Lire ce fichier en entier avant chaque session.
2. Respecter la structure de dossiers définie plus haut — ne pas inventer de nouveaux dossiers sans accord.
3. Ecrire les commentaires en français.
4. Tester avec `npm run dev` avant de considérer une tâche terminée.
5. Caper le pixel ratio à 2 dans tout code WebGL.
6. Disposer proprement toutes les ressources WebGL au démontage d'une page.
7. Commenter chaque uniform et chaque section d'un shader, en français.
8. Centraliser les events : un seul `requestAnimationFrame`, un seul `resize`, un seul `mousemove` global. Les composants s'abonnent via l'`EventEmitter`.

### A ne jamais faire
1. Installer React, Vue, ou tout framework UI.
2. Ajouter Tailwind, Bootstrap ou un framework CSS.
3. Créer plusieurs instances de `WebGLRenderer`.
4. `document.querySelector` directement dans les classes WebGL (passer le DOM en paramètre).
5. Laisser des `console.log`, du code mort, ou des assets inutilisés.
6. Animer en JavaScript ce qui peut être fait en shader.
7. Migrer en TypeScript sans accord explicite.

### Avant d'ajouter une lib externe
- Vérifier sa taille (< 30KB minified gzipped idéalement).
- Vérifier qu'elle n'est pas déjà couverte par three.js / GSAP.
- Demander avant de l'ajouter au `package.json`.

### Quand tu n'es pas sûr
- Demande avant de modifier l'architecture (dossiers, classes core).
- Demande avant de toucher au design system (palette, typo, espacements).
- Pour le reste (code interne d'une feature), tu peux avancer.

---

## Ressources d'apprentissage & d'inspiration

- **Référence principale** : https://patrickheng.com
- **Awwwards SOTD** : https://www.awwwards.com/websites/sites_of_the_day/
- **Three.js Journey** (Bruno Simon) : https://threejs-journey.com
- **GSAP Docs** : https://gsap.com/docs/v3/
- **The Book of Shaders** : https://thebookofshaders.com
- **Codrops Tutorials** : https://tympanus.net/codrops/
- **Lenis** : https://github.com/darkroomengineering/lenis

---

## Notes

- Ce fichier est la source de vérité du projet.
- Toute décision technique majeure doit y être ajoutée.
- A mettre à jour à chaque nouvelle feature significative.

NB : un portfolio bien animé et très fluide aussi.