import { IsString, Length, IsUrl, IsArray } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  @IsString()
  image: string;

  @IsArray()
  itemsId: number[];
}
