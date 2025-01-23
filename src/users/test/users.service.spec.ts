import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/users/create-user.dto';
import { UsersRepository } from '../data/repositories/users.repository';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AddressService } from '../../addres/services/addres.service';
import { UsersMapper } from '../maper/users.maper';

jest.mock('axios');

describe('UsersService', () => {
  const initializeTestingModule = async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersRepository,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: AddressService,
          useValue: {
            getaddressByCep: jest.fn(),
          },
        },
      ],
    }).compile();

    return {
      usersService: module.get<UsersService>(UsersService),
      usersRepository: module.get<UsersRepository>(UsersRepository),
      userRepository: module.get<Repository<User>>(getRepositoryToken(User)),
      addressService: module.get<AddressService>(AddressService),

    };
  };

  it('should be defined', async () => {
    const { usersService, usersRepository } = await initializeTestingModule();
    jest.spyOn(usersRepository, 'getUserByCPF').mockResolvedValue(null);
    expect(usersService).toBeDefined();
  });


  describe('create', () => {
    it('should throw BadRequestException if user already exists', async () => {
      const { usersService, usersRepository } = await initializeTestingModule();
      const createUserDto: CreateUserDto = {
        cpf: '12345678901',
        cep: '12345678',
        houseNumber: '123',
      };
      jest.spyOn(usersRepository, 'getUserByCPF').mockResolvedValue({} as any);

      await expect(usersService.create(createUserDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if CPF or CEP is invalid', async () => {
      const { usersService, usersRepository } = await initializeTestingModule();
      const createUserDto: CreateUserDto = {
        cpf: '123',
        cep: '123',
        houseNumber: '123',
      };
      jest.spyOn(usersRepository, 'getUserByCPF').mockResolvedValue(null);

      await expect(usersService.create(createUserDto)).rejects.toThrow(BadRequestException);
    });

    it('should create user if data is valid and cep remains unchanged', async () => {
      const { usersService, usersRepository, addressService } = await initializeTestingModule();
      const createUserDto: CreateUserDto = {
        cpf: '12345678901',
        cep: '12345678',
        houseNumber: '123',
      };
      jest.spyOn(usersRepository, 'getUserByCPF').mockResolvedValue(null);
      const address = {
        cep: '12345678',
        city: 'City',
        state: 'State',
        street: 'Street',
        houseNumber: '123',
      };
      jest.spyOn(addressService, 'getaddressByCep').mockResolvedValue(address);

      const createdUser = { id: 1, cpf: '12345678901', cep: '12345678', houseNumber: '123' } as User;
      const createUserSpy = jest.spyOn(usersRepository, 'createUser').mockResolvedValue(createdUser);
      const result = await usersService.create(createUserDto);

      expect(result).toEqual({
        cpf: '12345678901',
        address: {
          cep: '12345678',
          houseNumber: '123',
          city: 'City',
          state: 'State',
          street: 'Street',
        },
      });

      expect(createUserSpy).toHaveBeenCalledWith(expect.objectContaining({
        cep: '12345678',
      }));
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const { usersService, usersRepository } = await initializeTestingModule();
      const users = [
        { id: 1, cpf: '12345678901', cep: '12345678', houseNumber: '123' },
        { id: 2, cpf: '98765432100', cep: '87654321', houseNumber: '321' },
      ];
      jest.spyOn(usersRepository, 'getUsers').mockResolvedValue(users);

      const result = await usersService.findAll();
      expect(result).toEqual(users.map(user => UsersMapper.toDto(user)));
    });

    it('should return an empty array if no users are found', async () => {
      const { usersService, usersRepository } = await initializeTestingModule();
      jest.spyOn(usersRepository, 'getUsers').mockResolvedValue([]);

      const result = await usersService.findAll();
      expect(result).toEqual([]);
    });
  });



  describe('findOne', () => {
    it('should throw NotFoundException if user is not found', async () => {
      const { usersService, usersRepository } = await initializeTestingModule();
      jest.spyOn(usersRepository, 'getUserByCPF').mockResolvedValue(null);

      await expect(usersService.findOne('12345678901')).rejects.toThrow(NotFoundException);
    });

    it('should return user if found', async () => {
      const { usersService, usersRepository, addressService } = await initializeTestingModule();
      const cpf = '13345675927';
      const user = { id: 1, cpf, cep: '65066022', houseNumber: 'a7' };
      const address = {
        cep: '65066-022',
        city: 'São Luís',
        houseNumber: 'a7',
        state: 'Maranhão',
        street: 'Rua Juritis',
      };

      jest.spyOn(usersRepository, 'getUserByCPF').mockResolvedValue(user);
      jest.spyOn(addressService, 'getaddressByCep').mockResolvedValue(address);

      const result = await usersService.findOne('13345675927');
      expect(result).toEqual({
        cpf: '13345675927',
        address: {
          cep: '65066-022',
          houseNumber: 'a7',
          city: 'São Luís',
          state: 'Maranhão',
          street: 'Rua Juritis',
        },
      });
    });
  });
});