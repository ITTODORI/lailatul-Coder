// ===========================
// SYSTEM HEALTH MONITOR - App JS
// ===========================

// Configuration
const API_BASE_URL = 'http://127.0.0.1:5000';
const REFRESH_INTERVAL = 2000; // 2 seconds
const MAX_DATA_POINTS = 10;

// State Management
let appState = {
    isRunning: true,
    dataPoints: 0,
    cpuHistory: [],
    ramHistory: [],
    charts: {
        cpu: null,
        ram: null
    },
    lastUpdate: new Date()
};

// ===========================
// DOM ELEMENTS
// ===========================
const cpuValue = document.getElementById('cpuValue');
const ramValue = document.getElementById('ramValue');
const cpuProgress = document.getElementById('cpuProgress');
const ramProgress = document.getElementById('ramProgress');
const connectionStatus = document.getElementById('connectionStatus');
const statusText = document.getElementById('statusText');
const systemHealthText = document.getElementById('systemHealthText');
const lastUpdate = document.getElementById('lastUpdate');
const dataPoints = document.getElementById('dataPoints');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const refreshBtn = document.getElementById('refreshBtn');

// ===========================
// CHART INITIALIZATION
// ===========================
function initCharts() {
    // CPU Chart
    const cpuCtx = document.getElementById('cpuChart').getContext('2d');
    appState.charts.cpu = new Chart(cpuCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'CPU Usage (%)',
                data: [],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#f59e0b',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#f1f5f9',
                        font: {
                            size: 12,
                            weight: 600
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleColor: '#fff',
                    bodyColor: '#f1f5f9',
                    borderColor: '#f59e0b',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#cbd5e1',
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(71, 85, 105, 0.2)'
                    }
                },
                x: {
                    ticks: {
                        color: '#cbd5e1',
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(71, 85, 105, 0.2)'
                    }
                }
            }
        }
    });

    // RAM Chart
    const ramCtx = document.getElementById('ramChart').getContext('2d');
    appState.charts.ram = new Chart(ramCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'RAM Usage (%)',
                data: [],
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#06b6d4',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#f1f5f9',
                        font: {
                            size: 12,
                            weight: 600
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleColor: '#fff',
                    bodyColor: '#f1f5f9',
                    borderColor: '#06b6d4',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#cbd5e1',
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(71, 85, 105, 0.2)'
                    }
                },
                x: {
                    ticks: {
                        color: '#cbd5e1',
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(71, 85, 105, 0.2)'
                    }
                }
            }
        }
    });
}

// ===========================
// FETCH DATA FROM API
// ===========================
async function fetchSystemStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/system-stats`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'success') {
            updateUI(data.data);
            setConnectionStatus(true);
            return true;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        setConnectionStatus(false);
        return false;
    }
}

// ===========================
// UPDATE UI WITH DATA
// ===========================
function updateUI(data) {
    const cpu = Math.round(data.cpu_usage);
    const ram = Math.round(data.ram_usage);

    // Update values
    cpuValue.textContent = cpu;
    ramValue.textContent = ram;

    // Update progress bars
    cpuProgress.style.width = cpu + '%';
    ramProgress.style.width = ram + '%';

    // Update progress bar colors based on usage
    updateProgressColor(cpuProgress, cpu);
    updateProgressColor(ramProgress, ram);

    // Add to history
    appState.cpuHistory.push(cpu);
    appState.ramHistory.push(ram);

    // Keep only last MAX_DATA_POINTS
    if (appState.cpuHistory.length > MAX_DATA_POINTS) {
        appState.cpuHistory.shift();
        appState.ramHistory.shift();
    }

    // Update charts
    updateCharts();

    // Update system health
    updateSystemHealth(cpu, ram);

    // Update last update time
    updateTimestamp();

    // Increment data point counter
    appState.dataPoints++;
    dataPoints.textContent = `${appState.dataPoints} readings`;
}

// ===========================
// UPDATE PROGRESS BAR COLOR
// ===========================
function updateProgressColor(element, percentage) {
    if (percentage < 50) {
        element.style.background = 'linear-gradient(90deg, #10b981, #06b6d4)';
    } else if (percentage < 80) {
        element.style.background = 'linear-gradient(90deg, #f59e0b, #ef4444)';
    } else {
        element.style.background = '#ef4444';
    }
}

// ===========================
// UPDATE CHARTS
// ===========================
function updateCharts() {
    const time = new Date().toLocaleTimeString();

    // CPU Chart
    appState.charts.cpu.data.labels = appState.cpuHistory.map((_, i) => 
        `${MAX_DATA_POINTS - appState.cpuHistory.length + i + 1}`
    );
    appState.charts.cpu.data.datasets[0].data = appState.cpuHistory;
    appState.charts.cpu.update('none');

    // RAM Chart
    appState.charts.ram.data.labels = appState.ramHistory.map((_, i) => 
        `${MAX_DATA_POINTS - appState.ramHistory.length + i + 1}`
    );
    appState.charts.ram.data.datasets[0].data = appState.ramHistory;
    appState.charts.ram.update('none');
}

// ===========================
// UPDATE SYSTEM HEALTH
// ===========================
function updateSystemHealth(cpu, ram) {
    let health = 'Healthy';
    let color = '#10b981';

    if (cpu > 90 || ram > 90) {
        health = '⚠️ Critical';
        color = '#ef4444';
    } else if (cpu > 70 || ram > 70) {
        health = '⚠️ High Usage';
        color = '#f59e0b';
    } else if (cpu > 50 || ram > 50) {
        health = '📈 Moderate';
        color = '#06b6d4';
    }

    systemHealthText.textContent = health;
    systemHealthText.style.color = color;
}

// ===========================
// UPDATE TIMESTAMP
// ===========================
function updateTimestamp() {
    const now = new Date();
    const time = now.toLocaleTimeString();
    const date = now.toLocaleDateString();
    lastUpdate.textContent = `Updated: ${time} (${date})`;
}

// ===========================
// CONNECTION STATUS
// ===========================
function setConnectionStatus(isConnected) {
    if (isConnected) {
        connectionStatus.classList.add('connected');
        statusText.textContent = 'Connected';
        statusText.style.color = '#10b981';
    } else {
        connectionStatus.classList.remove('connected');
        statusText.textContent = 'Disconnected';
        statusText.style.color = '#ef4444';
    }
}

// ===========================
// MONITORING LOOP
// ===========================
let monitoringInterval;

function startMonitoring() {
    appState.isRunning = true;
    pauseBtn.textContent = '⏸️ Pause Monitoring';
    
    // Fetch immediately
    fetchSystemStats();
    
    // Then fetch at interval
    monitoringInterval = setInterval(() => {
        if (appState.isRunning) {
            fetchSystemStats();
        }
    }, REFRESH_INTERVAL);
}

function pauseMonitoring() {
    appState.isRunning = false;
    clearInterval(monitoringInterval);
    pauseBtn.textContent = '▶️ Resume Monitoring';
}

function toggleMonitoring() {
    if (appState.isRunning) {
        pauseMonitoring();
    } else {
        startMonitoring();
    }
}

function resetData() {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        appState.cpuHistory = [];
        appState.ramHistory = [];
        appState.dataPoints = 0;
        dataPoints.textContent = '0 readings';
        updateCharts();
    }
}

function refreshNow() {
    fetchSystemStats();
}

// ===========================
// EVENT LISTENERS
// ===========================
function setupEventListeners() {
    pauseBtn.addEventListener('click', toggleMonitoring);
    resetBtn.addEventListener('click', resetData);
    refreshBtn.addEventListener('click', refreshNow);
}

// ===========================
// INITIALIZATION
// ===========================
function init() {
    console.log('🖥️ System Health Monitor initialized');
    initCharts();
    setupEventListeners();
    startMonitoring();
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
