import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/users/create-user.dto';
import { User } from '../entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { UsersRepository } from '../data/repositories/users.repository';

@Injectable()
export class UsersService {

  constructor(
    private readonly userRepository: UsersRepository,
  ) { }

  async getaddressByCep(userCep: string, houseNumber: string) {

    userCep = userCep.replace(/\D/g, '');

    if (!userCep.match(/^[0-9]+$/) || userCep.length !== 8) {
      throw new BadRequestException('Invalid CEP');
    }

    let response = await axios.get(`http://viacep.com.br/ws/${userCep}/json/`)
      .then(response => response.data)
      .catch(() => {
        throw new BadRequestException('Invalid CEP');
      });

    const { cep, localidade, estado, logradouro } = response;
    return {
      cep,
      houseNumber,
      city: localidade,
      state: estado,
      street: logradouro
    }
  }

  async create(createUserDto: CreateUserDto) {

    createUserDto.cpf = createUserDto.cpf.replace(/\D/g, '');
    createUserDto.cep = createUserDto.cep.replace(/\D/g, '');

    let user = await this.userRepository.getUser(createUserDto.cpf)

    if (user) {
      throw new BadRequestException('CEP already exists');
    }

    if (createUserDto.cpf.length !== 11 || createUserDto.cep.length !== 8) {
      throw new BadRequestException('Invalid CPF or CEP');
    }

    let address = await this.getaddressByCep(createUserDto.cep, createUserDto.houseNumber)

    // const newUser = this.userRepository.create(createUserDto)
    this.userRepository.createUser(createUserDto)
    return { cpf: createUserDto.cpf, address }
  }

  async findAll(){
    return await this.userRepository.getUsers();
  }

  async findOne(cpf: string) {

    cpf = cpf.replace(/\D/g, '');
    let user = await this.userRepository.getUser(cpf)

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let address = await this.getaddressByCep(user.cep, user.houseNumber)
    return { cpf, address }
  }
}
