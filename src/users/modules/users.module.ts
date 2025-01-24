import { Module } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { DatabaseModule } from 'src/users/data/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersController } from 'src/users/controllers/users.controller';
import { UsersRepository } from 'src/users/data/repositories/users.repository';
import { AddressModule } from 'src/address/modules/address.module';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User]), AddressModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
