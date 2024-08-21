import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Logger,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NpcService } from './npc.service';
import { CreateNpcDto } from './dto/create-npc.dto';
import { NPC } from './npc.entity';

@ApiTags('npcs')
@Controller('npcs')
export class NpcController {
  private readonly logger = new Logger(NpcService.name);
  constructor(private readonly npcService: NpcService) {}

  @Get()
  @ApiOperation({ summary: 'Get all NPCs' })
  @ApiResponse({ status: 200, description: 'Return all NPCs', type: [NPC] })
  getAll(): Promise<NPC[]> {
    return this.npcService.findAll();
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending NPCs' })
  @ApiResponse({
    status: 200,
    description: 'Return trending NPCs',
    type: [NPC],
  })
  async getTrending(): Promise<NPC[]> {
    this.logger.log('Fetching trending NPCs...');
    const npcs = await this.npcService.getTrending();
    this.logger.log(`Found ${npcs.length} trending NPCs.`);
    return npcs;
  }

  @Get('author/:authorId')
  @ApiOperation({ summary: 'Get NPCs by author ID' })
  @ApiResponse({
    status: 200,
    description: 'Return NPCs by author ID',
    type: [NPC],
  })
  async getNPCsByAuthorId(@Param('authorId') authorId: string): Promise<NPC[]> {
    this.logger.log(`Fetching NPCs for author: ${authorId}`);
    const npcs = await this.npcService.findByAuthorId(authorId);
    this.logger.log(`Found ${npcs.length} NPCs for author: ${authorId}`);
    return npcs;
  }

  @Get('search')
  @ApiOperation({ summary: 'Search NPCs by name or description' })
  @ApiResponse({
    status: 200,
    description: 'Return NPCs by search query',
    type: [NPC],
  })
  async searchNPCs(@Query('search') search: string): Promise<NPC[]> {
    this.logger.log(`Searching NPCs with query: ${search}`);
    return this.npcService.searchNPCs(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get NPC by ID' })
  @ApiResponse({ status: 200, description: 'Return NPC', type: NPC })
  async getById(@Param('id') id: number): Promise<NPC> {
    try {
      return await this.npcService.findById(id);
    } catch (error) {
      console.error('Error in getById:', error.message);
      throw error;
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new NPC' })
  @ApiResponse({
    status: 201,
    description: 'The NPC has been created.',
    type: NPC,
  })
  create(
    @Body() createNpcDto: CreateNpcDto,
    @Body('clerkId') clerkId: string,
  ): Promise<NPC> {
    return this.npcService.create(createNpcDto, clerkId);
  }

  @Patch('update-views/:id')
  @ApiOperation({ summary: 'Update NPC views' })
  @ApiResponse({
    status: 200,
    description: 'NPC views have been updated.',
    type: NPC,
  })
  updateViews(@Param('id') id: number): Promise<NPC> {
    return this.npcService.updateViews(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete NPC' })
  @ApiResponse({ status: 200, description: 'NPC has been deleted.' })
  delete(@Param('id') id: number): Promise<void> {
    return this.npcService.delete(id);
  }
}
