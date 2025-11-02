#!/bin/bash

# Radio Exam Helper - Quick Verification Script
# Run this to verify everything is working correctly

echo "🔍 Radio Exam Helper - System Check"
echo "===================================="
echo ""

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies not installed"
    echo "   Run: npm install --legacy-peer-deps"
    exit 1
fi

# Check if dev server is running
if lsof -Pi :4321 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Development server is running on port 4321"
    echo "   Visit: http://localhost:4321/RadioExamHelper/"
else
    echo "⚠️  Development server not running"
    echo "   Run: npm run dev"
fi

# Check key files exist
echo ""
echo "📁 Checking project files..."

files=(
    "src/components/ModePicker.tsx"
    "src/components/Flashcard.tsx"
    "src/components/QCodeTrainer.tsx"
    "src/components/PhoneticTrainer.tsx"
    "src/components/Stats.tsx"
    "src/lib/storage.ts"
    "src/lib/srs.ts"
    "src/lib/format.ts"
    "src/lib/data.ts"
    "src/data/alphabets.ts"
    "public/qcodes.json"
    "public/manifest.webmanifest"
)

all_good=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (missing)"
        all_good=false
    fi
done

echo ""
if [ "$all_good" = true ]; then
    echo "✅ All essential files present"
else
    echo "❌ Some files are missing"
    exit 1
fi

# Try to build data
echo ""
echo "🔨 Testing data validation..."
npm run build:data > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Data validation passed"
else
    echo "❌ Data validation failed"
    echo "   Run: npm run build:data"
    exit 1
fi

echo ""
echo "================================================"
echo "✅ All systems operational!"
echo ""
echo "Next steps:"
echo "  1. Open: http://localhost:4321/RadioExamHelper/"
echo "  2. Test Q-codes flashcards"
echo "  3. Test phonetic alphabets"
echo "  4. Check statistics page"
echo ""
echo "Deploy when ready:"
echo "  git add ."
echo "  git commit -m 'Initial deployment'"
echo "  git push origin main"
echo ""
echo "📻 73 and happy studying!"
