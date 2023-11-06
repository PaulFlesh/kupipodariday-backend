import {
  IsString,
  Length,
  IsUrl,
  IsEmail,
  IsNotEmpty,
  IsArray,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsString()
  @Length(2, 200)
  about: string;

  @IsUrl()
  @IsString()
  avatar: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsArray()
  wishlists: [];

  @IsArray()
  wishes: [];

  @IsArray()
  offers: [];
}
