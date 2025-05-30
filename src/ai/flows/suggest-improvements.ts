'use server';

/**
 * @fileOverview Suggests improvements to a resume using AI.
 *
 * - suggestImprovements - A function that suggests improvements to the resume.
 * - SuggestImprovementsInput - The input type for the suggestImprovements function.
 * - SuggestImprovementsOutput - The return type for the suggestImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestImprovementsInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume to be improved.'),
  jobDescription: z
    .string()
    .optional()
    .describe('Optional job description to tailor the resume improvements to.'),
});

export type SuggestImprovementsInput = z.infer<typeof SuggestImprovementsInputSchema>;

const SuggestImprovementsOutputSchema = z.object({
  improvedResumeText: z
    .string()
    .describe('The improved resume text with suggestions incorporated.'),
  suggestions: z.array(z.string()).describe('Specific suggestions made by the AI.'),
});

export type SuggestImprovementsOutput = z.infer<typeof SuggestImprovementsOutputSchema>;

export async function suggestImprovements(
  input: SuggestImprovementsInput
): Promise<SuggestImprovementsOutput> {
  return suggestImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestImprovementsPrompt',
  input: {schema: SuggestImprovementsInputSchema},
  output: {schema: SuggestImprovementsOutputSchema},
  prompt: `You are an expert resume writer. Review the provided resume and
suggest improvements to make it more compelling to potential employers.

Resume Text:
{{resumeText}}

{% if jobDescription %}
Here is the job description to tailor the resume improvements to:
{{jobDescription}}
{% endif %}

Provide the improved resume text and a list of specific suggestions you made.
`,
});

const suggestImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestImprovementsFlow',
    inputSchema: SuggestImprovementsInputSchema,
    outputSchema: SuggestImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
