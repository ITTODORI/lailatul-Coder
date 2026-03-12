"""
Habit Tracker + GitHub Commits Tracker
Memantau kebiasaan harian dan commits ke GitHub selama 10 hari
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import json
import os
from pathlib import Path
import requests
from functools import lru_cache

app = Flask(__name__)
CORS(app)

# ====== CONFIGURATION ======
HABITS_FILE = 'habits_data.json'
GITHUB_USERNAME = os.getenv('GITHUB_USERNAME', 'ITTODORI')  # Ganti dengan username GitHub kamu
CHALLENGE_DURATION = 10  # hari
CHALLENGE_START_DATE = os.getenv('CHALLENGE_START_DATE', datetime.now().strftime('%Y-%m-%d'))

# ====== DATA STRUCTURES ======
DEFAULT_HABITS = [
    {'id': 1, 'name': 'Coding', 'emoji': '💻', 'description': 'Write code for at least 1 hour'},
    {'id': 2, 'name': 'Learning', 'emoji': '📚', 'description': 'Learn something new'},
    {'id': 3, 'name': 'Exercise', 'emoji': '🏃', 'description': 'Physical exercise or walk'},
    {'id': 4, 'name': 'GitHub Commit', 'emoji': '🔄', 'description': 'Make at least 1 commit to GitHub'},
    {'id': 5, 'name': 'Reading', 'emoji': '📖', 'description': 'Read something (article, book, docs)'},
]

# ====== UTILITY FUNCTIONS ======
def load_habits_data():
    """Load habits data from JSON file"""
    if os.path.exists(HABITS_FILE):
        with open(HABITS_FILE, 'r') as f:
            return json.load(f)
    return initialize_habits_data()

def initialize_habits_data():
    """Initialize habits data for 10-day challenge"""
    start_date = datetime.strptime(CHALLENGE_START_DATE, '%Y-%m-%d')
    data = {
        'challenge_start': CHALLENGE_START_DATE,
        'challenge_end': (start_date + timedelta(days=CHALLENGE_DURATION-1)).strftime('%Y-%m-%d'),
        'habits': DEFAULT_HABITS,
        'daily_logs': {}
    }
    
    # Initialize 10 days of logs
    for i in range(CHALLENGE_DURATION):
        day_date = (start_date + timedelta(days=i)).strftime('%Y-%m-%d')
        data['daily_logs'][day_date] = {
            'date': day_date,
            'day_number': i + 1,
            'completed_habits': [],
            'github_commits': 0,
            'notes': ''
        }
    
    save_habits_data(data)
    return data

def save_habits_data(data):
    """Save habits data to JSON file"""
    with open(HABITS_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@lru_cache(maxsize=1)
def get_github_commits(username, days=10):
    """Fetch GitHub commits for the last N days"""
    try:
        # GitHub API endpoint untuk mendapatkan events dari user
        url = f'https://api.github.com/users/{username}/events/public'
        headers = {'Accept': 'application/vnd.github.v3+json'}
        
        response = requests.get(url, headers=headers, timeout=5)
        if response.status_code != 200:
            return []
        
        events = response.json()
        commits_by_date = {}
        
        # Filter push events (commits) dari last N days
        start_date = datetime.now() - timedelta(days=days)
        
        for event in events:
            if event['type'] == 'PushEvent':
                event_date = datetime.fromisoformat(event['created_at'].replace('Z', '+00:00'))
                if event_date > start_date:
                    date_str = event_date.strftime('%Y-%m-%d')
                    if date_str not in commits_by_date:
                        commits_by_date[date_str] = {
                            'count': 0,
                            'repos': set()
                        }
                    commits_by_date[date_str]['count'] += event['payload'].get('size', 0)
                    commits_by_date[date_str]['repos'].add(event['repo']['name'])
        
        return commits_by_date
    except Exception as e:
        print(f"Error fetching GitHub commits: {e}")
        return {}

# ====== API ENDPOINTS ======

@app.route('/api/habits/all', methods=['GET'])
def get_all_habits():
    """Get all habits and challenge info"""
    try:
        data = load_habits_data()
        return jsonify({
            'status': 'success',
            'data': {
                'challenge_start': data['challenge_start'],
                'challenge_end': data['challenge_end'],
                'duration_days': CHALLENGE_DURATION,
                'habits': data['habits']
            }
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/habits/daily/<date>', methods=['GET'])
def get_daily_habits(date):
    """Get habits for a specific date"""
    try:
        data = load_habits_data()
        if date in data['daily_logs']:
            return jsonify({
                'status': 'success',
                'data': data['daily_logs'][date]
            })
        return jsonify({'status': 'error', 'message': 'Date not found'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/habits/complete', methods=['POST'])
def complete_habit():
    """Mark a habit as completed for a specific date"""
    try:
        data_dict = request.get_json()
        date = data_dict.get('date')
        habit_id = data_dict.get('habit_id')
        
        data = load_habits_data()
        
        if date not in data['daily_logs']:
            return jsonify({'status': 'error', 'message': 'Date not found'}), 404
        
        completed = data['daily_logs'][date]['completed_habits']
        if habit_id not in completed:
            completed.append(habit_id)
        
        save_habits_data(data)
        
        return jsonify({
            'status': 'success',
            'message': 'Habit marked as completed',
            'data': data['daily_logs'][date]
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/habits/uncomplete', methods=['POST'])
def uncomplete_habit():
    """Unmark a completed habit"""
    try:
        data_dict = request.get_json()
        date = data_dict.get('date')
        habit_id = data_dict.get('habit_id')
        
        data = load_habits_data()
        
        if date not in data['daily_logs']:
            return jsonify({'status': 'error', 'message': 'Date not found'}), 404
        
        completed = data['daily_logs'][date]['completed_habits']
        if habit_id in completed:
            completed.remove(habit_id)
        
        save_habits_data(data)
        
        return jsonify({
            'status': 'success',
            'message': 'Habit unmarked',
            'data': data['daily_logs'][date]
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/habits/notes/<date>', methods=['POST'])
def add_note(date):
    """Add notes for a specific date"""
    try:
        data_dict = request.get_json()
        notes = data_dict.get('notes', '')
        
        data = load_habits_data()
        
        if date not in data['daily_logs']:
            return jsonify({'status': 'error', 'message': 'Date not found'}), 404
        
        data['daily_logs'][date]['notes'] = notes
        save_habits_data(data)
        
        return jsonify({
            'status': 'success',
            'message': 'Notes saved',
            'data': data['daily_logs'][date]
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/habits/progress', methods=['GET'])
def get_progress():
    """Get overall progress for the challenge"""
    try:
        data = load_habits_data()
        progress = {
            'total_days': CHALLENGE_DURATION,
            'days_completed': 0,
            'completion_rate': 0,
            'daily_summaries': []
        }
        
        for date, daily_log in data['daily_logs'].items():
            completed_count = len(daily_log['completed_habits'])
            total_habits = len(data['habits'])
            daily_summary = {
                'date': date,
                'day_number': daily_log['day_number'],
                'completed_habits': completed_count,
                'total_habits': total_habits,
                'completion_percentage': (completed_count / total_habits * 100) if total_habits > 0 else 0
            }
            progress['daily_summaries'].append(daily_summary)
            
            # Count fully completed days (all habits done)
            if completed_count == total_habits:
                progress['days_completed'] += 1
        
        progress['completion_rate'] = (progress['days_completed'] / CHALLENGE_DURATION * 100) if CHALLENGE_DURATION > 0 else 0
        
        return jsonify({
            'status': 'success',
            'data': progress
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/github/commits', methods=['GET'])
def get_github():
    """Get GitHub commits for the challenge period"""
    try:
        commits_by_date = get_github_commits(GITHUB_USERNAME, CHALLENGE_DURATION)
        
        # Sync GitHub commits dengan daily logs
        data = load_habits_data()
        for date, daily_log in data['daily_logs'].items():
            if date in commits_by_date:
                daily_log['github_commits'] = commits_by_date[date]['count']
        
        save_habits_data(data)
        
        return jsonify({
            'status': 'success',
            'username': GITHUB_USERNAME,
            'data': commits_by_date
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/habits/reset', methods=['POST'])
def reset_challenge():
    """Reset the entire challenge (careful!)"""
    try:
        os.remove(HABITS_FILE)
        initialize_habits_data()
        return jsonify({
            'status': 'success',
            'message': 'Challenge reset successfully'
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/habits/status', methods=['GET'])
def get_status():
    """Get current status of the challenge"""
    try:
        data = load_habits_data()
        today = datetime.now().strftime('%Y-%m-%d')
        
        current_day_log = data['daily_logs'].get(today, {})
        
        return jsonify({
            'status': 'success',
            'data': {
                'today': today,
                'challenge_active': True,
                'current_day_log': current_day_log,
                'total_habits': len(data['habits']),
                'github_username': GITHUB_USERNAME
            }
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'success',
        'message': 'Habit Tracker API is running',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("🎯 Habit Tracker API running on http://127.0.0.1:5001")
    print(f"📊 GitHub Username: {GITHUB_USERNAME}")
    print(f"📅 Challenge Period: {CHALLENGE_START_DATE} to {(datetime.strptime(CHALLENGE_START_DATE, '%Y-%m-%d') + timedelta(days=CHALLENGE_DURATION-1)).strftime('%Y-%m-%d')}")
    initialize_habits_data()
    app.run(debug=True, port=5001)
