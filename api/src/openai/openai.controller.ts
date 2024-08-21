import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OpenaiService } from './openai.service';

@ApiTags('openai')
@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  //   @Post('generate-audio')
  //   @ApiOperation({ summary: 'Generate audio' })
  //   @ApiResponse({ status: 201, description: 'Audio generated successfully.' })
  //   async generateAudio(
  //     @Body() { input, voice }: { input: string; voice: string },
  //   ): Promise<Buffer> {
  //     return this.openaiService.generateAudio(input, voice);
  //   }

  @Post('generate-thumbnail')
  @ApiOperation({ summary: 'Generate thumbnail' })
  @ApiResponse({
    status: 201,
    description: 'Thumbnail generated successfully.',
  })
  async generateThumbnail(
    @Body() { prompt }: { prompt: string },
  ): Promise<Buffer> {
    return this.openaiService.generateThumbnail(prompt);
  }

  @Post('generate-npc-details')
  @ApiOperation({ summary: 'Generate NPC details' })
  @ApiResponse({
    status: 201,
    description: 'NPC details generated successfully.',
  })
  async generateNPCDetails(@Body() { input }: { input: string }): Promise<any> {
    return this.openaiService.generateNPCDetails(input);
  }
}
