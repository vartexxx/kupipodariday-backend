import { IsBoolean, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  amount: number;

  @IsBoolean()
  hidden: boolean;

  itemId: number;
}
