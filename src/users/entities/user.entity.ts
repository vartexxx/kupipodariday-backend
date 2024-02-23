import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import { Offer } from '../../offers/entities/offer.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  @Length(2, 30)
  @IsString()
  @IsNotEmpty()
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе.' })
  @Length(1, 200)
  @IsString()
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Wish, (wish) => wish.owner, { onDelete: 'CASCADE' })
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user, { onDelete: 'CASCADE' })
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner, {
    onDelete: 'CASCADE',
  })
  wishlists: Wishlist[];
}
