import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { DeleteResult, Repository } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { User } from '../users/entities/user.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async findAll(): Promise<Wishlist[]> {
    const wishlists: Wishlist[] = await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });
    if (!wishlists) {
      throw new BadRequestException('Список подарков не найден');
    }
    return wishlists;
  }

  async findOne(id: number): Promise<Wishlist> {
    return this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'item'],
    });
  }

  async create(
    createWishlistDto: CreateWishlistDto,
    owner: User,
  ): Promise<Wishlist> {
    const items: any[] = [];
    const { image, name, description } = createWishlistDto;
    for (const itemId of createWishlistDto.itemsId) {
      items.push(await this.wishesService.findOne(itemId));
    }
    return this.wishlistsRepository.save({
      name,
      image,
      description,
      owner,
      items,
    });
  }

  async update(
    updateWishlistDto: UpdateWishlistDto,
    owner: User,
    id: number,
  ): Promise<Wishlist> {
    const wishlist: Wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });
    if (owner.id !== wishlist?.owner?.id) {
      throw new ForbiddenException(
        'Редактировать можно только свои подборки подарков.',
      );
    }
    const items = [];
    await this.wishlistsRepository.save({
      id: wishlist.id,
      items: items ? items : wishlist.items,
      name: updateWishlistDto.name ? updateWishlistDto.name : wishlist?.name,
      image: updateWishlistDto.image
        ? updateWishlistDto.image
        : wishlist?.image,
      owner: wishlist.owner,
    });
    return await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });
  }

  async delete(id: number, owner: User): Promise<DeleteResult> {
    const wishList: Wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (wishList.owner.id !== owner.id) {
      throw new BadRequestException(
        'Удалять можно только свои подборки подарков.',
      );
    }
    return await this.wishlistsRepository.delete(wishList);
  }
}
