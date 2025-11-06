'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating personalized follow-up messages for an MVP.
 *
 * - sendFollowUpMessage - The main function to generate a follow-up message.
 * - SendFollowUpMessageInput - The input type for the function.
 * - SendFollowUpMessageOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SendFollowUpMessageInputSchema = z.object({
  contactName: z.string().describe("The name of the new convert."),
  contactDetails: z.string().describe('Any known details or notes about the new convert.'),
  outreachTitle: z.string().describe('The title of the outreach event where they were met.'),
});
export type SendFollowUpMessageInput = z.infer<typeof SendFollowUpMessageInputSchema>;

const SendFollowUpMessageOutputSchema = z.object({
  message: z.string().describe('The personalized follow-up message to be sent.'),
  // The status is now simulated for the MVP
  status: z.string().describe('The status of the message generation process (e.g., "Generated", "Sent").'),
});
export type SendFollowUpMessageOutput = z.infer<typeof SendFollowUpMessageOutputSchema>;

export async function sendFollowUpMessage(
  input: SendFollowUpMessageInput
): Promise<SendFollowUpMessageOutput> {
  return sendFollowUpMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sendFollowUpMessagePrompt',
  input: {schema: SendFollowUpMessageInputSchema},
  output: {schema: z.object({ message: z.string() })},
  prompt: `You are an assistant for a church outreach team. Your task is to write a short, warm, and encouraging follow-up message for a new convert.

  The message should be personal and reference the event where you met them. Keep it concise, friendly, and under 160 characters, like an SMS message.

  **Context:**
  - New Convert's Name: {{{contactName}}}
  - Notes about them: {{{contactDetails}}}
  - Outreach Event: {{{outreachTitle}}}

  Generate a message that makes them feel welcomed and cared for. End with a gentle, open-ended question to encourage a response.
  `,
});

const sendFollowUpMessageFlow = ai.defineFlow(
  {
    name: 'sendFollowUpMessageFlow',
    inputSchema: SendFollowUpMessageInputSchema,
    outputSchema: SendFollowUpMessageOutputSchema,
  },
  async (input) => {
    // 1. Generate the personalized message using the AI prompt
    const {output} = await prompt(input);
    const personalizedMessage = output!.message;

    // 2. For the MVP, we simulate the "Sent" status without an actual API call.
    // This allows the UI to feel complete and demonstrates the core concept.
    console.log(`Generated message for ${input.contactName}: "${personalizedMessage}"`);

    return { message: personalizedMessage, status: 'Sent' };
  }
);
