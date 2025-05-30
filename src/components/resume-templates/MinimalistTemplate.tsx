
import type { ResumeData } from '@/types/resume';
// No icons needed for this template to maintain minimalism

interface TemplateProps {
  resumeData: ResumeData | null;
}

export default function MinimalistTemplate({ resumeData }: TemplateProps) {
  if (!resumeData) return <div className="p-8 text-center text-muted-foreground">No resume data to display.</div>;

  const { name, contactInfo, summary, workExperience, education, skills, projects } = resumeData;

  return (
    <div className="p-10 bg-white text-gray-800 font-serif leading-normal shadow-lg min-h-[calc(100vh-180px)] md:min-h-[1056px] md:max-h-[1056px] md:aspect-[1/1.414] overflow-y-auto">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 font-headline tracking-tight">{name}</h1>
        <p className="text-sm text-gray-600">
          {contactInfo.email}
          {contactInfo.phone && ` · ${contactInfo.phone}`}
          {contactInfo.linkedin && ` · ${contactInfo.linkedin}`}
        </p>
      </header>

      <section className="mb-8">
        {/*<h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Summary</h2>*/}
        <p className="text-sm text-gray-700 text-justify">{summary}</p>
      </section>

      <hr className="my-6 border-gray-200" />

      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 font-headline">Experience</h2>
        {workExperience.map((exp, index) => (
          <div key={index} className="mb-5">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-gray-800">{exp.title}</h3>
              <p className="text-xs text-gray-500 text-right whitespace-nowrap">{exp.startDate} - {exp.endDate || 'Present'}</p>
            </div>
            <p className="text-sm font-normal text-gray-600 mb-1">{exp.company}</p>
            <p className="text-sm text-gray-700 whitespace-pre-line text-justify">{exp.description}</p>
          </div>
        ))}
      </section>
      
      {projects && projects.length > 0 && (
        <>
          <hr className="my-6 border-gray-200" />
          <section className="mb-8">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 font-headline">Projects</h2>
            {projects.map((proj, index) => (
              <div key={index} className="mb-5">
                <h3 className="text-lg font-medium text-gray-800">{proj.name}</h3>
                <p className="text-sm text-gray-700 whitespace-pre-line text-justify">{proj.description}</p>
              </div>
            ))}
          </section>
        </>
      )}

      <hr className="my-6 border-gray-200" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <section className="mb-8 md:mb-0">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 font-headline">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-3">
              <h3 className="text-md font-medium text-gray-800">{edu.degree}</h3>
              <p className="text-sm text-gray-600">{edu.institution}</p>
              <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 font-headline">Skills</h2>
          <p className="text-sm text-gray-700">
            {skills.join(' · ')}
          </p>
        </section>
      </div>
    </div>
  );
}
