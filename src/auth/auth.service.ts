import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { HashService } from '../hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private hashService: HashService,
  ) {}

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
    const existUser: User = await this.usersService.findOne(
      'username',
      username,
    );
    if (
      !existUser ||
      !this.hashService.compareHash(password, existUser.password)
    )
      return null;
    return existUser;
  }
}
