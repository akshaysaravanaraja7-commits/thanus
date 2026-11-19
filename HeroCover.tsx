import { useState } from 'react';
import type { ProfileInfo } from '../types/portfolio';
import { formatDisplayNameTitleCase } from '../utils/portfolioLogic';

interface HeroCoverProps {
  profile: ProfileInfo;
  onExplore: () => void;
}

export function HeroCover({ profile, onExplore }: HeroCoverProps) {
  const [imgSrc, setImgSrc] = useState(profile.portrait_cutout_url);
  const [imgFailed, setImgFailed] = useState(false);

  const displayName = formatDisplayNameTitleCase(profile.full_name);

  const handleImageError = () => {
    if (imgSrc !== profile.portrait_original_url) {
      setImgSrc(profile.portrait_original_url);
    } else {
      setImgFailed(true);
    }
  };

  return (
    <section
      id="cover"
      aria-label="Portfolio cover"
      className="relative h-screen min-h-[640px] max-h-[1080px] w-full overflow-hidden bg-[#181818] text-[#EBDDC3]"
    >
      {/* Four-corner editorial framing matching the reference composition */}
      <div className="pointer-events-none absolute inset-0 z-40 flex flex-col justify-between px-6 py-8 sm:px-12 sm:py-12 lg:px-20 lg:py-14">
        {/* Top Row: Role label (left) and minimalist elongated arrow (right) */}
        <div className="flex items-center justify-between gap-4">
          <p className="pointer-events-auto text-sm font-light tracking-[0.015em] text-[#EBDDC3]/90 sm:text-base lg:text-[19px]">
            {profile.headline}
          </p>

          <button
            type="button"
            onClick={onExplore}
            aria-label="Explore portfolio sections"
            className="group pointer-events-auto inline-flex min-h-[44px] min-w-[44px] items-center justify-end text-[#EBDDC3] transition-opacity duration-200 hover:opacity-80 cursor-pointer"
          >
            <svg
              viewBox="0 0 116 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-[76px] transition-transform duration-200 ease-out group-hover:translate-x-1.5 sm:h-6 sm:w-[104px]"
              aria-hidden="true"
            >
              <line
                x1="0"
                y1="12"
                x2="112"
                y2="12"
                stroke="#EBDDC3"
                strokeWidth="1.5"
              />
              <polyline
                points="102,4 113,12 102,20"
                fill="none"
                stroke="#EBDDC3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Bottom Row: Full Name (left) and Contact Email (right) */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="pointer-events-auto text-sm font-light tracking-[0.015em] text-[#EBDDC3]/95 sm:text-base lg:text-[19px]">
            {displayName}
          </h1>

          <a
            href="#contact"
            className="pointer-events-auto text-sm font-light tracking-[0.015em] text-[#EBDDC3]/95 transition-opacity duration-200 hover:underline hover:underline-offset-4 sm:text-base lg:text-[19px]"
          >
            {profile.email}
          </a>
        </div>
      </div>

      {/* Back Layer (z-10): Solid #EBDDC3 condensed PORTFOLIO display typography */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-10 lg:px-16"
      >
        <svg
          viewBox="0 0 1440 420"
          className="h-auto w-full max-w-[1320px] select-none overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        >
          <text
            x="720"
            y="348"
            textAnchor="middle"
            fill="#EBDDC3"
            style={{
              fontFamily: "'Anton', Impact, sans-serif",
              fontSize: '365px',
              letterSpacing: '4px',
            }}
          >
            PORTFOLIO
          </text>
        </svg>
      </div>

      {/* Middle Layer (z-20): Extracted portrait cutout of Arekatika Thanush Lal */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center">
        {!imgFailed ? (
          <img
            src={imgSrc}
            alt={`${displayName} portrait`}
            referrerPolicy="no-referrer"
            onError={handleImageError}
            className="h-[74vh] max-h-[780px] min-h-[430px] w-auto translate-x-[3%] object-contain object-bottom select-none sm:h-[84vh] sm:max-h-[820px] lg:h-[88vh] lg:max-h-[840px]"
          />
        ) : (
          <div className="mb-12 flex h-[520px] w-[360px] flex-col items-center justify-center border border-[#EBDDC3]/20 bg-[#1F1F1D] text-center">
            <span className="font-display text-5xl tracking-wide text-[#EBDDC3]">ATL</span>
            <span className="mt-3 text-sm text-[#B8B0A0]">{displayName}</span>
          </div>
        )}
      </div>

      {/* Subtle bottom vignette fade to ground torso seamlessly into #181818 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-t from-[#181818] via-[#181818]/55 to-transparent"
      />

      {/* Front Layer (z-30): Pixel-identical hollow stroked outline PORTFOLIO overlapping the portrait */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-4 sm:px-10 lg:px-16"
      >
        <svg
          viewBox="0 0 1440 420"
          className="h-auto w-full max-w-[1320px] select-none overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        >
          <text
            x="720"
            y="348"
            textAnchor="middle"
            fill="none"
            stroke="#EBDDC3"
            strokeWidth="1.8"
            strokeLinejoin="round"
            style={{
              fontFamily: "'Anton', Impact, sans-serif",
              fontSize: '365px',
              letterSpacing: '4px',
            }}
          >
            PORTFOLIO
          </text>
        </svg>
      </div>
    </section>
  );
}
