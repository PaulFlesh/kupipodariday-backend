import { Injectable, ForbiddenException } from '@nestjs/common';
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
  ) { }

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
    const wish = await this.wishesRepository.findOne({ relations: { owner: true } });
    if (wish.owner) {
      throw new ForbiddenException('Нельзя изменять чужие подарки.');
    }
    return this.wishesRepository.update(params, updateWishDto);
  }

  async removeOne(params: FindOptionsWhere<Wish>): Promise<DeleteResult> {
    const wish = await this.wishesRepository.findOne({ relations: { owner: true } });
    if (wish.owner) {
      throw new ForbiddenException('Нельзя удалять чужие подарки.');
    }
    return this.wishesRepository.delete(params);
  }

  async getRaise(amount: number, id: number): Promise<UpdateResult> {
    const wish = await this.wishesRepository.findOne({where: { id: +id }});
    if (wish.price && wish.raised > 0) {
      throw new ForbiddenException(
        'Вы не можете изменять стоимость подарка, если уже есть желающие скинуться.'
      )
    }
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
