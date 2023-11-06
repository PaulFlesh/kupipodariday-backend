import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { DeleteResult, In, UpdateResult } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { Wishlist } from './entities/wishlist.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Controller('wishlists')
export class WishlistsController {
  constructor(
    private readonly wishlistsService: WishlistsService,
    private readonly wishesService: WishesService,
  ) {}

  @Post()
  async create(
    @Request() req,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const wishlist = await this.wishlistsService.create(
      createWishlistDto,
      req.user.id,
    );
    return wishlist;
  }

  @Get()
  async findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll({});
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<Omit<Wishlist, 'items'> & { items: Wish[] }> {
    const wishlist = await this.wishlistsService.findOne({
      where: {
        id: +id,
      },
      relations: {
        owner: true,
      },
    });
    const wishesList = await this.wishesService.findAll({
      where: {
        id: In(wishlist.items),
      },
    });
    const responseObject = { ...wishlist, items: wishesList };
    return responseObject;
  }

  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<UpdateResult> {
    return this.wishlistsService.updateOne(
      { id: +id, owner: req.user.id },
      updateWishlistDto,
    );
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string): Promise<DeleteResult> {
    return this.wishlistsService.removeOne({ id: +id, owner: req.user.id });
  }
}
