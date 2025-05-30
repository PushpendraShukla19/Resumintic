
import type { ExtractResumeDataOutput } from '@/ai/flows/extract-resume-data';
import type React from 'react';

export interface ResumeData extends ExtractResumeDataOutput {}

// Individual parts for forms or detailed display
export type ContactInfo = ExtractResumeDataOutput['contactInfo'];
export interface WorkExperience extends ExtractResumeDataOutput['workExperience'][0] {
  isCurrent?: boolean;
}
export type Education = ExtractResumeDataOutput['education'][0];
export type Project = ExtractResumeDataOutput['projects'][0];

export interface Template {
  id: string;
  name: string;
  previewImageUrl: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<{ resumeData: ResumeData | null }>;
  dataAiHint?: string;
}
