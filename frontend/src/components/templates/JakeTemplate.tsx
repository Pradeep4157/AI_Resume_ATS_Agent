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

export function JakeTemplate({ data }: { data: NormalizedResume }) {
  if (!data) return null;

  const { basics, skills, experience, projects, achievements, education } = data;

  // Normalize links into an array even if incoming data is a string
  const linksList = Array.isArray(basics?.links)
    ? basics.links
    : typeof basics?.links === "string"
    ? [basics.links]
    : [];

  return (
    <div className="bg-white text-black font-serif p-8 rounded-lg text-[12px] leading-relaxed">
      {/* Header */}
      <div className="text-center border-b border-black pb-2 mb-3">
        <h1 className="text-2xl font-bold uppercase tracking-wide font-sans">{basics?.name}</h1>
        <div className="flex flex-wrap justify-center items-center gap-2 text-[11px] text-gray-700 mt-1">
          {basics?.email && (
            <a href={`mailto:${basics.email}`} className="hover:underline text-blue-800">
              {basics.email}
            </a>
          )}
          {basics?.phone && <span>• {basics.phone}</span>}
          {basics?.location && <span>• {basics.location}</span>}
          {linksList.map((link, i) => {
            const href = link.startsWith("http") ? link : `https://${link}`;
            const display = link.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
            return (
              <React.Fragment key={i}>
                <span>•</span>
                <a href={href} target="_blank" rel="noreferrer" className="hover:underline text-blue-800 font-mono text-[10px]">
                  {display}
                </a>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Education */}
      {education?.length > 0 && (
        <div className="mb-3 break-inside-avoid">
          <h2 className="font-bold uppercase text-[11px] border-b border-black mb-1 font-sans">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-baseline my-0.5">
              <div>
                <span className="font-bold">{edu.institution}</span> — <span>{edu.degree}</span>
              </div>
              <span className="text-[11px] font-mono">{edu.dates}</span>
            </div>
          ))}
        </div>
      )}

      {/* Technical Skills */}
      {skills?.length > 0 && (
        <div className="mb-3 break-inside-avoid">
          <h2 className="font-bold uppercase text-[11px] border-b border-black mb-1 font-sans">
            Technical Skills
          </h2>
          <p className="text-[11px]">
            <span className="font-bold">Languages & Tools: </span>
            {skills.join(", ")}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="mb-3">
          <h2 className="font-bold uppercase text-[11px] border-b border-black mb-1.5 font-sans">
            Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id || exp.role} className="mb-2 break-inside-avoid">
              <div className="flex justify-between font-bold">
                <span>{exp.role}</span>
                <span className="text-[11px] font-mono font-normal">{exp.dates}</span>
              </div>
              <div className="flex justify-between italic text-[11px] text-gray-800 mb-0.5">
                <span>{exp.company}</span>
                {exp.location && <span>{exp.location}</span>}
              </div>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-gray-900">
                {exp.bullets?.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div className="mb-3">
          <h2 className="font-bold uppercase text-[11px] border-b border-black mb-1.5 font-sans">
            Projects
          </h2>
          {projects.map((proj) => {
            const projHref = proj.link ? (proj.link.startsWith("http") ? proj.link : `https://${proj.link}`) : null;
            const projDisplay = proj.link ? proj.link.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") : null;

            return (
              <div key={proj.id || proj.name} className="mb-2 break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">
                    {proj.name}
                    {proj.tech_stack?.length > 0 && (
                      <span className="font-normal italic text-[11px] text-gray-700">
                        {" "}| {proj.tech_stack.join(", ")}
                      </span>
                    )}
                  </span>
                  {projHref && (
                    <a
                      href={projHref}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-mono text-blue-800 hover:underline"
                    >
                      [{projDisplay}]
                    </a>
                  )}
                </div>
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-gray-900 mt-0.5">
                  {proj.bullets?.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* Achievements */}
      {achievements?.length > 0 && (
        <div className="break-inside-avoid">
          <h2 className="font-bold uppercase text-[11px] border-b border-black mb-1 font-sans">
            Achievements & Recognition
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-gray-900">
            {achievements.map((ach) => (
              <li key={ach.id || ach.title}>
                <span className="font-bold">{ach.title}</span> ({ach.category}):{" "}
                {ach.details?.join(" • ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}