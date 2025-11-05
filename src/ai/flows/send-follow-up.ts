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

    // 2. Send the message via an external service like Bitrix24.
    // This section is commented out until you provide your Bitrix24 webhook URL in a .env file.
    /*
    const webhookUrl = process.env.BITRIX24_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn("Bitrix24 webhook URL not set in .env file. Skipping message sending.");
      return { message: personalizedMessage, status: 'Generated (Not Sent)' };
    }

    try {
      // Bitrix24 APIs expect data in a specific format.
      // This is a conceptual example. You may need to adjust the payload.
      // For example, to send a notification to a user, you might need their Bitrix24 user ID.
      // To send an SMS, you'd call the crm.activity.add method with the right parameters.
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Example payload for creating an SMS activity
          'fields[OWNER_TYPE_ID]': '3', // 3 = CONTACT
          'fields[OWNER_ID]': 123, // The Bitrix24 ID of the contact
          'fields[PROVIDER_ID]': 'SMS',
          'fields[PROVIDER_TYPE_ID]': 'SMS',
          'fields[SUBJECT]': 'Follow-up Message',
          'fields[COMPLETED]': 'N',
          'fields[DESCRIPTION]': personalizedMessage,
          'fields[COMMUNICATIONS]': [
            {
              'VALUE': input.contactPhoneNumber,
              'ENTITY_ID': 123, // The Bitrix24 ID of the contact
              'ENTITY_TYPE_ID': '3' // 3 = CONTACT
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`Bitrix24 API responded with status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Bitrix24 API response:', result);
      
      return { message: personalizedMessage, status: 'Sent' };

    } catch (error) {
      console.error("Failed to send message via Bitrix24:", error);
      return { message: personalizedMessage, status: 'Failed' };
    }
    */
   
    // For now, we'll just return the generated message without sending it.
    console.warn("Simulating message send. To enable sending, configure your service (e.g., Bitrix24) credentials in .env and uncomment the logic in send-follow-up.ts");
    return { message: personalizedMessage, status: 'Generated (Not Sent)' };
  }
);
