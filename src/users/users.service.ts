import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { HashService } from '../hash/hash.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TUser } from './users.controller';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async findUserByName(username: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    if ((await this.findUserByName(createUserDto.username)) !== null) {
      throw new ForbiddenException(
        'Пользователь с таким именем уже существует.',
      );
    }
    if (await this.findByEmail(createUserDto.email)) {
      throw new ForbiddenException(
        'Пользователь с таким email уже существует.',
      );
    }
    createUserDto.password = this.hashService.getHash(createUserDto?.password);
    return await this.usersRepository.save(
      this.usersRepository.create(createUserDto),
    );
  }
  async findOne(key: string, param: any): Promise<User> {
    return await this.usersRepository.findOneBy({ [key]: param });
  }

  async update(user: User, updateUserDto: UpdateUserDto): Promise<TUser> {
    const { id } = user;
    const { email, username } = updateUserDto;
    if (updateUserDto.password) {
      updateUserDto.password = this.hashService.getHash(updateUserDto.password);
    }
    const isExist = !!(await this.usersRepository.findOne({
      where: [{ email }, { username }],
    }));
    if (isExist) {
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }
    try {
      await this.usersRepository.update(id, updateUserDto);
      const { password: string, ...updUser } =
        await this.usersRepository.findOneBy({
          id,
        });
      return updUser;
    } catch (_) {
      throw new BadRequestException(
        'Пользователь может редактировать только свой профиль',
      );
    }
  }
  async findWishes(id: number): Promise<User[]> {
    return await this.usersRepository.find({
      relations: { wishes: true },
      where: { id },
    });
  }
  async findMany(query: string): Promise<User[]> {
    return await this.usersRepository.find({
      where: [{ email: Like(`%${query}%`) }, { username: Like(`%${query}%`) }],
    });
  }
}
