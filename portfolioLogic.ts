import type {
  CareerTrack,
  ContactFormInput,
  ContactValidationResult,
  PortfolioData,
  SkillCategory,
} from '../types/portfolio';

export const INITIAL_PORTFOLIO_DATA: PortfolioData = {
  profile: {
    full_name: 'AREKATIKA THANUSH LAL',
    headline: 'B.Tech Student | Aspiring Software Developer',
    email: 'thanusharekatika@gmail.com',
    mobile: '7989436239',
    university: 'Jain University',
    program_pursued: 'Bachelor of Technology (B.Tech)',
    portrait_cutout_url: '/assets/aistudio/thanush_cutout.png',
    portrait_original_url:
      '/assets/aistudio/WhatsApp_Image_2026-11-19_at_11.10.39_PM_996b1f2a.jpeg',
  },
  career_objective:
    'Motivated B.Tech student with an interest in software development, programming and emerging technologies. Possess a willingness to learn new technical skills, explore innovative ideas and apply theoretical knowledge to practical problems. Seeking internship opportunities to gain industry exposure, enhance technical abilities and contribute to meaningful projects.',
  education: {
    degree: 'Bachelor of Technology (B.Tech)',
    institution: 'Jain University',
    status: 'Currently pursuing 2nd Year',
    cgpa: '8.00',
    cgpa_scale: '10.00',
  },
  technical_skills: [
    {
      id: 'programming',
      title: 'Programming Languages',
      items: ['Python', 'Java'],
    },
    {
      id: 'web',
      title: 'Web Technologies',
      items: ['HTML'],
    },
    {
      id: 'frameworks',
      title: 'Frameworks',
      items: ['FastAPI'],
    },
    {
      id: 'core',
      title: 'Core Skills',
      items: ['Problem-solving', 'Logical thinking', 'Basic programming concepts'],
    },
  ],
  projects: [
    {
      id: 'student-gap-analyser',
      title: 'Student Gap Analyser',
      category: 'Academic Project',
      summary:
        "An academic project focused on identifying students' existing skills, analysing skill gaps and helping them discover suitable learning opportunities. The project aims to support students in improving their technical abilities and preparing for internships and career opportunities.",
      objectives: [
        "Identify students' existing technical and foundational skills.",
        'Analyse skill gaps against target internship and career pathways.',
        'Recommend suitable learning opportunities to bridge technical gaps.',
      ],
      technologies: ['Python', 'FastAPI', 'HTML', 'Logical Analysis'],
    },
  ],
  achievements: [
    {
      index: '01',
      title: 'Smart India Hackathon (SIH)',
      description: 'Participated in Smart India Hackathon (SIH).',
    },
    {
      index: '02',
      title: 'Project-Based Learning',
      description: 'Participated in academic project-based learning activities.',
    },
    {
      index: '03',
      title: 'Collaborative Ideation',
      description:
        'Collaborated with team members during problem-solving and ideation activities.',
    },
  ],
  career_interests: [
    'Software Development',
    'Web Development',
    'Technology & Innovation',
  ],
  personal_strengths: [
    'Quick learner',
    'Problem-solving mindset',
    'Team collaboration',
    'Adaptability',
    'Willingness to learn',
    'Creative thinking',
  ],
  languages: ['English', 'Kannada', 'Hindi'],
  powered_by: 'Python 3.11',
};

export const INITIAL_CAREER_TRACKS: CareerTrack[] = [
  {
    id: 'software-development',
    label: 'Software Development',
    description:
      'Core programming, algorithms, version control, and backend architecture for SDE internships.',
    required_skills: [
      'Python',
      'Java',
      'Problem-solving',
      'Logical thinking',
      'Data Structures',
      'Git & GitHub',
      'SQL Basics',
      'REST APIs',
    ],
  },
  {
    id: 'web-development',
    label: 'Web Development',
    description:
      'Frontend fundamentals paired with Python API backends for modern web applications.',
    required_skills: [
      'HTML',
      'CSS & Responsive Layout',
      'JavaScript',
      'Python',
      'FastAPI',
      'REST APIs',
      'Git & GitHub',
      'SQL Basics',
    ],
  },
  {
    id: 'python-backend',
    label: 'Python & FastAPI Backend',
    description:
      'API engineering, testing, data modeling, and deployment readiness using Python & FastAPI.',
    required_skills: [
      'Python',
      'FastAPI',
      'Basic programming concepts',
      'Problem-solving',
      'REST APIs',
      'SQL Basics',
      'Unit Testing',
      'Git & GitHub',
    ],
  },
];

export const INITIAL_AVAILABLE_SKILLS: string[] = [
  'Python',
  'Java',
  'HTML',
  'FastAPI',
  'Problem-solving',
  'Logical thinking',
  'Basic programming concepts',
  'CSS & Responsive Layout',
  'JavaScript',
  'Data Structures',
  'Git & GitHub',
  'SQL Basics',
  'REST APIs',
  'Unit Testing',
];

export const THANUSH_DEFAULT_SKILLS: string[] = [
  'Python',
  'Java',
  'HTML',
  'FastAPI',
  'Problem-solving',
  'Logical thinking',
  'Basic programming concepts',
];

export function filterSkillCategories(
  categories: SkillCategory[],
  activeCategoryId: string,
): SkillCategory[] {
  if (activeCategoryId === 'all') {
    return categories;
  }
  return categories.filter((cat) => cat.id === activeCategoryId);
}

export function toggleSkillSelection(current: string[], skill: string): string[] {
  const exists = current.includes(skill);
  if (exists) {
    return current.filter((item) => item !== skill);
  }
  return [...current, skill];
}

export function formatDisplayNameTitleCase(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1).toLowerCase() : ''))
    .join(' ');
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(input: ContactFormInput): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormInput, string>> = {};
  const trimmedName = input.name.trim();
  const trimmedEmail = input.email.trim();
  const trimmedSubject = input.subject.trim();
  const trimmedMessage = input.message.trim();

  if (trimmedName.length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  }
  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (trimmedSubject.length > 120) {
    errors.subject = 'Subject must be 120 characters or fewer.';
  }
  if (trimmedMessage.length < 10) {
    errors.message = 'Please enter a message of at least 10 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
