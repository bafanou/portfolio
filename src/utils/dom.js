// =============================================================
//  dom.js — helpers DOM légers.
//  NB : les classes WebGL ne doivent PAS appeler ces helpers
//  directement (passer le DOM en paramètre — cf. README).
// =============================================================

// querySelector typé court, avec racine optionnelle.
export const qs = (selector, root = document) => root.querySelector(selector);

// querySelectorAll renvoyé sous forme de tableau.
export const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

// Crée un élément avec attributs et enfants.
//   el('a', { href: '/work', class: 'link' }, 'Work')
export const el = (tag, attrs = {}, children = []) => {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'class') node.className = value;
    else if (key === 'dataset') Object.assign(node.dataset, value);
    else node.setAttribute(key, value);
  }
  const list = Array.isArray(children) ? children : [children];
  for (const child of list) {
    node.append(child instanceof Node ? child : document.createTextNode(child));
  }
  return node;
};
