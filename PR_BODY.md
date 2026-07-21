**Findings (ordered by severity)**

- **Critical runtime/link errors:** Several places used `import.meta.env` values (WhatsApp, PDFs) without safe fallbacks, which could produce `undefined` hrefs or runtime URL errors.
- **Modal focus and accessibility issues:** `PDFModal` and `SampleGallery` lacked focus management and focus traps; keyboard users couldn't reliably tab inside modals or restore focus on close.
- **Security: window.open opener vulnerability:** External links opened with `window.open(url, '_blank', ...)` without properly setting `opener = null` in some code paths.
- **Broken UI / Tailwind syntax:** Invalid Tailwind bracketed classes in `SampleGallery` produced incorrect gradients and styles.
- **Scroll locking side-effects:** Components that locked body scroll were restoring `document.body.style.overflow` without preserving the previous value, clobbering other components.
- **Behavior/UX regressions:** Scroll progress bar did not initialize until the first scroll; gallery had degraded dark-mode gradient visuals.
- **Cross-browser reliability:** PDF iframe loading in some browsers (Safari/Firefox) could appear empty; no fallback or timeout handling was present.
- **Compatibility issues:** `matchMedia().addEventListener`/`removeEventListener` usage could fail on older browsers that only support `addListener`/`removeListener`.

---

**Fixes applied (files changed and summary)**

- `src/data/content.ts`
  - Added safe fallbacks for env-based links (`VITE_WHATSAPP_URL`, `VITE_PDF_VIEWER_BASE_URL`, etc.) to avoid undefined hrefs and `new URL()` failures.

- `src/components/PDFModal.tsx`
  - Added robust `getViewerUrls()` with a fallback to Google Docs viewer.
  - Implemented a 12s load timeout to retry with a fallback viewer.
  - Added focus management: save previous focus, focus the close button on open, trap Tab/Shift+Tab inside the modal, restore previous focus on close.
  - Preserve previous `document.body.style.overflow` when locking/unlocking body scroll.

- `src/components/SampleGallery.tsx`
  - Replaced invalid Tailwind bracket gradient with inline gradients and added dark-mode detection.
  - Added focus management: save/restore focus, focus the gallery close button on open, trap focus within the gallery, lock body scroll while open.
  - Added keyboard navigation and touch-swipe support (preserved and slightly hardened).

- `src/components/Toast.tsx`
  - Added `role="status"`, `aria-live="polite"`, and `aria-hidden` toggling to ensure screen readers announce messages when visible.

- `src/sections/WorkSection.tsx`
  - All `window.open` usages updated to set `w.opener = null` on the returned window to mitigate `window.opener` attacks.
  - WhatsApp link handling: if the configured link is missing or not an external URL, the code now scrolls to `#contact` instead of opening blank tabs.
  - Preserved `document.body.style.overflow` when opening the PDF modal.

- `src/components/ScrollProgressBar.tsx`
  - Initialize progress on mount and added a `resize` listener to recalculate document height.

- `src/hooks/useIntersectionReveal.ts` and `src/hooks/use-mobile.ts`
  - Added `addListener/removeListener` fallbacks for `matchMedia` to increase compatibility with older browsers.

- `src/components/SampleGallery.tsx` and other UI components
  - Minor styling fixes, removed broken Tailwind bracket classes, added `motion-reduce` handling where appropriate.

- Misc
  - Removed or guarded problematic `target`/`rel` attributes on internal anchors so internal `#anchor` links don't open new tabs.
  - Cleaned up console warnings related to placeholder assets (kept a single helpful warn in `content.ts` to remind replacement of placeholder PDF).

---

**Build & validation**

- Verified TypeScript compile and a production build: `npm run build` completed successfully multiple times with generated `dist/` assets.
- Ran the Vite dev server locally at `http://localhost:3002/` for manual inspection.
- Ran automated `get_errors` checks (no TypeScript errors reported).

---

**Remaining risks & follow-up items**

- **Manual cross-browser QA:** The PDF fallback (Google viewer) is functional, but please verify file rendering across Safari and Firefox on macOS/iOS.
- **Accessibility deeper audit:** I improved keyboard/focus behavior and ARIA for affected components, but a complete site-wide audit with `axe`/Lighthouse is recommended (contrast checks, focus order validation, aria roles on complex widgets).
- **Env vars & assets for production:** Replace placeholder `resume.pdf` and set these env vars for production: `VITE_WHATSAPP_URL`, `VITE_CONTACT_EMAIL`, `VITE_EMAIL_HREF`, `VITE_PDF_VIEWER_BASE_URL`, and social URLs.
- **Image optimization:** Consider adding responsive `srcset` and next-gen image formats for better performance.

---

**How to test locally**

1. Install & start dev server:

```bash
npm install
npm run dev
```

2. Manual checks:
- Open `http://localhost:3002/` and test modals (`View Samples`, `Open PDF`) using keyboard (Tab/Shift+Tab, Esc).
- Trigger gallery and PDF modal; ensure focus is trapped and restored after closing.
- Click WhatsApp buttons; if `VITE_WHATSAPP_URL` is not set, the UI scrolls to `#contact` instead of opening blank tabs.

---

If you want, I can also:
- Run a full Lighthouse accessibility audit and apply remaining high-impact fixes.
- Create a small PR checklist for production env vars and missing assets.
