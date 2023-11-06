import {
  IsNumber,
  IsDate,
  IsString,
  Length,
  IsUrl,
  IsEmail,
} from 'class-validator';

export class RegisterUserResponseDto {
  @IsNumber()
  id: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

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
}
