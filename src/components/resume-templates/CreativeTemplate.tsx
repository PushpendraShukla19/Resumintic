
import type { ResumeData } from '@/types/resume';
import { Zap, Feather, Aperture, Award, Code } from 'lucide-react';

interface TemplateProps {
  resumeData: ResumeData | null;
}

export default function CreativeTemplate({ resumeData }: TemplateProps) {
  if (!resumeData) return <div className="p-8 text-center text-muted-foreground">No resume data to display.</div>;

  const { name, contactInfo, summary, workExperience, education, skills, projects } = resumeData;

  return (
    <div className="p-10 bg-gradient-to-br from-background to-accent/10 text-foreground font-sans shadow-xl min-h-[calc(100vh-200px)]">
      <header className="relative mb-12 text-center">
        <div className="inline-block p-1 bg-accent rounded-full shadow-lg">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-4xl font-bold text-primary-foreground">
            {name.substring(0, 1)}{name.split(' ').length > 1 ? name.split(' ')[1].substring(0,1): ''}
          </div>
        </div>
        <h1 className="text-5xl font-extrabold text-primary mt-4 mb-2 font-headline tracking-tight">{name}</h1>
        <p className="text-sm text-accent-foreground/80">
          {contactInfo.email} &bull; {contactInfo.phone} {contactInfo.linkedin && `&bull; ${contactInfo.linkedin}`}
        </p>
      </header>

      <section className="mb-10 p-6 bg-card/80 rounded-lg shadow-md backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-accent mb-3 flex items-center font-headline">
          <Feather className="w-6 h-6 mr-3" /> About Me
        </h2>
        <p className="text-sm text-foreground/90">{summary}</p>
      </section>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-accent mb-4 flex items-center font-headline">
              <Zap className="w-6 h-6 mr-3" /> Experience
            </h2>
            {workExperience.map((exp, index) => (
              <div key={index} className="mb-6 p-4 bg-card/50 rounded-md shadow-sm hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-primary">{exp.title}</h3>
                <p className="text-md font-medium text-accent-foreground/90">{exp.company}</p>
                <p className="text-xs text-muted-foreground mb-1">{exp.startDate} - {exp.endDate || 'Present'}</p>
                <p className="text-sm text-foreground/80 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </section>

          {projects && projects.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-accent mb-4 flex items-center font-headline">
                <Code className="w-6 h-6 mr-3" /> Projects
              </h2>
              {projects.map((proj, index) => (
                <div key={index} className="mb-6 p-4 bg-card/50 rounded-md shadow-sm hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-primary">{proj.name}</h3>
                  <p className="text-sm text-foreground/80 whitespace-pre-line">{proj.description}</p>
                </div>
              ))}
            </section>
          )}
        </div>

        <div>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-accent mb-4 flex items-center font-headline">
              <Award className="w-6 h-6 mr-3" /> Education
            </h2>
            {education.map((edu, index) => (
              <div key={index} className="mb-4 p-4 bg-card/50 rounded-md shadow-sm">
                <h3 className="text-xl font-semibold text-primary">{edu.degree}</h3>
                <p className="text-md font-medium text-accent-foreground/90">{edu.institution}</p>
                <p className="text-xs text-muted-foreground">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-4 flex items-center font-headline">
              <Aperture className="w-6 h-6 mr-3" /> Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <span key={index} className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded-full shadow-sm">{skill}</span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
