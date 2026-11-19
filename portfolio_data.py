"""
Structured portfolio data model for Arekatika Thanush Lal.
Pure Python 3.11 standard library module (zero third-party dependencies).
"""
from dataclasses import asdict, dataclass, field
from typing import Any


@dataclass(frozen=True)
class ProfileInfo:
    full_name: str
    headline: str
    email: str
    mobile: str
    university: str
    program_pursued: str
    portrait_cutout_url: str
    portrait_original_url: str


@dataclass(frozen=True)
class EducationEntry:
    degree: str
    institution: str
    status: str
    cgpa: str
    cgpa_scale: str


@dataclass(frozen=True)
class SkillCategory:
    id: str
    title: str
    items: list[str]


@dataclass(frozen=True)
class ProjectEntry:
    id: str
    title: str
    category: str
    summary: str
    objectives: list[str]
    technologies: list[str]


@dataclass(frozen=True)
class AchievementEntry:
    index: str
    title: str
    description: str


@dataclass(frozen=True)
class PortfolioData:
    profile: ProfileInfo
    career_objective: str
    education: EducationEntry
    technical_skills: list[SkillCategory]
    projects: list[ProjectEntry]
    achievements: list[AchievementEntry]
    career_interests: list[str]
    personal_strengths: list[str]
    languages: list[str]
    powered_by: str = "Python 3.11"

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def get_portfolio_data() -> PortfolioData:
    return PortfolioData(
        profile=ProfileInfo(
            full_name="AREKATIKA THANUSH LAL",
            headline="B.Tech Student | Aspiring Software Developer",
            email="thanusharekatika@gmail.com",
            mobile="7989436239",
            university="Jain University",
            program_pursued="Bachelor of Technology (B.Tech)",
            portrait_cutout_url="/assets/aistudio/thanush_cutout.png",
            portrait_original_url="/assets/aistudio/WhatsApp_Image_2026-11-19_at_11.10.39_PM_996b1f2a.jpeg",
        ),
        career_objective=(
            "Motivated B.Tech student with an interest in software development, "
            "programming and emerging technologies. Possess a willingness to learn "
            "new technical skills, explore innovative ideas and apply theoretical "
            "knowledge to practical problems. Seeking internship opportunities to "
            "gain industry exposure, enhance technical abilities and contribute to "
            "meaningful projects."
        ),
        education=EducationEntry(
            degree="Bachelor of Technology (B.Tech)",
            institution="Jain University",
            status="Currently pursuing 2nd Year",
            cgpa="8.00",
            cgpa_scale="10.00",
        ),
        technical_skills=[
            SkillCategory(
                id="programming",
                title="Programming Languages",
                items=["Python", "Java"],
            ),
            SkillCategory(
                id="web",
                title="Web Technologies",
                items=["HTML"],
            ),
            SkillCategory(
                id="frameworks",
                title="Frameworks",
                items=["FastAPI"],
            ),
            SkillCategory(
                id="core",
                title="Core Skills",
                items=[
                    "Problem-solving",
                    "Logical thinking",
                    "Basic programming concepts",
                ],
            ),
        ],
        projects=[
            ProjectEntry(
                id="student-gap-analyser",
                title="Student Gap Analyser",
                category="Academic Project",
                summary=(
                    "An academic project focused on identifying students' existing skills, "
                    "analysing skill gaps and helping them discover suitable learning "
                    "opportunities. The project aims to support students in improving their "
                    "technical abilities and preparing for internships and career opportunities."
                ),
                objectives=[
                    "Identify students' existing technical and foundational skills.",
                    "Analyse skill gaps against target internship and career pathways.",
                    "Recommend suitable learning opportunities to bridge technical gaps.",
                ],
                technologies=["Python", "FastAPI", "HTML", "Logical Analysis"],
            )
        ],
        achievements=[
            AchievementEntry(
                index="01",
                title="Smart India Hackathon (SIH)",
                description="Participated in Smart India Hackathon (SIH).",
            ),
            AchievementEntry(
                index="02",
                title="Project-Based Learning",
                description="Participated in academic project-based learning activities.",
            ),
            AchievementEntry(
                index="03",
                title="Collaborative Ideation",
                description="Collaborated with team members during problem-solving and ideation activities.",
            ),
        ],
        career_interests=[
            "Software Development",
            "Web Development",
            "Technology & Innovation",
        ],
        personal_strengths=[
            "Quick learner",
            "Problem-solving mindset",
            "Team collaboration",
            "Adaptability",
            "Willingness to learn",
            "Creative thinking",
        ],
        languages=["English", "Kannada", "Hindi"],
    )


def format_resume_text(data: PortfolioData | None = None) -> str:
    portfolio = data or get_portfolio_data()
    p = portfolio.profile
    edu = portfolio.education

    lines = [
        p.full_name,
        p.headline,
        "=" * 64,
        f"Email:      {p.email}",
        f"Mobile:     {p.mobile}",
        f"University: {p.university}",
        f"Program:    {p.program_pursued}",
        "",
        "CAREER OBJECTIVE",
        "-" * 64,
        portfolio.career_objective,
        "",
        "EDUCATION",
        "-" * 64,
        f"{edu.degree} — {edu.institution}",
        f"{edu.status} | CGPA: {edu.cgpa} / {edu.cgpa_scale}",
        "",
        "TECHNICAL SKILLS",
        "-" * 64,
    ]
    for category in portfolio.technical_skills:
        lines.append(f"{category.title}: {', '.join(category.items)}")

    lines.extend(["", "PROJECTS", "-" * 64])
    for proj in portfolio.projects:
        lines.append(f"{proj.title} ({proj.category})")
        lines.append(proj.summary)

    lines.extend(["", "ACHIEVEMENTS & ACTIVITIES", "-" * 64])
    for item in portfolio.achievements:
        lines.append(f"- {item.description}")

    lines.extend([
        "",
        "CAREER INTERESTS",
        "-" * 64,
        ", ".join(portfolio.career_interests),
        "",
        "PERSONAL STRENGTHS",
        "-" * 64,
        ", ".join(portfolio.personal_strengths),
        "",
        "LANGUAGES",
        "-" * 64,
        ", ".join(portfolio.languages),
        "",
    ])
    return "\n".join(lines)
