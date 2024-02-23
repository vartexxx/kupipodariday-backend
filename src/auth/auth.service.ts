import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { HashService } from '../hash/hash.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (
      (await this.usersService.findOne('username', createUserDto.username)) ||
      (await this.usersService.findOne('email', createUserDto.email))
    )
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    return this.usersService.create(createUserDto);
  }

  async login(user: User) {
    const { id, username, email } = user;
    return {
      id,
      username,
      email,
      access_token: this.jwtService.sign({
        id: user.id,
        username: user.username,
        email: user.email,
      }),
    };
  }
  async validateUser(username: string, password: string): Promise<User> {
    const existUser = await this.usersService.findOne('username', username);

    if (
      !existUser ||
      !this.hashService.compareHash(password, existUser.password)
    )
      return null;

    return existUser;
  }
}
