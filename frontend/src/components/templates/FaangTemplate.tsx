import React from "react";

export function FaangTemplate({ data }: { data: any }) {
  return (
    <div className="bg-white text-zinc-900 font-sans p-8 max-w-4xl mx-auto shadow-md text-xs leading-normal">
      {/* Header */}
      <div className="border-b-2 border-zinc-900 pb-3 mb-4">
        <h1 className="text-2xl font-black tracking-tight text-zinc-900">{data.basics.name}</h1>
        <div className="flex flex-wrap gap-2 text-zinc-600 mt-1 text-[11px]">
          {[data.basics.email, data.basics.phone, data.basics.location, data.basics.links]
            .filter(Boolean)
            .map((item, idx) => (
              <span key={idx}>
                {idx > 0 && <span className="mr-2 text-zinc-400">•</span>}
                {item}
              </span>
            ))}
        </div>
      </div>

      {/* Skills */}
      {data.skills?.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase mb-2">
            Skills & Competencies
          </h2>
          <div className="flex flex-wrap gap-1">
            {data.skills.map((s: string, i: number) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-zinc-100 border border-zinc-200 text-zinc-800 rounded text-[11px] font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase mb-2">
            Professional Experience
          </h2>
          {data.experience.map((exp: any) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline font-semibold text-zinc-900">
                <span>
                  {exp.role} <span className="text-zinc-500 font-normal">@ {exp.company}</span>
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">{exp.dates}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-zinc-700 mt-1">
                {exp.bullets.map((b: string, i: number) => (
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
          <h2 className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase mb-2">
            Technical Projects
          </h2>
          {data.projects.map((proj: any) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-baseline font-semibold text-zinc-900">
                <span>{proj.name}</span>
                {proj.link && <span className="text-[11px] text-blue-600 font-mono">{proj.link}</span>}
              </div>
              {proj.tech_stack?.length > 0 && (
                <p className="text-[11px] text-zinc-500 font-mono mb-1">
                  Stack: {proj.tech_stack.join(" • ")}
                </p>
              )}
              <ul className="list-disc list-inside space-y-1 text-zinc-700">
                {proj.bullets.map((b: string, i: number) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {data.achievements?.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase mb-2">
            Achievements & Recognition
          </h2>
          <div className="space-y-1 text-zinc-800">
            {data.achievements.map((ach: any) => (
              <div key={ach.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold">{ach.title}</span> — {ach.details.join(", ")}
                </div>
                <span className="text-[10px] uppercase font-bold text-zinc-400">{ach.category}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase mb-2">
            Education
          </h2>
          {data.education.map((edu: any, idx: number) => (
            <div key={idx} className="flex justify-between text-zinc-800">
              <span>
                <strong className="text-zinc-900">{edu.degree}</strong>, {edu.institution}
              </span>
              <span className="text-[11px] font-mono text-zinc-500">{edu.dates}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}