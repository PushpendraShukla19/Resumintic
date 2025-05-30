
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertFileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as Data URI.'));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}

export function formatResumeDataToText(resumeData: import('@/types/resume').ResumeData | null): string {
  if (!resumeData) return "No resume data available.";

  let text = `Name: ${resumeData.name}\n`;
  text += `Email: ${resumeData.contactInfo.email}\n`;
  text += `Phone: ${resumeData.contactInfo.phone}\n`;
  if (resumeData.contactInfo.linkedin) {
    text += `LinkedIn: ${resumeData.contactInfo.linkedin}\n`;
  }
  if (resumeData.contactInfo.github) {
    text += `GitHub: ${resumeData.contactInfo.github}\n`;
  }
  text += `\nSummary:\n${resumeData.summary}\n`;

  text += `\nSkills:\n- ${resumeData.skills.join("\n- ")}\n`;

  text += "\nWork Experience:\n";
  resumeData.workExperience.forEach(exp => {
    text += `  Title: ${exp.title}\n`;
    text += `  Company: ${exp.company}\n`;
    text += `  Dates: ${exp.startDate} - ${exp.endDate || 'Present'}\n`;
    text += `  Description: ${exp.description}\n\n`;
  });

  text += "Education:\n";
  resumeData.education.forEach(edu => {
    text += `  Institution: ${edu.institution}\n`;
    text += `  Degree: ${edu.degree}\n`;
    text += `  Dates: ${edu.startDate} - ${edu.endDate}\n\n`;
  });
  
  if (resumeData.projects && resumeData.projects.length > 0) {
    text += "Projects:\n";
    resumeData.projects.forEach(proj => {
      text += `  Name: ${proj.name}\n`;
      text += `  Description: ${proj.description}\n\n`;
    });
  }

  return text;
}
