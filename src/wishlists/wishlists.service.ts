import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  UpdateResult,
  DeleteResult,
} from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    userId: string,
  ): Promise<Wishlist> {
    const { itemsId, ...createWishlistData } = createWishlistDto;
    createWishlistData['items'] = [...itemsId];
    createWishlistData['owner'] = userId;
    return this.wishlistRepository.save(createWishlistData);
  }

  async findAll(paramsObject: FindManyOptions<Wishlist>): Promise<Wishlist[]> {
    return this.wishlistRepository.find(paramsObject);
  }

  async findOne(paramsObject: FindOneOptions<Wishlist>): Promise<Wishlist> {
    return this.wishlistRepository.findOne(paramsObject);
  }

  async updateOne(
    paramsObject: FindOptionsWhere<Wishlist>,
    updateUserDto: UpdateWishlistDto,
  ): Promise<UpdateResult> {
    if (!paramsObject.owner) {
      throw new ForbiddenException(
        'Вы не можете редактировать чужие списки подарков.',
      );
    }
    return this.wishlistRepository.update(paramsObject, updateUserDto);
  }

  async removeOne(
    paramsObject: FindOptionsWhere<Wishlist>,
  ): Promise<DeleteResult> {
    if (!paramsObject.owner) {
      throw new ForbiddenException(
        'Вы не можете удалять чужие списки подарков.',
      );
    }
    return this.wishlistRepository.delete(paramsObject);
  }
}
