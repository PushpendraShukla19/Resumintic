
import { config } from 'dotenv';
config();

import '@/ai/flows/add-ats-keywords.ts';
import '@/ai/flows/suggest-improvements.ts';
import '@/ai/flows/extract-resume-data.ts';
import '@/ai/flows/calculate-ats-score.ts';
import '@/ai/flows/suggest-resume-field-content.ts';
