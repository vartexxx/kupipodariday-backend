import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../utils/base.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column()
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User)
  owner: User;
}
