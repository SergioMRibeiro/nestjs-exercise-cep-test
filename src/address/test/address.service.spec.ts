import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from '../services/address.service';
import { BadRequestException } from '@nestjs/common';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const initializeTestingModule = async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      AddressService,
    ],
  }).compile();

  return module;
};

describe('AddressService', () => {
  let service: AddressService;

  beforeEach(async () => {
    const module = await initializeTestingModule();
    service = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException for invalid CEP', async () => {
    await expect(service.getaddressByCep('123', '10')).rejects.toThrow(BadRequestException);
    await expect(service.getaddressByCep('abcdefgh', '10')).rejects.toThrow(BadRequestException);
    await expect(service.getaddressByCep('123456789', '10')).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if axios request fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Invalid CEP'));
    await expect(service.getaddressByCep('12345678', '10')).rejects.toThrow(BadRequestException);
  });

  it('should return address data for valid CEP', async () => {
    const mockResponse = {
      data: {
        cep: '12345678',
        localidade: 'City',
        estado: 'State',
        logradouro: 'Street',
      },
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await service.getaddressByCep('12345678', '10');
    expect(result).toEqual({
      cep: '12345678',
      houseNumber: '10',
      city: 'City',
      state: 'State',
      street: 'Street',
    });
  });
});