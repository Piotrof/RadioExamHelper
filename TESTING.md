# 🧪 Testing Guide - Radio Exam Helper

## ✅ Fixed: Buttons Not Working

### What Was Wrong
The React components weren't properly handling click events because:
1. The `onSelectMode` callback was being passed from Astro template
2. Functions passed as props from Astro to React islands don't serialize correctly
3. Navigation logic needs to be inside the React component itself

### What Was Fixed
1. Moved navigation logic inside `ModePicker.tsx` component
2. Created internal `handleSelectMode` function
3. Removed prop passing from `index.astro`

---

## 🧪 How to Test

### 1. Ensure Dev Server is Running
```bash
npm run dev
```

If not running, start it. The server should be at:
**http://localhost:4321/RadioExamHelper/**

### 2. Test Landing Page
1. Open: **http://localhost:4321/RadioExamHelper/**
2. You should see three options:
   - **Q-Codes Flashcards** (blue card)
   - **Phonetic Alphabets** (green card)
   - **View Statistics** (button at bottom)

### 3. Test Navigation - Q-Codes
1. Click the **"Q-Codes Flashcards"** blue card
2. Should navigate to: `/RadioExamHelper/qcodes`
3. Should see:
   - Header with "Q-Codes Flashcards"
   - Filter buttons (QRA, QRB, etc.)
   - Shuffle toggle
   - A flashcard showing a Q-code (e.g., "QRA")

### 4. Test Flashcard Interactions
1. On the Q-codes page:
2. Press **Space** or click **"Reveal Answer"**
   - Should show the meaning in Polish
3. Click **"❌ Again"** or press **1**
   - Should move to next card
4. Click **"✅ Got It"** or press **2**
   - Should move to next card and save progress

### 5. Test Navigation - Phonetic Alphabets
1. Go back to home: Click **"← Back"** or visit `/RadioExamHelper/`
2. Click the **"Phonetic Alphabets"** green card
3. Should navigate to: `/RadioExamHelper/phonetic`
4. Should see:
   - Alphabet selector (NATO / Polish)
   - A random word displayed
   - "Show Spelling" and "Try Spelling" buttons

### 6. Test Phonetic Trainer
1. Click **"🔍 Show Spelling"**
   - Should display phonetic spelling (e.g., "RADIO" → "Romeo Alfa Delta India Oscar")
2. Click **"Next Word"**
   - Should generate a new word
3. Switch between **NATO** and **Polish** alphabets
   - Should work instantly
4. Try **"✍️ Try Spelling"**
   - Should show input field
   - Type a spelling and check

### 7. Test Navigation - Statistics
1. Go back to home
2. Click **"View Statistics"** button
3. Should navigate to: `/RadioExamHelper/stats`
4. Should see:
   - Due Today counter
   - Current Streak
   - Total Reviews
   - Accuracy percentage

### 8. Test Statistics Page
1. Should display cards due count
2. Should show learning progress by box level
3. If you've reviewed cards, should show card details table
4. Click **"← Back"** to return home

---

## 🎯 Expected Results

### ✅ All Buttons Should Work
- [x] Q-Codes card clicks
- [x] Phonetic Alphabets card clicks
- [x] View Statistics button clicks
- [x] Back buttons on all pages
- [x] Reveal/Answer buttons on flashcards
- [x] Filter buttons on Q-codes page
- [x] Alphabet toggle buttons
- [x] All form inputs

### ✅ All Navigation Should Work
- [x] Home → Q-Codes
- [x] Home → Phonetic
- [x] Home → Stats
- [x] Any page → Home (via Back link)

### ✅ All Interactions Should Work
- [x] Keyboard shortcuts (Space, 1, 2, arrows)
- [x] Mouse clicks
- [x] Touch events (on mobile)
- [x] Form submissions

---

## 🐛 Troubleshooting

### If buttons still don't work:

1. **Hard refresh the browser:**
   - Mac: `Cmd + Shift + R`
   - Windows/Linux: `Ctrl + Shift + R`
   - Or clear browser cache

2. **Check browser console:**
   - Press `F12` or right-click → Inspect
   - Look for errors in Console tab
   - Should see no red errors

3. **Restart dev server:**
   ```bash
   # Stop current server (Ctrl + C)
   npm run dev
   ```

4. **Clear Astro cache:**
   ```bash
   rm -rf .astro
   npm run dev
   ```

### Common Issues:

**Buttons don't respond:**
- Refresh the page (hot reload might not have worked)
- Check if JavaScript is enabled in browser
- Look for console errors

**Navigation goes to wrong URL:**
- Check if base URL is correct in `astro.config.mjs`
- Should be `/RadioExamHelper` for GitHub Pages

**Components don't load:**
- Ensure `client:load` directive is present
- Check that React is imported in components

---

## ✅ Success Criteria

All these should work:
- ✅ Click Q-Codes → See flashcards
- ✅ Click Phonetic → See trainer
- ✅ Click Stats → See statistics
- ✅ Flashcards reveal on Space/click
- ✅ Flashcards advance on 1/2 keys
- ✅ Phonetic trainer shows spelling
- ✅ All "Back" buttons return home
- ✅ No console errors
- ✅ Smooth animations/transitions

---

## 📝 Quick Smoke Test Checklist

```
□ Open http://localhost:4321/RadioExamHelper/
□ Click Q-Codes → Works ✓
□ Press Space → Reveals answer ✓
□ Press 2 → Next card ✓
□ Click Back → Returns home ✓
□ Click Phonetic → Works ✓
□ Click Show Spelling → Works ✓
□ Switch NATO/Polish → Works ✓
□ Click Back → Returns home ✓
□ Click View Statistics → Works ✓
□ Click Back → Returns home ✓
```

If all checkboxes pass: **🎉 Everything is working!**

---

## 🚀 Next Steps

Once everything works locally:

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "Fix: React component hydration and button interactions"
   git push origin main
   ```

2. **Deploy will happen automatically** via GitHub Actions

3. **Test on live site:**
   - Wait for deployment (~2-3 minutes)
   - Visit: https://piotrof.github.io/RadioExamHelper/
   - Run the same tests

---

**Happy testing!** 📻✨
