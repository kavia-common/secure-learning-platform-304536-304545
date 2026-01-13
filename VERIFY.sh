#!/bin/bash

echo "========================================"
echo "  Installation Verification"
echo "========================================"
echo ""

cd express_backend

# Check backend files
echo "Checking backend files..."
FILES=(
    "src/routes/vulnerable.js"
    "src/controllers/vulnerableController.js"
    "src/models/Comment.js"
    "src/models/Flag.js"
    "scripts/seed.js"
)

BACKEND_OK=true
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING"
        BACKEND_OK=false
    fi
done

# Check multer package
echo ""
echo "Checking dependencies..."
if grep -q "multer" package.json; then
    echo "✅ multer listed in package.json"
else
    echo "❌ multer missing from package.json"
    BACKEND_OK=false
fi

# Check uploads directory
if [ -d "uploads" ]; then
    echo "✅ uploads/ directory exists"
else
    echo "⚠️  uploads/ directory missing (will be created)"
fi

cd ../react_frontend

# Check frontend files
echo ""
echo "Checking frontend files..."
FRONTEND_FILES=(
    "src/pages/labs/StoredXSSLab.js"
    "src/pages/labs/ReflectedXSSLab.js"
    "src/pages/labs/DOMXSSLab.js"
    "src/pages/labs/NoSQLInjectionLab.js"
    "src/pages/labs/BrokenAuthLab.js"
    "src/pages/labs/IDORLab.js"
    "src/pages/labs/CSRFLab.js"
    "src/pages/labs/FileUploadLab.js"
    "src/pages/labs/CommandInjectionLab.js"
    "src/pages/CTFFlags.js"
    "src/pages/labs/LabPage.css"
    "src/pages/CTFFlags.css"
)

FRONTEND_OK=true
for file in "${FRONTEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING"
        FRONTEND_OK=false
    fi
done

echo ""
echo "========================================"
if [ "$BACKEND_OK" = true ] && [ "$FRONTEND_OK" = true ]; then
    echo "  ✅ All files verified!"
    echo "========================================"
    echo ""
    echo "Next steps:"
    echo "1. Configure .env in express_backend/"
    echo "2. Run: cd express_backend && npm install"
    echo "3. Run: npm run seed"
    echo "4. Run: npm run dev"
    echo "5. In new terminal: cd react_frontend && npm install && npm start"
    echo ""
    echo "Or use: ./START.sh for automated startup"
else
    echo "  ❌ Some files are missing!"
    echo "========================================"
    echo ""
    echo "Please check the output above and ensure all files are created."
fi
echo ""
