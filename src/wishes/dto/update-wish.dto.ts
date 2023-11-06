import { IsString, Length, IsUrl, IsNumber, Min } from 'class-validator';

export class UpdateWishDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  @IsString()
  link: string;

  @IsUrl()
  @IsString()
  image: string;

  @IsNumber()
  @Min(1)
  price: number;

  @IsString()
  @Length(1, 1024)
  description: string;

  @IsNumber()
  copied?: number;

  @IsNumber()
  raised?: number;
}
