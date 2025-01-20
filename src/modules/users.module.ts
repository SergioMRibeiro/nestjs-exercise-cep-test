import { Module } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { DatabaseModule } from 'src/data/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersController } from 'src/controllers/users.controller';
import { UsersRepository } from 'src/data/repositories/users.repository';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
