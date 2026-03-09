# lailatul-Coder

personal-health-monitor/
├── backend-python/          # Folder untuk logic monitoring & API
│   ├── app.py               # Main Flask Application
│   ├── monitor.py           # Script logic psutil
│   └── requirements.txt     # Daftar library (psutil, flask)
├── backend-php/             # Folder untuk fitur tambahan (Auth/Logs)
│   ├── config/
│   │   └── db.php           # Koneksi database (jika perlu)
│   ├── auth.php             # Logic login sederhana
│   └── api-proxy.php        # Optional: Proxy antara PHP ke Python
├── frontend/                # Tampilan Dashboard
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       ├── app.js       # Logic Fetch API
│   │       └── charts.js    # Konfigurasi Chart.js
│   └── index.html           # Halaman utama
├── .gitignore               # Mengabaikan venv atau file sensitif
└── README.md                # Dokumentasi Project (Penting untuk GitHub!)