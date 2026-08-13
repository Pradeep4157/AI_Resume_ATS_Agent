import React from "react";

interface NormalizedResume {
  basics: {
    name: string;
    email?: string;
    phone?: string;
    location?: string;
    links?: string;
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

export function JakesTemplate({ data }: { data: NormalizedResume }) {
  return (
    <div className="bg-white text-black font-serif p-8 max-w-4xl mx-auto shadow-md text-[13px] leading-relaxed">
      {/* Header */}
      <div className="text-center border-b border-black pb-2 mb-4">
        <h1 className="text-2xl font-bold uppercase tracking-wider">{data.basics.name}</h1>
        <p className="text-xs text-gray-700 mt-1">
          {[data.basics.phone, data.basics.email, data.basics.location, data.basics.links]
            .filter(Boolean)
            .join(" | ")}
        </p>
      </div>

      {/* Education */}
      {data.education?.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold uppercase text-xs border-b border-black mb-1.5">Education</h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-baseline my-1">
              <div>
                <span className="font-bold">{edu.institution}</span> — <span>{edu.degree}</span>
              </div>
              <span className="text-xs font-mono">{edu.dates}</span>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold uppercase text-xs border-b border-black mb-1.5 font-sans">
            Technical Skills
          </h2>
          <p className="text-xs">
            <span className="font-bold">Languages & Tools: </span>
            {data.skills.join(", ")}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold uppercase text-xs border-b border-black mb-2 font-sans">
            Experience
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between font-bold">
                <span>{exp.role}</span>
                <span className="text-xs font-mono font-normal">{exp.dates}</span>
              </div>
              <div className="flex justify-between italic text-xs text-gray-800 mb-1">
                <span>{exp.company}</span>
                {exp.location && <span>{exp.location}</span>}
              </div>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-gray-900">
                {exp.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold uppercase text-xs border-b border-black mb-2 font-sans">
            Projects
          </h2>
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-bold">
                  {proj.name}{" "}
                  {proj.tech_stack?.length > 0 && (
                    <span className="font-normal italic text-xs text-gray-700">
                      | {proj.tech_stack.join(", ")}
                    </span>
                  )}
                </span>
                {proj.link && <span className="text-xs text-blue-800 underline">{proj.link}</span>}
              </div>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-gray-900 mt-1">
                {proj.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Achievements & Certifications */}
      {data.achievements?.length > 0 && (
        <div>
          <h2 className="font-bold uppercase text-xs border-b border-black mb-2 font-sans">
            Achievements & Certifications
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-gray-900">
            {data.achievements.map((ach) => (
              <li key={ach.id}>
                <span className="font-bold">{ach.title}</span> ({ach.category}):{" "}
                {ach.details.join(" • ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}