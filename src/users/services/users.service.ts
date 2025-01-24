import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/users/create-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../data/repositories/users.repository';
import { User } from '../entities/user.entity';
import { UserDefaultReturnInterface } from '../../users/utils/interfaces';
import { AddressService } from '../../address/services/address.service';
import { isValidCEP, isValidCPF } from '../utils/validation';
import { UsersMapper } from '../maper/users.maper';

@Injectable()
export class UsersService {

  constructor(
    private readonly userRepository: UsersRepository,
    private readonly addressService: AddressService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<{ cpf: string; address: any }> {
    createUserDto.cpf = createUserDto.cpf.replace(/\D/g, '');
    createUserDto.cep = createUserDto.cep.replace(/\D/g, '');

    const existingUser = await this.userRepository.getUserByCPF(createUserDto.cpf);

    if (existingUser) {
      throw new BadRequestException('CPF already exists');
    }

    if (!isValidCPF(createUserDto.cpf)) {
      throw new BadRequestException('Invalid CPF');
    }

    if (!isValidCEP(createUserDto.cep)) {
      throw new BadRequestException('Invalid CEP');
    }
    const address = await this.addressService.getaddressByCep(createUserDto.cep, createUserDto.houseNumber);

    // FIXME - This is a bug, the cpf and cep should be validated before creating the user
    // createUserDto.cep = 'banana';

    const user: User = UsersMapper.toEntity(createUserDto);
    await this.userRepository.createUser(user);

    return { cpf: createUserDto.cpf, address };
  }

  async findAll(): Promise<CreateUserDto[]> {
    const users = await this.userRepository.getUsers();
    return users.map(user => UsersMapper.toDto(user));
  }

  async findOne(cpf: string): Promise<UserDefaultReturnInterface> {

    cpf = cpf.replace(/\D/g, '');
    const user = await this.userRepository.getUserByCPF(cpf)

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const address = await this.addressService.getaddressByCep(user.cep, user.houseNumber)
    return { cpf, address }
  }
}
