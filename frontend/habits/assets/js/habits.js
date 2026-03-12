// ===========================
// HABIT TRACKER - Frontend JS
// ===========================

const API_BASE_URL = 'http://127.0.0.1:5001';
let appState = {
    habits: [],
    dailyLogs: {},
    currentDate: new Date().toISOString().split('T')[0],
    challangeInfo: {},
    progressChart: null
};

// ===========================
// PAGE INITIALIZATION
// ===========================
async function initApp() {
    console.log('🎯 Initializing Habit Tracker...');
    setupEventListeners();
    await loadHabits();
    await loadProgress();
    await loadGitHubCommits();
    displayTodaySection();
}

// ===========================
// EVENT LISTENERS
// ===========================
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchTab(e.target.dataset.tab);
        });
    });
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Mark button as active
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Load specific tab content
    if (tabName === 'calendar') {
        displayCalendar();
    } else if (tabName === 'progress') {
        displayProgress();
    } else if (tabName === 'github') {
        displayGithub();
    }
}

// ===========================
// LOAD HABITS
// ===========================
async function loadHabits() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/habits/all`);
        const result = await response.json();
        
        if (result.status === 'success') {
            appState.habits = result.data.habits;
            appState.challngeInfo = {
                start: result.data.challenge_start,
                end: result.data.challenge_end,
                duration: result.data.duration_days
            };
            
            await loadDailyHabits(appState.currentDate);
            displayTodaySection();
        }
    } catch (error) {
        console.error('Error loading habits:', error);
        showError('Failed to load habits');
    }
}

async function loadDailyHabits(date) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/habits/daily/${date}`);
        const result = await response.json();
        
        if (result.status === 'success') {
            appState.dailyLogs[date] = result.data;
        }
    } catch (error) {
        console.error('Error loading daily habits:', error);
    }
}

// ===========================
// DISPLAY TODAY SECTION
// ===========================
async function displayTodaySection() {
    const today = new Date().toISOString().split('T')[0];
    appState.currentDate = today;
    
    // Ensure we have today's data
    if (!appState.dailyLogs[today]) {
        await loadDailyHabits(today);
    }
    
    const dailyLog = appState.dailyLogs[today];
    
    if (!dailyLog) {
        console.error('No daily log for today');
        return;
    }
    
    // Update date display
    const dateObj = new Date(today);
    document.getElementById('todayDate').textContent = dateObj.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('dayNumber').textContent = `Day ${dailyLog.day_number} of 10`;
    
    // Display habits
    const habitsList = document.getElementById('habitsList');
    habitsList.innerHTML = '';
    
    const completedCount = dailyLog.completed_habits.length;
    const totalCount = appState.habits.length;
    const completionPercent = (completedCount / totalCount * 100).toFixed(0);
    
    appState.habits.forEach(habit => {
        const isCompleted = dailyLog.completed_habits.includes(habit.id);
        const habitElement = createHabitElement(habit, isCompleted, today);
        habitsList.appendChild(habitElement);
    });
    
    // Update progress circle
    updateProgressCircle(completionPercent);
    
    // Update daily notes
    document.getElementById('dailyNotes').value = dailyLog.notes || '';
}

function createHabitElement(habit, isCompleted, date) {
    const div = document.createElement('div');
    div.className = `habit-item ${isCompleted ? 'completed' : ''}`;
    div.innerHTML = `
        <div class="habit-info">
            <div class="habit-emoji">${habit.emoji}</div>
            <div class="habit-details">
                <h3>${habit.name}</h3>
                <p class="habit-desc">${habit.description}</p>
            </div>
        </div>
        <button class="habit-checkbox" onclick="toggleHabit(${habit.id}, '${date}')">
            ${isCompleted ? '✓' : ''}
        </button>
    `;
    return div;
}

function updateProgressCircle(percent) {
    const circle = document.querySelector('.progress-fill');
    const circumference = 2 * Math.PI * 45; // radius = 45
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    document.getElementById('dayCompletionPercent').textContent = `${percent.toFixed(0)}%`;
}

// ===========================
// TOGGLE HABIT
// ===========================
async function toggleHabit(habitId, date) {
    try {
        const dailyLog = appState.dailyLogs[date];
        const isCompleted = dailyLog.completed_habits.includes(habitId);
        
        const endpoint = isCompleted ? 'uncomplete' : 'complete';
        const response = await fetch(`${API_BASE_URL}/api/habits/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, habit_id: habitId })
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            appState.dailyLogs[date] = result.data;
            await displayTodaySection();
        }
    } catch (error) {
        console.error('Error toggling habit:', error);
        showError('Failed to update habit');
    }
}

// ===========================
// SAVE NOTES
// ===========================
async function saveNotes() {
    try {
        const notes = document.getElementById('dailyNotes').value;
        const date = appState.currentDate;
        
        const response = await fetch(`${API_BASE_URL}/api/habits/notes/${date}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notes })
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            showSuccess('Notes saved!');
            appState.dailyLogs[date] = result.data;
        }
    } catch (error) {
        console.error('Error saving notes:', error);
        showError('Failed to save notes');
    }
}

// ===========================
// LOAD AND DISPLAY PROGRESS
// ===========================
async function loadProgress() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/habits/progress`);
        const result = await response.json();
        
        if (result.status === 'success') {
            const progress = result.data;
            
            // Update header stats
            document.getElementById('overallProgress').textContent = 
                `${progress.completion_rate.toFixed(0)}%`;
            document.getElementById('daysCompleted').textContent = 
                `${progress.days_completed}/${progress.total_days}`;
            
            // Store all daily logs
            progress.daily_summaries.forEach(summary => {
                if (!appState.dailyLogs[summary.date]) {
                    appState.dailyLogs[summary.date] = summary;
                }
            });
        }
    } catch (error) {
        console.error('Error loading progress:', error);
    }
}

function displayProgress() {
    loadProgress().then(() => {
        const response = fetch(`${API_BASE_URL}/api/habits/progress`).then(r => r.json());
        response.then(result => {
            if (result.status === 'success') {
                const progress = result.data;
                
                // Update stats
                document.getElementById('totalHabits').textContent = appState.habits.length;
                document.getElementById('completedDays').textContent = progress.days_completed;
                document.getElementById('successRate').textContent = 
                    `${progress.completion_rate.toFixed(0)}%`;
                
                // Calculate current streak
                let streak = 0;
                const today = new Date();
                for (let i = progress.daily_summaries.length - 1; i >= 0; i--) {
                    const summary = progress.daily_summaries[i];
                    if (summary.completion_percentage === 100) {
                        streak++;
                    } else {
                        break;
                    }
                }
                
                document.getElementById('currentStreak').textContent = streak;
                
                // Create progress chart
                if (appState.progressChart) {
                    appState.progressChart.destroy();
                }
                
                const ctx = document.getElementById('progressChart').getContext('2d');
                appState.progressChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: progress.daily_summaries.map(s => `Day ${s.day_number}`),
                        datasets: [{
                            label: 'Daily Completion %',
                            data: progress.daily_summaries.map(s => s.completion_percentage),
                            backgroundColor: progress.daily_summaries.map(s => 
                                s.completion_percentage === 100 ? '#10b981' : 
                                s.completion_percentage >= 50 ? '#f59e0b' : 
                                '#ef4444'
                            ),
                            borderColor: '#475569',
                            borderWidth: 2,
                            borderRadius: 8
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: { color: '#f1f5f9', font: { size: 12 } }
                            }
                        },
                        scales: {
                            y: {
                                max: 100,
                                ticks: { color: '#cbd5e1' },
                                grid: { color: 'rgba(71, 85, 105, 0.2)' }
                            },
                            x: {
                                ticks: { color: '#cbd5e1' },
                                grid: { color: 'rgba(71, 85, 105, 0.2)' }
                            }
                        }
                    }
                });
            }
        });
    });
}

// ===========================
// DISPLAY CALENDAR
// ===========================
function displayCalendar() {
    const calendar = document.getElementById('miniCalendar');
    calendar.innerHTML = '';
    
    for (let i = 1; i <= 10; i++) {
        const startDate = new Date(appState.challngeInfo.start);
        const dayDate = new Date(startDate);
        dayDate.setDate(dayDate.getDate() + (i - 1));
        const dateStr = dayDate.toISOString().split('T')[0];
        
        const dailyLog = appState.dailyLogs[dateStr];
        const isCompleted = dailyLog && dailyLog.completed_habits.length === appState.habits.length;
        
        const dayElement = document.createElement('div');
        dayElement.className = `calendar-day ${isCompleted ? 'completed' : ''}`;
        dayElement.innerHTML = `
            <div class="day-num">Day ${i}</div>
            <div class="completion">${dailyLog ? dailyLog.completed_habits.length : 0}/${appState.habits.length}</div>
        `;
        dayElement.onclick = () => goToDay(dateStr);
        calendar.appendChild(dayElement);
    }
}

// ===========================
// LOAD AND DISPLAY GITHUB
// ===========================
async function loadGitHubCommits() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/github/commits`);
        const result = await response.json();
        
        if (result.status === 'success') {
            console.log('GitHub commits loaded:', result.data);
        }
    } catch (error) {
        console.error('Error loading GitHub commits:', error);
    }
}

function displayGithub() {
    loadGitHubCommits().then(() => {
        const response = fetch(`${API_BASE_URL}/api/github/commits`).then(r => r.json());
        response.then(result => {
            if (result.status === 'success') {
                const info = document.getElementById('githubInfo');
                info.innerHTML = `
                    <p>📊 GitHub commits tracked for <strong>@${result.username}</strong></p>
                    <p>Commits during challenge period are synced with your daily logs</p>
                `;
                
                const commitsList = document.getElementById('commitsList');
                commitsList.innerHTML = '';
                
                const commits = result.data;
                if (Object.keys(commits).length === 0) {
                    commitsList.innerHTML = '<p style="text-align: center; color: #cbd5e1;">No commits found yet</p>';
                    return;
                }
                
                Object.entries(commits)
                    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
                    .forEach(([date, data]) => {
                        const dayElement = document.createElement('div');
                        dayElement.className = 'commit-day';
                        dayElement.innerHTML = `
                            <div>
                                <div class="commit-date">${new Date(date).toLocaleDateString('id-ID')}</div>
                                <div style="color: #cbd5e1; font-size: 0.9em;">${Array.from(data.repos).join(', ')}</div>
                            </div>
                            <div class="commit-count">${data.count} 🔄</div>
                        `;
                        commitsList.appendChild(dayElement);
                    });
            }
        });
    });
}

// ===========================
// UTILITY FUNCTIONS
// ===========================
function goToToday() {
    switchTab('today');
    displayTodaySection();
}

function goToDay(date) {
    appState.currentDate = date;
    switchTab('today');
    displayTodaySection();
}

async function resetChallenge() {
    if (confirm('⚠️ This will reset all your progress. Are you sure?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/habits/reset`, {
                method: 'POST'
            });
            const result = await response.json();
            
            if (result.status === 'success') {
                appState.dailyLogs = {};
                await loadHabits();
                await loadProgress();
                showSuccess('Challenge reset successfully!');
            }
        } catch (error) {
            console.error('Error resetting challenge:', error);
            showError('Failed to reset challenge');
        }
    }
}

function showSuccess(message) {
    alert(`✅ ${message}`);
}

function showError(message) {
    alert(`❌ ${message}`);
}

// ===========================
// START THE APP
// ===========================
window.addEventListener('DOMContentLoaded', initApp);
