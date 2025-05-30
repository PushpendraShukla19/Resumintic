
import type { ResumeData } from '@/types/resume';
import { Lightbulb, Zap, GraduationCap, Briefcase, User, Mail, Phone, Linkedin, Github } from 'lucide-react';

interface TemplateProps {
  resumeData: ResumeData | null;
}

export default function EntryLevelTemplate({ resumeData }: TemplateProps) {
  if (!resumeData) return <div className="p-8 text-center text-muted-foreground">No resume data to display.</div>;

  const { name, contactInfo, summary, workExperience, education, skills, projects } = resumeData;

  return (
    <div className="p-8 bg-slate-50 text-slate-800 font-sans leading-relaxed shadow-md">
      {/* Header: Name & Contact */}
      <header className="mb-6 pb-4 border-b border-slate-300">
        <h1 className="text-3xl font-bold text-primary mb-1 font-headline">{name}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
          {contactInfo.email && <span className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1 text-primary/80" /> {contactInfo.email}</span>}
          {contactInfo.phone && <span className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1 text-primary/80" /> {contactInfo.phone}</span>}
          {contactInfo.linkedin && <span className="flex items-center"><Linkedin className="w-3.5 h-3.5 mr-1 text-primary/80" /> {contactInfo.linkedin}</span>}
          {contactInfo.github && <span className="flex items-center"><Github className="w-3.5 h-3.5 mr-1 text-primary/80" /> {contactInfo.github}</span>}
        </div>
      </header>

      {/* Summary/Objective */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-primary mb-2 flex items-center font-headline">
          <User className="w-5 h-5 mr-2" /> Career Objective / Summary
        </h2>
        <p className="text-sm text-slate-700">{summary}</p>
      </section>

      {/* Skills Section - Prominent */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-primary mb-2 flex items-center font-headline">
          <Lightbulb className="w-5 h-5 mr-2" /> Key Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span key={index} className="bg-primary/20 text-primary-foreground text-xs px-3 py-1.5 rounded-md font-medium">{skill}</span>
          ))}
        </div>
      </section>

      {/* Projects Section - Prominent */}
      {projects && projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-primary mb-2 flex items-center font-headline">
            <Zap className="w-5 h-5 mr-2" /> Projects
          </h2>
          {projects.map((proj, index) => (
            <div key={index} className="mb-4 p-3 bg-white rounded-md shadow-sm">
              <h3 className="text-md font-semibold text-slate-800">{proj.name}</h3>
              <p className="text-sm text-slate-600 whitespace-pre-line">{proj.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Education Section */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-primary mb-2 flex items-center font-headline">
          <GraduationCap className="w-5 h-5 mr-2" /> Education
        </h2>
        {education.map((edu, index) => (
          <div key={index} className="mb-3">
            <h3 className="text-md font-semibold text-slate-800">{edu.degree}</h3>
            <p className="text-sm font-medium text-primary/90">{edu.institution}</p>
            <p className="text-xs text-slate-500">{edu.startDate} - {edu.endDate}</p>
          </div>
        ))}
      </section>
      
      {/* Work Experience Section (can be shorter for entry-level) */}
      {workExperience && workExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-primary mb-2 flex items-center font-headline">
            <Briefcase className="w-5 h-5 mr-2" /> Experience
          </h2>
          {workExperience.map((exp, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-md font-semibold text-slate-800">{exp.title}</h3>
              <p className="text-sm font-medium text-primary/90">{exp.company}</p>
              <p className="text-xs text-slate-500 mb-1">{exp.startDate} - {exp.endDate || 'Present'}</p>
              <p className="text-sm text-slate-600 whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
