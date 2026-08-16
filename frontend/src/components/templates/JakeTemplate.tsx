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
  const display = link.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  return { href, display };
};

export function JakeTemplate({ data }: { data: NormalizedResume }) {
  if (!data) return null;

  const { basics, skills, experience, projects, achievements, education } = data;

  const linksList = Array.isArray(basics?.links)
    ? basics.links
    : typeof basics?.links === "string" && basics.links
    ? [basics.links]
    : [];

  const contactParts = [basics?.phone, basics?.email, basics?.location].filter(Boolean);

  return (
    <div className="bg-white text-black p-[12mm] text-[10.5pt] leading-[1.4]" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
      {/* Header */}
      <div className="text-center border-b border-black pb-[6pt] mb-[10pt]">
        <h1 className="text-[18pt] font-bold uppercase tracking-wide m-0 mb-[4pt]">{basics?.name}</h1>
        <div className="text-[9pt] text-[#333333]">
          {contactParts.join("  |  ")}
          {linksList.length > 0 && (
            <>
              {contactParts.length > 0 && <span>&nbsp;|&nbsp;</span>}
              {linksList.join(", ")}
            </>
          )}
        </div>
      </div>

      {/* Education */}
      {education?.length > 0 && (
        <section className="mb-[9pt] break-inside-avoid">
          <h2 className="text-[9.5pt] font-bold uppercase border-b border-black pb-[2pt] mb-[5pt]">Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-start">
              <div className="text-left">
                <span className="font-bold text-[10.5pt]">{edu.institution}</span> — {edu.degree}
              </div>
              <div className="text-right whitespace-nowrap pl-[10pt] font-mono text-[9pt] text-[#333333] w-[90pt] shrink-0">
                {edu.dates}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <section className="mb-[9pt] break-inside-avoid">
          <h2 className="text-[9.5pt] font-bold uppercase border-b border-black pb-[2pt] mb-[5pt]">Technical Skills</h2>
          <p className="text-[9.5pt]">
            <span className="font-bold">Languages &amp; Tools: </span>
            {skills.join(", ")}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <section className="mb-[9pt]">
          <h2 className="text-[9.5pt] font-bold uppercase border-b border-black pb-[2pt] mb-[5pt]">Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id || exp.role} className="mb-[6pt] break-inside-avoid">
              <div className="flex justify-between items-start">
                <div className="font-bold text-[10.5pt] text-left">{exp.role}</div>
                <div className="text-right whitespace-nowrap pl-[10pt] font-mono text-[9pt] text-[#333333] w-[90pt] shrink-0">
                  {exp.dates}
                </div>
              </div>
              <div className="flex justify-between items-start italic text-[9.5pt] text-[#333333] mb-[2pt]">
                <div>{exp.company}</div>
                <div>{exp.location || ""}</div>
              </div>
              <ul className="list-disc list-outside ml-[14pt] mt-[2pt] space-y-[1.5pt]">
                {exp.bullets?.map((b, i) => (
                  <li key={i} className="text-[9.5pt]">{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <section className="mb-[9pt]">
          <h2 className="text-[9.5pt] font-bold uppercase border-b border-black pb-[2pt] mb-[5pt]">
            Projects
          </h2>

          {projects.map((proj) => {
            const linkInfo = proj.link ? formatLink(proj.link) : null;

            return (
              <div
                key={proj.id || proj.name}
                className="mb-[6pt] break-inside-avoid"
              >
                <div className="flex justify-between items-start">

                  <div className="font-bold text-[10.5pt] text-left">
                    {proj.name}

                    {proj.tech_stack?.length > 0 && (
                      <span className="font-normal italic text-[9pt]">
                        {" | "}
                        {proj.tech_stack.join(", ")}
                      </span>
                    )}
                  </div>

                  {linkInfo && (
                    <a
                      href={linkInfo.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-right whitespace-normal pl-[10pt] font-mono text-[9pt] text-[#1a4fa3] no-underline hover:underline w-[130pt] shrink-0"
                    >
                      [{linkInfo.display}]
                    </a>
                  )}

                </div>

                <ul className="list-disc list-outside ml-[14pt] mt-[2pt] space-y-[1.5pt]">
                  {proj.bullets?.map((b, i) => (
                    <li key={i} className="text-[9.5pt]">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      )}

      {/* Achievements */}
      {achievements?.length > 0 && (
        <section className="break-inside-avoid">
          <h2 className="text-[9.5pt] font-bold uppercase border-b border-black pb-[2pt] mb-[5pt]">
            Achievements &amp; Recognition
          </h2>
          <ul className="list-disc list-outside ml-[14pt] space-y-[1.5pt]">
            {achievements.map((ach) => (
              <li key={ach.id || ach.title} className="text-[9.5pt]">
                <span className="font-bold">{ach.title}</span>: {ach.details?.join(" • ")}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}