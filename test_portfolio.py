"""
Unit tests for the Python portfolio data model, Student Gap Analyser engine,
and contact form validator. Run via: python3 -m unittest discover -s python
"""
import unittest
from pathlib import Path
import sys

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from gap_analyzer import analyze_skill_gaps, get_available_tracks
from portfolio_data import format_resume_text, get_portfolio_data
from portfolio_server import validate_contact_payload


class PortfolioDataTests(unittest.TestCase):
    def test_profile_and_education_details_exact(self) -> None:
        data = get_portfolio_data()
        self.assertEqual(data.profile.full_name, "AREKATIKA THANUSH LAL")
        self.assertEqual(data.profile.email, "thanusharekatika@gmail.com")
        self.assertEqual(data.profile.mobile, "7989436239")
        self.assertEqual(data.profile.university, "Jain University")
        self.assertEqual(data.education.cgpa, "8.00")
        self.assertIn("English", data.languages)
        self.assertIn("Kannada", data.languages)
        self.assertIn("Hindi", data.languages)

    def test_resume_formatter_contains_all_sections(self) -> None:
        resume = format_resume_text()
        for heading in (
            "AREKATIKA THANUSH LAL",
            "CAREER OBJECTIVE",
            "EDUCATION",
            "TECHNICAL SKILLS",
            "Student Gap Analyser",
            "Smart India Hackathon (SIH)",
        ):
            self.assertIn(heading, resume)


class GapAnalyzerTests(unittest.TestCase):
    def test_tracks_available(self) -> None:
        tracks = get_available_tracks()
        ids = {t["id"] for t in tracks}
        self.assertEqual(ids, {"software-development", "web-development", "python-backend"})

    def test_gap_analysis_computes_score_and_missing_skills(self) -> None:
        result = analyze_skill_gaps(
            "software-development",
            ["Python", "Java", "Problem-solving", "Logical thinking"],
        )
        self.assertEqual(result["matched_count"], 4)
        self.assertEqual(result["total_required"], 8)
        self.assertEqual(result["readiness_score"], 50)
        self.assertIn("Data Structures", result["missing_skills"])
        self.assertEqual(len(result["roadmap"]), 4)
        self.assertEqual(result["roadmap"][0]["priority"], "High Priority")

    def test_gap_analysis_rejects_unknown_track(self) -> None:
        with self.assertRaises(ValueError):
            analyze_skill_gaps("unknown-track", ["Python"])


class ContactValidationTests(unittest.TestCase):
    def test_rejects_invalid_fields(self) -> None:
        ok, errors = validate_contact_payload({"name": "A", "email": "not-an-email", "message": "Hi"})
        self.assertFalse(ok)
        self.assertIn("name", errors)
        self.assertIn("email", errors)
        self.assertIn("message", errors)

    def test_accepts_valid_payload(self) -> None:
        ok, errors = validate_contact_payload({
            "name": "Priya Nair",
            "email": "priya@techcorp.in",
            "subject": "Summer Internship",
            "message": "We would love to discuss a Python FastAPI internship role.",
        })
        self.assertTrue(ok)
        self.assertEqual(errors, {})


import io
import zipfile
from export_zip import build_portfolio_zip_bytes


class ZipExportTests(unittest.TestCase):
    def test_zip_archive_contains_core_coding_files(self) -> None:
        raw = build_portfolio_zip_bytes()
        self.assertGreater(len(raw), 1000)
        with zipfile.ZipFile(io.BytesIO(raw), "r") as zf:
            names = set(zf.namelist())
            for expected in (
                "arekatika-thanush-lal-portfolio/app.py",
                "arekatika-thanush-lal-portfolio/server.ts",
                "arekatika-thanush-lal-portfolio/package.json",
                "arekatika-thanush-lal-portfolio/index.html",
                "arekatika-thanush-lal-portfolio/python/portfolio_server.py",
                "arekatika-thanush-lal-portfolio/python/gap_analyzer.py",
                "arekatika-thanush-lal-portfolio/src/App.tsx",
                "arekatika-thanush-lal-portfolio/src/components/HeroCover.tsx",
                "arekatika-thanush-lal-portfolio/public/assets/aistudio/thanush_cutout.png",
            ):
                self.assertIn(expected, names)
            self.assertFalse(any("node_modules" in n for n in names))


if __name__ == "__main__":
    unittest.main()
