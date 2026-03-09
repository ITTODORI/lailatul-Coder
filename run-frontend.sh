#!/bin/bash

# System Health Monitor - Frontend Server
# Script untuk menjalankan Simple HTTP Server untuk frontend

echo "🌐 Memulai Web Server untuk Frontend..."
echo "=================================="
echo ""
echo "📂 Direktori: frontend/"
echo "🔗 URL: http://127.0.0.1:8000"
echo "👉 Buka di browser: http://127.0.0.1:8000"
echo ""
echo "⚠️  Pastikan Backend Flask sudah berjalan di port 5000!"
echo "=================================="
echo ""

cd frontend
python3 -m http.server 8000 --bind 127.0.0.1
