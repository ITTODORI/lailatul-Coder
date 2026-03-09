#!/bin/bash

# System Health Monitor - Run Script
# Script untuk menjalankan Flask backend

echo "🚀 Memulai System Health Monitor..."
echo "=================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 tidak ditemukan. Silakan install Python3 terlebih dahulu."
    exit 1
fi

# Install dependencies
echo "📦 Menginstall dependencies..."
pip install -r requirements.txt > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Dependencies berhasil diinstall"
else
    echo "⚠️ Ada masalah saat install dependencies"
fi

echo ""
echo "=================================="
echo "🖥️  BACKEND - Flask API"
echo "=================================="
echo "URL: http://127.0.0.1:5000"
echo "API: http://127.0.0.1:5000/api/system-stats"
echo ""
echo "🌐 FRONTEND - Dashboard"
echo "=================================="
echo "URL: http://127.0.0.1:8000"
echo "File: frontend/index.html"
echo ""
echo "Catatan: Jalankan frontend di terminal terpisah!"
echo "Perintah: python3 -m http.server 8000 --bind 127.0.0.1 --directory frontend"
echo ""
echo "=================================="
echo ""

# Run Backend Flask
python3 app.py
