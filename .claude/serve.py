"""Minimal static file server — avoids os.getcwd() entirely."""
import http.server
import os

PORT = 3456
DIRECTORY = "/Users/shruthi/Desktop/Job application materail"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    def log_message(self, fmt, *args):
        pass  # suppress request noise

os.chdir(DIRECTORY)
with http.server.HTTPServer(("", PORT), Handler) as httpd:
    print(f"Serving on http://localhost:{PORT}", flush=True)
    httpd.serve_forever()
