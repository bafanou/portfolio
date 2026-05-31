// =============================================================
//  main.js — point d'entrée de l'application.
// =============================================================
import '@/styles/main.scss';
import App from './App.js';

const root = document.querySelector('[data-app]');
const app = new App(root);

// Nettoyage propre lors du hot-reload Vite (évite les listeners en double).
if (import.meta.hot) {
  import.meta.hot.dispose(() => app.destroy());
}
