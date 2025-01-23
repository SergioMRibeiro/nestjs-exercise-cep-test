import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateUserDto } from '../dto/users/create-user.dto';
import { UsersService } from 'src/users/services/users.service';
import { UserDefaultReturnInterface } from 'src/users/utils/interfaces';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDefaultReturnInterface> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':cpf')
  async findOne(@Param('cpf') cpf: string): Promise<UserDefaultReturnInterface> {
    return await this.usersService.findOne(cpf);
  }
}
