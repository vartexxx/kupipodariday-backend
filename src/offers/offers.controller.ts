import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  async getAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<Offer> {
    return await this.offersService.findOne(id);
  }

  @Post()
  async create(@Body() createOfferDto: CreateOfferDto, @Req() req) {
    return this.offersService.create(createOfferDto, req.user);
  }
}
