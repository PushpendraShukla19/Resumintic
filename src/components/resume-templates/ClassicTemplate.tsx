
import type { ResumeData } from '@/types/resume';
import { User, Briefcase, GraduationCap, Star, Target } from 'lucide-react'; // Using Star for skills, Target for Projects

interface TemplateProps {
  resumeData: ResumeData | null;
}

export default function ClassicTemplate({ resumeData }: TemplateProps) {
  if (!resumeData) return <div className="p-8 text-center text-muted-foreground">No resume data to display.</div>;

  const { name, contactInfo, summary, workExperience, education, skills, projects } = resumeData;

  return (
    <div className="p-8 bg-white text-gray-700 font-serif leading-normal shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-1 font-headline">{name}</h1>
        <p className="text-sm text-gray-600">
          {contactInfo.email} | {contactInfo.phone} {contactInfo.linkedin && `| ${contactInfo.linkedin}`}
        </p>
      </div>

      <hr className="my-6 border-gray-300" />

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center font-headline uppercase tracking-wider">
          <User className="w-5 h-5 mr-2 text-gray-600" /> Summary
        </h2>
        <p className="text-sm">{summary}</p>
      </section>

      <hr className="my-6 border-gray-300" />

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center font-headline uppercase tracking-wider">
              <Briefcase className="w-5 h-5 mr-2 text-gray-600" /> Experience
            </h2>
            {workExperience.map((exp, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-medium text-gray-800">{exp.title}</h3>
                <p className="text-sm font-semibold text-gray-600">{exp.company}</p>
                <p className="text-xs text-gray-500 mb-1">{exp.startDate} - {exp.endDate || 'Present'}</p>
                <p className="text-sm whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </section>

          {projects && projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center font-headline uppercase tracking-wider">
                <Target className="w-5 h-5 mr-2 text-gray-600" /> Projects
              </h2>
              {projects.map((proj, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-lg font-medium text-gray-800">{proj.name}</h3>
                  <p className="text-sm whitespace-pre-line">{proj.description}</p>
                </div>
              ))}
            </section>
          )}
        </div>

        <div className="col-span-1">
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center font-headline uppercase tracking-wider">
              <GraduationCap className="w-5 h-5 mr-2 text-gray-600" /> Education
            </h2>
            {education.map((edu, index) => (
              <div key={index} className="mb-3">
                <h3 className="text-md font-medium text-gray-800">{edu.degree}</h3>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center font-headline uppercase tracking-wider">
              <Star className="w-5 h-5 mr-2 text-gray-600" /> Skills
            </h2>
            <ul className="list-disc list-inside text-sm">
              {skills.map((skill, index) => (
                <li key={index} className="mb-1">{skill}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
