import {
  IsNumber,
  IsString,
  Length,
  IsUrl,
  IsEmail,
  IsDate,
} from 'class-validator';

export class UserProfileResponseDto {
  @IsNumber()
  id: number;

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

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
