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

export function ExecutiveTemplate({ data }: { data: NormalizedResume }) {
  if (!data) return null;

  const { basics, skills, experience, projects, achievements, education } = data;

  const linksList = Array.isArray(basics?.links)
    ? basics.links
    : typeof basics?.links === "string"
    ? [basics.links]
    : [];

  return (
    <div className="bg-white text-slate-900 font-sans p-8 text-[12px] leading-relaxed">
      {/* Header */}
      <div className="border-b-2 border-slate-800 pb-3 mb-4">
        <h1 className="text-2xl font-bold tracking-wide text-slate-900">{basics?.name}</h1>
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 mt-1">
          {basics?.email && (
            <a href={`mailto:${basics.email}`} className="hover:underline text-slate-900 font-medium">
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
                <a href={href} target="_blank" rel="noreferrer" className="hover:underline text-blue-700 font-mono text-[10.5px]">
                  {display}
                </a>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold uppercase text-[11px] tracking-wider text-slate-800 bg-slate-100 px-2 py-0.5 rounded mb-2">
            Professional Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id || exp.role} className="mb-3 break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold text-slate-900">
                <span className="text-[12.5px]">{exp.role}</span>
                <span className="text-[11px] font-mono text-slate-600">{exp.dates}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-700 mb-1">
                <span>{exp.company}</span>
                {exp.location && <span>{exp.location}</span>}
              </div>
              <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-slate-800">
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
        <div className="mb-4">
          <h2 className="font-bold uppercase text-[11px] tracking-wider text-slate-800 bg-slate-100 px-2 py-0.5 rounded mb-2">
            Key Projects
          </h2>
          {projects.map((proj) => {
            const projHref = proj.link ? (proj.link.startsWith("http") ? proj.link : `https://${proj.link}`) : null;
            const projDisplay = proj.link ? proj.link.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") : null;

            return (
              <div key={proj.id || proj.name} className="mb-3 break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">
                    {proj.name}
                    {proj.tech_stack?.length > 0 && (
                      <span className="font-normal text-[11px] text-slate-600">
                        {" "}| {proj.tech_stack.join(", ")}
                      </span>
                    )}
                  </span>
                  {projHref && (
                    <a href={projHref} target="_blank" rel="noreferrer" className="text-[10.5px] font-mono text-blue-700 hover:underline">
                      [{projDisplay}]
                    </a>
                  )}
                </div>
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-slate-800 mt-1">
                  {proj.bullets?.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <div className="mb-4 break-inside-avoid">
          <h2 className="font-bold uppercase text-[11px] tracking-wider text-slate-800 bg-slate-100 px-2 py-0.5 rounded mb-1.5">
            Core Competencies & Tools
          </h2>
          <p className="text-[11px] text-slate-800 leading-relaxed px-1">
            {skills.join(" • ")}
          </p>
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div className="mb-4 break-inside-avoid">
          <h2 className="font-bold uppercase text-[11px] tracking-wider text-slate-800 bg-slate-100 px-2 py-0.5 rounded mb-1.5">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-baseline px-1 my-0.5">
              <div>
                <span className="font-bold text-slate-900">{edu.institution}</span> — <span className="text-slate-800">{edu.degree}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-600">{edu.dates}</span>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {achievements?.length > 0 && (
        <div className="break-inside-avoid">
          <h2 className="font-bold uppercase text-[11px] tracking-wider text-slate-800 bg-slate-100 px-2 py-0.5 rounded mb-1.5">
            Honors & Leadership
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-slate-800">
            {achievements.map((ach) => (
              <li key={ach.id || ach.title}>
                <span className="font-bold text-slate-900">{ach.title}</span> ({ach.category}): {ach.details?.join(" • ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}