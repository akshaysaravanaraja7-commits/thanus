# Arekatika Thanush Lal — Portfolio

Editorial portfolio website for **Arekatika Thanush Lal** (B.Tech Student, Jain University | Aspiring Software Developer), powered by a zero-dependency Python 3.11 backend and a React + Tailwind CSS frontend.

## Included Files
- `app.py` — Standalone Python entry point (`python3 app.py`) serving the compiled frontend and live APIs on port `8000`.
- `python/portfolio_data.py` — Structured Python dataclasses for profile, education, skills, projects, achievements, and plain-text resume generation.
- `python/gap_analyzer.py` — Pure-Python engine for the **Student Gap Analyser** project.
- `python/portfolio_server.py` — Multi-threaded Python 3.11 HTTP API server (`/api/portfolio`, `/api/gap-analyser`, `/api/contact`, `/api/resume.txt`, `/api/portfolio-source.zip`).
- `python/extract_portrait.py` — Python + ImageMagick foreground cutout script.
- `python/test_portfolio.py` — Python `unittest` suite.
- `server.ts` — Full-stack Node/Express bridge that launches the Python backend and mounts Vite on port `3000`.
- `src/` — Modular React + TypeScript + Tailwind CSS components (`HeroCover`, `StickyNav`, `ProfileSection`, `EducationSection`, `SkillsSection`, `ProjectsSection`, `ActivitiesSection`, `ContactSection`).
- `public/assets/aistudio/` — Portrait cutout and uploaded portrait asset.

## Run Locally

### Option 1: Full-Stack Dev Server (Port 3000, auto-launches Python backend)
```bash
npm install
npm run dev
```

### Option 2: Standalone Python Server (Port 8000)
```bash
npm install
npm run build
python3 app.py
```

## Run Tests
```bash
python3 -m unittest discover -s python -v
npx tsx --test src/utils/portfolioLogic.test.ts
```
