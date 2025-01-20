import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../services/users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { CreateUserDto } from '../../dto/users/create-user.dto';
import { UsersRepository } from '../../data/repositories/users.repository';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            getUser: jest.fn(),
            createUser: jest.fn(),
            getUsers: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getaddressByCep', () => {
    it('should throw BadRequestException if CEP is invalid', async () => {
      await expect(service.getaddressByCep('invalid-cep', '123')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if CEP is not numeric', async () => {
      await expect(service.getaddressByCep('12345-abc', '123')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if axios request fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Request failed'));
      await expect(service.getaddressByCep('12345678', '123')).rejects.toThrow(BadRequestException);
    });

    it('should return address if CEP is valid', async () => {
      const response = {
        data: {
          cep: '12345678',
          localidade: 'City',
          estado: 'State',
          logradouro: 'Street',
        },
      };
      mockedAxios.get.mockResolvedValue(response);

      const result = await service.getaddressByCep('12345678', '123');
      expect(result).toEqual({
        cep: '12345678',
        houseNumber: '123',
        city: 'City',
        state: 'State',
        street: 'Street',
      });
    });
  });

  describe('create', () => {
    it('should throw BadRequestException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        cpf: '12345678901',
        cep: '12345678',
        houseNumber: '123',
      };
      jest.spyOn(repository, 'getUser').mockResolvedValue({} as any);

      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if CPF or CEP is invalid', async () => {
      const createUserDto: CreateUserDto = {
        cpf: '123',
        cep: '123',
        houseNumber: '123',
      };

      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
    });

    it('should create user if data is valid', async () => {
      const createUserDto: CreateUserDto = {
        cpf: '12345678901',
        cep: '12345678',
        houseNumber: '123',
      };
      jest.spyOn(repository, 'getUser').mockResolvedValue(null);
      const response = {
        data: {
          cep: '12345678',
          localidade: 'City',
          estado: 'State',
          logradouro: 'Street',
        },
      };
      mockedAxios.get.mockResolvedValue(response);

      const result = await service.create(createUserDto);
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
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, cpf: '12345678901', cep: '12345678', houseNumber: '123' }];
      jest.spyOn(repository, 'getUsers').mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
    });
  });
  //   it('should throw NotFoundException if user is not found', async () => {
  //     jest.spyOn(repository, 'getUser').mockResolvedValue(null);

  //     await expect(service.findOne('12345678901')).rejects.toThrow(NotFoundException);
  //   });

  //   it('should return user if found', async () => {
  //     const user = { id:1, cpf: '13345675927', cep: '12345678', houseNumber: 'a7' };
  //     jest.spyOn(repository, 'getUser').mockResolvedValue(user);
  //     const response = {
  //       data: {
  //         cep: "65066-022",
  //         houseNumber: "a7",
  //         city: "São Luís",
  //         state: "Maranhão",
  //         street: "Rua Juritis"
  //       },
  //     };
  //     mockedAxios.get.mockResolvedValue(response);

  //     const result = await service.findOne('13345675927');
  //     expect(result).toEqual({
  //       cpf: '13345675927',
  //       address: {
  //         cep: "65066-022",
  //         houseNumber: "a7",
  //         city: "São Luís",
  //         state: "Maranhão",
  //         street: "Rua Juritis"
  //       },
  //     });
  //   });
  // });

  describe('findOne', () => {
    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(repository, 'getUser').mockResolvedValue(null);

      await expect(service.findOne('12345678901')).rejects.toThrow(NotFoundException);
    });

    it('should return user if found', async () => {
      const user = { id: 1, cpf: '13345675927', cep: '12345678', houseNumber: 'a7' };
      jest.spyOn(repository, 'getUser').mockResolvedValue(user);
      const response = {
        data: {
          cep: '65066-022',
          localidade: 'São Luís',
          estado: 'Maranhão',
          logradouro: 'Rua Juritis',
        },
      };
      mockedAxios.get.mockResolvedValue(response);

      const result = await service.findOne('13345675927');
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