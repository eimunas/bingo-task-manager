import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.findByEmail(dto.email);
    if (user) {
      throw new ConflictException('Account already exists');
    }

    return await this.usersRepository.save(
      this.usersRepository.create({
        username: dto.username,
        email: dto.email,
        password: dto.password,
      }),
    );
  }

  private async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }
}
