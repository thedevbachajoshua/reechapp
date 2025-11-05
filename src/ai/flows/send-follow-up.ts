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
  contactName: z.string().describe("The name of the new convert."),
  contactPhoneNumber: z.string().describe("The E.164 formatted phone number of the new convert."),
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

    // 2. Send the message via Zixflow API
    const apiKey = process.env.ZIXFLOW_API_KEY;
    console.log('ZIXFLOW_API_KEY loaded:', !!apiKey); // Log if the key is present

    if (!apiKey) {
      console.error("Zixflow API key not set in .env file. Skipping message sending.");
      return { message: personalizedMessage, status: 'Generated (No API Key)' };
    }

    try {
      const response = await fetch('https://api.zixflow.com/v1/campaigns/sms/send', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            // IMPORTANT: This payload structure is based on Zixflow's documentation.
            // It sends a single message.
            "messages": [
                {
                    "to": input.contactPhoneNumber,
                    "body": personalizedMessage
                }
            ]
        }),
      });

      if (!response.ok) {
        // If the response is not ok, we try to get more details.
        const errorBody = await response.text(); // Use .text() as it could be HTML or plain text
        console.error(`Zixflow API Error: Status ${response.status}`, errorBody);
        throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
      }
      
      const responseJson = await response.json();
      console.log('Zixflow API Success:', responseJson);
      return { message: personalizedMessage, status: 'Sent' };

    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("Failed to send message via Zixflow API:", errorMessage);
      return { message: personalizedMessage, status: `Failed: ${errorMessage}` };
    }
  }
);
