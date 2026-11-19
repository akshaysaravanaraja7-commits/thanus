"""
Pure-Python ZIP archiver for exporting all clean coding files and assets
of Arekatika Thanush Lal's portfolio without build artifacts or caches.
"""
import io
from pathlib import Path
import zipfile

ROOT_DIR = Path(__file__).resolve().parent.parent

EXCLUDED_DIRS = {
    "node_modules",
    "dist",
    ".git",
    ".playwright-cli",
    ".aistudio",
    "__pycache__",
    ".venv",
    "venv",
}

EXCLUDED_EXTENSIONS = {
    ".pyc",
    ".pyo",
    ".zip",
    ".log",
}

EXCLUDED_FILES = {
    ".env",
    "package-lock.json",
}

INCLUDED_ROOT_FILES = {
    "app.py",
    "server.ts",
    "index.html",
    "package.json",
    "tsconfig.json",
    "vite.config.ts",
    "metadata.json",
    ".env.example",
    ".gitignore",
    "README.md",
}

INCLUDED_DIRS = (
    "python",
    "src",
    "public/assets/aistudio",
)

# Exclude the older superseded uploaded photo so the zip contains only the active portrait assets
EXCLUDED_REL_PATHS = {
    "public/assets/aistudio/WhatsApp_Image_2026-11-19_at_10.34.32_PM_4b83ae3f.jpeg",
}


def collect_project_files(root: Path = ROOT_DIR) -> list[Path]:
    files: list[Path] = []

    for name in sorted(INCLUDED_ROOT_FILES):
        candidate = root / name
        if candidate.is_file():
            files.append(candidate)

    for rel_dir in INCLUDED_DIRS:
        base = root / rel_dir
        if not base.exists():
            continue
        for path in sorted(base.rglob("*")):
            if not path.is_file():
                continue
            rel = path.relative_to(root)
            rel_posix = rel.as_posix()
            if rel_posix in EXCLUDED_REL_PATHS:
                continue
            if any(part in EXCLUDED_DIRS for part in rel.parts):
                continue
            if path.name in EXCLUDED_FILES or path.suffix.lower() in EXCLUDED_EXTENSIONS:
                continue
            files.append(path)

    return files


def build_portfolio_zip_bytes(root: Path = ROOT_DIR) -> bytes:
    buf = io.BytesIO()
    prefix = Path("arekatika-thanush-lal-portfolio")
    with zipfile.ZipFile(buf, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
        for file_path in collect_project_files(root):
            arcname = (prefix / file_path.relative_to(root)).as_posix()
            zf.write(file_path, arcname=arcname)
    return buf.getvalue()


def write_portfolio_zip(output_path: Path, root: Path = ROOT_DIR) -> int:
    data = build_portfolio_zip_bytes(root)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(data)
    return len(data)


if __name__ == "__main__":
    out = ROOT_DIR / "public" / "Arekatika_Thanush_Lal_Portfolio.zip"
    size = write_portfolio_zip(out)
    print(f"Wrote {out} ({size} bytes)")
