
import type { ResumeData } from '@/types/resume';
import { User, Mail, Phone, Linkedin, MapPin, Briefcase, GraduationCap, Star, Zap, Palette } from 'lucide-react';

interface TemplateProps {
  resumeData: ResumeData | null;
}

export default function InfographicTemplate({ resumeData }: TemplateProps) {
  if (!resumeData) return <div className="p-8 text-center text-muted-foreground">No resume data to display.</div>;

  const { name, contactInfo, summary, workExperience, education, skills, projects } = resumeData;

  // Dummy skill level for visual representation
  const getSkillLevel = (index: number) => {
    const levels = [90, 85, 80, 75, 70];
    return levels[index % levels.length];
  };

  return (
    <div className="flex flex-col md:flex-row bg-white text-gray-700 font-sans shadow-lg min-h-[calc(100vh-180px)] md:min-h-[1056px] md:max-h-[1056px] md:aspect-[1/1.414]">
      {/* Left Column / Sidebar */}
      <aside className="w-full md:w-1/3 bg-primary/10 p-6 space-y-6 text-primary-foreground">
        <div className="text-center">
          <div className="w-32 h-32 rounded-full bg-primary mx-auto flex items-center justify-center text-5xl font-bold text-white mb-4 shadow-md">
             {name.substring(0, 1)}{name.split(' ').length > 1 ? name.split(' ')[name.split(' ').length -1].substring(0,1): ''}
          </div>
          <h1 className="text-3xl font-bold text-primary font-headline">{name}</h1>
          {/* <p className="text-md text-primary/90">Job Title Placeholder</p> */}
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-primary border-b-2 border-primary/50 pb-1 font-headline flex items-center"><User className="w-5 h-5 mr-2"/>Contact</h2>
          {contactInfo.email && <p className="text-xs flex items-center"><Mail className="w-4 h-4 mr-2 shrink-0"/> {contactInfo.email}</p>}
          {contactInfo.phone && <p className="text-xs flex items-center"><Phone className="w-4 h-4 mr-2 shrink-0"/> {contactInfo.phone}</p>}
          {contactInfo.linkedin && <p className="text-xs flex items-center"><Linkedin className="w-4 h-4 mr-2 shrink-0"/> <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{contactInfo.linkedin}</a></p>}
          {/* <p className="text-xs flex items-center"><MapPin className="w-4 h-4 mr-2 shrink-0"/> City, Country</p> */}
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-primary border-b-2 border-primary/50 pb-1 font-headline flex items-center"><Star className="w-5 h-5 mr-2"/>Skills</h2>
          {skills.map((skill, index) => (
            <div key={index} className="text-xs mb-2">
              <span>{skill}</span>
              <div className="w-full bg-primary/30 rounded-full h-2.5 mt-1 shadow-inner">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${getSkillLevel(index)}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-primary border-b-2 border-primary/50 pb-1 font-headline flex items-center"><GraduationCap className="w-5 h-5 mr-2"/>Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="text-xs mb-2">
              <h3 className="font-bold">{edu.degree}</h3>
              <p className="italic">{edu.institution}</p>
              <p>{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* Right Column / Main Content */}
      <main className="w-full md:w-2/3 p-8 space-y-8 overflow-y-auto">
        <section>
          <h2 className="text-2xl font-semibold text-primary border-b-2 border-primary/70 pb-2 mb-4 flex items-center font-headline">
            <User className="w-6 h-6 mr-3 text-primary" /> Summary
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary border-b-2 border-primary/70 pb-2 mb-4 flex items-center font-headline">
            <Briefcase className="w-6 h-6 mr-3 text-primary" /> Work Experience
          </h2>
          {workExperience.map((exp, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800">{exp.title}</h3>
              <p className="text-md text-primary font-medium">{exp.company}</p>
              <p className="text-xs text-gray-500 mb-1">{exp.startDate} - {exp.endDate || 'Present'}</p>
              <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </section>

        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-primary border-b-2 border-primary/70 pb-2 mb-4 flex items-center font-headline">
              <Zap className="w-6 h-6 mr-3 text-primary" /> Projects
            </h2>
            {projects.map((proj, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{proj.name}</h3>
                <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
