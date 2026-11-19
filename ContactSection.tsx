import { useState, type FormEvent } from 'react';
import { ArrowUp, Check, Copy, Download, Send } from 'lucide-react';
import type { ContactFormInput, ProfileInfo } from '../types/portfolio';
import {
  formatDisplayNameTitleCase,
  validateContactForm,
} from '../utils/portfolioLogic';

interface ContactSectionProps {
  profile: ProfileInfo;
}

const EMPTY_FORM: ContactFormInput = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export function ContactSection({ profile }: ContactSectionProps) {
  const [form, setForm] = useState<ContactFormInput>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ContactFormInput, string>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedNote, setSubmittedNote] = useState<{
    id: string;
    message: string;
  } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const displayName = formatDisplayNameTitleCase(profile.full_name);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      setCopiedEmail(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    const validation = validateContactForm(form);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.field_errors) {
          setFieldErrors(data.field_errors);
        }
        throw new Error(data.error || 'Could not submit inquiry.');
      }

      setSubmittedNote({
        id: data.inquiry?.id ?? 'recorded',
        message:
          data.message ||
          `Thank you, ${form.name.trim()}. Your message has been recorded.`,
      });
      setForm(EMPTY_FORM);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Unable to send message right now.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-20 pt-20 pb-12 sm:pt-28 sm:pb-16"
    >
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <div className="mb-12 border-b border-[#EBDDC3]/12 pb-6">
          <p className="font-mono text-xs tracking-[0.14em] text-[#8C857A] tabular-nums">
            06 · Internships & Collaboration
          </p>
          <h2
            id="contact-heading"
            className="mt-3 font-display text-4xl tracking-[0.02em] text-[#EBDDC3] sm:text-5xl lg:text-6xl"
          >
            GET IN TOUCH
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Direct Contact Details */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-10">
            <div>
              <p className="text-base leading-relaxed text-[#B8B0A0]">
                Open to software development and web development internship
                opportunities, collaborative academic builds, and emerging technology
                projects.
              </p>

              <dl className="mt-8 divide-y divide-[#EBDDC3]/12 border-y border-[#EBDDC3]/12">
                <div className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <dt className="font-mono text-xs text-[#8C857A]">Email</dt>
                    <dd className="mt-1 text-sm font-medium text-[#EBDDC3]">
                      <a
                        href={`mailto:${profile.email}`}
                        className="hover:underline hover:underline-offset-4"
                      >
                        {profile.email}
                      </a>
                    </dd>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label={`Copy ${profile.email}`}
                    className="inline-flex min-h-[40px] items-center gap-1.5 border border-[#EBDDC3]/20 px-3 py-1.5 text-xs text-[#EBDDC3] transition-colors duration-150 hover:border-[#EBDDC3] cursor-pointer"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="py-4">
                  <dt className="font-mono text-xs text-[#8C857A]">Mobile</dt>
                  <dd className="mt-1 text-sm font-medium text-[#EBDDC3] tabular-nums">
                    <a
                      href={`tel:${profile.mobile}`}
                      className="hover:underline hover:underline-offset-4"
                    >
                      {profile.mobile}
                    </a>
                  </dd>
                </div>

                <div className="py-4">
                  <dt className="font-mono text-xs text-[#8C857A]">University</dt>
                  <dd className="mt-1 text-sm font-medium text-[#EBDDC3]">
                    {profile.university} · {profile.program_pursued}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <a
                href="/api/resume.txt"
                download="Arekatika_Thanush_Lal_Resume.txt"
                className="inline-flex min-h-[44px] items-center gap-2.5 border border-[#EBDDC3]/30 px-5 py-2.5 text-sm font-medium text-[#EBDDC3] transition-colors duration-150 hover:border-[#EBDDC3] hover:bg-[#EBDDC3] hover:text-[#181818]"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>Download Resume (.txt)</span>
              </a>
            </div>
          </div>

          {/* Python-Backed Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="border border-[#EBDDC3]/14 bg-[#1F1F1D] p-7 sm:p-9">
              {submittedNote ? (
                <div
                  data-testid="contact-confirmation"
                  aria-live="polite"
                  className="py-6"
                >
                  <p className="font-mono text-xs text-[#8C857A]">
                    Inquiry Recorded · Ref {submittedNote.id}
                  </p>
                  <h3 className="mt-3 font-display text-3xl text-[#EBDDC3]">
                    MESSAGE RECEIVED
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#B8B0A0]">
                    {submittedNote.message}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmittedNote(null)}
                    className="mt-6 inline-flex min-h-[44px] items-center border border-[#EBDDC3]/30 px-5 py-2.5 text-sm font-medium text-[#EBDDC3] transition-colors duration-150 hover:border-[#EBDDC3] hover:bg-[#EBDDC3] hover:text-[#181818] cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-medium text-[#B8B0A0]"
                      >
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => {
                          setForm((prev) => ({ ...prev, name: e.target.value }));
                          if (fieldErrors.name) {
                            setFieldErrors((prev) => ({ ...prev, name: undefined }));
                          }
                        }}
                        placeholder="Priya Nair"
                        aria-invalid={Boolean(fieldErrors.name)}
                        className="mt-2 block w-full min-h-[44px] border border-[#EBDDC3]/18 bg-[#181818] px-4 py-2.5 text-sm text-[#EBDDC3] placeholder:text-[#8C857A]/60 focus:border-[#EBDDC3] focus:outline-none"
                      />
                      {fieldErrors.name && (
                        <p role="alert" className="mt-1.5 text-xs text-amber-300">
                          {fieldErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-medium text-[#B8B0A0]"
                      >
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => {
                          setForm((prev) => ({ ...prev, email: e.target.value }));
                          if (fieldErrors.email) {
                            setFieldErrors((prev) => ({ ...prev, email: undefined }));
                          }
                        }}
                        placeholder="priya@company.com"
                        aria-invalid={Boolean(fieldErrors.email)}
                        className="mt-2 block w-full min-h-[44px] border border-[#EBDDC3]/18 bg-[#181818] px-4 py-2.5 text-sm text-[#EBDDC3] placeholder:text-[#8C857A]/60 focus:border-[#EBDDC3] focus:outline-none"
                      />
                      {fieldErrors.email && (
                        <p role="alert" className="mt-1.5 text-xs text-amber-300">
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-xs font-medium text-[#B8B0A0]"
                    >
                      Subject (Optional)
                    </label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      value={form.subject}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, subject: e.target.value }))
                      }
                      placeholder="Software Development Internship Opportunity"
                      className="mt-2 block w-full min-h-[44px] border border-[#EBDDC3]/18 bg-[#181818] px-4 py-2.5 text-sm text-[#EBDDC3] placeholder:text-[#8C857A]/60 focus:border-[#EBDDC3] focus:outline-none"
                    />
                    {fieldErrors.subject && (
                      <p role="alert" className="mt-1.5 text-xs text-amber-300">
                        {fieldErrors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-medium text-[#B8B0A0]"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      required
                      value={form.message}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, message: e.target.value }));
                        if (fieldErrors.message) {
                          setFieldErrors((prev) => ({ ...prev, message: undefined }));
                        }
                      }}
                      placeholder="Share details about an internship, project, or collaboration..."
                      aria-invalid={Boolean(fieldErrors.message)}
                      className="mt-2 block w-full border border-[#EBDDC3]/18 bg-[#181818] px-4 py-3 text-sm text-[#EBDDC3] placeholder:text-[#8C857A]/60 focus:border-[#EBDDC3] focus:outline-none"
                    />
                    {fieldErrors.message && (
                      <p role="alert" className="mt-1.5 text-xs text-amber-300">
                        {fieldErrors.message}
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <p role="alert" className="text-sm text-amber-300">
                      {submitError}
                    </p>
                  )}

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex min-h-[44px] items-center gap-2.5 rounded-sm bg-[#EBDDC3] px-6 py-2.5 text-sm font-semibold text-[#181818] whitespace-nowrap transition-colors duration-150 hover:bg-[#f5ebd8] disabled:opacity-60 cursor-pointer"
                    >
                      <Send className="h-4 w-4" aria-hidden="true" />
                      <span>{isSubmitting ? 'Sending...' : 'Send Inquiry'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Quiet Editorial Footer */}
        <footer className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-[#EBDDC3]/12 pt-8 text-xs text-[#8C857A]">
          <p>
            © 2026 {displayName} · {profile.university} · Python-Powered Portfolio
          </p>
          <div className="flex items-center gap-6">
            <a
              href="/api/portfolio-source.zip"
              download="Arekatika_Thanush_Lal_Portfolio.zip"
              className="inline-flex min-h-[40px] items-center gap-1.5 text-[#B8B0A0] transition-colors duration-150 hover:text-[#EBDDC3]"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Download Source (.zip)</span>
            </a>
            <a
              href="#cover"
              className="inline-flex min-h-[40px] items-center gap-1.5 text-[#B8B0A0] transition-colors duration-150 hover:text-[#EBDDC3]"
            >
              <span>Back to Top</span>
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}
