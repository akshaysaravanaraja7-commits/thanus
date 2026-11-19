import { Download } from 'lucide-react';
import type { PortfolioData } from '../types/portfolio';

interface ProfileSectionProps {
  portfolio: PortfolioData;
}

export function ProfileSection({ portfolio }: ProfileSectionProps) {
  const { profile, career_objective, career_interests, languages } = portfolio;

  const profileRows = [
    { label: 'Full Name', value: profile.full_name },
    { label: 'Role', value: profile.headline },
    { label: 'University', value: profile.university },
    { label: 'Program Pursued', value: profile.program_pursued },
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { label: 'Mobile', value: profile.mobile, href: `tel:${profile.mobile}` },
  ];

  return (
    <section
      id="profile"
      aria-labelledby="profile-heading"
      className="scroll-mt-20 border-b border-[#EBDDC3]/12 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-[#EBDDC3]/12 pb-6">
          <div>
            <p className="font-mono text-xs tracking-[0.14em] text-[#8C857A] tabular-nums">
              01 · Profile & Career Objective
            </p>
            <h2
              id="profile-heading"
              className="mt-3 font-display text-4xl tracking-[0.02em] text-[#EBDDC3] sm:text-5xl lg:text-6xl"
              style={{ textWrap: 'balance' }}
            >
              CAREER OBJECTIVE
            </h2>
          </div>

          <a
            href="/api/resume.txt"
            download="Arekatika_Thanush_Lal_Resume.txt"
            className="inline-flex min-h-[44px] items-center gap-2.5 rounded-sm border border-[#EBDDC3]/30 px-5 py-2.5 text-sm font-medium text-[#EBDDC3] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[#EBDDC3] hover:bg-[#EBDDC3] hover:text-[#181818]"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span>Download Resume</span>
          </a>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left column: Career Objective prose, Career Interests, Languages */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-10">
            <p className="max-w-[65ch] text-base leading-[1.75] font-light text-[#EBDDC3]/90 sm:text-lg">
              {career_objective}
            </p>

            <div className="grid grid-cols-1 gap-8 border-t border-[#EBDDC3]/12 pt-8 sm:grid-cols-2">
              <div>
                <h3 className="font-mono text-xs tracking-[0.12em] text-[#8C857A]">
                  Career Interests
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm text-[#EBDDC3]">
                  {career_interests.map((interest) => (
                    <li key={interest} className="flex items-baseline gap-3">
                      <span aria-hidden="true" className="text-[#8C857A]">
                        —
                      </span>
                      <span>{interest}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-mono text-xs tracking-[0.12em] text-[#8C857A]">
                  Languages
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#EBDDC3]">
                  {languages.join('  ·  ')}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-[#8C857A]">
                  Fluent communication across academic collaboration, technical
                  presentations, and team engineering environments.
                </p>
              </div>
            </div>
          </div>

          {/* Right column: Structured Profile Ledger */}
          <div className="lg:col-span-5">
            <div className="border border-[#EBDDC3]/14 bg-[#1F1F1D] p-6 sm:p-8">
              <h3 className="font-mono text-xs tracking-[0.12em] text-[#8C857A]">
                Profile Details
              </h3>
              <dl className="mt-5 divide-y divide-[#EBDDC3]/10">
                {profileRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                  >
                    <dt className="text-xs text-[#8C857A] shrink-0">{row.label}</dt>
                    <dd className="text-sm font-medium text-[#EBDDC3] sm:text-right break-words">
                      {row.href ? (
                        <a
                          href={row.href}
                          className="transition-opacity duration-150 hover:underline hover:underline-offset-4"
                        >
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
