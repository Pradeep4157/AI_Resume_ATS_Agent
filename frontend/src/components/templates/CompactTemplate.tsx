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

export function CompactTemplate({ data }: { data: NormalizedResume }) {
  if (!data) return null;

  const { basics, skills, experience, projects, achievements, education } = data;

  const linksList = Array.isArray(basics?.links)
    ? basics.links
    : typeof basics?.links === "string"
    ? [basics.links]
    : [];

  return (
    <div className="bg-white text-black font-sans p-6 text-[11px] leading-tight">
      {/* Header */}
      <div className="border-b-2 border-gray-900 pb-2 mb-2">
        <h1 className="text-xl font-black uppercase tracking-tight text-gray-900">{basics?.name}</h1>
        <div className="flex flex-wrap gap-x-2 text-[10px] text-gray-700 mt-0.5">
          {basics?.email && (
            <a href={`mailto:${basics.email}`} className="hover:underline text-blue-700 font-medium">
              {basics.email}
            </a>
          )}
          {basics?.phone && <span>| {basics.phone}</span>}
          {basics?.location && <span>| {basics.location}</span>}
          {linksList.map((link, i) => {
            const href = link.startsWith("http") ? link : `https://${link}`;
            const display = link.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
            return (
              <React.Fragment key={i}>
                <span>|</span>
                <a href={href} target="_blank" rel="noreferrer" className="hover:underline text-blue-700 font-mono">
                  {display}
                </a>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Skills */}
      {skills?.length > 0 && (
        <div className="mb-2 break-inside-avoid">
          <h2 className="font-bold uppercase text-[10px] tracking-wider text-gray-900 border-b border-gray-300 pb-0.5 mb-1">
            Technical Skills
          </h2>
          <p className="text-[10px.5] text-gray-800">
            {skills.join(" • ")}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="mb-2">
          <h2 className="font-bold uppercase text-[10px] tracking-wider text-gray-900 border-b border-gray-300 pb-0.5 mb-1">
            Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id || exp.role} className="mb-1.5 break-inside-avoid">
              <div className="flex justify-between font-bold text-gray-900">
                <span>{exp.role} <span className="font-normal text-gray-700">@ {exp.company}</span></span>
                <span className="text-[10px] font-mono font-normal text-gray-600">{exp.dates}</span>
              </div>
              <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-[10px.5] text-gray-800 mt-0.5">
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
        <div className="mb-2">
          <h2 className="font-bold uppercase text-[10px] tracking-wider text-gray-900 border-b border-gray-300 pb-0.5 mb-1">
            Projects
          </h2>
          {projects.map((proj) => {
            const projHref = proj.link ? (proj.link.startsWith("http") ? proj.link : `https://${proj.link}`) : null;
            const projDisplay = proj.link ? proj.link.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") : null;

            return (
              <div key={proj.id || proj.name} className="mb-1.5 break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">
                    {proj.name}
                    {proj.tech_stack?.length > 0 && (
                      <span className="font-normal text-gray-600 text-[10px]">
                        {" "}({proj.tech_stack.join(", ")})
                      </span>
                    )}
                  </span>
                  {projHref && (
                    <a href={projHref} target="_blank" rel="noreferrer" className="text-[9.5px] font-mono text-blue-700 hover:underline">
                      {projDisplay}
                    </a>
                  )}
                </div>
                <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-[10px.5] text-gray-800 mt-0.5">
                  {proj.bullets?.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div className="mb-2 break-inside-avoid">
          <h2 className="font-bold uppercase text-[10px] tracking-wider text-gray-900 border-b border-gray-300 pb-0.5 mb-1">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-baseline">
              <div>
                <span className="font-bold text-gray-900">{edu.institution}</span> — <span className="text-gray-800">{edu.degree}</span>
              </div>
              <span className="text-[10px] font-mono text-gray-600">{edu.dates}</span>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {achievements?.length > 0 && (
        <div className="break-inside-avoid">
          <h2 className="font-bold uppercase text-[10px] tracking-wider text-gray-900 border-b border-gray-300 pb-0.5 mb-1">
            Achievements
          </h2>
          <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-[10px.5] text-gray-800">
            {achievements.map((ach) => (
              <li key={ach.id || ach.title}>
                <span className="font-semibold text-gray-900">{ach.title}</span>: {ach.details?.join(" • ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}