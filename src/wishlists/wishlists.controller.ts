import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getOne(@Param('id') id: number): Promise<Wishlist> {
    return this.wishlistsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req,
  ): Promise<Wishlist> {
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  @Patch()
  @UseGuards(JwtGuard)
  async update(
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req,
    @Param('id') id: number,
  ) {
    return this.wishlistsService.update(updateWishlistDto, req.user, id);
  }

  @Delete()
  @UseGuards(JwtGuard)
  async delete(@Param('id') id: number, @Req() req) {
    return this.wishlistsService.delete(id, req.user);
  }
}
