import { useState } from 'react';
import type { SkillCategory } from '../types/portfolio';
import { filterSkillCategories } from '../utils/portfolioLogic';

interface SkillsSectionProps {
  technicalSkills: SkillCategory[];
  personalStrengths: string[];
}

export function SkillsSection({
  technicalSkills,
  personalStrengths,
}: SkillsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const visibleCategories = filterSkillCategories(technicalSkills, activeCategory);

  const filterOptions = [
    { id: 'all', label: 'All Skills' },
    ...technicalSkills.map((category) => ({
      id: category.id,
      label: category.title,
    })),
  ];

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="scroll-mt-20 border-b border-[#EBDDC3]/12 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <div className="mb-10 flex flex-col gap-6 border-b border-[#EBDDC3]/12 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs tracking-[0.14em] text-[#8C857A] tabular-nums">
              03 · Capabilities & Strengths
            </p>
            <h2
              id="skills-heading"
              className="mt-3 font-display text-4xl tracking-[0.02em] text-[#EBDDC3] sm:text-5xl lg:text-6xl"
            >
              TECHNICAL SKILLS
            </h2>
          </div>

          {/* Interactive segmented filter controls */}
          <div
            role="tablist"
            aria-label="Filter technical skill categories"
            className="flex flex-wrap items-center gap-1.5 bg-[#1F1F1D] p-1.5 border border-[#EBDDC3]/12"
          >
            {filterOptions.map((option) => {
              const isSelected = activeCategory === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveCategory(option.id)}
                  className={`min-h-[40px] px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-[#EBDDC3] text-[#181818]'
                      : 'text-[#B8B0A0] hover:text-[#EBDDC3]'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Technical Skill Categories Grid */}
        <div
          data-testid="skills-grid"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {visibleCategories.map((category, idx) => (
            <div
              key={category.id}
              className="border border-[#EBDDC3]/14 bg-[#1F1F1D] p-7"
            >
              <div className="flex items-baseline justify-between gap-4 border-b border-[#EBDDC3]/10 pb-4">
                <h3 className="text-base font-semibold tracking-tight text-[#EBDDC3]">
                  {category.title}
                </h3>
                <span className="font-mono text-xs text-[#8C857A] tabular-nums">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              <ul className="mt-5 space-y-3">
                {category.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline justify-between gap-4 text-base text-[#EBDDC3]/90"
                  >
                    <span>{item}</span>
                    <span className="font-mono text-xs text-[#8C857A]">
                      {category.title.split(' ')[0]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Personal Strengths Editorial Grid */}
        <div className="mt-16 border-t border-[#EBDDC3]/12 pt-14">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="font-display text-3xl tracking-[0.02em] text-[#EBDDC3] sm:text-4xl">
              PERSONAL STRENGTHS
            </h3>
            <p className="text-sm text-[#8C857A]">
              How I approach learning, problem-solving, and team execution
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px bg-[#EBDDC3]/12 border border-[#EBDDC3]/12 sm:grid-cols-2 lg:grid-cols-3">
            {personalStrengths.map((strength, idx) => (
              <div
                key={strength}
                className="flex items-baseline justify-between gap-4 bg-[#181818] p-6"
              >
                <span className="text-base font-medium text-[#EBDDC3]">{strength}</span>
                <span className="font-mono text-xs text-[#8C857A] tabular-nums">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
