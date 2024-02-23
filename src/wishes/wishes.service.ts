import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { FindOptionsOrder, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}
  async create(createWishDto: CreateWishDto, owner: User): Promise<Wish> {
    return await this.wishesRepository.save({ ...createWishDto, owner });
  }
  async findByOrder(
    order: FindOptionsOrder<Wish>,
    limit: number,
  ): Promise<Wish[]> {
    return await this.wishesRepository.find({
      relations: { owner: true },
      order: order,
      take: limit,
    });
  }

  async findOne(id: number): Promise<Wish> {
    return await this.wishesRepository.findOne({
      relations: { owner: true, offers: { user: true } },
      where: { id },
    });
  }

  async findMany(key: string, param: any): Promise<Wish[]> {
    return await this.wishesRepository.findBy({
      [key]: param,
    });
  }

  async update(
    id: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ): Promise<Wish[]> {
    const wish = await this.wishesRepository.findOne({
      relations: { owner: true },
      where: { id },
    });
    if (updateWishDto.price && wish.raised > 0) {
      throw new BadRequestException(
        'Вы не можете изменять стоимость подарка, если уже есть желающие скинуться.',
      );
    }
    if (wish?.owner?.id !== userId) {
      throw new BadRequestException('Вы не можете изменять чужие подарки.');
    }
    try {
      await this.wishesRepository.update(id, updateWishDto);
      return await this.wishesRepository.findBy({ id });
    } catch (_) {
      throw new BadRequestException('Ошибка при выполнении запроса.');
    }
  }

  async delete(id: number, userId: number): Promise<Wish> {
    const wish: Wish = await this.wishesRepository.findOne({
      relations: { owner: true },
      where: { id },
    });
    if (wish.owner.id !== userId) {
      throw new BadRequestException('Невозможно для чужих подарков');
    }
    return await this.wishesRepository.remove(wish);
  }

  async copy(id: number, user: User): Promise<Wish> {
    const wish: Wish = await this.wishesRepository.findOneBy({ id });
    const isAdded = !!(await this.wishesRepository.findOne({
      where: { owner: { id: user.id }, name: wish.name },
    }));
    if (isAdded) throw new BadRequestException('Подарок уже скопирован');
    wish.owner = user;
    delete wish.id;
    return await this.wishesRepository.save(wish);
  }

  async updateByRise(id: number, newRise: number) {
    return await this.wishesRepository.update({ id: id }, { raised: newRise });
  }
}
