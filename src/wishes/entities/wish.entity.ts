import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { BaseEntity } from '../../utils/base.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  @Column()
  @IsUrl()
  @IsNotEmpty()
  link: string;

  @Column()
  @IsUrl()
  @IsNotEmpty()
  image: string;

  @Column()
  @MinLength(1)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Column({
    default: 0,
    scale: 2,
  })
  @IsNumber()
  raised: number;

  @Column({
    default: 0,
  })
  @IsNumber()
  copied: number;

  @Column()
  @Length(1, 1024)
  @IsString()
  description: string;

  @ManyToOne(() => User, (user: User) => user.wishes)
  @JoinColumn({ name: 'user_id' })
  owner: User;

  @OneToMany(() => Offer, (offer: Offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist: Wishlist) => wishlist.items)
  wishlists: Wishlist[];
}
