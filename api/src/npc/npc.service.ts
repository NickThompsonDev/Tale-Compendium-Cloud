import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { NPC } from './npc.entity';
import { CreateNpcDto } from './dto/create-npc.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class NpcService {
  private readonly logger = new Logger(NpcService.name);

  constructor(
    @InjectRepository(NPC)
    private npcRepository: Repository<NPC>,
    private userService: UserService,
  ) {}

  findAll(): Promise<NPC[]> {
    return this.npcRepository.find();
  }

  async getTrending(): Promise<NPC[]> {
    return this.npcRepository.find({
      order: {
        views: 'DESC',
      },
      take: 10,
    });
  }

  async findById(id: number): Promise<NPC> {
    console.log(`Fetching NPC with id: ${id}`); // Add this line for logging
    const npc = await this.npcRepository.findOne({ where: { id } });

    if (!npc) {
      console.error(`NPC not found with id: ${id}`);
      throw new Error('NPC not found');
    }

    console.log(`Found NPC: ${JSON.stringify(npc)}`);
    return npc;
  }

  async findByAuthorId(authorId: string): Promise<NPC[]> {
    return this.npcRepository.find({ where: { authorId } });
  }

  async searchNPCs(query: string): Promise<NPC[]> {
    if (!query) {
      // If the search query is empty, return all NPCs
      return this.findAll();
    }

    // Perform a case-insensitive "contains" search
    return this.npcRepository.find({
      where: [
        { npcName: ILike(`%${query}%`) },
        { npcDescription: ILike(`%${query}%`) },
      ],
    });
  }

  async create(createNpcDto: CreateNpcDto, clerkId: string): Promise<NPC> {
    // Fetch the user using the clerkId
    const user = await this.userService.findById(clerkId);

    // Create the NPC with the authorId set to clerkId
    const npc = this.npcRepository.create({
      ...createNpcDto,
      authorId: user.clerkId,
      author: user.name,
      authorImageUrl: user.imageUrl || '',
    });

    return this.npcRepository.save(npc);
  }

  async updateViews(id: number): Promise<NPC> {
    const npc = await this.findById(id);
    if (!npc) {
      throw new NotFoundException('NPC not found');
    }
    npc.views += 1;
    return this.npcRepository.save(npc);
  }

  async delete(id: number): Promise<void> {
    const npc = await this.findById(id);
    if (!npc) {
      throw new NotFoundException('NPC not found');
    }
    await this.npcRepository.remove(npc);
  }
}
