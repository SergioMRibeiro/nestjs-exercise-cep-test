import { CreateUserDto } from "../dto/users/create-user.dto";
import { User } from "../entities/user.entity";

export class UsersMapper {
    static toEntity(createUserDto: CreateUserDto): User {
        const user = new User();
        user.cpf = createUserDto.cpf;
        user.cep = createUserDto.cep;
        user.houseNumber = createUserDto.houseNumber;
        return user;
    }

    static toDto(user: User): CreateUserDto {
        const createUserDto = new CreateUserDto();
        createUserDto.cpf = user.cpf;
        createUserDto.cep = user.cep;
        createUserDto.houseNumber = user.houseNumber;
        return createUserDto;
    }

}