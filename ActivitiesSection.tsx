import type { AchievementEntry } from '../types/portfolio';

interface ActivitiesSectionProps {
  achievements: AchievementEntry[];
}

export function ActivitiesSection({ achievements }: ActivitiesSectionProps) {
  return (
    <section
      id="activities"
      aria-labelledby="activities-heading"
      className="scroll-mt-20 border-b border-[#EBDDC3]/12 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <div className="mb-12 border-b border-[#EBDDC3]/12 pb-6">
          <p className="font-mono text-xs tracking-[0.14em] text-[#8C857A] tabular-nums">
            05 · Hackathons & Teamwork
          </p>
          <h2
            id="activities-heading"
            className="mt-3 font-display text-4xl tracking-[0.02em] text-[#EBDDC3] sm:text-5xl lg:text-6xl"
            style={{ textWrap: 'balance' }}
          >
            ACHIEVEMENTS & ACTIVITIES
          </h2>
        </div>

        <ol className="divide-y divide-[#EBDDC3]/14 border-b border-[#EBDDC3]/14">
          {achievements.map((item) => (
            <li
              key={item.index}
              className="grid grid-cols-1 gap-3 py-8 sm:grid-cols-12 sm:items-baseline sm:gap-8"
            >
              <span className="font-display text-3xl text-[#EBDDC3]/45 tabular-nums sm:col-span-2">
                {item.index}
              </span>
              <h3 className="text-lg font-semibold text-[#EBDDC3] sm:col-span-4">
                {item.title}
              </h3>
              <p className="text-base leading-relaxed text-[#B8B0A0] sm:col-span-6">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
