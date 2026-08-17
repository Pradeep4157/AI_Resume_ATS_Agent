import React from "react";

interface NormalizedResume {
  basics: {
    name: string;
    email?: string;
    phone?: string;
    location?: string;
    links?: string[] | string;
  };
  skills: string[];
  experience: Array<{
    id: string;
    company: string;
    role: string;
    dates: string;
    location?: string;
    bullets: string[];
  }>;
  projects: Array<{
    id: string;
    name: string;
    tech_stack: string[];
    link?: string;
    bullets: string[];
  }>;
  achievements: Array<{
    id: string;
    title: string;
    category: string;
    dates?: string;
    details: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    dates: string;
  }>;
}

const formatLink = (link: string) => {
  const href = link.startsWith("http") ? link : `https://${link}`;
  const display = link
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/\/$/, "");

  return { href, display };
};

export function JakeTemplate({ data }: { data: NormalizedResume }) {
  if (!data) return null;

  const {
    basics,
    skills,
    experience,
    projects,
    achievements,
    education,
  } = data;

  const linksList = Array.isArray(basics?.links)
    ? basics.links
    : typeof basics?.links === "string" && basics.links
      ? [basics.links]
      : [];

  return (
    <div
      className="bg-white text-black px-[12mm] py-[10mm] text-[10pt] leading-[1.25]"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      {/* ================= HEADER ================= */}
      <header className="text-center mb-[8pt]">
        <h1 className="text-[18pt] font-bold tracking-tight leading-none mb-[3pt]">
          {basics?.name}
        </h1>

        <div className="flex flex-wrap justify-center items-center gap-x-[4pt] text-[9pt] leading-[1.15]">
          {basics?.phone && <span>{basics.phone}</span>}

          {basics?.email && (
            <>
              {basics?.phone && <span>|</span>}
              <a
                href={`mailto:${basics.email}`}
                className="text-black no-underline hover:underline"
              >
                {basics.email}
              </a>
            </>
          )}

          {basics?.location && (
            <>
              {(basics?.phone || basics?.email) && <span>|</span>}
              <span>{basics.location}</span>
            </>
          )}

          {linksList.map((link, index) => {
            const { href, display } = formatLink(link);

            return (
              <React.Fragment key={index}>
                <span>|</span>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-black no-underline hover:underline"
                >
                  {display}
                </a>
              </React.Fragment>
            );
          })}
        </div>
      </header>

      {/* ================= EDUCATION ================= */}
      {education?.length > 0 && (
        <section className="mb-[7pt]">
          <SectionTitle title="Education" />

          {education.map((edu, index) => (
            <div
              key={index}
              className="flex justify-between items-baseline mb-[2pt]"
            >
              <div className="min-w-0">
                <span className="font-bold">
                  {edu.institution}
                </span>
                <span> — {edu.degree}</span>
              </div>

              <span className="ml-[10pt] shrink-0 text-[9pt]">
                {edu.dates}
              </span>
            </div>
          ))}
        </section>
      )}

      {/* ================= EXPERIENCE ================= */}
      {experience?.length > 0 && (
        <section className="mb-[7pt]">
          <SectionTitle title="Experience" />

          {experience.map((exp) => (
            <div
              key={exp.id || exp.role}
              className="mb-[5pt]"
            >
              {/* Company + Dates */}
              <div className="flex justify-between items-baseline">
                <span className="font-bold">
                  {exp.company}
                </span>

                <span className="ml-[10pt] shrink-0 text-[9pt]">
                  {exp.dates}
                </span>
              </div>

              {/* Role + Location */}
              <div className="flex justify-between items-baseline italic text-[9.5pt]">
                <span>{exp.role}</span>

                {exp.location && (
                  <span className="ml-[10pt] shrink-0">
                    {exp.location}
                  </span>
                )}
              </div>

              {/* Bullets */}
              {exp.bullets?.length > 0 && (
                <ul className="list-disc ml-[15pt] mt-[1.5pt] space-y-[0.5pt]">
                  {exp.bullets.map((bullet, index) => (
                    <li
                      key={index}
                      className="pl-[1pt] text-[9.5pt]"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ================= PROJECTS ================= */}
      {projects?.length > 0 && (
        <section className="mb-[7pt]">
          <SectionTitle title="Projects" />

          {projects.map((project) => {
            const linkInfo = project.link
              ? formatLink(project.link)
              : null;

            return (
              <div
                key={project.id || project.name}
                className="mb-[5pt]"
              >
                {/* Project + Link */}
                <div className="flex justify-between items-baseline">
                  <div className="min-w-0">
                    <span className="font-bold">
                      {project.name}
                    </span>

                    {project.tech_stack?.length > 0 && (
                      <span className="italic text-[9pt]">
                        {" | "}
                        {project.tech_stack.join(", ")}
                      </span>
                    )}
                  </div>

                  {linkInfo && (
                    <a
                      href={linkInfo.href}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-[10pt] shrink-0 text-[8.5pt] text-black no-underline hover:underline"
                    >
                      {linkInfo.display}
                    </a>
                  )}
                </div>

                {/* Project bullets */}
                {project.bullets?.length > 0 && (
                  <ul className="list-disc ml-[15pt] mt-[1.5pt] space-y-[0.5pt]">
                    {project.bullets.map((bullet, index) => (
                      <li
                        key={index}
                        className="pl-[1pt] text-[9.5pt]"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* ================= TECHNICAL SKILLS ================= */}
      {skills?.length > 0 && (
        <section className="mb-[7pt]">
          <SectionTitle title="Technical Skills" />

          <p className="text-[9.5pt]">
            <span className="font-bold">
              Languages &amp; Technologies:
            </span>{" "}
            {skills.join(", ")}
          </p>
        </section>
      )}

      {/* ================= ACHIEVEMENTS ================= */}
      {achievements?.length > 0 && (
        <section>
          <SectionTitle title="Honors & Achievements" />

          <ul className="list-disc ml-[15pt] space-y-[0.5pt]">
            {achievements.map((achievement) => (
              <li
                key={achievement.id || achievement.title}
                className="pl-[1pt] text-[9.5pt]"
              >
                <span className="font-bold">
                  {achievement.title}
                </span>

                {achievement.category && (
                  <span> ({achievement.category})</span>
                )}

                {achievement.details?.length > 0 && (
                  <span>
                    : {achievement.details.join(" • ")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/* ============================================================
   JAKE-STYLE SECTION HEADING
   ============================================================ */

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-baseline mb-[3pt]">
      <h2 className="text-[10pt] font-bold uppercase tracking-[0.02em] whitespace-nowrap">
        {title}
      </h2>

      <div className="ml-[5pt] flex-1 border-b border-black" />
    </div>
  );
}