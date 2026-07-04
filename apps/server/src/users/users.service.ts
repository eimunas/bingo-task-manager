import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  private saltRounds: number = 10;
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<User> {
    return await this.usersRepository.findOneByOrFail({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ email });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.findByEmail(dto.email);
    if (user) {
      throw new ConflictException('Account already exists');
    }

    return await this.usersRepository.save(
      this.usersRepository.create({
        username: dto.username,
        email: dto.email,
        password: await this.hashPassword(dto.password),
      }),
    );
  }

  async hashPassword(password: string): Promise<string> {
    return hash(password, this.saltRounds);
  }
}
