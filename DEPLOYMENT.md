# Deployment

This portfolio is a Vite React single-page app. Production output is generated in `dist/`.

## Local Production Build

1. Install dependencies:

   ```bash
   npm install
   ```

2. Build the app:

   ```bash
   npm run build
   ```

3. Preview the production build locally:

   ```bash
   npm run preview
   ```

## Deploy to Vercel

1. Push the project to GitHub, GitLab, or Bitbucket.
2. In Vercel, create a new project and import the repository.
3. Use these build settings:

   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`

4. Add any required environment variables from `.env.example` in the Vercel project settings.
5. Deploy.

SPA routing is handled by `vercel.json`, which rewrites all routes to `index.html`.

## Deploy to Netlify

1. Push the project to GitHub, GitLab, or Bitbucket.
2. In Netlify, create a new site and import the repository.
3. Use these build settings:

   - Build command: `npm run build`
   - Publish directory: `dist`

4. Add any required environment variables from `.env.example` in the Netlify site settings.
5. Deploy.

SPA routing is handled by `public/_redirects`, which is copied into `dist/` during the Vite build.

## Manual Static Deploy

1. Run `npm run build`.
2. Upload the contents of `dist/` to a static host.
3. Configure the host to serve `index.html` for unknown routes so deep links work.
