# AGENTS.md

## Project

Build the public static website for **2Morrow.land**, an anonymous, independent editorial project related to the history, memory and culture surrounding Tomorrowland.

The site must not reveal that the final outcome is a book. Do not mention a book in source code, comments, commit messages, metadata, README files or visible content.

## Authority

The requirements in this file and in `docs/project-specification.md` are authoritative. Do not replace them with generic landing-page conventions. When a requirement is unclear, preserve mystery, editorial restraint, accessibility and performance.

## Repository rules

- Public repository.
- Default branch: `main`.
- No license file.
- Do not commit secrets, API keys or private credentials.
- Keep `README.md` minimal.
- Use concise, intentional commits.
- Deployment occurs from GitHub Actions after pushes to `main`.

## Technology

- Handwritten semantic HTML.
- Handwritten CSS.
- Minimal progressive JavaScript.
- No React, Vue, Svelte, Astro or other frameworks.
- No Tailwind, Bootstrap or component libraries.
- No TypeScript.
- No animation libraries.
- No service worker or PWA.
- No unnecessary third-party dependencies.
- Node.js may be used only for local tooling, validation, minification and asset optimisation.
- Production output must be generated in `dist/`.

## Languages and URLs

- English homepage: `/`.
- Spanish homepage: `/es/`.
- English legal pages: `/privacy/`, `/legal/`, `/accessibility/`.
- Spanish legal pages: `/es/privacidad/`, `/es/aviso-legal/`, `/es/accesibilidad/`.
- English is the canonical default language.
- The URL always determines the displayed language.
- Never redirect automatically based on browser language or stored preference.
- Store the manually selected language in `localStorage` only to reflect the preference in the language selector.
- Implement `hreflang` for `en`, `es` and `x-default`.

## Visual direction

Primary concept: **secret archive**.
Secondary concept: **fragmented memory**.

The design must be mysterious, minimal, editorial, emotional and restrained. It must not resemble a generic AI-generated black-and-gold landing page.

Use:

- Near-black charcoal background.
- Warm off-white primary text.
- Stone-grey secondary text.
- Aged, matte gold only for fine details, small accents, dates, lines, focus and interactive states.
- Very subtle grain and archive marks.
- Generous negative space.
- Documentary codes, dates, stamps and index-like elements.
- One master abstract photographic/documentary composition suggesting distant lights, crowds, stages, negatives or archives without showing identifiable Tomorrowland visual property.

Do not use:

- Gold gradients.
- Large gold surfaces.
- Glowing buttons.
- Generic particle backgrounds.
- Futuristic fonts.
- Recognisable Tomorrowland logos, butterfly marks, stages or official graphics.
- Scroll hijacking, parallax, custom cursors or continuous decorative animation.

## Typography

Self-host only WOFF2 assets with valid redistribution licences.

- Newsreader: headings and key editorial statements.
- IBM Plex Sans: body copy, navigation, controls and forms.
- IBM Plex Mono: dates, archive codes, stamps and technical labels.

Load only required subsets and weights. Use `font-display: swap` and sensible system fallbacks.

## Required visible identity

- Main visible name: `2Morrow.land`.
- Visible period: `2005 — 2026`.
- Main English heading: `Some stories have yet to be told.`
- Main Spanish heading: `Todavía quedan historias que nadie ha contado.`
- Visible archive stamps in the relevant language for archives, sources, testimonies, memory and music.

## Calls to action

Priority:

1. Newsletter subscription.
2. Share the page.
3. Invite contributions by email.

English:

- Primary CTA: `Follow the story`.
- Secondary CTA: `Share`.
- Contribution prompt: `Do you have a story, document or memory? Write to info@2morrow.land`.

Spanish:

- Primary CTA: `Sigue la historia`.
- Secondary CTA: `Compartir`.
- Contribution prompt: `¿Tienes una historia, un documento o un recuerdo? Escribe a info@2morrow.land`.

## Newsletter

- Provider: SendFox.
- Use SendFox legacy HTML form when the real integration is available.
- Use a placeholder implementation until Carlos provides the generated SendFox form details.
- One contact list with a language attribute if supported.
- Fallback order if a language field is not supported:
  1. Hidden custom language field in one list.
  2. Two forms feeding the same list while preserving source/language information.
  3. Two separate language lists as the final fallback.
- Email is required.
- Name is optional.
- Privacy checkbox is required and must never be preselected.
- Double opt-in is required.
- Include an unobtrusive honeypot when compatible with SendFox.
- Never expose private SendFox credentials.
- Prefer an inline success message. If SendFox requires redirects, use `/thanks/` and `/es/gracias/` with matching minimal design.

## Sharing

- Use the Web Share API where supported.
- Otherwise copy the current canonical URL to the clipboard.
- Announce successful copying using an accessible `aria-live` status.
- Do not show permanent social-network icon rows.

## JavaScript principles

The site must remain readable and usable without JavaScript. JavaScript may enhance only:

- Web Share API and clipboard fallback.
- Language preference storage and selector state.
- Minimal reveal animations.
- Accessible inline form feedback where compatible with SendFox.

Use small modules, defensive feature detection and no global dependencies.

## Motion

- Minimal opacity and very small positional transitions.
- No essential information may depend on motion.
- Fully respect `prefers-reduced-motion: reduce` by removing non-essential movement and showing content immediately.

## Accessibility

Formal target: **WCAG 2.2 AA**.

Required:

- Semantic landmarks and correct heading hierarchy.
- Skip link.
- Full keyboard operation.
- Strong, visible focus styles.
- Sufficient colour contrast.
- Proper form labels, descriptions and accessible validation.
- `aria-live` for asynchronous status messages.
- Minimum practical touch target sizes.
- No information conveyed by colour or animation alone.
- No loss of content or functionality at 200% zoom.
- Logical reading and focus order.
- Decorative imagery must use empty alternative text or CSS backgrounds as appropriate.
- Test with keyboard, automated tools and at least one desktop screen reader workflow.

## SEO and social metadata

The site is indexable from launch.

English:

- Title: `2Morrow.land — The story is still being written`
- Description: `An independent editorial project exploring the music, memory, archives and testimonies surrounding Tomorrowland from 2005 to 2026.`

Spanish:

- Title: `2Morrow.land — La historia todavía se está escribiendo`
- Description: `Un proyecto editorial independiente que explora la música, la memoria, los archivos y los testimonios en torno a Tomorrowland entre 2005 y 2026.`

Required:

- Canonical URLs using `https://2morrow.land/` without `www`.
- Open Graph and Twitter/X card metadata.
- One abstract Open Graph image at 1200 × 630, without official logos or embedded promotional copy.
- `robots.txt`.
- `sitemap.xml`.
- Structured data limited to appropriate `WebSite` and `WebPage` entities.
- Do not use `Organization` structured data.
- Prepare clean placeholders for later Google Search Console and Bing Webmaster Tools verification.

## Domain

- Canonical host: `https://2morrow.land/`.
- `https://www.2morrow.land/` will redirect to the non-www host through Cloudflare.
- Include the GitHub Pages `CNAME` file for `2morrow.land` in the published output.

## Analytics and storage

- Analytics: Cloudflare Web Analytics enabled through Cloudflare automatic injection, not hard-coded in the repository.
- No analytics cookies.
- No cookie banner solely for Cloudflare Web Analytics.
- `localStorage` is used only for language preference and must be documented in the privacy policy.

## Security

GitHub Pages cannot set all required response headers directly. Document and prepare a Cloudflare configuration checklist for:

- Content-Security-Policy.
- X-Content-Type-Options.
- Referrer-Policy.
- Permissions-Policy.
- Frame protection through CSP `frame-ancestors`.

Ensure CSP accommodates the final SendFox form endpoint and required assets without unsafe broad allowances where avoidable.

## Legal and editorial independence

Visible disclaimer in English:

`2Morrow.land is an independent editorial project. It is not an official publication and is not affiliated with, endorsed by or authorised by Tomorrowland.`

Visible disclaimer in Spanish:

`2Morrow.land es un proyecto editorial independiente. No es una publicación oficial ni está afiliado, respaldado o autorizado por Tomorrowland.`

Copyright:

- English: `© 2026 2Morrow.land. All rights reserved.`
- Spanish: `© 2026 2Morrow.land. Todos los derechos reservados.`

Responsible party information belongs only on legal pages, not on the homepage:

- Carlos Longarela
- NIF: ES34896148L
- Avenida de A Coruña, 288, 1.º
- 27003 Lugo, España
- Email: info@2morrow.land

Use `info@2morrow.land` for contact and data-protection rights requests.

## Performance budget

Targets:

- Lighthouse mobile scores of at least 95 for Performance, Accessibility, Best Practices and SEO.
- First-party JavaScript under 15 KB minified.
- CSS under 40 KB minified.
- Initial transfer under 1 MB.
- AVIF and WebP responsive images with fallback where needed.
- Core Web Vitals in the green range under normal conditions.
- Avoid render-blocking third-party resources.

## Browser support

Support the latest two stable versions of Chrome, Edge, Firefox and Safari, plus current Safari on iOS and Chrome on Android. Progressive enhancement must preserve the core experience in older or restricted environments.

## Required pages and files

- `/index.html`
- `/es/index.html`
- `/privacy/index.html`
- `/legal/index.html`
- `/accessibility/index.html`
- `/es/privacidad/index.html`
- `/es/aviso-legal/index.html`
- `/es/accesibilidad/index.html`
- `/404.html` with concise bilingual copy and links to both homepages.
- Optional fallback confirmation pages only if SendFox requires them.
- `robots.txt`
- `sitemap.xml`
- `CNAME`

## Build and validation

Use a minimal npm-based toolchain for:

- CSS and JavaScript minification.
- Image optimisation.
- HTML validation.
- CSS linting where useful.
- JavaScript linting.
- Accessibility checks.
- Link checking.
- Lighthouse CI or an equivalent repeatable performance audit.

Create GitHub Actions workflows for validation and GitHub Pages deployment.

## Acceptance criteria

Do not consider the implementation complete until:

- All required pages exist in both languages.
- The main page remains concise and direct, approximately one to two screens depending on viewport.
- No final-outcome format is revealed.
- No official Tomorrowland visual identity is used.
- The site works without JavaScript except for documented enhancements.
- Keyboard, reduced-motion and zoom checks pass.
- Automated HTML, link, accessibility and build checks pass.
- SEO metadata, canonical URLs and `hreflang` are correct.
- The repository contains no secrets.
- The visual design feels authored, editorial and distinctive rather than templated.
