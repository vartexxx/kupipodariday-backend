import { IsNotEmpty, IsNumber, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty({ message: 'Название не может быть пустым.' })
  @IsString()
  @Length(1, 250, { message: 'Диапазон длины имени от 1 до 250 символов.' })
  name: string;

  @IsNotEmpty({ message: 'Ссылка на подарок обязательна.' })
  @IsUrl()
  link: string;

  @IsNotEmpty({ message: 'Ссылка на изображение обязательна.' })
  @IsUrl()
  image: string;

  @IsNotEmpty({ message: 'Цена подарка должна быть указана.' })
  @IsNumber()
  price: number;

  @IsNotEmpty({ message: 'Описание подарка обязательно.' })
  @IsString()
  description: string;
}
