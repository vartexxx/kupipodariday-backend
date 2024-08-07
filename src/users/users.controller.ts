import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { WishesService } from '../wishes/wishes.service';

export type TUser = Omit<User, 'password'>;

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Get('me')
  async getMe(@Req() req): Promise<TUser> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: string, ...userWithoutPassword } =
      await this.usersService.findOne('id', req.user.id);
    return userWithoutPassword;
  }

  @Patch('me')
  async update(@Req() req, @Body() body): Promise<TUser> {
    return this.usersService.update(req.user, body);
  }

  @Get('me/wishes')
  async getMeWishes(@Req() req): Promise<Wish[]> {
    const users: User[] = await this.usersService.findWishes(req.user.id);
    const wishes: Wish[][] = users.map((user: User) => user.wishes);
    return wishes[0];
  }

  @Get(':username')
  async getUser(@Param('username') username): Promise<TUser> {
    return this.usersService.findOne('username', username);
  }

  @Get(':username/wishes')
  async getUsersWishes(@Param('username') username): Promise<Wish[]> {
    return this.wishesService.findMany('owner', { username });
  }

  @Post('find')
  async findUsers(@Body('query') query: string): Promise<TUser[]> {
    return this.usersService.findMany(query);
  }
}
