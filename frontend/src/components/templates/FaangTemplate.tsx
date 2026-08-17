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

export function FaangTemplate({ data }: { data: NormalizedResume }) {
  if (!data) return null;

  const { basics, skills, experience, projects, achievements, education } = data;

  const linksList = Array.isArray(basics?.links)
    ? basics.links
    : typeof basics?.links === "string"
    ? [basics.links]
    : [];

  return (
    <div className="bg-white text-black font-sans p-8 text-[11.5px] leading-snug">
      {/* Header */}
      <div className="text-center mb-3">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-black">{basics?.name}</h1>
        <div className="flex flex-wrap justify-center items-center gap-1.5 text-[10.5px] text-gray-800 mt-1">
          {basics?.location && <span>{basics.location}</span>}
          {basics?.email && (
            <>
              <span>|</span>
              <a href={`mailto:${basics.email}`} className="hover:underline text-blue-800 font-medium">
                {basics.email}
              </a>
            </>
          )}
          {basics?.phone && <span>| {basics.phone}</span>}
          {linksList.map((link, i) => {
            const href = link.startsWith("http") ? link : `https://${link}`;
            const display = link.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
            return (
              <React.Fragment key={i}>
                <span>|</span>
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
          <h2 className="font-bold uppercase text-[11px] border-b border-black mb-1">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-baseline">
              <div>
                <span className="font-bold">{edu.institution}</span>, {edu.degree}
              </div>
              <span className="text-[10.5px] font-mono text-gray-700">{edu.dates}</span>
            </div>
          ))}
        </div>
      )}

      {/* Technical Skills */}
      {skills?.length > 0 && (
        <div className="mb-3 break-inside-avoid">
          <h2 className="font-bold uppercase text-[11px] border-b border-black mb-1">
            Technical Skills
          </h2>
          <p className="text-[11px]">
            <span className="font-bold">Languages & Technologies: </span>
            {skills.join(", ")}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="mb-3">
          <h2 className="font-bold uppercase text-[11px] border-b border-black mb-1.5">
            Work Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id || exp.role} className="mb-2.5 break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold">
                <span>{exp.company}</span>
                <span className="text-[10.5px] font-mono font-normal text-gray-700">{exp.dates}</span>
              </div>
              <div className="flex justify-between items-baseline  text-[11px] text-gray-800 mb-0.5">
                <span>{exp.role}</span>
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
          <h2 className="font-bold uppercase text-[11px] border-b border-black mb-1.5">
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
                      <span className="font-normal  text-[10.5px] text-gray-700">
                        {" "}| {proj.tech_stack.join(", ")}
                      </span>
                    )}
                  </span>
                  {projHref && (
                    <a href={projHref} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-blue-800 hover:underline">
                      {projDisplay}
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
          <h2 className="font-bold uppercase text-[11px] border-b border-black mb-1">
            Honors & Achievements
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-gray-900">
            {achievements.map((ach) => (
              <li key={ach.id || ach.title}>
                <span className="font-bold">{ach.title}</span> ({ach.category}): {ach.details?.join(" • ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}