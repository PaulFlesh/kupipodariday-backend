import { Module } from '@nestjs/common';
import { HashModule } from 'src/hash/hash.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HashService } from 'src/hash/hash.service';
import { WishesService } from 'src/wishes/wishes.service';

@Module({
  imports: [HashModule, TypeOrmModule.forFeature([User, Wish])],
  controllers: [UsersController],
  providers: [UsersService, HashService, WishesService],
  exports: [UsersService],
})
export class UsersModule {}
