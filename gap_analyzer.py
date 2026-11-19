"""
Pure-Python Student Gap Analyser engine.
Implements Arekatika Thanush Lal's featured academic project directly in Python:
identifies existing skills, analyses skill gaps against target career tracks,
and suggests structured learning opportunities for internships and career readiness.
"""
from dataclasses import asdict, dataclass
from typing import Any


@dataclass(frozen=True)
class LearningStep:
    skill: str
    priority: str
    recommendation: str


@dataclass(frozen=True)
class CareerTrack:
    id: str
    label: str
    description: str
    required_skills: list[str]
    learning_map: dict[str, str]


CAREER_TRACKS: dict[str, CareerTrack] = {
    "software-development": CareerTrack(
        id="software-development",
        label="Software Development",
        description="Core programming, algorithms, version control, and backend architecture for SDE internships.",
        required_skills=[
            "Python",
            "Java",
            "Problem-solving",
            "Logical thinking",
            "Data Structures",
            "Git & GitHub",
            "SQL Basics",
            "REST APIs",
        ],
        learning_map={
            "Python": "Master Python functions, OOP, virtual environments, and standard library automation.",
            "Java": "Practice Java collections, object-oriented design patterns, and exception handling.",
            "Problem-solving": "Solve 3–5 structured coding challenges weekly with complexity analysis.",
            "Logical thinking": "Break system specs into flowcharts, edge cases, and testable modules.",
            "Data Structures": "Study arrays, linked lists, stacks, queues, trees, and hash maps in Python/Java.",
            "Git & GitHub": "Use branching, pull requests, and clean commit histories on academic projects.",
            "SQL Basics": "Learn relational schemas, JOINs, indexing, and aggregations with PostgreSQL or SQLite.",
            "REST APIs": "Design typed HTTP endpoints, status codes, validation, and OpenAPI docs with FastAPI.",
        },
    ),
    "web-development": CareerTrack(
        id="web-development",
        label="Web Development",
        description="Frontend fundamentals paired with Python API backends for modern web applications.",
        required_skills=[
            "HTML",
            "CSS & Responsive Layout",
            "JavaScript",
            "Python",
            "FastAPI",
            "REST APIs",
            "Git & GitHub",
            "SQL Basics",
        ],
        learning_map={
            "HTML": "Build semantic, accessible HTML5 document structures with proper landmarks.",
            "CSS & Responsive Layout": "Master Flexbox, CSS Grid, fluid typography, and mobile-first breakpoints.",
            "JavaScript": "Learn ES6+, async/await, DOM state updates, and Fetch API integration.",
            "Python": "Structure clean backend services and data validation modules in Python.",
            "FastAPI": "Build high-performance async API routes, Pydantic schemas, and CORS middleware.",
            "REST APIs": "Connect frontend views to JSON APIs with loading, empty, and error handling.",
            "Git & GitHub": "Host repositories and collaborate via branches and code reviews.",
            "SQL Basics": "Persist application records using structured tables and parameterized queries.",
        },
    ),
    "python-backend": CareerTrack(
        id="python-backend",
        label="Python & FastAPI Backend",
        description="API engineering, testing, data modeling, and deployment readiness using Python & FastAPI.",
        required_skills=[
            "Python",
            "FastAPI",
            "Basic programming concepts",
            "Problem-solving",
            "REST APIs",
            "SQL Basics",
            "Unit Testing",
            "Git & GitHub",
        ],
        learning_map={
            "Python": "Deepen proficiency in dataclasses, type hints, async I/O, and modular packaging.",
            "FastAPI": "Implement dependency injection, request validation, and interactive Swagger docs.",
            "Basic programming concepts": "Strengthen control flow, modularity, and clean error handling.",
            "Problem-solving": "Design resilient backend workflows and handle edge-case inputs gracefully.",
            "REST APIs": "Standardize JSON payloads, HTTP verbs, status codes, and pagination.",
            "SQL Basics": "Model normalized tables and write clean CRUD queries without SQL injection.",
            "Unit Testing": "Write deterministic unittest / pytest suites covering core business logic.",
            "Git & GitHub": "Automate checks and maintain readable README documentation.",
        },
    ),
}

ALL_SELECTABLE_SKILLS: list[str] = [
    "Python",
    "Java",
    "HTML",
    "FastAPI",
    "Problem-solving",
    "Logical thinking",
    "Basic programming concepts",
    "CSS & Responsive Layout",
    "JavaScript",
    "Data Structures",
    "Git & GitHub",
    "SQL Basics",
    "REST APIs",
    "Unit Testing",
]


def get_available_tracks() -> list[dict[str, Any]]:
    return [
        {
            "id": track.id,
            "label": track.label,
            "description": track.description,
            "required_skills": track.required_skills,
        }
        for track in CAREER_TRACKS.values()
    ]


def analyze_skill_gaps(track_id: str, current_skills: list[str]) -> dict[str, Any]:
    track = CAREER_TRACKS.get(track_id)
    if track is None:
        raise ValueError(f"Unsupported career track: {track_id}")

    normalized_input = {skill.strip().lower() for skill in current_skills if skill.strip()}

    matched: list[str] = []
    missing: list[str] = []

    for req in track.required_skills:
        if req.lower() in normalized_input:
            matched.append(req)
        else:
            missing.append(req)

    total = len(track.required_skills)
    readiness_score = round((len(matched) / total) * 100) if total > 0 else 0

    roadmap: list[LearningStep] = []
    for idx, skill in enumerate(missing):
        priority = "High Priority" if idx < 2 else "Recommended Next"
        recommendation = track.learning_map.get(
            skill,
            f"Build a focused mini-project applying {skill} to practical engineering tasks.",
        )
        roadmap.append(
            LearningStep(
                skill=skill,
                priority=priority,
                recommendation=recommendation,
            )
        )

    if readiness_score >= 85:
        level = "Internship Ready"
        summary = (
            f"Strong foundation for {track.label}. Focus on portfolio projects, "
            "mock technical interviews, and refining remaining specialized skills."
        )
    elif readiness_score >= 50:
        level = "Developing Momentum"
        summary = (
            f"Solid start for {track.label} ({len(matched)}/{total} core skills matched). "
            f"Closing the top {min(2, len(missing))} gaps will significantly boost internship readiness."
        )
    else:
        level = "Foundation Building"
        summary = (
            f"Early stage for {track.label} ({len(matched)}/{total} core skills matched). "
            "Start with the high-priority learning steps below and build small hands-on scripts."
        )

    return {
        "track_id": track.id,
        "track_label": track.label,
        "readiness_score": readiness_score,
        "readiness_level": level,
        "matched_count": len(matched),
        "total_required": total,
        "matched_skills": matched,
        "missing_skills": missing,
        "roadmap": [asdict(step) for step in roadmap],
        "summary": summary,
    }
