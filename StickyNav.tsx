import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { formatDisplayNameTitleCase } from '../utils/portfolioLogic';

interface StickyNavProps {
  fullName: string;
}

const NAV_LINKS = [
  { href: '#profile', label: 'Profile' },
  { href: '#education', label: 'Education' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#activities', label: 'Activities' },
];

export function StickyNav({ fullName }: StickyNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const displayName = formatDisplayNameTitleCase(fullName);

  return (
    <header className="sticky top-0 z-40 border-y border-[#EBDDC3]/15 bg-[#181818]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-6 py-4 sm:px-10">
        {/* Zone 1: Single-element brand wordmark */}
        <a
          href="#cover"
          className="font-display text-lg tracking-[0.04em] text-[#EBDDC3] whitespace-nowrap shrink-0 transition-opacity duration-150 hover:opacity-80"
        >
          {displayName}
        </a>

        {/* Zone 2: 5 concise single-line text links */}
        <nav
          aria-label="Primary portfolio navigation"
          className="hidden md:flex items-center gap-7 text-sm font-normal text-[#B8B0A0]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#EBDDC3] hover:underline hover:underline-offset-8"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center rounded-sm bg-[#EBDDC3] px-5 py-2 text-xs font-semibold tracking-[0.04em] text-[#181818] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#f5ebd8]"
          >
            Contact
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-[#EBDDC3]/20 text-[#EBDDC3] md:hidden cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile collapsible navigation */}
      {mobileOpen && (
        <nav
          aria-label="Mobile portfolio navigation"
          className="border-t border-[#EBDDC3]/15 bg-[#181818] px-6 py-4 md:hidden"
        >
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[44px] items-center text-sm text-[#EBDDC3]/90 hover:text-[#EBDDC3]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex min-h-[44px] items-center justify-center rounded-sm bg-[#EBDDC3] px-4 py-2.5 text-sm font-semibold text-[#181818]"
            >
              Contact
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
