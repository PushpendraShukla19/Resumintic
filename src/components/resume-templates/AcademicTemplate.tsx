
import type { ResumeData } from '@/types/resume';
import { BookOpen, Edit3, Mic, Users, Scroll, Star } from 'lucide-react'; // Using Scroll for Summary, Star for Skills

interface TemplateProps {
  resumeData: ResumeData | null;
}

export default function AcademicTemplate({ resumeData }: TemplateProps) {
  if (!resumeData) return <div className="p-8 text-center text-muted-foreground">No resume data to display.</div>;

  const { name, contactInfo, summary, workExperience, education, skills, projects } = resumeData;

  return (
    <div className="p-8 bg-gray-50 text-gray-800 font-serif leading-relaxed shadow-md">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1 font-headline">{name}</h1>
        <p className="text-sm text-gray-600">
          {contactInfo.email} | {contactInfo.phone}
          {contactInfo.linkedin && ` | ${contactInfo.linkedin}`}
        </p>
      </header>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-300 pb-1 mb-2 flex items-center font-headline">
          <Scroll className="w-4 h-4 mr-2" /> Summary
        </h2>
        <p className="text-sm">{summary}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-300 pb-1 mb-2 flex items-center font-headline">
          <BookOpen className="w-4 h-4 mr-2" /> Education
        </h2>
        {education.map((edu, index) => (
          <div key={index} className="mb-3">
            <h3 className="text-md font-semibold text-gray-800">{edu.degree}</h3>
            <p className="text-sm italic">{edu.institution}</p>
            <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-300 pb-1 mb-2 flex items-center font-headline">
          <Users className="w-4 h-4 mr-2" /> Professional Experience
        </h2>
        {workExperience.map((exp, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-md font-semibold text-gray-800">{exp.title}</h3>
            <p className="text-sm italic">{exp.company}</p>
            <p className="text-xs text-gray-500 mb-1">{exp.startDate} - {exp.endDate || 'Present'}</p>
            <p className="text-sm whitespace-pre-line">{exp.description}</p>
          </div>
        ))}
      </section>

      {projects && projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-300 pb-1 mb-2 flex items-center font-headline">
            <Edit3 className="w-4 h-4 mr-2" /> Research & Projects
          </h2>
          {projects.map((proj, index) => (
            <div key={index} className="mb-3">
              <h3 className="text-md font-semibold text-gray-800">{proj.name}</h3>
              <p className="text-sm whitespace-pre-line">{proj.description}</p>
            </div>
          ))}
        </section>
      )}
      
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-300 pb-1 mb-2 flex items-center font-headline">
         <Star className="w-4 h-4 mr-2" /> Skills
        </h2>
        <p className="text-sm">
          {skills.join(', ')}
        </p>
      </section>
      
      {/* Placeholder for other academic sections like Publications, Presentations, etc. */}
      {/* 
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-300 pb-1 mb-2 flex items-center">
          <Mic className="w-4 h-4 mr-2" /> Publications / Presentations
        </h2>
        <ul className="list-disc list-inside text-sm">
          <li>Placeholder Publication 1 (Year)</li>
          <li>Placeholder Presentation 2 (Year)</li>
        </ul>
      </section> 
      */}
    </div>
  );
}
