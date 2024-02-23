import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(@Body() creteWishDto: CreateWishDto, @Req() req) {
    return this.wishesService.create(creteWishDto, req?.user);
  }

  @Get('last')
  async getLast(): Promise<Wish[]> {
    return await this.wishesService.findByOrder({ createdAt: 'DESC' }, 40);
  }

  @Get('top')
  async getTop(): Promise<Wish[]> {
    return await this.wishesService.findByOrder({ copied: 'DESC' }, 20);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getById(@Param('id') id: number): Promise<Wish> {
    return await this.wishesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async updateById(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
  ) {
    return await this.wishesService.update(id, updateWishDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteById(@Param('id') id: number, @Req() req) {
    return await this.wishesService.delete(id, req.user.id);
  }

  @Post(':id/copy')
  @UseGuards(JwtGuard)
  async copyById(@Param('id') id: number, @Req() req) {
    return await this.wishesService.copy(id, req.user.id);
  }
}
