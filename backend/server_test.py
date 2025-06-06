#!/usr/bin/env python3
"""
Simple HTTP server for testing backend structure locally.
This will be replaced with FastAPI once dependencies are installed.
"""

import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse

from app.core.config import settings
from app.main import health_check, root


class BackendHandler(BaseHTTPRequestHandler):
    """HTTP request handler for testing backend endpoints."""

    def _send_json_response(self, data, status_code=200):
        """Send JSON response."""
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode())

    def do_GET(self):
        """Handle GET requests."""
        path = urlparse(self.path).path

        if path == '/':
            self._send_json_response(root())
        elif path == '/health':
            self._send_json_response(health_check())
        elif path == '/api/info':
            from app.main import app
            self._send_json_response(app)
        else:
            self._send_json_response(
                {"error": "Not Found", "message": f"Path {path} not found"},
                404
            )

    def do_OPTIONS(self):
        """Handle OPTIONS requests (CORS preflight)."""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        """Custom log format."""
        print(f"🌐 {self.address_string()} - {format % args}")


def run_server(host='localhost', port=8000):
    """Run the test server."""
    server_address = (host, port)
    httpd = HTTPServer(server_address, BackendHandler)

    print("🚀 UnderdogDevs Backend Test Server")
    print("=" * 50)
    print(f"📍 Server running at: http://{host}:{port}")
    print(f"🔧 Environment: {settings.ENVIRONMENT}")
    print(f"🐛 Debug mode: {settings.DEBUG}")
    print()
    print("📋 Available endpoints:")
    print(f"  🏠 GET  http://{host}:{port}/          - Root endpoint")
    print(f"  💚 GET  http://{host}:{port}/health    - Health check")
    print(f"  📊 GET  http://{host}:{port}/api/info  - App info")
    print()
    print("Press Ctrl+C to stop the server")
    print("=" * 50)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        httpd.server_close()


if __name__ == '__main__':
    run_server()
