import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategies/jwt/jwt-auth.guard';
import { UsersService } from './users.service';
import { HashService } from 'src/hash/hash.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { WishesService } from 'src/wishes/wishes.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly wishesService: WishesService,
  ) {}

  @Get('me')
  async findOwn(@Request() req) {
    return this.usersService.findOne({
      where: { id: +req.user.id },
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Patch('me')
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    let hashedPassword: string;
    if (updateUserDto.password) {
      hashedPassword = await this.hashService.hash(updateUserDto.password);
      updateUserDto.password = hashedPassword;
    }
    return this.usersService.updateOne(+req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  async getOwnWishes(@Request() req) {
    const user = await this.usersService.findOne({
      where: {
        id: +req.user.id,
      },
      relations: {
        wishes: true,
      },
      select: {
        wishes: true,
      },
    });
    return user.wishes;
  }

  @Get(':username')
  async findOne(@Param() username: { username: string }) {
    return this.usersService.findOne({
      where: username,
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Get(':username/wishes')
  async getWishes(@Param() username: { username: string }) {
    const userWishes = await this.usersService.findOne({
      where: username,
      relations: {
        wishes: true,
      },
      select: {
        wishes: true,
      },
    });
    return userWishes.wishes;
  }

  @Post('find')
  async findMany(@Body() reqBody: FindUserDto) {
    return this.usersService.findAll({
      where: [{ username: reqBody.query }, { email: reqBody.query }],
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
