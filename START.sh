#!/bin/bash

echo "========================================"
echo "  Secure Learning Platform - Startup"
echo "========================================"
echo ""
echo "⚠️  WARNING: This is an intentionally vulnerable application!"
echo "    Only run in isolated, sandboxed environments."
echo ""

# Check if MongoDB is accessible
echo "Checking MongoDB connection..."
cd express_backend

if ! grep -q "MONGODB_URI" .env 2>/dev/null; then
    echo "❌ Error: .env file not configured"
    echo "   Please set MONGODB_URI in express_backend/.env"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Create uploads directory
mkdir -p uploads
chmod 755 uploads

# Seed database
echo ""
echo "🌱 Seeding database with 9 vulnerability labs..."
npm run seed

if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully!"
else
    echo "⚠️  Database seeding failed. Check MongoDB connection."
    echo "   Continuing anyway - manual seeding may be required."
fi

# Start backend
echo ""
echo "🚀 Starting backend server on port 3001..."
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
cd ../react_frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo ""
echo "🚀 Starting frontend server on port 3000..."
npm start &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "  ✅ Secure Learning Platform Started!"
echo "========================================"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:3001"
echo "📚 API Docs: http://localhost:3001/docs"
echo ""
echo "🔑 Default Credentials:"
echo "   Admin: admin@example.com / admin"
echo "   User:  victim@example.com / victim123"
echo ""
echo "🎯 9 Vulnerability Labs Available"
echo "🏆 20 CTF Flags Hidden Throughout"
echo ""
echo "Press Ctrl+C to stop all servers"
echo "========================================"

# Wait for user interrupt
wait
