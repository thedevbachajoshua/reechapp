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

    // 2. Use a webhook to send the message via Zixflow.
    // This approach is more reliable than direct API calls.

    // HOW TO SET THIS UP:
    // a. In your Zixflow account, create a new webhook trigger.
    //    This will give you a unique URL.
    // b. Add this URL to your .env file:
    //    ZIXFLOW_WEBHOOK_URL=https://hooks.zixflow.com/your/unique/path
    // c. Uncomment the code below to send the generated message to your webhook.

    /*
    const webhookUrl = process.env.ZIXFLOW_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("Zixflow webhook URL not set in .env file. Skipping message sending.");
      return { message: personalizedMessage, status: 'Generated' };
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // This payload structure depends on how you set up your webhook in Zixflow.
          // You might need to send the phone number and message content.
          phone: input.contactPhoneNumber,
          text: personalizedMessage
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed with status ${response.status}`);
      }
      
      return { message: personalizedMessage, status: 'Sent' };

    } catch (error) {
      console.error("Failed to send message via Zixflow webhook:", error);
      return { message: personalizedMessage, status: `Failed: ${(error as Error).message}` };
    }
    */
    
    // For now, we will return the generated message without sending it.
    // Once you add the webhook URL and uncomment the code above, it will be sent.
    return { message: personalizedMessage, status: 'Generated' };
  }
);
