import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
// import { SpeechCreateParams } from 'openai/resources/audio/speech.mjs';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  //   async generateAudio(input: string, voice: string): Promise<Buffer> {
  //     const mp3 = await this.openai.audio.speech.create({
  //       model: 'tts-1',
  //       voice: voice as SpeechCreateParams['voice'],
  //       input,
  //     });

  //     return Buffer.from(await mp3.arrayBuffer());
  //   }

  async generateThumbnail(prompt: string): Promise<Buffer> {
    const response = await this.openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    });

    const url = response.data[0].url;
    if (!url) {
      throw new Error('Error generating thumbnail');
    }

    const imageResponse = await fetch(url);
    return Buffer.from(await imageResponse.arrayBuffer());
  }

  async generateNPCDetails(input: string): Promise<any> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `
            You are a helpful D&D Dungeon Master assistant.
            The JSON object should have the following structure:

            {
              "npcName": "string",
              "npcDescription": "string", (Replace with 4 paragraphs or more.)
              "challenge": "number",
              "armorClass": "number",
              "hitPoints": "number",
              "speed": "number",
              "proficiencyBonus": "number",
              "str": "number",
              "dex": "number",
              "con": "number",
              "int": "number",
              "wis": "number",
              "cha": "number",
              "skills": [
                { "name": "string", "description": "number" }
              ],
              "senses": [
                { "name": "string", "description": "string" }
              ],
              "languages": [
                { "name": "string" }
              ],
              "specialTraits": [
                { "name": "string", "description": "string" }
              ],
              "actions": [
                { "name": "string", "description": "string" }
              ]
            }
          `,
        },
        { role: 'user', content: input },
      ],
    });

    const content = response.choices[0].message.content;
    if (content) {
      try {
        const npcDetails = JSON.parse(content);
        if (!npcDetails.npcDescription) {
          throw new Error(
            'npcDescription field is missing from the generated JSON',
          );
        }
        return npcDetails;
      } catch (error) {
        throw new Error('Failed to parse NPC details: Invalid JSON format');
      }
    } else {
      throw new Error(
        'Failed to generate NPC details: Response content is null',
      );
    }
  }
}
