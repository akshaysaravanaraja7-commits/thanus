import { useState } from 'react';
import { ArrowRight, Check, RotateCcw } from 'lucide-react';
import type {
  CareerTrack,
  GapAnalysisResult,
  ProjectEntry,
} from '../types/portfolio';
import {
  THANUSH_DEFAULT_SKILLS,
  toggleSkillSelection,
} from '../utils/portfolioLogic';

interface ProjectsSectionProps {
  projects: ProjectEntry[];
  tracks: CareerTrack[];
  availableSkills: string[];
}

export function ProjectsSection({
  projects,
  tracks,
  availableSkills,
}: ProjectsSectionProps) {
  const featuredProject = projects[0];

  const [selectedTrackId, setSelectedTrackId] = useState<string>(
    tracks[0]?.id ?? 'software-development',
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    THANUSH_DEFAULT_SKILLS,
  );
  const [analysis, setAnalysis] = useState<GapAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeTrack =
    tracks.find((track) => track.id === selectedTrackId) ?? tracks[0];

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills((prev) => toggleSkillSelection(prev, skill));
  };

  const handleReset = () => {
    setSelectedSkills(THANUSH_DEFAULT_SKILLS);
    setErrorMessage(null);
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/gap-analyser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track_id: selectedTrackId,
          current_skills: selectedSkills,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not complete skill gap analysis.');
      }
      setAnalysis(data.analysis as GapAnalysisResult);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to reach Python analysis service.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!featuredProject) {
    return null;
  }

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="scroll-mt-20 border-b border-[#EBDDC3]/12 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <div className="mb-12 border-b border-[#EBDDC3]/12 pb-6">
          <p className="font-mono text-xs tracking-[0.14em] text-[#8C857A] tabular-nums">
            04 · Featured Project
          </p>
          <h2
            id="projects-heading"
            className="mt-3 font-display text-4xl tracking-[0.02em] text-[#EBDDC3] sm:text-5xl lg:text-6xl"
          >
            PROJECTS
          </h2>
        </div>

        {/* Project Editorial Spread */}
        <article className="border border-[#EBDDC3]/14 bg-[#1F1F1D] p-7 sm:p-10">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#EBDDC3]/12 pb-6">
            <div>
              <p className="text-xs text-[#8C857A]">
                {featuredProject.category}
                <span aria-hidden="true"> · </span>
                {featuredProject.technologies.join(' / ')}
              </p>
              <h3 className="mt-2 font-display text-3xl tracking-[0.02em] text-[#EBDDC3] sm:text-5xl">
                {featuredProject.title}
              </h3>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="text-base leading-[1.75] text-[#EBDDC3]/90">
                {featuredProject.summary}
              </p>
            </div>

            <div className="lg:col-span-5 border-t border-[#EBDDC3]/12 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
              <h4 className="font-mono text-xs tracking-[0.12em] text-[#8C857A]">
                Core Objectives
              </h4>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#B8B0A0]">
                {featuredProject.objectives.map((objective, idx) => (
                  <li key={objective} className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-[#EBDDC3] tabular-nums">
                      0{idx + 1}
                    </span>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Live Interactive Python-Powered Student Gap Analyser */}
          <div className="mt-10 border-t border-[#EBDDC3]/14 pt-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h4 className="text-lg font-semibold text-[#EBDDC3]">
                  Interactive Demo — Student Gap Analyser
                </h4>
                <p className="mt-1 text-sm text-[#B8B0A0]">
                  Select a career track and current skills to run the live Python skill
                  gap analysis engine.
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex min-h-[40px] items-center gap-2 text-xs font-medium text-[#B8B0A0] transition-colors duration-150 hover:text-[#EBDDC3] cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Reset to Thanush&apos;s Skills</span>
              </button>
            </div>

            {/* Step 1: Career Track Selection */}
            <div className="mt-6">
              <p className="font-mono text-xs text-[#8C857A]">
                1. Target Career Track
              </p>
              <div
                role="radiogroup"
                aria-label="Target career track"
                className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3"
              >
                {tracks.map((track) => {
                  const isSelected = track.id === selectedTrackId;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSelectedTrackId(track.id)}
                      className={`min-h-[44px] border p-4 text-left transition-colors duration-150 cursor-pointer ${
                        isSelected
                          ? 'border-[#EBDDC3] bg-[#EBDDC3] text-[#181818]'
                          : 'border-[#EBDDC3]/15 bg-[#181818] text-[#EBDDC3] hover:border-[#EBDDC3]/40'
                      }`}
                    >
                      <span className="block text-sm font-semibold">
                        {track.label}
                      </span>
                      <span
                        className={`mt-1 block text-xs leading-snug ${
                          isSelected ? 'text-[#181818]/80' : 'text-[#8C857A]'
                        }`}
                      >
                        {track.required_skills.length} required skills
                      </span>
                    </button>
                  );
                })}
              </div>
              {activeTrack && (
                <p className="mt-2.5 text-xs text-[#8C857A]">
                  {activeTrack.description}
                </p>
              )}
            </div>

            {/* Step 2: Current Skills Checklist */}
            <div className="mt-7">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-mono text-xs text-[#8C857A]">
                  2. Current Skills ({selectedSkills.length} selected)
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {availableSkills.map((skill) => {
                  const checked = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      aria-pressed={checked}
                      onClick={() => handleToggleSkill(skill)}
                      className={`inline-flex min-h-[40px] items-center gap-2 border px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                        checked
                          ? 'border-[#EBDDC3] bg-[#EBDDC3]/15 text-[#EBDDC3]'
                          : 'border-[#EBDDC3]/14 bg-[#181818] text-[#8C857A] hover:border-[#EBDDC3]/35 hover:text-[#EBDDC3]'
                      }`}
                    >
                      {checked && (
                        <Check className="h-3.5 w-3.5 text-[#EBDDC3]" aria-hidden="true" />
                      )}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading}
                className="inline-flex min-h-[44px] items-center gap-2.5 rounded-sm bg-[#EBDDC3] px-6 py-2.5 text-sm font-semibold text-[#181818] whitespace-nowrap transition-colors duration-150 hover:bg-[#f5ebd8] disabled:opacity-60 cursor-pointer"
              >
                <span>{isLoading ? 'Analyzing in Python...' : 'Analyze Skill Gaps'}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              {errorMessage && (
                <p role="alert" className="text-sm text-amber-300">
                  {errorMessage}
                </p>
              )}
            </div>

            {/* Python Analysis Results Panel */}
            {analysis && (
              <div
                data-testid="gap-analysis-result"
                aria-live="polite"
                className="mt-8 border border-[#EBDDC3]/20 bg-[#181818] p-6 sm:p-8"
              >
                <div className="grid grid-cols-1 gap-8 border-b border-[#EBDDC3]/12 pb-6 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <p className="font-mono text-xs text-[#8C857A]">
                      Readiness · {analysis.track_label}
                    </p>
                    <div className="mt-2 flex items-baseline gap-3">
                      <span className="font-display text-6xl leading-none text-[#EBDDC3] tabular-nums">
                        {analysis.readiness_score}%
                      </span>
                      <span className="text-sm font-medium text-[#B8B0A0]">
                        {analysis.readiness_level}
                      </span>
                    </div>
                    <p className="mt-2 font-mono text-xs text-[#8C857A] tabular-nums">
                      {analysis.matched_count} of {analysis.total_required} target skills
                      matched
                    </p>
                  </div>

                  <div className="lg:col-span-8 flex flex-col justify-center">
                    <p className="text-sm leading-relaxed text-[#EBDDC3]/90">
                      {analysis.summary}
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                      <div>
                        <span className="font-mono text-[#8C857A]">Matched Skills</span>
                        <p className="mt-1 text-[#EBDDC3]">
                          {analysis.matched_skills.length > 0
                            ? analysis.matched_skills.join(' · ')
                            : 'None yet'}
                        </p>
                      </div>
                      <div>
                        <span className="font-mono text-[#8C857A]">Identified Gaps</span>
                        <p className="mt-1 text-[#B8B0A0]">
                          {analysis.missing_skills.length > 0
                            ? analysis.missing_skills.join(' · ')
                            : 'All target skills covered'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {analysis.roadmap.length > 0 && (
                  <div className="mt-6">
                    <h5 className="font-mono text-xs tracking-[0.12em] text-[#8C857A]">
                      Recommended Learning Opportunities
                    </h5>
                    <ol className="mt-4 divide-y divide-[#EBDDC3]/10">
                      {analysis.roadmap.map((step, index) => (
                        <li
                          key={step.skill}
                          className="grid grid-cols-1 gap-2 py-3.5 sm:grid-cols-12 sm:items-baseline sm:gap-4"
                        >
                          <div className="sm:col-span-4 flex items-baseline gap-3">
                            <span className="font-mono text-xs text-[#8C857A] tabular-nums">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="text-sm font-semibold text-[#EBDDC3]">
                              {step.skill}
                            </span>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="font-mono text-xs text-[#B8B0A0]">
                              {step.priority}
                            </span>
                          </div>
                          <p className="sm:col-span-6 text-sm text-[#B8B0A0]">
                            {step.recommendation}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
