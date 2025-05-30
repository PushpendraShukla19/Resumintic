
'use server';
/**
 * @fileOverview An AI agent that calculates an ATS score for a resume.
 *
 * - calculateAtsScore - A function that provides an ATS score and justification.
 * - CalculateAtsScoreInput - The input type for the calculateAtsScore function.
 * - CalculateAtsScoreOutput - The return type for the calculateAtsScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { ResumeData } from '@/types/resume';


const CalculateAtsScoreInputSchema = z.object({
  name: z.string().describe('The name of the resume owner.'),
  summary: z.string().describe('A brief summary of the resume owner.'),
  skills: z.array(z.string()).describe('A list of skills of the resume owner.'),
  workExperience: z.array(
    z.object({
      title: z.string().describe('The job title.'),
      company: z.string().describe('The company name.'),
      startDate: z.string().describe('The start date of the job.'),
      endDate: z.string().optional().describe('The end date of the job, or null if current job.'),
      description: z.string().describe('The job description.'),
    })
  ).describe('A list of work experiences of the resume owner.'),
   education: z.array(
    z.object({
      institution: z.string().describe('The institution name.'),
      degree: z.string().describe('The degree name.'),
      startDate: z.string().describe('The start date of the education.'),
      endDate: z.string().describe('The end date of the education.'),
    })
  ).describe('A list of educations of the resume owner.'),
});

export type CalculateAtsScoreInput = z.infer<typeof CalculateAtsScoreInputSchema>;

const CalculateAtsScoreOutputSchema = z.object({
  atsScore: z
    .number()
    .min(0)
    .max(100)
    .describe('The ATS compatibility score, ranging from 0 to 100.'),
  justification: z
    .string()
    .describe(
      'A brief justification for the score, highlighting 1-2 key strengths and 1-2 areas for improvement from an ATS perspective.'
    ),
});
export type CalculateAtsScoreOutput = z.infer<typeof CalculateAtsScoreOutputSchema>;

export async function calculateAtsScore(
  input: CalculateAtsScoreInput
): Promise<CalculateAtsScoreOutput> {
  return calculateAtsScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateAtsScorePrompt',
  input: {schema: CalculateAtsScoreInputSchema},
  output: {schema: CalculateAtsScoreOutputSchema},
  prompt: `You are an advanced Applicant Tracking System (ATS) simulator. Analyze the following resume information and provide an ATS compatibility score out of 100.
Also, provide a brief justification for the score, highlighting 1-2 key strengths and 1-2 areas for improvement from an ATS perspective.

Focus on:
- Clarity and conciseness of information.
- Presence of action verbs and quantifiable achievements.
- Overall structure and readability for automated systems.
- Relevance of skills and experience for general employability (assume no specific job target unless explicitly provided in future versions).

Resume Information:
Name: {{{name}}}
Summary: {{{summary}}}
Skills:
{{#each skills}}
- {{{this}}}
{{/each}}

Work Experience:
{{#each workExperience}}
  Job Title: {{title}}
  Company: {{company}}
  Description: {{{description}}}
{{/each}}

Education:
{{#each education}}
  Degree: {{degree}}
  Institution: {{institution}}
{{/each}}

Return the score as a number (atsScore) and the justification as a string.
For the score, ensure it is an integer between 0 and 100.
For the justification, make it concise, actionable, and directly related to ATS best practices.
Example justification: "Good use of keywords and clear structure. Consider quantifying achievements in work experience more."
`,
});

const calculateAtsScoreFlow = ai.defineFlow(
  {
    name: 'calculateAtsScoreFlow',
    inputSchema: CalculateAtsScoreInputSchema,
    outputSchema: CalculateAtsScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (output) {
        // Ensure score is an integer
        output.atsScore = Math.round(output.atsScore);
    }
    return output!;
  }
);
