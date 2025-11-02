# 🚀 Quick Start Guide

Get the Radio Exam Helper app running in 3 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

This installs all required packages (Astro, React, Tailwind, etc.)

## Step 2: Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:4321/RadioExamHelper/**

## Step 3: Build for Production (Optional)

```bash
npm run build
```

Then preview:

```bash
npm run preview
```

---

## 📋 All Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (hot reload enabled) |
| `npm run build` | Build for production (validates data, builds site, generates SW) |
| `npm run preview` | Preview production build locally |
| `npm run fetch-qcodes` | Fetch Q-codes from source website (optional) |
| `npm run build:data` | Validate data with Zod schemas |
| `npm run build:pwa` | Generate service worker only |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

---

## 🎯 What to Try First

1. **Open the app** in your browser
2. Click **"Q-Codes Flashcards"** to start learning
3. Use `Space` to reveal answers, `1` or `2` to mark correctness
4. Try **"Phonetic Alphabets"** to practice NATO/Polish spelling
5. View your **Statistics** to see progress

---

## 🚀 Deploy to GitHub Pages

### One-Time Setup

1. **Enable GitHub Pages:**
   - Go to your repo → Settings → Pages
   - Source: **GitHub Actions**

2. **Push your code:**
   ```bash
   git add .
   git commit -m "Initial setup"
   git push origin main
   ```

3. **Wait for deployment:**
   - Check Actions tab for build progress
   - Your site will be live at: `https://piotrof.github.io/RadioExamHelper/`

### Future Updates

Just push to `main` and it auto-deploys! 🎉

```bash
git add .
git commit -m "Update content"
git push
```

---

## 🐛 Troubleshooting

### Port already in use?
```bash
# Kill process on port 4321
lsof -ti:4321 | xargs kill -9
# Or use a different port
npm run dev -- --port 3000
```

### Dependencies not installing?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors?
```bash
# Check TypeScript errors
npx astro check

# Validate data
npm run build:data
```

---

## 📱 Test PWA Features

After building:

1. Run `npm run preview`
2. Open DevTools → Application → Service Workers
3. Check "Offline" and reload page
4. App should work offline! 🎉

---

## 🎨 Customization Ideas

- **Change colors:** Edit `tailwind.config.cjs`
- **Add more Q-codes:** Edit `public/qcodes.json`
- **Change intervals:** Edit `src/lib/srs.ts` (BOX_INTERVALS_DAYS)
- **Add languages:** Edit `src/data/alphabets.ts`

---

## ✅ Ready to Go!

You now have a fully functional PWA ready to deploy. Check out the main **README.md** for detailed documentation.

**Happy studying and 73!** 📻
