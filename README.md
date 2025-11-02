# 📻 Radio Exam Helper

A lightweight, offline-capable Progressive Web App (PWA) for studying for the Polish amateur radio exam. Features Q-codes flashcards with spaced repetition and phonetic alphabet trainers for both NATO and Polish alphabets.

**Live Demo:** [https://piotrof.github.io/RadioExamHelper/](https://piotrof.github.io/RadioExamHelper/)

## ✨ Features

### Q-Codes Flashcards
- **Spaced Repetition System (SRS)**: Simple Leitner-based algorithm with 5 learning boxes
- **Smart Scheduling**: Cards are automatically scheduled for review based on your performance
- **Filter by Letter**: Focus on specific Q-code ranges (QRA, QRB, etc.)
- **Shuffle Mode**: Randomize card order for varied practice
- **Progress Tracking**: All progress stored locally in IndexedDB

### Phonetic Alphabets Trainer
- **Dual Alphabet Support**: Practice with NATO or Polish phonetic alphabets
- **Random Word Generation**: Built-in word lists for automatic practice
- **Custom Words**: Enter your own words to practice spelling
- **Interactive Testing**: Type your answer and get immediate feedback
- **Visual Spelling Display**: See letter-by-letter phonetic breakdown

### Statistics & Progress
- **Detailed Analytics**: Track reviews, accuracy, and learning streaks
- **Due Card Counter**: See how many cards need review today
- **Progress by Level**: Visual breakdown of cards in each learning stage
- **Card-Level Details**: Review individual Q-code performance and schedules

### PWA Features
- **Offline Support**: Full functionality without internet connection
- **Installable**: Add to home screen on mobile and desktop
- **Fast Loading**: Optimized bundle size with code splitting
- **Responsive Design**: Works beautifully on all screen sizes
- **Keyboard Shortcuts**: Navigate efficiently with keyboard controls

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with service worker support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Piotrof/RadioExamHelper.git
   cd RadioExamHelper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Fetch Q-codes data (optional)**
   ```bash
   npm run fetch-qcodes
   ```
   This fetches Q-codes from the source website. If you skip this step, the app will use the built-in seed data.

4. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:4321/RadioExamHelper/](http://localhost:4321/RadioExamHelper/)

### Building for Production

```bash
npm run build
```

This will:
1. Validate all data files with Zod schemas
2. Build the static site with Astro
3. Generate service worker for offline support
4. Output to `dist/` directory

Preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
RadioExamHelper/
├── public/
│   ├── icons/              # PWA icons (72px to 512px)
│   ├── manifest.webmanifest
│   ├── favicon.svg
│   └── qcodes.json         # Generated from fetch-qcodes script
├── src/
│   ├── components/         # React components (islands)
│   │   ├── ModePicker.tsx
│   │   ├── Flashcard.tsx
│   │   ├── QCodeTrainer.tsx
│   │   ├── PhoneticTrainer.tsx
│   │   └── Stats.tsx
│   ├── data/
│   │   ├── alphabets.ts    # NATO & Polish phonetic data
│   │   └── qcodes.seed.json # Fallback Q-codes
│   ├── lib/
│   │   ├── data.ts         # Zod schemas & data loading
│   │   ├── storage.ts      # LocalForage wrappers
│   │   ├── srs.ts          # Spaced repetition logic
│   │   └── format.ts       # Text normalization utilities
│   ├── layouts/
│   │   └── Layout.astro    # Base HTML layout
│   ├── pages/
│   │   ├── index.astro     # Landing page
│   │   ├── qcodes.astro    # Q-codes flashcards
│   │   ├── phonetic.astro  # Phonetic trainer
│   │   └── stats.astro     # Statistics page
│   └── styles/
│       └── global.css      # Tailwind + custom styles
├── scripts/
│   ├── fetch_qcodes.mjs    # Fetch Q-codes from source
│   ├── build_data.mjs      # Validate data at build time
│   └── build_pwa.mjs       # Generate service worker
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deployment
├── astro.config.mjs
├── tailwind.config.cjs
├── tsconfig.json
├── package.json
└── README.md
```

## 🎯 Usage

### Keyboard Shortcuts

**Q-Codes Flashcards:**
- `Space` - Reveal answer
- `1` or `←` - Mark as "Again" (restart learning)
- `2` or `→` - Mark as "Got It" (advance to next box)

**General:**
- `Tab` - Navigate between interactive elements
- `Enter` - Activate focused button

### Data Attribution

Q-codes data is sourced from the Polish amateur radio exam website:
**[https://egzaminkf.pl/infusions/test_examination_a/examination.php](https://egzaminkf.pl/infusions/test_examination_a/examination.php)**

This app does not fetch data at runtime. Data is fetched manually once using the `fetch-qcodes` script and committed to the repository. This respects the source website's resources and ensures the app works completely offline.

### Spaced Repetition System

The app uses a simplified Leitner system with 5 boxes:

| Box | Level      | Review Interval |
|-----|------------|-----------------|
| 0   | New        | Immediate       |
| 1   | Learning   | 1 day           |
| 2   | Review     | 3 days          |
| 3   | Mastered   | 7 days          |
| 4   | Completed  | 14 days         |

- ✅ **Correct Answer**: Move to next box (increased interval)
- ❌ **Incorrect Answer**: Return to Box 0 (start over)

## 🚢 Deployment

### GitHub Pages (Automated)

1. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: GitHub Actions

2. **Push to main branch**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Automatic deployment**
   The GitHub Actions workflow will automatically build and deploy on every push to `main`.

Your site will be live at: `https://<username>.github.io/RadioExamHelper/`

### Manual Deployment

Build and deploy to any static hosting:

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

Compatible with:
- Netlify
- Vercel
- Cloudflare Pages
- Any static file hosting

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/) 4.x (Static Site Generation)
- **UI Library**: [React](https://react.dev/) 18 (Islands Architecture)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 3.x
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/) 5.x
- **Validation**: [Zod](https://zod.dev/) 3.x
- **Storage**: [LocalForage](https://localforage.github.io/localForage/) (IndexedDB wrapper)
- **PWA**: [Workbox](https://developer.chrome.com/docs/workbox/) 7.x
- **Bundler**: [Vite](https://vitejs.dev/) (via Astro)

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Mobile browsers with service worker support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run linting: `npm run lint`
5. Run formatting: `npm run format`
6. Commit: `git commit -m "Add amazing feature"`
7. Push: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Q-codes data sourced from [egzaminkf.pl](https://egzaminkf.pl/)
- NATO phonetic alphabet from ICAO/ITU standards
- Polish phonetic alphabet from Polish radio communication standards
- Built with amazing open-source tools and libraries

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation above

---

**Happy studying and 73!** 📻✨