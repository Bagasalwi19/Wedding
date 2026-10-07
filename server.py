import http.server
import socketserver
import os
import json
from datetime import datetime

PORT = 8000
WISHES_FILE = "wishes.json"

if not os.path.exists(WISHES_FILE):
    initial_data = {
        "wishes": [],
        "stats": {
            "total": 0,
            "hadir": 0,
            "tidak_hadir": 0,
            "ragu": 0
        }
    }
    with open(WISHES_FILE, "w", encoding="utf-8") as f:
        json.dump(initial_data, f, ensure_ascii=False, indent=2)

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for local testing if needed
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Accept')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path.startswith("/api/wishes"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            try:
                with open(WISHES_FILE, "r", encoding="utf-8") as f:
                    data = f.read()
                self.wfile.write(data.encode("utf-8"))
            except Exception as e:
                err_resp = json.dumps({"error": str(e)})
                self.wfile.write(err_resp.encode("utf-8"))
            return
        return super().do_GET()

    def do_POST(self):
        if self.path.startswith("/api/wishes"):
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            try:
                data = json.loads(body)
                name = str(data.get("name", "")).strip()[:60]
                message = str(data.get("message", "")).strip()[:500]
                attendance = str(data.get("attendance", "ragu")).strip()

                if not name or not message:
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json; charset=utf-8")
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Nama dan ucapan wajib diisi"}).encode('utf-8'))
                    return

                # Load existing wishes
                with open(WISHES_FILE, "r", encoding="utf-8") as f:
                    store = json.load(f)

                new_wish = {
                    "name": name,
                    "message": message,
                    "attendance": attendance,
                    "created_at": datetime.now().isoformat() + "Z"
                }

                store["wishes"].insert(0, new_wish)
                store["stats"]["total"] = len(store["wishes"])
                if attendance in store["stats"]:
                    store["stats"][attendance] += 1
                else:
                    store["stats"]["ragu"] = store["stats"].get("ragu", 0) + 1

                with open(WISHES_FILE, "w", encoding="utf-8") as f:
                    json.dump(store, f, ensure_ascii=False, indent=2)

                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps(store, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return

        self.send_response(404)
        self.end_headers()

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        httpd.serve_forever()
