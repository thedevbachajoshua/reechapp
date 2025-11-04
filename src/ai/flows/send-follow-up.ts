'use server';
/**
 * @fileOverview This file defines a Genkit flow for sending personalized follow-up messages.
 *
 * - sendFollowUpMessage - The main function to generate and "send" a follow-up.
 * - SendFollowUpMessageInput - The input type for the function.
 * - SendFollowUpMessageOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SendFollowUpMessageInputSchema = z.object({
  contactName: z.string().describe('The name of the new convert.'),
  contactDetails: z.string().describe('Any known details or notes about the new convert.'),
  outreachTitle: z.string().describe('The title of the outreach event where they were met.'),
});
export type SendFollowUpMessageInput = z.infer<typeof SendFollowUpMessageInputSchema>;

const SendFollowUpMessageOutputSchema = z.object({
  message: z.string().describe('The personalized follow-up message to be sent.'),
  status: z.string().describe('The status of the message sending process (e.g., "Generated", "Sent", "Failed").'),
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

  The message should be personal and reference the event where you met them. Keep it concise, like an SMS message.

  **Context:**
  - New Convert's Name: {{{contactName}}}
  - Notes about them: {{{contactDetails}}}
  - Outreach Event: {{{outreachTitle}}}

  Generate a message that makes them feel welcomed and cared for. End with a gentle, open-ended question.
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

    // 2. **Placeholder for sending the message**
    // In a real implementation, you would add your SMS/WhatsApp API call here.
    // For example:
    //
    // try {
    //   await twilio.messages.create({
    //     body: personalizedMessage,
    //     from: 'your_twilio_number',
    //     to: input.contactPhoneNumber // You would need to pass the phone number in the input
    //   });
    //   return { message: personalizedMessage, status: 'Sent' };
    // } catch (error) {
    //   console.error("Failed to send message:", error);
    //   return { message: personalizedMessage, status: 'Failed' };
    // }
    
    // For now, we will just return the generated message and a simulated status.
    return {
        message: personalizedMessage,
        status: 'Generated', // This would be 'Sent' in a real implementation
    };
  }
);
