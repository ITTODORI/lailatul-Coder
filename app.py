from flask import Flask, jsonify
from flask_cors import CORS
import psutil

app = Flask(__name__)
# CORS diaktifkan agar Frontend (HTML) bisa mengakses API ini meskipun beda folder/port
CORS(app)

@app.route('/api/system-stats', methods=['GET'])
def get_stats():
    # Mengambil data penggunaan sistem
    cpu = psutil.cpu_percent(interval=0.5)
    ram = psutil.virtual_memory().percent
    
    # Mengembalikan data dalam format JSON
    return jsonify({
        "status": "success",
        "data": {
            "cpu_usage": cpu,
            "ram_usage": ram
        }
    })

if __name__ == '__main__':
    print("Server Python berjalan di http://127.0.0.1:5000")
    app.run(debug=True, port=5000)