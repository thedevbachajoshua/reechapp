'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating personalized encouragements
 *  based on user input and selecting relevant scriptures.
 *
 * - generatePersonalizedEncouragement - The main function to generate personalized encouragements.
 * - GeneratePersonalizedEncouragementInput - The input type for the generatePersonalizedEncouragement function.
 * - GeneratePersonalizedEncouragementOutput - The output type for the generatePersonalizedEncouragement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedEncouragementInputSchema = z.object({
  userProfile: z
    .string()
    .describe('The user profile including their current spiritual needs and context.'),
  conversationHistory: z
    .string()
    .describe('The recent conversation history to understand the context.'),
});
export type GeneratePersonalizedEncouragementInput = z.infer<typeof GeneratePersonalizedEncouragementInputSchema>;

const GeneratePersonalizedEncouragementOutputSchema = z.object({
  encouragement: z.string().describe('A personalized encouragement message.'),
  scriptureReference: z.string().describe('The relevant scripture reference.'),
});
export type GeneratePersonalizedEncouragementOutput = z.infer<typeof GeneratePersonalizedEncouragementOutputSchema>;

export async function generatePersonalizedEncouragement(
  input: GeneratePersonalizedEncouragementInput
): Promise<GeneratePersonalizedEncouragementOutput> {
  return generatePersonalizedEncouragementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedEncouragementPrompt',
  input: {schema: GeneratePersonalizedEncouragementInputSchema},
  output: {schema: GeneratePersonalizedEncouragementOutputSchema},
  prompt: `You are a spiritual guide providing personalized encouragements by selecting relevant scriptures.

  Based on the user profile and conversation history, provide a personalized encouragement message and a relevant scripture reference.

  User Profile: {{{userProfile}}}
  Conversation History: {{{conversationHistory}}}

  Ensure the encouragement is timely, relevant, and supportive.
  Return the encouragement and the scripture reference.
  `,
});

const generatePersonalizedEncouragementFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedEncouragementFlow',
    inputSchema: GeneratePersonalizedEncouragementInputSchema,
    outputSchema: GeneratePersonalizedEncouragementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
