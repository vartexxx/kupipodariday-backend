import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

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

  @ManyToOne(() => User, (user) => user.wishes)
  @JoinColumn({ name: 'user_id' })
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[];
}
