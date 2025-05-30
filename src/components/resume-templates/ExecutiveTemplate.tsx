
import type { ResumeData } from '@/types/resume';
import { User, Briefcase, GraduationCap, Award, Zap, Phone, Mail, Linkedin, Github } from 'lucide-react';

interface TemplateProps {
  resumeData: ResumeData | null;
}

export default function ExecutiveTemplate({ resumeData }: TemplateProps) {
  if (!resumeData) return <div className="p-10 text-center text-muted-foreground">No resume data to display.</div>;

  const { name, contactInfo, summary, workExperience, education, skills, projects } = resumeData;

  return (
    <div className="p-10 bg-white text-gray-800 font-sans antialiased shadow-lg">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight font-headline">{name}</h1>
        {/* <p className="text-lg text-gray-600 mt-1">Senior Executive | Strategic Leader</p> */}
        <div className="mt-4 flex justify-center items-center space-x-3 text-xs text-gray-500">
          {contactInfo.email && <span className="flex items-center"><Mail className="w-3 h-3 mr-1.5 text-gray-500" /> {contactInfo.email}</span>}
          {contactInfo.phone && <span className="flex items-center"><Phone className="w-3 h-3 mr-1.5 text-gray-500" /> {contactInfo.phone}</span>}
          {contactInfo.linkedin && <span className="flex items-center"><Linkedin className="w-3 h-3 mr-1.5 text-gray-500" /> {contactInfo.linkedin}</span>}
          {contactInfo.github && <span className="flex items-center"><Github className="w-3 h-3 mr-1.5 text-gray-500" /> {contactInfo.github}</span>}
        </div>
      </header>

      {/* Executive Summary */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-primary border-b-2 border-primary pb-1 mb-3 font-headline flex items-center">
          <User className="w-4 h-4 mr-2" /> Executive Summary
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
      </section>

      {/* Core Competencies / Skills */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-primary border-b-2 border-primary pb-1 mb-3 font-headline flex items-center">
          <Award className="w-4 h-4 mr-2" /> Core Competencies
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">{skill}</span>
          ))}
        </div>
      </section>

      {/* Professional Experience */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-primary border-b-2 border-primary pb-1 mb-3 font-headline flex items-center">
          <Briefcase className="w-4 h-4 mr-2" /> Professional Experience
        </h2>
        {workExperience.map((exp, index) => (
          <div key={index} className="mb-6 last:mb-0">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-800">{exp.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{exp.startDate} – {exp.endDate || 'Present'}</p>
            </div>
            <p className="text-md font-medium text-primary">{exp.company}</p>
            <ul className="mt-1 list-disc list-inside text-sm text-gray-700 leading-relaxed space-y-1">
              {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim().replace(/^- /, '')}</li>)}
            </ul>
          </div>
        ))}
      </section>

      {/* Education & Certifications */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-primary border-b-2 border-primary pb-1 mb-3 font-headline flex items-center">
          <GraduationCap className="w-4 h-4 mr-2" /> Education & Certifications
        </h2>
        {education.map((edu, index) => (
          <div key={index} className="mb-3 last:mb-0">
            <h3 className="text-md font-semibold text-gray-800">{edu.degree}</h3>
            <p className="text-sm text-primary">{edu.institution}</p>
            <p className="text-xs text-gray-500">{edu.startDate} – {edu.endDate}</p>
          </div>
        ))}
      </section>

      {/* Projects (Optional) */}
      {projects && projects.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary border-b-2 border-primary pb-1 mb-3 font-headline flex items-center">
            <Zap className="w-4 h-4 mr-2" /> Key Projects
          </h2>
          {projects.map((proj, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <h3 className="text-md font-semibold text-gray-800">{proj.name}</h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{proj.description}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
