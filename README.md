# 🖥️ System Health Monitor Dashboard

Personal system health monitoring application with real-time Flask backend API dan interactive HTML5/CSS3 Dashboard.

## 📁 Project Structure

```
/
├── app.py                           # Flask Backend API
├── requirements.txt                 # Python dependencies
├── run.sh                           # Script untuk menjalankan backend
├── run-frontend.sh                  # Script untuk menjalankan frontend
├── README.md                        # Dokumentasi ini
└── frontend/                        # Dashboard Frontend
    ├── index.html                   # Main dashboard page
    └── assets/
        ├── css/
        │   └── style.css            # Styling & layout
        └── js/
            └── app.js               # Dashboard logic & API integration
```

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Terminal/Command Prompt

### Installation & Running

#### 1️⃣ **Install Dependencies**
```bash
pip install -r requirements.txt
```

#### 2️⃣ **Terminal 1 - Run Backend (Flask API)**
```bash
# Linux/Mac
bash run.sh

# Or manually
python3 app.py
```
✅ Backend akan berjalan di: `http://127.0.0.1:5000`  
API Endpoint: `http://127.0.0.1:5000/api/system-stats`

#### 3️⃣ **Terminal 2 - Run Frontend (Web Server)**
```bash
# Linux/Mac
bash run-frontend.sh

# Or manually
cd frontend
python3 -m http.server 8000 --bind 127.0.0.1
```
✅ Frontend akan berjalan di: `http://127.0.0.1:8000`

#### 4️⃣ **Buka di Browser**
Kunjungi: **http://127.0.0.1:8000**

## ✨ Features

### Backend Features (Python Flask)
- ✅ Real-time CPU usage monitoring
- ✅ Real-time RAM usage monitoring
- ✅ JSON API endpoint
- ✅ CORS enabled untuk frontend access
- ✅ Lightweight & fast response

### Frontend Features (HTML/CSS/JS)
- ✅ **Real-time Dashboard** - Update setiap 2 detik
- ✅ **Stat Cards** - CPU, RAM, System Status
- ✅ **Interactive Charts** - Riwayat 10 data terakhir dengan Chart.js
- ✅ **Connection Status** - Indikator koneksi API
- ✅ **System Health** - Indicator status sistem (Healthy/Warning/Critical)
- ✅ **Controls** - Pause, Resume, Reset, Refresh
- ✅ **Responsive Design** - Desktop, Tablet, Mobile
- ✅ **Dark Theme** - Modern gradient design
- ✅ **Smooth Animations** - Transisi dan hover effects

## 📊 Dashboard Components

### 1. **Header Section**
- Logo dan judul
- Connection status indicator
- Real-time status display

### 2. **Stats Section**
- **CPU Usage Card** - Persentase penggunaan CPU dengan progress bar
- **RAM Usage Card** - Persentase penggunaan RAM dengan progress bar
- **System Status Card** - Kondisi kesehatan sistem

### 3. **Charts Section**
- **CPU Usage History** - Line chart dengan 10 data point terakhir
- **RAM Usage History** - Line chart dengan 10 data point terakhir

### 4. **Info & Controls Section**
- **Monitoring Information** - Refresh rate, API endpoint, connection status
- **Controls** - Button untuk Pause/Resume, Reset Data, Refresh Now

### 5. **Footer**
- Credit dan informasi project

## 🎨 Design Features

| Aspek | Detail |
|-------|--------|
| **Color Scheme** | Dark theme dengan primary blue, secondary green |
| **Layout** | CSS Grid responsif, mobile-first approach |
| **Typography** | Segoe UI, sans-serif dengan weight 400-700 |
| **Animations** | Smooth transitions, pulse effects, hover states |
| **Chart Style** | Chart.js dengan custom colors dan styling |
| **Breakpoints** | Desktop (1024px+), Tablet (768px), Mobile (480px) |

## 🔧 API Endpoint

**GET** `/api/system-stats`

**Response:**
```json
{
  "status": "success",
  "data": {
    "cpu_usage": 45.5,
    "ram_usage": 62.3
  }
}
```

## 📦 Dependencies

### Backend
- `flask` - Web framework
- `flask-cors` - CORS support
- `psutil` - System utilities

### Frontend
- `Chart.js` (CDN) - Data visualization

## ⚙️ Configuration

### Backend Configuration (app.py)
```python
API_PORT = 5000
DEBUG_MODE = True
CORS_ENABLED = True
```

### Frontend Configuration (app.js)
```javascript
API_BASE_URL = 'http://127.0.0.1:5000'
REFRESH_INTERVAL = 2000  // 2 seconds
MAX_DATA_POINTS = 10     // Maximum history points
```

## 🐛 Troubleshooting

### **Problem: "Cannot GET /" di frontend**
✅ **Solution:** Jalankan `python3 -m http.server 8000` di folder `frontend/`

### **Problem: "Failed to fetch" di console**
✅ **Solution:** 
- Pastikan backend Flask sudah running di port 5000
- Check CORS adalah enabled di backend
- Buka Network tab di DevTools untuk debug

### **Problem: Data tidak update**
✅ **Solution:**
- Reload halaman browser (F5)
- Check apakah connection status menunjukkan "disconnected"
- Verify API endpoint di browser console

## 📱 Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full support |
| Firefox | ✅ Full support |
| Safari | ✅ Full support |
| Edge | ✅ Full support |
| IE 11 | ❌ Not supported |

## 🚀 Future Enhancements

- [ ] Database integration untuk menyimpan history
- [ ] User authentication & login
- [ ] Alert system (email/notification)
- [ ] Export data (CSV/PDF)
- [ ] Dark/Light theme toggle
- [ ] Multiple system monitoring
- [ ] Disk usage monitoring
- [ ] Network monitoring

## 📄 License

MIT License - Feel free to use this project

## 👤 Author

**lailatul-Coder**

---

**Built with ❤️ using Flask, HTML5, CSS3, JavaScript, dan Chart.js**