# Nguyễn Phú Vinh — Portfolio

React + Vite + Motion. Static portfolio for Cloudflare Pages, with EN/VI and a monochrome responsive interface.

## Local and build

`npm install`, then `npm run dev` (http://localhost:5173).

`npm run build` creates `dist`. Run `npx playwright test` for browser checks.

## Content

Edit `src/content.js` for profile, social links, skills, About Me, certifications, experiences, and projects. Vietnamese translations are in `src/i18n.js`.

- Experience is intentionally empty. Add entries with `title`, `company`, `period`, and `description` when ready.
- Projects is an empty array and displays **None / Chưa có dự án**. Add real entries with `title`, `category`, `description`, `image`, `stack`, and `details`. The project guide and details dialog will appear when entries exist.
- **View CV / Xem CV** opens `public/resume.pdf` in a new tab. The editable source is `output/cv/nguyen-phu-vinh-cv.tex`. After updating and compiling the CV, copy `output/pdf/nguyen-phu-vinh-cv.pdf` to `public/resume.pdf` and rebuild the website. A public R2 PDF URL can also be set in `profile.resume`.
- The contact form opens an email draft addressed to `profile.email`, with the visitor’s information. Visitors review and send the draft in their email app; the website does not send or store messages.
- The AWS certification links to the supplied Credly badge. No exam version or dates are inferred. Local brand assets and licenses are documented in `public/assets/brands/SOURCES.md`.

Page order: Hero → About Me → Skills → Experience → Certifications → Projects → Contact.

## Motion and fonts

Desktop sections fade as they enter or leave the reading area, with native scrolling and active navigation. Mobile keeps the natural vertical layout. Character SVGs blink and breathe, and the hero types in bursts. Idle animation pauses offscreen and in hidden tabs. Reduced-motion preferences are respected.

Vietnamese uses self-hosted JetBrains Mono Nerd Font Mono (license: `public/fonts/OFL.txt`). English uses Sora from Google Fonts with a system fallback.

## Cloudflare Pages

Build command: `npm run build`. Output directory: `dist`. Node.js: 24. No environment variables or backend required.

For Direct Upload, build first and upload the contents of `dist`, or a ZIP containing those contents.
