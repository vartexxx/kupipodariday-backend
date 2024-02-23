import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { IsBoolean } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { BaseEntity } from '../../utils/base.entity';

@Entity()
export class Offer extends BaseEntity {
  @Column()
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => User, (user: User) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish: Wish) => wish.offers)
  item: Wish;
}
