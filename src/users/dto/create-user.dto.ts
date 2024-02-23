import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Имя пользователя не может быть пустым.' })
  @IsString()
  @Length(1, 64, { message: 'Минимум 1 символ, максимум 64.' })
  username: string;

  @IsOptional()
  @IsString()
  @Length(0, 200, { message: 'Минимум 0 символов, максимум 200.' })
  about: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsNotEmpty({ message: 'Емайл не может быть пустым.' })
  @IsUrl()
  email: string;

  @IsNotEmpty({ message: 'Пароль не может быть пустым.' })
  @IsString()
  @MinLength(2, { message: 'Длина пароля - минимум 2 символа.' })
  password: string;
}
