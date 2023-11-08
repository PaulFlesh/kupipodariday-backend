import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response-dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return this.userRepository.save(createUserDto);
    } catch (error) {
      throw new ConflictException('Такой пользователь уже существует.');
    }
  }

  async findAll(
    paramsObject: FindManyOptions<User>,
  ): Promise<UserProfileResponseDto[]> {
    return this.userRepository.find(paramsObject);
  }

  async findOne(paramsObject: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne(paramsObject);
  }

  async updateOne(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    const isUserExists =
      (updateUserDto?.username || updateUserDto?.email) &&
      (await this.findOne({
        where: [
          { username: updateUserDto.username },
          { email: updateUserDto.email },
        ],
      }));
    if (isUserExists) {
      throw new ConflictException('Такой пользователь уже существует.');
    }
    await this.userRepository.update(id, updateUserDto);
    return await this.userRepository.findOne({ where: { id } });
  }

  async removeOne(id: number) {
    return this.userRepository.delete(id);
  }
}
