
import type { ResumeData } from '@/types/resume';

interface TemplateProps {
  resumeData: ResumeData | null;
}

export default function TypographicTemplate({ resumeData }: TemplateProps) {
  if (!resumeData) return <div className="p-10 text-center text-muted-foreground">No resume data to display.</div>;

  const { name, contactInfo, summary, workExperience, education, skills, projects } = resumeData;
  const accentColor = "text-gray-700"; // Single accent color for headings/emphasis

  return (
    <div className="p-12 bg-white text-gray-900 font-serif leading-normal min-h-[calc(100vh-180px)] md:min-h-[1056px] md:max-h-[1056px] md:aspect-[1/1.414] overflow-y-auto shadow-lg">
      <header className="mb-10">
        <h1 className="text-5xl font-extrabold tracking-tighter mb-1 font-headline">{name}</h1>
        <p className="text-sm text-gray-600 tracking-wide">
          {contactInfo.email}
          {contactInfo.phone && `  ·  ${contactInfo.phone}`}
          {contactInfo.linkedin && `  ·  ${contactInfo.linkedin}`}
          {contactInfo.github && `  ·  ${contactInfo.github}`}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12">
        {/* Main Content Column */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className={`text-xs font-bold uppercase tracking-widest ${accentColor} mb-3 font-headline`}>Summary</h2>
            <p className="text-sm text-gray-700">{summary}</p>
          </section>

          <section>
            <h2 className={`text-xs font-bold uppercase tracking-widest ${accentColor} mb-4 font-headline`}>Experience</h2>
            {workExperience.map((exp, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xl font-semibold">{exp.title}</h3>
                  <p className="text-xs text-gray-500 whitespace-nowrap">{exp.startDate} — {exp.endDate || 'Present'}</p>
                </div>
                <p className={`text-md font-medium ${accentColor}`}>{exp.company}</p>
                <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </section>

          {projects && projects.length > 0 && (
            <section>
              <h2 className={`text-xs font-bold uppercase tracking-widest ${accentColor} mb-4 font-headline`}>Projects</h2>
              {projects.map((proj, index) => (
                <div key={index} className="mb-5">
                  <h3 className="text-xl font-semibold">{proj.name}</h3>
                  <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">{proj.description}</p>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="md:col-span-1 space-y-8 mt-8 md:mt-0">
          <section>
            <h2 className={`text-xs font-bold uppercase tracking-widest ${accentColor} mb-3 font-headline`}>Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-semibold">{edu.degree}</h3>
                <p className="text-sm text-gray-700">{edu.institution}</p>
                <p className="text-xs text-gray-500">{edu.startDate} — {edu.endDate}</p>
              </div>
            ))}
          </section>

          <section>
            <h2 className={`text-xs font-bold uppercase tracking-widest ${accentColor} mb-3 font-headline`}>Skills</h2>
            <p className="text-sm text-gray-700">
              {skills.join('  ·  ')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
