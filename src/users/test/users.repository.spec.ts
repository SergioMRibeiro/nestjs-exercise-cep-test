import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UsersRepository } from "../data/repositories/users.repository";
import { CreateUserDto } from "../dto/users/create-user.dto";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";


describe('UsersRepository', () => {
        const initializeTestingModule = async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersRepository,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
            ],
        }).compile();

        return {
            usersRepository: module.get<UsersRepository>(UsersRepository),
            userRepository: module.get<Repository<User>>(getRepositoryToken(User)),
        };
    };

    it('should be defined', async () => {
        const { usersRepository } = await initializeTestingModule();
        expect(usersRepository).toBeDefined();
    });

    describe('getUsers', () => {
        it('should return an array of users', async () => {
            const { userRepository, usersRepository } = await initializeTestingModule();
            const users: User[] = [{ id: 1, cpf: '12345678901', cep: '25976185', houseNumber: '256' }];
            jest.spyOn(userRepository, 'find').mockResolvedValue(users);

            expect(await usersRepository.getUsers()).toEqual(users);
        });
    });

    describe('getUserByCPF', () => {
        it('should return a user by cpf', async () => {
            const { userRepository, usersRepository } = await initializeTestingModule();
            const user: User = { id: 1, cpf: '12345678901', cep: '25976185', houseNumber: '256' };
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

            expect(await usersRepository.getUserByCPF('12345678901')).toEqual(user);
        });

        it('should return null if user not found', async () => {
            const { userRepository, usersRepository } = await initializeTestingModule();
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            expect(await usersRepository.getUserByCPF('12345678901')).toBeNull();
        });
    });

    describe('createUser', () => {
        it('should create and return a new user', async () => {
            const { userRepository, usersRepository } = await initializeTestingModule();
            const createUserDto: CreateUserDto = { cpf: '12345678901', cep: '25976185', houseNumber: '256' };
            const user: User = { id: 1, ...createUserDto };
            jest.spyOn(userRepository, 'create').mockReturnValue(user);
            jest.spyOn(userRepository, 'save').mockResolvedValue(user);

            expect(await usersRepository.createUser(createUserDto)).toEqual(user);
        });
    });
});