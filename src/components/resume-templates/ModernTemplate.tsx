
import type { ResumeData } from '@/types/resume';
import { Mail, Phone, Linkedin, Briefcase, GraduationCap, Lightbulb, User } from 'lucide-react';

interface TemplateProps {
  resumeData: ResumeData | null;
}

export default function ModernTemplate({ resumeData }: TemplateProps) {
  if (!resumeData) return <div className="p-8 text-center text-muted-foreground">No resume data to display.</div>;

  const { name, contactInfo, summary, workExperience, education, skills, projects } = resumeData;

  return (
    <div className="p-8 bg-white text-gray-800 font-sans leading-relaxed shadow-lg">
      <header className="text-center mb-8 border-b-2 border-primary pb-6">
        <h1 className="text-5xl font-bold text-primary mb-2 font-headline">{name}</h1>
        <div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
          {contactInfo.email && <span className="flex items-center"><Mail className="w-4 h-4 mr-1 text-primary" /> {contactInfo.email}</span>}
          {contactInfo.phone && <span className="flex items-center"><Phone className="w-4 h-4 mr-1 text-primary" /> {contactInfo.phone}</span>}
          {contactInfo.linkedin && <span className="flex items-center"><Linkedin className="w-4 h-4 mr-1 text-primary" /> {contactInfo.linkedin}</span>}
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-primary border-b border-gray-300 pb-2 mb-4 flex items-center font-headline">
          <User className="w-6 h-6 mr-2" /> Summary
        </h2>
        <p className="text-sm text-gray-700">{summary}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-primary border-b border-gray-300 pb-2 mb-4 flex items-center font-headline">
          <Briefcase className="w-6 h-6 mr-2" /> Work Experience
        </h2>
        {workExperience.map((exp, index) => (
          <div key={index} className="mb-6 last:mb-0">
            <h3 className="text-xl font-semibold text-gray-700">{exp.title}</h3>
            <p className="text-md text-primary font-medium">{exp.company}</p>
            <p className="text-xs text-gray-500 mb-1">{exp.startDate} - {exp.endDate || 'Present'}</p>
            <p className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</p>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-primary border-b border-gray-300 pb-2 mb-4 flex items-center font-headline">
          <GraduationCap className="w-6 h-6 mr-2" /> Education
        </h2>
        {education.map((edu, index) => (
          <div key={index} className="mb-4 last:mb-0">
            <h3 className="text-xl font-semibold text-gray-700">{edu.degree}</h3>
            <p className="text-md text-primary font-medium">{edu.institution}</p>
            <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-primary border-b border-gray-300 pb-2 mb-4 flex items-center font-headline">
          <Lightbulb className="w-6 h-6 mr-2" /> Skills
        </h2>
        <ul className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <li key={index} className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">{skill}</li>
          ))}
        </ul>
      </section>

      {projects && projects.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-primary border-b border-gray-300 pb-2 mb-4 flex items-center font-headline">
            <Lightbulb className="w-6 h-6 mr-2" /> Projects
          </h2>
          {projects.map((proj, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <h3 className="text-lg font-semibold text-gray-700">{proj.name}</h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">{proj.description}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
