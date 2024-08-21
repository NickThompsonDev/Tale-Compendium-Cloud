import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@ApiTags('users')
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly userService: UserService) {}

  @Post('user')
  @ApiOperation({ summary: 'Get or create user by Clerk user object' })
  @ApiResponse({ status: 200, description: 'Return user', type: User })
  async getUserByObject(@Body() user: User): Promise<User> {
    try {
      const existingUser = await this.userService.findById(user.clerkId);
      return existingUser;
    } catch (error) {
      if (error.message === 'User not found') {
        return this.userService.createUser(user);
      }
      throw error;
    }
  }

  @Get('top-users')
  @ApiOperation({ summary: 'Get top users' })
  @ApiResponse({ status: 200, description: 'Return top users', type: [User] })
  async getTopUsers(): Promise<User[]> {
    this.logger.log('Top users endpoint called');
    return this.userService.findTopUsers();
  }

  @Get(':clerkId')
  @ApiOperation({ summary: 'Get user by clerk ID' })
  @ApiResponse({ status: 200, description: 'Return user', type: User })
  async getUserById(@Param('clerkId') clerkId: string): Promise<User> {
    return this.userService.findById(clerkId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been created.',
    type: User,
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Patch()
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been updated.',
    type: User,
  })
  async updateUser(@Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.updateUser(updateUserDto);
  }

  @Delete(':clerkId')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'The user has been deleted.' })
  async deleteUser(@Param('clerkId') clerkId: string): Promise<void> {
    return this.userService.deleteUser(clerkId);
  }

  @Patch('add-tokens/:clerkId')
  @ApiOperation({ summary: 'Add tokens to a user' })
  @ApiResponse({
    status: 200,
    description: 'Tokens have been added.',
    type: User,
  })
  async addTokens(
    @Param('clerkId') clerkId: string,
    @Body('tokens') tokens: number,
  ): Promise<User> {
    return this.userService.addTokens(clerkId, tokens);
  }

  @Patch('consume-tokens/:clerkId')
  @ApiOperation({ summary: 'Consume tokens from a user' })
  @ApiResponse({
    status: 200,
    description: 'Tokens have been consumed.',
    type: User,
  })
  async consumeTokens(
    @Param('clerkId') clerkId: string,
    @Body('tokens') tokens: number,
  ): Promise<User> {
    return this.userService.consumeTokens(clerkId, tokens);
  }
}
