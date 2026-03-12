#!/bin/bash

# Habit Tracker & GitHub Commits Runner
# Menjalankan Backend API dan Frontend Dashboard

echo "🎯 Starting Habit Tracker Application..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    exit 1
fi

# Check if dependencies are installed
echo -e "${BLUE}📦 Checking dependencies...${NC}"
pip3 install -q -r requirements.txt 2>/dev/null

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo "📝 Please edit .env with your GitHub username"
fi

# Start Backend API
echo ""
echo -e "${GREEN}🚀 Starting Backend API (Port 5001)...${NC}"
echo -e "${BLUE}📍 API URL: http://127.0.0.1:5001${NC}"
python3 habits.py &
API_PID=$!

# Wait for API to start
sleep 2

# Start Frontend Server (simple Python HTTP server)
echo ""
echo -e "${GREEN}🚀 Starting Frontend Server (Port 3000)...${NC}"
echo -e "${BLUE}📍 Frontend URL: http://127.0.0.1:3000/frontend/habits${NC}"
cd frontend/habits
python3 -m http.server 3000 > /dev/null 2>&1 &
FRONTEND_PID=$!
cd ../..

echo ""
echo -e "${GREEN}✅ Habit Tracker is Running!${NC}"
echo ""
echo -e "${YELLOW}📊 Dashboard:${NC}"
echo "   🎯 Habit Tracker: http://127.0.0.1:3000/frontend/habits"
echo "   🖥️  System Monitor: http://127.0.0.1:3000"
echo ""
echo -e "${YELLOW}🔧 API Endpoints:${NC}"
echo "   Health Check: http://127.0.0.1:5001/api/health"
echo "   Get All Habits: http://127.0.0.1:5001/api/habits/all"
echo "   Get Progress: http://127.0.0.1:5001/api/habits/progress"
echo "   GitHub Commits: http://127.0.0.1:5001/api/github/commits"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "   1. Edit .env to change your GitHub username"
echo "   2. Open http://127.0.0.1:3000/frontend/habits in your browser"
echo "   3. Start tracking your daily habits!"
echo "   4. Your GitHub commits will be tracked automatically"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the servers${NC}"
echo ""

# Function to clean up on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping Habit Tracker...${NC}"
    kill $API_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ All servers stopped.${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for both processes
wait
