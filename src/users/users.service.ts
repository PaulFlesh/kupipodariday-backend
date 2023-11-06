import { Injectable } from '@nestjs/common';
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
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(createUserDto);
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
    const updateResult = await this.userRepository
      .createQueryBuilder()
      .update(User, updateUserDto)
      .where({ id })
      .returning([
        'id',
        'username',
        'about',
        'avatar',
        'email',
        'createdAt',
        'updatedAt',
      ])
      .execute();
    return updateResult.raw[0];
  }

  async removeOne(id: number) {
    return this.userRepository.delete(id);
  }
}
