/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useState } from 'react';
import { ActivitiesSection } from './components/ActivitiesSection';
import { ContactSection } from './components/ContactSection';
import { EducationSection } from './components/EducationSection';
import { HeroCover } from './components/HeroCover';
import { ProfileSection } from './components/ProfileSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { StickyNav } from './components/StickyNav';
import type {
  CareerTrack,
  PortfolioApiResponse,
  PortfolioData,
} from './types/portfolio';
import {
  INITIAL_AVAILABLE_SKILLS,
  INITIAL_CAREER_TRACKS,
  INITIAL_PORTFOLIO_DATA,
} from './utils/portfolioLogic';

export default function App() {
  const [portfolio, setPortfolio] = useState<PortfolioData>(INITIAL_PORTFOLIO_DATA);
  const [tracks, setTracks] = useState<CareerTrack[]>(INITIAL_CAREER_TRACKS);
  const [availableSkills, setAvailableSkills] = useState<string[]>(
    INITIAL_AVAILABLE_SKILLS,
  );

  useEffect(() => {
    let cancelled = false;

    async function hydrateFromPythonApi() {
      try {
        const res = await fetch('/api/portfolio');
        if (!res.ok) return;
        const payload = (await res.json()) as PortfolioApiResponse;
        if (cancelled) return;
        if (payload.portfolio) {
          setPortfolio(payload.portfolio);
        }
        if (payload.gap_analyser?.tracks?.length) {
          setTracks(payload.gap_analyser.tracks);
        }
        if (payload.gap_analyser?.available_skills?.length) {
          setAvailableSkills(payload.gap_analyser.available_skills);
        }
      } catch {
        // Initial deterministic portfolio data stays mounted seamlessly
      }
    }

    hydrateFromPythonApi();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleExplore = () => {
    const profileEl = document.getElementById('profile');
    if (profileEl) {
      profileEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#181818] text-[#EBDDC3]">
      <HeroCover profile={portfolio.profile} onExplore={handleExplore} />
      <StickyNav fullName={portfolio.profile.full_name} />
      <main>
        <ProfileSection portfolio={portfolio} />
        <EducationSection
          education={portfolio.education}
          programPursued={portfolio.profile.program_pursued}
        />
        <SkillsSection
          technicalSkills={portfolio.technical_skills}
          personalStrengths={portfolio.personal_strengths}
        />
        <ProjectsSection
          projects={portfolio.projects}
          tracks={tracks}
          availableSkills={availableSkills}
        />
        <ActivitiesSection achievements={portfolio.achievements} />
        <ContactSection profile={portfolio.profile} />
      </main>
    </div>
  );
}
