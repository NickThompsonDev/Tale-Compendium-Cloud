import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { NPC } from '../npc/npc.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(NPC)
    private readonly npcRepository: Repository<NPC>,
  ) {}

  async findById(clerkId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { clerkId } });
    if (!user) {
      this.logger.error(`FindById User not found: ${clerkId}`);
      throw new NotFoundException('User not found');
    }
    this.logger.log(`User found: ${clerkId}`);
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      ...createUserDto,
      tokens: 30, // Default token assignment
    });
    const savedUser = await this.userRepository.save(user);
    this.logger.log(`User created: ${savedUser.clerkId}`);
    return savedUser;
  }

  async findTopUsers(): Promise<any[]> {
    this.logger.log('Fetching all users from the database...');
    const users = await this.userRepository.find();

    if (!users || users.length === 0) {
      this.logger.warn('No users found in the database.');
      return [];
    }

    this.logger.log(`Found ${users.length} users. Processing NPCs...`);

    const userData = await Promise.all(
      users.map(async (user) => {
        this.logger.log(`Fetching NPCs for user: ${user.clerkId}`);

        const npcs = await this.npcRepository.find({
          where: { authorId: user.clerkId },
        });

        this.logger.log(`Found ${npcs.length} NPCs for user: ${user.clerkId}`);

        const sortedNPCs = npcs.sort((a, b) => b.views - a.views);

        return {
          ...user,
          totalNPCs: npcs.length,
          npcs: sortedNPCs.map((npc) => ({
            npcName: npc.npcName,
            npcId: npc.id,
          })),
        };
      }),
    );

    this.logger.log('Sorting users by total NPC count...');
    return userData.sort((a, b) => b.totalNPCs - a.totalNPCs);
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(updateUserDto.clerkId);
    user.email = updateUserDto.email;
    user.imageUrl = updateUserDto.imageUrl;
    this.logger.log(`Updating user: ${user.clerkId}`);
    return this.userRepository.save(user);
  }

  async deleteUser(clerkId: string): Promise<void> {
    const user = await this.findById(clerkId);
    await this.userRepository.remove(user);
    this.logger.log(`User deleted: ${clerkId}`);
  }

  async addTokens(clerkId: string, tokens: number): Promise<User> {
    const user = await this.findById(clerkId);
    user.tokens += tokens;
    this.logger.log(`Added ${tokens} tokens to user: ${clerkId}`);
    return this.userRepository.save(user);
  }

  async consumeTokens(clerkId: string, tokens: number): Promise<User> {
    const user = await this.findById(clerkId);
    if (user.tokens < tokens) {
      this.logger.warn(`Insufficient tokens for user: ${clerkId}`);
      throw new Error('Insufficient tokens');
    }
    user.tokens -= tokens;
    this.logger.log(`Consumed ${tokens} tokens for user: ${clerkId}`);
    return this.userRepository.save(user);
  }
}
