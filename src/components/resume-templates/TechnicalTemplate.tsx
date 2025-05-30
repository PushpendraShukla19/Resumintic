
import type { ResumeData } from '@/types/resume';
import { Terminal, Database, Users, Layers, Brain, FileJson } from 'lucide-react'; // Using FileJson for projects

interface TemplateProps {
  resumeData: ResumeData | null;
}

export default function TechnicalTemplate({ resumeData }: TemplateProps) {
  if (!resumeData) return <div className="p-8 text-center text-muted-foreground">No resume data to display.</div>;

  const { name, contactInfo, summary, workExperience, education, skills, projects } = resumeData;

  return (
    <div className="p-8 bg-gray-900 text-gray-200 font-mono shadow-lg">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-green-400 mb-1 font-headline">{name}</h1>
        <div className="flex items-center space-x-3 text-sm text-gray-400">
          <span>{contactInfo.email}</span>
          <span>// {contactInfo.phone}</span>
          {contactInfo.linkedin && <span>// <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{contactInfo.linkedin}</a></span>}
        </div>
      </header>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-green-400 mb-2 flex items-center font-headline">
          <Terminal className="w-5 h-5 mr-2" /> Profile
        </h2>
        <p className="text-sm text-gray-300 leading-relaxed">{summary}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-green-400 mb-3 flex items-center font-headline">
          <Layers className="w-5 h-5 mr-2" /> Professional Experience
        </h2>
        {workExperience.map((exp, index) => (
          <div key={index} className="mb-5 pl-4 border-l-2 border-green-500/50">
            <h3 className="text-lg font-medium text-sky-400">{exp.title} <span className="text-gray-500">@ {exp.company}</span></h3>
            <p className="text-xs text-gray-500 mb-1">{exp.startDate} - {exp.endDate || 'Current'}</p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim().replace(/^- /, '')}</li>)}
            </ul>
          </div>
        ))}
      </section>
      
      {projects && projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-green-400 mb-3 flex items-center font-headline">
            <FileJson className="w-5 h-5 mr-2" /> Key Projects
          </h2>
          {projects.map((proj, index) => (
            <div key={index} className="mb-4 pl-4 border-l-2 border-green-500/50">
              <h3 className="text-lg font-medium text-sky-400">{proj.name}</h3>
              <p className="text-sm text-gray-300 whitespace-pre-line">{proj.description}</p>
            </div>
          ))}
        </section>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <section>
          <h2 className="text-xl font-semibold text-green-400 mb-3 flex items-center font-headline">
            <Brain className="w-5 h-5 mr-2" /> Technical Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="bg-gray-700 text-green-300 text-xs px-2 py-1 rounded">{skill}</span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-400 mb-3 flex items-center font-headline">
            <Users className="w-5 h-5 mr-2" /> Education
          </h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-2">
              <h3 className="text-md font-medium text-sky-400">{edu.degree}</h3>
              <p className="text-sm text-gray-400">{edu.institution}</p>
              <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
