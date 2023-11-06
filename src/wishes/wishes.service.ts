import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  DeleteResult,
  UpdateResult,
} from 'typeorm';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto): Promise<Wish> {
    return await this.wishesRepository.save(createWishDto);
  }

  async findAll(params: FindManyOptions<Wish>): Promise<Wish[]> {
    return this.wishesRepository.find(params);
  }

  async findOne(params: FindOneOptions<Wish>) {
    return this.wishesRepository.findOne(params);
  }

  async updateOne(
    params: FindOptionsWhere<Wish>,
    updateWishDto: UpdateWishDto,
  ) {
    return this.wishesRepository.update(params, updateWishDto);
  }

  async removeOne(params: FindOptionsWhere<Wish>): Promise<DeleteResult> {
    return this.wishesRepository.delete(params);
  }

  async getRaise(amount: number, id: number): Promise<UpdateResult> {
    const updatedWish = await this.wishesRepository
      .createQueryBuilder()
      .update(Wish)
      .set({
        raised: () => `raised + ${amount}`,
      })
      .where('id = :id', { id })
      .execute();

    return updatedWish;
  }

  async incrementCopiedField(id: number, amount: number) {
    return this.wishesRepository.increment({ id }, 'copied', amount);
  }
}
