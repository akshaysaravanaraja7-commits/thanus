"""
Standalone Python entry point to run Arekatika Thanush Lal's portfolio directly:
    python3 app.py
Serves the compiled portfolio UI (dist/) and live Python JSON APIs on port 8000.
"""
import os
from python.portfolio_server import run_server

if __name__ == "__main__":
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "8000"))
    run_server(host=host, port=port, serve_static_dist=True)
