'use server';

/**
 * @fileOverview An AI agent that adds ATS-friendly keywords to a resume.
 *
 * - addAtsKeywords - A function that enhances a resume with ATS keywords based on a job role.
 * - AddAtsKeywordsInput - The input type for the addAtsKeywords function.
 * - AddAtsKeywordsOutput - The return type for the addAtsKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AddAtsKeywordsInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume to be enhanced with keywords.'),
  jobRole: z
    .string()
    .describe(
      'The target job role or industry for which the resume should be optimized.'
    ),
});
export type AddAtsKeywordsInput = z.infer<typeof AddAtsKeywordsInputSchema>;

const AddAtsKeywordsOutputSchema = z.object({
  enhancedResume: z
    .string()
    .describe('The resume text enhanced with ATS-friendly keywords.'),
});
export type AddAtsKeywordsOutput = z.infer<typeof AddAtsKeywordsOutputSchema>;

export async function addAtsKeywords(
  input: AddAtsKeywordsInput
): Promise<AddAtsKeywordsOutput> {
  return addAtsKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'addAtsKeywordsPrompt',
  input: {schema: AddAtsKeywordsInputSchema},
  output: {schema: AddAtsKeywordsOutputSchema},
  prompt: `You are an expert resume writer specializing in Applicant Tracking System (ATS) optimization.

  A user will provide their resume text and a target job role. You must enhance the resume by adding relevant, ATS-friendly keywords to increase its chances of passing through applicant tracking systems.  Incorporate the keywords naturally within the existing text.

  Resume Text: {{{resumeText}}}
  Target Job Role: {{{jobRole}}}`,
});

const addAtsKeywordsFlow = ai.defineFlow(
  {
    name: 'addAtsKeywordsFlow',
    inputSchema: AddAtsKeywordsInputSchema,
    outputSchema: AddAtsKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
