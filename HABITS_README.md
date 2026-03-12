# 🎯 10-Day Habit Tracker with GitHub Commit Integration

Build your perfect habits over 10 days while tracking your GitHub commits!

## 📋 Features

- ✅ **Daily Habit Tracking** - Monitor up to 5 customizable habits per day
- 📊 **Progress Dashboard** - Visual progress charts and completion stats
- 🔄 **GitHub Integration** - Automatically sync your GitHub commits
- 📝 **Daily Notes** - Keep notes on your progress and learnings
- 📅 **Calendar View** - See all 10 days at a glance
- 🎯 **Streak Counter** - Track your consistency
- 📱 **Responsive Design** - Works on desktop and mobile

## 🚀 Quick Start

### 1. Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Copy environment configuration
cp .env.example .env
```

### 2. Configure GitHub Username

Edit `.env` and set your GitHub username:
```env
GITHUB_USERNAME=ITTODORI
CHALLENGE_START_DATE=2026-03-12
```

### 3. Run the Application

```bash
# Make script executable
chmod +x run-habits.sh

# Start the application
./run-habits.sh
```

Or run manually:
```bash
# Terminal 1: Start Backend API (Port 5001)
python3 habits.py

# Terminal 2: Start Frontend (Port 3000)
cd frontend/habits
python3 -m http.server 3000
```

### 4. Open in Browser

```
🎯 Habit Tracker: http://127.0.0.1:3000/frontend/habits
```

## 📖 How to Use

### Today Tab 📅
- View today's date and day number
- Check off habits as you complete them
- Add daily notes about your progress
- Visual progress indicator shows completion %

### Calendar Tab 📆
- See all 10 days of the challenge
- Click on any day to view/edit that day's habits
- Color-coded: Green = fully completed, others = partial

### Progress Tab 📊
- View overall completion statistics
- Chart showing daily completion percentages
- Track your streak and success rate
- Total habits completed counter

### GitHub Tab 🔄
- See all commits made during the challenge period
- Automatically synced from your GitHub account
- Filtered to challenge dates

## 🔧 API Endpoints

### Habits Management
```
GET  /api/habits/all                    - Get all habits
GET  /api/habits/daily/<date>           - Get habits for specific date
POST /api/habits/complete               - Mark habit complete
POST /api/habits/uncomplete             - Unmark habit
POST /api/habits/notes/<date>           - Save daily notes
```

### Progress & Tracking
```
GET  /api/habits/progress               - Get overall progress
GET  /api/github/commits                - Get GitHub commits
GET  /api/habits/status                 - Current challenge status
```

### Admin
```
POST /api/habits/reset                  - Reset entire challenge
GET  /api/health                        - Health check
```

## 📊 Default Habits

1. **Coding** 💻 - Write code for at least 1 hour
2. **Learning** 📚 - Learn something new
3. **Exercise** 🏃 - Physical exercise or walk
4. **GitHub Commit** 🔄 - Make at least 1 commit
5. **Reading** 📖 - Read something (article, book, docs)

## 🎮 Customization

### Add Custom Habits

Edit `habits.py` and modify the `DEFAULT_HABITS` list:

```python
DEFAULT_HABITS = [
    {'id': 1, 'name': 'Your Habit', 'emoji': '🎯', 'description': 'Description here'},
    # ...
]
```

### Change Challenge Duration

Set `CHALLENGE_DURATION` in `habits.py`:
```python
CHALLENGE_DURATION = 10  # Change to desired days
```

### Set Start Date

Update in `.env`:
```
CHALLENGE_START_DATE=2026-03-12
```

## 📁 Project Structure

```
lailatul-Coder/
├── habits.py                          # Backend API server
├── requirements.txt                   # Python dependencies
├── .env.example                       # Environment template
├── run-habits.sh                      # Start script
└── frontend/
    └── habits/
        ├── index.html                 # Main dashboard
        └── assets/
            ├── css/
            │   └── habits.css         # Styles
            └── js/
                └── habits.js          # Frontend logic
```

## 📊 Data Storage

Habits data is stored in `habits_data.json`:
- All daily logs
- Completed habits
- Notes and progress
- GitHub commit sync

## 🔐 Privacy

- All data stored locally (habits_data.json)
- GitHub API uses public endpoints (no authentication needed)
- No data sent to external servers

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :5001
lsof -i :3000

# Kill process
kill -9 <PID>
```

### GitHub Commits Not Showing
- Check GitHub username in `.env`
- Ensure you have made commits in the challenge period
- API limits: 60 requests/hour for unauthenticated requests

### Can't Connect to API
- Make sure `habits.py` is running
- Check if port 5001 is open
- Try: `curl http://127.0.0.1:5001/api/health`

## 💡 Pro Tips

1. **Set Daily Reminders** - Check your habits each morning
2. **Track Streaks** - The Progress tab shows your current streak
3. **Review Notes** - Read your daily notes for motivation
4. **GitHub Sync** - Pure commits during the challenge for best tracking
5. **Export Data** - Download `habits_data.json` for backup

## 🎓 Learning Path

This project demonstrates:
- Flask REST API development
- Frontend-Backend integration
- GitHub API usage
- Data persistence with JSON
- Progress tracking and visualization
- Chart.js for data visualization

## 📈 Next Steps After 10 Days

- Analyze your completion data
- Export habits_data.json for records
- Start a new 10-day challenge
- Extend habits you found valuable
- Share your progress on GitHub

## 🤝 Contributing

To customize this project:
1. Edit default habits in `habits.py`
2. Modify challenge duration
3. Add more visualization charts
4. Integrate with calendar apps
5. Add email reminders

## 📝 License

Open source - feel free to modify and use!

## 🎉 Ready to Start?

```bash
./run-habits.sh
```

Visit: **http://127.0.0.1:3000/frontend/habits**

Let's build those habits! 🚀
