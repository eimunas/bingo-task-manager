import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '@/common/interceptors/serialize.interceptor';

@ApiTags('Users')
@Serialize(UserDto)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBody({ type: [CreateUserDto] })
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({ type: UserDto })
  @ApiConflictResponse({ description: 'Email already exists' })
  @Post()
  async create(@Body() body: CreateUserDto): Promise<User> {
    return await this.usersService.create(body);
  }
}
