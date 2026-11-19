"""
Pure-Python 3.11 HTTP server for Arekatika Thanush Lal's Portfolio.
Serves structured portfolio JSON, live Student Gap Analyser API,
contact inquiry validation & storage, downloadable plain-text resume,
and (when run standalone via `python3 app.py`) static dist/ files.
"""
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import mimetypes
import os
from pathlib import Path
import re
import sys
from typing import Any
from urllib.parse import urlparse

# Ensure sibling imports work whether executed from repo root or python/
SCRIPT_DIR = Path(__file__).resolve().parent
ROOT_DIR = SCRIPT_DIR.parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from export_zip import build_portfolio_zip_bytes
from gap_analyzer import ALL_SELECTABLE_SKILLS, analyze_skill_gaps, get_available_tracks
from portfolio_data import format_resume_text, get_portfolio_data

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
INQUIRIES: list[dict[str, Any]] = []


def validate_contact_payload(payload: dict[str, Any]) -> tuple[bool, dict[str, str]]:
    errors: dict[str, str] = {}
    name = str(payload.get("name", "")).strip()
    email = str(payload.get("email", "")).strip()
    subject = str(payload.get("subject", "")).strip()
    message = str(payload.get("message", "")).strip()

    if len(name) < 2:
        errors["name"] = "Please enter your name (at least 2 characters)."
    if not EMAIL_REGEX.match(email):
        errors["email"] = "Please enter a valid email address."
    if len(message) < 10:
        errors["message"] = "Please enter a message of at least 10 characters."
    if subject and len(subject) > 120:
        errors["subject"] = "Subject must be 120 characters or fewer."

    return (len(errors) == 0, errors)


class PortfolioRequestHandler(BaseHTTPRequestHandler):
    serve_static_dist: bool = False
    dist_dir: Path = ROOT_DIR / "dist"
    public_dir: Path = ROOT_DIR / "public"

    def log_message(self, format: str, *args: Any) -> None:
        # Clean concise stdout logging
        sys.stdout.write(f"[python-api] {self.command} {self.path} -> {args[1] if len(args) > 1 else ''}\n")
        sys.stdout.flush()

    def _send_json(self, status: int, data: dict[str, Any]) -> None:
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _send_text(self, status: int, text: str, filename: str | None = None) -> None:
        body = text.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        if filename:
            self.send_header("Content-Disposition", f'attachment; filename="{filename}"')
        self.end_headers()
        self.wfile.write(body)

    def _read_json_body(self) -> dict[str, Any] | None:
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            return None
        if length <= 0 or length > 65536:
            return {}
        raw = self.rfile.read(length)
        try:
            parsed = json.loads(raw.decode("utf-8"))
            return parsed if isinstance(parsed, dict) else None
        except (UnicodeDecodeError, json.JSONDecodeError):
            return None

    def _serve_file(self, file_path: Path) -> bool:
        if not file_path.exists() or not file_path.is_file():
            return False
        content_type, _ = mimetypes.guess_type(str(file_path))
        body = file_path.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type or "application/octet-stream")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
        return True

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/") or "/"

        if path == "/api/health":
            self._send_json(HTTPStatus.OK, {
                "status": "ok",
                "runtime": f"Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
            })
            return

        if path == "/api/portfolio":
            portfolio = get_portfolio_data()
            self._send_json(HTTPStatus.OK, {
                "portfolio": portfolio.to_dict(),
                "gap_analyser": {
                    "tracks": get_available_tracks(),
                    "available_skills": ALL_SELECTABLE_SKILLS,
                },
            })
            return

        if path == "/api/resume.txt":
            resume = format_resume_text()
            self._send_text(
                HTTPStatus.OK,
                resume,
                filename="Arekatika_Thanush_Lal_Resume.txt",
            )
            return

        if path == "/api/portfolio-source.zip":
            zip_bytes = build_portfolio_zip_bytes()
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "application/zip")
            self.send_header(
                "Content-Disposition",
                'attachment; filename="Arekatika_Thanush_Lal_Portfolio.zip"',
            )
            self.send_header("Content-Length", str(len(zip_bytes)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(zip_bytes)
            return

        if path == "/api/inquiries":
            self._send_json(HTTPStatus.OK, {
                "count": len(INQUIRIES),
                "inquiries": INQUIRIES[-10:],
            })
            return

        if self.serve_static_dist:
            rel = path.lstrip("/")
            if rel and self._serve_file(self.dist_dir / rel):
                return
            if rel and self._serve_file(self.public_dir / rel):
                return
            if self._serve_file(self.dist_dir / "index.html"):
                return

        self._send_json(HTTPStatus.NOT_FOUND, {"error": "Endpoint not found"})

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")

        if path == "/api/gap-analyser":
            payload = self._read_json_body()
            if payload is None:
                self._send_json(HTTPStatus.BAD_REQUEST, {"error": "Invalid JSON body."})
                return
            track_id = str(payload.get("track_id", "")).strip()
            skills = payload.get("current_skills", [])
            if not isinstance(skills, list):
                self._send_json(HTTPStatus.BAD_REQUEST, {"error": "current_skills must be a list."})
                return
            try:
                result = analyze_skill_gaps(track_id, [str(s) for s in skills])
            except ValueError as exc:
                self._send_json(HTTPStatus.BAD_REQUEST, {"error": str(exc)})
                return
            self._send_json(HTTPStatus.OK, {"analysis": result})
            return

        if path == "/api/contact":
            payload = self._read_json_body()
            if payload is None:
                self._send_json(HTTPStatus.BAD_REQUEST, {"error": "Invalid JSON body."})
                return
            is_valid, errors = validate_contact_payload(payload)
            if not is_valid:
                self._send_json(HTTPStatus.BAD_REQUEST, {
                    "error": "Validation failed.",
                    "field_errors": errors,
                })
                return
            record = {
                "id": f"inq-{len(INQUIRIES) + 1:03d}",
                "name": str(payload.get("name", "")).strip(),
                "email": str(payload.get("email", "")).strip(),
                "subject": str(payload.get("subject", "Internship / Collaboration Inquiry")).strip()
                or "Internship / Collaboration Inquiry",
                "message": str(payload.get("message", "")).strip(),
                "received_at": datetime.now(timezone.utc).isoformat(),
            }
            INQUIRIES.append(record)
            self._send_json(HTTPStatus.CREATED, {
                "status": "received",
                "inquiry": record,
                "message": f"Thank you, {record['name']}. Your message for Arekatika Thanush Lal has been recorded.",
            })
            return

        self._send_json(HTTPStatus.NOT_FOUND, {"error": "Endpoint not found"})


def run_server(host: str = "127.0.0.1", port: int = 8765, serve_static_dist: bool = False) -> None:
    PortfolioRequestHandler.serve_static_dist = serve_static_dist
    server = ThreadingHTTPServer((host, port), PortfolioRequestHandler)
    print(f"[python-api] Portfolio Python server listening on http://{host}:{port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    host = os.environ.get("PYTHON_API_HOST", "127.0.0.1")
    port = int(os.environ.get("PYTHON_API_PORT", "8765"))
    serve_static = os.environ.get("PYTHON_SERVE_STATIC", "0") == "1"
    run_server(host=host, port=port, serve_static_dist=serve_static)
