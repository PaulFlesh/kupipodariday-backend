import {
  Controller,
  UseGuards,
  Post,
  Request,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt/jwt-auth.guard';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createWish(
    @Request() req,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    const createdWish = await this.wishesService.create({
      owner: req.user.id,
      ...createWishDto,
    });
    return createdWish;
  }

  @Get('last')
  findLast(): Promise<Wish[]> {
    return this.wishesService.findAll({
      order: {
        createdAt: 'DESC',
      },
      skip: 0,
      take: 40,
    });
  }

  @Get('top')
  findTop(): Promise<Wish[]> {
    return this.wishesService.findAll({
      order: {
        copied: 'DESC',
      },
      skip: 0,
      take: 20,
    });
  }

  @Get(':id')
  async getWish(
    @Param('id') id: string,
  ): Promise<Omit<Wish, 'offers'> & { offers: Record<string, any>[] }> {
    const wish = await this.wishesService.findOne({
      where: { id: +id },
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
    });
    const usersWithOffers = wish.offers.map((offer) => {
      let user = {};
      user = { ...offer, name: offer.user.username };
      return user;
    });
    return { ...wish, offers: usersWithOffers };
  }

  @Patch(':id')
  async updateWish(
    @Request() req,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateOne(
      { id: +id, owner: req.user.id, offers: [] },
      updateWishDto,
    );
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    return this.wishesService.removeOne({ id: +id, owner: req.user });
  }

  @Post(':id/copy')
  async copyWish(@Request() req, @Param('id') id: string) {
    const wish = await this.wishesService.findOne({
      where: { id: +id },
      select: {
        name: true,
        link: true,
        image: true,
        price: true,
        description: true,
      },
    });
    const copiedWish = await this.wishesService.create({
      owner: req.user.id,
      ...wish,
    });
    this.wishesService.incrementCopiedField(+id, 1);
    return copiedWish;
  }
}
