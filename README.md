# MELI catering site

A fast, static, three-page website. Plain HTML, CSS and vanilla JavaScript. No build step and no backend. Ready for GitHub Pages.

## Files

- `index.html`: home
- `parties.html`: kids party catering and booking form
- `lunch-club.html`: office lunch club and enquiry form
- `styles.css`: all styles
- `script.js`: nav, forms and small helpers
- `images/`: drop your photos here (see `images/README.md`)
- `.nojekyll`: tells GitHub Pages to serve the files as they are

## Before you go live, replace these placeholders

Use find and replace across all files.

1. The WhatsApp number is set to `447414962803` (from +44 7414 962803) in `script.js` and every WhatsApp link.
2. The business name is set to **MELI** across the pages. Change it only if your business name is different.
3. The contact email is set to `melicateringuk@gmail.com` in the footer.
4. Add your six photos to `images/` using the exact filenames listed in `images/README.md`.

Optional: the social share image tags (`og:image`) use a relative path. For rich previews when people share a link, swap them for the full URL once you know your domain, for example `https://yourdomain.co.uk/images/hero.jpg`.

## How the forms work

There is no backend. On submit, the form checks the required fields, then builds a WhatsApp message from what was typed and opens `https://wa.me/...` with the text pre-filled. The enquiry lands in your WhatsApp. The customer taps send.

## Deploy to GitHub Pages

1. Create a new repository on GitHub.
2. Put these files at the root of the repository and push them.

   ```bash
   git init
   git add .
   git commit -m "Add catering site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. On GitHub, open the repository, go to **Settings**, then **Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**. Pick the `main` branch and the `/ (root)` folder. Save.
5. Wait a minute. Your site appears at `https://YOUR_USERNAME.github.io/YOUR_REPO/`.

To use your own domain, add it under **Settings, Pages, Custom domain**, then point your domain's DNS at GitHub Pages.

## Local preview

Open `index.html` in a browser, or run a small static server from this folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.
