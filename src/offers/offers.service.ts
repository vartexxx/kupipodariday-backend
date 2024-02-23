import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { WishesService } from '../wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async findAll() {
    return await this.offerRepository.find();
  }

  async findOne(id: number) {
    return await this.offerRepository.findOne({
      where: { id },
    });
  }

  async create(createOfferDto: CreateOfferDto, user: User) {
    const wishes = await this.wishesService.findOne(createOfferDto.itemId);
    const wish = await this.wishesService.findOne(wishes.id);
    if (wish.owner.id === user.id) {
      throw new ForbiddenException(
        'Пользователю нельзя вносить деньги на собственные подарки.',
      );
    }
    if (createOfferDto.amount > wish.price) {
      throw new ForbiddenException(
        'Сумма собранных средств не может превышать стоимость подарка',
      );
    }
    await this.wishesService.updateByRise(
      createOfferDto.itemId,
      Number(wish.raised) + Number(createOfferDto.amount),
    );
    const offerDto = { ...createOfferDto, user: user, item: wish };
    return await this.offerRepository.save(offerDto);
  }
}
