
'use server';

/**
 * @fileOverview A resume data extraction AI agent.
 *
 * - extractResumeData - A function that handles the resume data extraction process.
 * - ExtractResumeDataInput - The input type for the extractResumeData function.
 * - ExtractResumeDataOutput - The return type for the extractResumeData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractResumeDataInputSchema = z.object({
  resumePdfDataUri: z
    .string()
    .optional()
    .describe(
      "The PDF resume, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
  resumeText: z.string().optional().describe('The text content of the resume, extracted from a DOCX or other text-based file.'),
}).superRefine((data, ctx) => {
  if (!data.resumePdfDataUri && !data.resumeText) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Either resumePdfDataUri or resumeText must be provided.',
    });
  }
  if (data.resumePdfDataUri && data.resumeText) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Only one of resumePdfDataUri or resumeText should be provided.',
    });
  }
});
export type ExtractResumeDataInput = z.infer<typeof ExtractResumeDataInputSchema>;

const ExtractResumeDataOutputSchema = z.object({
  name: z.string().describe('The name of the resume owner.'),
  contactInfo: z.object({
    email: z.string().describe('The email address of the resume owner.'),
    phone: z.string().describe('The phone number of the resume owner.'),
    linkedin: z.string().optional().describe('The LinkedIn profile URL of the resume owner.'),
    github: z.string().optional().describe('The GitHub profile URL of the resume owner.'),
  }).describe('The contact information of the resume owner.'),
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
  projects: z.array(
    z.object({
      name: z.string().describe('The project name.'),
      description: z.string().describe('The project description.'),
    })
  ).describe('A list of projects of the resume owner.'),
});
export type ExtractResumeDataOutput = z.infer<typeof ExtractResumeDataOutputSchema>;

export async function extractResumeData(input: ExtractResumeDataInput): Promise<ExtractResumeDataOutput> {
  return extractResumeDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractResumeDataPrompt',
  input: {schema: ExtractResumeDataInputSchema},
  output: {schema: ExtractResumeDataOutputSchema},
  prompt: `You are an expert resume parser. Extract the key information from the resume and return it in JSON format.

Resume:
{{#if resumeText}}
{{{resumeText}}}
{{else}}
{{media url=resumePdfDataUri}}
{{/if}}
`,
});

const extractResumeDataFlow = ai.defineFlow(
  {
    name: 'extractResumeDataFlow',
    inputSchema: ExtractResumeDataInputSchema,
    outputSchema: ExtractResumeDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
