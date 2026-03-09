## 🚀 QUICK START GUIDE - System Health Monitor

### ✅ Yang Sudah Dibuat

```
✓ Frontend Dashboard (HTML/CSS/JS)
✓ Real-time API Integration
✓ Interactive Charts (Chart.js)
✓ Responsive Design
✓ Dark Theme dengan Animasi
✓ Documentation & Scripts
```

---

## 🎯 Cara Menjalankan

### **LANGKAH 1: Install Dependencies**
```bash
pip install -r requirements.txt
```

### **LANGKAH 2: Terminal Pertama - Jalankan Backend**
```bash
python3 app.py
```
Output yang diharapkan:
```
 * Running on http://127.0.0.1:5000
```

### **LANGKAH 3: Terminal Kedua - Jalankan Frontend**
```bash
cd frontend
python3 -m http.server 8000 --bind 127.0.0.1
```
Output yang diharapkan:
```
Serving HTTP on 127.0.0.1 port 8000
```

### **LANGKAH 4: Buka di Browser**
Kunjungi: **http://127.0.0.1:8000**

---

## 📂 Project Structure

```
lailatul-Coder/
├── app.py                   ⚡ Flask API (CPu & RAM monitoring)
├── requirements.txt         📦 Python dependencies
├── run.sh                   🚀 Backend run script
├── run-frontend.sh          🌐 Frontend run script
├── README.md                📖 Full documentation
├── .gitignore               🔒 Git ignore file
└── frontend/
    ├── index.html           📄 Main dashboard
    └── assets/
        ├── css/
        │   └── style.css    🎨 Dark theme styling
        └── js/
            └── app.js       ⚙️ Dashboard logic & API


```

---

## 🎨 Features yang Ada

### Frontend
- 📊 Real-time stat cards (CPU/RAM/Status)
- 📈 Interactive line charts dengan Chart.js
- 🎯 System health indicator
- ⏸️ Pause/Resume monitoring
- 🔄 Reset & Refresh buttons
- 📱 Responsive design (Desktop, Tablet, Mobile)
- 🌙 Dark theme modern
- ✅ Connection status indicator

### Backend
- ⚡ Live CPU monitoring
- 💾 Live RAM monitoring
- 🔗 REST API dengan JSON response
- 🛡️ CORS enabled
- 🚀 Minimal dependencies (Flask, psutil)

---

## 🔗 URLs

| Component | URL | Port |
|-----------|-----|------|
| Backend API | http://127.0.0.1:5000 | 5000 |
| Backend API Endpoint | http://127.0.0.1:5000/api/system-stats | 5000 |
| Frontend Dashboard | http://127.0.0.1:8000 | 8000 |
| Frontend HTML | http://127.0.0.1:8000/index.html | 8000 |

---

## ⚙️ Configuration

Jika ingin mengubah settings:

### Backend (app.py)
```python
app.run(debug=True, port=5000)  # Ubah port jika perlu
```

### Frontend (assets/js/app.js)
```javascript
const API_BASE_URL = 'http://127.0.0.1:5000';      // API URL
const REFRESH_INTERVAL = 2000;  // Interval update (ms)
const MAX_DATA_POINTS = 10;     // Max chart points
```

---

## 🐛 Common Issues & Solutions

| Issue | Solusi |
|-------|--------|
| "Cannot GET /" | Jalankan server di folder `frontend/` |
| "Failed to fetch" | Backend Flask harus running & CORS enabled |
| Data tidak update | Reload F5, check connection status |
| Port 5000/8000 sudah dipakai | Ubah port di code atau kill process |

---

## 📱 Browser Support

✅ Chrome, Firefox, Safari, Edge  
❌ Internet Explorer (tidak support)

---

## 🎯 Next Steps (Opsional)

Ingin menambah fitur? Berikut saran:

1. **[Mudah]** Tambah CPU Temperature monitoring
2. **[Mudah]** Tambah Disk Usage monitoring
3. **[Sedang]** Tambah Dark/Light theme toggle
4. **[Sedang]** Export data ke CSV
5. **[Sulit]** Tambah Database untuk history
6. **[Sulit]** Tambah User authentication

---

## 📚 File Documentation

- **README.md** - Full documentation dengan API details
- **index.html** - Dashboard HTML dengan comments
- **style.css** - CSS dengan variable & responsive design
- **app.js** - JavaScript dengan inline documentation

---

## 💡 Tips

- **Debugging:** Buka DevTools (F12) untuk melihat console logs
- **Network:** Tab "Network" di DevTools untuk monitor API calls
- **Performance:** Charts update smoothly dengan Chart.js v3.9.1
- **Responsive:** Buka di Chrome Mobile Emulation untuk test mobile

---

**Siap digunakan! 🎉**

Jika ada pertanyaan, check README.md untuk dokumentasi lengkap.
