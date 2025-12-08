#!/bin/bash
# Start both backend and frontend together

echo "🚀 Starting Backend and Frontend..."

# Kill existing processes on ports 3000 and 5173
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Start backend
echo "🔧 Starting Backend Server (port 3000)..."
cd "$(dirname "$0")/.."
npm run server > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "   ✅ Backend is running"
else
    echo "   ⚠️  Backend may not be ready yet"
fi

# Start frontend
echo "🎨 Starting Frontend (port 5173)..."
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

echo ""
echo "✅ Both servers are starting..."
echo ""
echo "📡 Backend: http://localhost:3000"
echo "🎨 Frontend: http://localhost:5173"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f /tmp/backend.log"
echo "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo "🛑 To stop:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Save PIDs to file
echo "$BACKEND_PID $FRONTEND_PID" > /tmp/musicapp-pids.txt

