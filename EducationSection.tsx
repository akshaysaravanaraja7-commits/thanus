import type { EducationEntry } from '../types/portfolio';

interface EducationSectionProps {
  education: EducationEntry;
  programPursued: string;
}

export function EducationSection({ education, programPursued }: EducationSectionProps) {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="scroll-mt-20 border-b border-[#EBDDC3]/12 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <div className="mb-12 border-b border-[#EBDDC3]/12 pb-6">
          <p className="font-mono text-xs tracking-[0.14em] text-[#8C857A] tabular-nums">
            02 · Academic Background
          </p>
          <h2
            id="education-heading"
            className="mt-3 font-display text-4xl tracking-[0.02em] text-[#EBDDC3] sm:text-5xl lg:text-6xl"
          >
            EDUCATION
          </h2>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Focal Anchor: Oversized CGPA Metric */}
          <div className="flex flex-col justify-between border border-[#EBDDC3]/14 bg-[#1F1F1D] p-8 lg:col-span-4">
            <p className="font-mono text-xs tracking-[0.12em] text-[#8C857A]">
              Cumulative Grade Point Average
            </p>
            <div className="my-6 flex items-baseline gap-3">
              <span className="font-display text-7xl leading-none tracking-tight text-[#EBDDC3] tabular-nums sm:text-8xl">
                {education.cgpa}
              </span>
              <span className="font-mono text-base text-[#8C857A] tabular-nums">
                / {education.cgpa_scale}
              </span>
            </div>
            <p className="text-sm text-[#B8B0A0]">{education.status}</p>
          </div>

          {/* Academic Details */}
          <div className="flex flex-col justify-between border border-[#EBDDC3]/14 bg-[#181818] p-8 lg:col-span-8">
            <div>
              <p className="text-sm text-[#B8B0A0]">{education.institution}</p>
              <h3 className="mt-2 font-display text-3xl tracking-[0.02em] text-[#EBDDC3] sm:text-4xl">
                {education.degree}
              </h3>
              <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-[#B8B0A0]">
                Building strong engineering foundations across Python, Java, web
                technologies, and FastAPI backend design through hands-on coursework and
                project-based learning.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 border-t border-[#EBDDC3]/12 pt-6 sm:grid-cols-3">
              <div>
                <p className="font-mono text-xs text-[#8C857A]">Program Pursued</p>
                <p className="mt-1.5 text-sm font-medium text-[#EBDDC3]">
                  {programPursued}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#8C857A]">University</p>
                <p className="mt-1.5 text-sm font-medium text-[#EBDDC3]">
                  {education.institution}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#8C857A]">Academic Standing</p>
                <p className="mt-1.5 text-sm font-medium text-[#EBDDC3]">
                  {education.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
