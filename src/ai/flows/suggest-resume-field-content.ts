
'use server';
/**
 * @fileOverview Provides AI-generated content suggestions for resume form fields.
 *
 * - suggestResumeFieldContent - A function to generate content for a specific resume field.
 * - SuggestResumeFieldContentInput - The input type for the suggestResumeFieldContent function.
 * - SuggestResumeFieldContentOutput - The return type for the suggestResumeFieldContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestResumeFieldContentInputSchema = z.object({
  targetJobRole: z.string().describe('The target job role or industry for which the resume is being tailored.'),
  fieldType: z.enum(['summary', 'skills', 'experienceDescription', 'projectDescription'])
    .describe('The type of resume field for which content is being suggested.'),
  existingName: z.string().optional().describe('The name of the resume owner (optional context).'),
  existingSummary: z.string().optional().describe('Existing summary text (optional context if not suggesting for summary).'),
  existingSkillsText: z.string().optional().describe('Existing skills as a comma-separated string (optional context if not suggesting for skills).'),
  contextData: z.any().optional().describe('Additional context specific to the field type (e.g., { jobTitle, companyName } for experience, { projectName } for project).'),
});
export type SuggestResumeFieldContentInput = z.infer<typeof SuggestResumeFieldContentInputSchema>;

const SuggestResumeFieldContentOutputSchema = z.object({
  suggestedContent: z.string().describe('The AI-generated content suggestion for the specified field.'),
});
export type SuggestResumeFieldContentOutput = z.infer<typeof SuggestResumeFieldContentOutputSchema>;

export async function suggestResumeFieldContent(
  input: SuggestResumeFieldContentInput
): Promise<SuggestResumeFieldContentOutput> {
  return suggestResumeFieldContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestResumeFieldContentPrompt',
  input: {schema: SuggestResumeFieldContentInputSchema},
  output: {schema: SuggestResumeFieldContentOutputSchema},
  prompt: `You are an expert resume writing assistant.
The user is filling out their resume and needs a suggestion for the '{{{fieldType}}}' section.
Their target job role is: {{{targetJobRole}}}.
{{#if existingName}}Their name is: {{{existingName}}}.{{/if}}
{{#if existingSummary}}Their current summary is: {{{existingSummary}}}.{{/if}}
{{#if existingSkillsText}}Their current skills are: {{{existingSkillsText}}}.{{/if}}

Based on the fieldType ('{{{fieldType}}}'):
- If 'fieldType' is 'summary', please provide a concise and impactful professional summary (2-3 sentences).
- If 'fieldType' is 'skills', please provide a comma-separated list of 5-7 relevant skills.
- If 'fieldType' is 'experienceDescription', {{#with contextData}}they are describing their experience as '{{jobTitle}}' at '{{companyName}}'. Please provide 2-3 bullet points for their job description, focusing on achievements and responsibilities.{{/with}}
- If 'fieldType' is 'projectDescription', {{#with contextData}}they are describing their project named '{{projectName}}'. Please provide a brief description (1-2 sentences) of this project.{{/with}}

Generate ONLY the suggested content for the specified '{{{fieldType}}}'. Ensure the output is a single string. For skills, it should be comma-separated.
`,
});

const suggestResumeFieldContentFlow = ai.defineFlow(
  {
    name: 'suggestResumeFieldContentFlow',
    inputSchema: SuggestResumeFieldContentInputSchema,
    outputSchema: SuggestResumeFieldContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
