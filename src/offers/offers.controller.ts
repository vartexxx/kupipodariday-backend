import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getAll() {
    return this.offersService.findAll();
  }

  @Post()
  @UseGuards(JwtGuard)
  async create(@Body() createOfferDto: CreateOfferDto, @Req() req) {
    return this.offersService.create(createOfferDto, req.user);
  }
}
