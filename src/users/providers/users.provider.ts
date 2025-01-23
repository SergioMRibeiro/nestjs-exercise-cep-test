import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";

export const UsersProviders = [
    {
        provide: 'USER_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
        inject: ['USER_REPOSITORY']
    }
]