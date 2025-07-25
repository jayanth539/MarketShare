'use server';

/**
 * @fileOverview AI-powered listing detail generator.
 *
 * - generateListingDetails - A function that handles the generation of listing details.
 * - GenerateListingDetailsInput - The input type for the generateListingDetails function.
 * - GenerateListingDetailsOutput - The return type for the generateListingDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateListingDetailsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  category: z.string().describe('The category of the product being listed.'),
});
export type GenerateListingDetailsInput = z.infer<typeof GenerateListingDetailsInputSchema>;

const GenerateListingDetailsOutputSchema = z.object({
  title: z.string().describe('A suggested title for the listing.'),
  description: z.string().describe('A suggested description for the listing.'),
});
export type GenerateListingDetailsOutput = z.infer<typeof GenerateListingDetailsOutputSchema>;

export async function generateListingDetails(input: GenerateListingDetailsInput): Promise<GenerateListingDetailsOutput> {
  return generateListingDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateListingDetailsPrompt',
  input: {schema: GenerateListingDetailsInputSchema},
  output: {schema: GenerateListingDetailsOutputSchema},
  prompt: `You are an expert in creating compelling product listings. Based on the provided image and category, generate an engaging title and description for the listing.

Category: {{{category}}}
Photo: {{media url=photoDataUri}}

Title:  Respond with an appropriate title.  Be concise and attractive.
Description: Respond with a detailed description of the product. Highlight its key features and benefits.
`,
});

const generateListingDetailsFlow = ai.defineFlow(
  {
    name: 'generateListingDetailsFlow',
    inputSchema: GenerateListingDetailsInputSchema,
    outputSchema: GenerateListingDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
