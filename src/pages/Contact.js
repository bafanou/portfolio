import BasePage from './BasePage.js';

// =============================================================
//  Contact (/contact) — page contact.
//  Titre éditorial, email mis en avant, réseaux numérotés.
//  Contenu en français.
// =============================================================

const SOCIALS = [
  {
    n: '01',
    label: 'GitHub',
    url: 'https://github.com/bafanou',
    cursor: 'GitHub',
  },
  {
    n: '02',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/benoît-anthime-fanou-51a78b36a',
    cursor: 'LinkedIn',
  },
];

const EMAIL = 'bafanou24@gmail.com';

export default class Contact extends BasePage {
  get backgroundStops() {
    return ['#5C5792', '#9281C0'];
  }

  render() {
    const socials = SOCIALS.map(
      (s) => `
        <li>
          <a
            class="contact__social"
            href="${s.url}"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="${s.cursor}"
          >
            <span class="u-mono contact__social-n">${s.n}</span>
            <span class="contact__social-name">${s.label}</span>
            <span class="contact__social-arrow" aria-hidden="true">↗</span>
          </a>
        </li>`
    ).join('');

    return `
      <section class="panel panel--contact">
        <h1 class="contact__title" data-reveal>
          Parlons<br />
          <em>ensemble</em>.
        </h1>

        <p class="contact__intro" data-reveal>
          Une idée, un projet, une alternance ? Le plus simple reste l'email
          je réponds rapidement, promis.
        </p>

        <a
          class="contact__email"
          href="mailto:${EMAIL}"
          data-cursor="Écrire"
          data-reveal
        >${EMAIL}</a>

        <ul class="contact__socials" data-reveal>
          ${socials}
        </ul>
      </section>
    `;
  }
}
