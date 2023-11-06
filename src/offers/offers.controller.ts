import {
  Controller,
  UseGuards,
  Post,
  Request,
  Body,
  Get,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategies/jwt/jwt-auth.guard';
import { OffersService } from './offers.service';
import { WishesService } from 'src/wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Controller('offers')
@UseGuards(JwtAuthGuard)
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly wishesService: WishesService,
  ) {}

  @Post()
  async create(
    @Request() req,
    @Body() createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    const wish = await this.wishesService.findOne({
      where: {
        id: createOfferDto.itemId,
      },
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
    });

    const total = +wish.raised + +createOfferDto.amount;
    if (total > +wish.price) {
      throw new BadRequestException('Сумма оффера выше цены товара.');
    }
    if (req.user.id !== wish.owner.id) {
      const offer = await this.offersService.create(
        createOfferDto,
        req.user.id,
      );
      await this.wishesService.getRaise(
        +createOfferDto.amount,
        createOfferDto.itemId,
      );
      return offer;
    } else {
      throw new BadRequestException('Вы не можете оплачивать свои хотелки.');
    }
  }

  @Get()
  async findAll(@Request() req): Promise<Offer[]> {
    return this.offersService.findAll({
      where: {
        user: req.user.id,
      },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Offer> {
    return this.offersService.findOne(+id);
  }
}
