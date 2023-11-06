import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { HashService } from 'src/hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RegisterUserResponseDto } from 'src/users/dto/signup-user-response-dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.usersService.findOne({ where: { username } });
      const isPasswordMatch = await this.hashService.compare(
        password,
        user.password,
      );
      if (isPasswordMatch) {
        // eslint-disable-next-line
        const { password, ...result } = user; 
        return result;
      }
    } catch {
      throw new UnauthorizedException('Неправильный логин или пароль');
    }
  }

  async login(
    user: Omit<User, 'password'>,
  ): Promise<Record<'access_token', string>> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { secret: 'jwt_secret' }),
    };
  }

  async register(
    registerData: CreateUserDto,
  ): Promise<RegisterUserResponseDto> {
    const hashedPassword = await this.hashService.hash(registerData.password);
    registerData.password = hashedPassword;
    try {
      const user = await this.usersService.create(registerData); // eslint-disable-next-line
      const { password, wishes, wishlists, offers, ...responseUser } = user;
      return responseUser;
    } catch (error) {
      throw new ConflictException('Такой пользователь уже существует.');
    }
  }
}
