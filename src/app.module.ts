import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from 'ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
