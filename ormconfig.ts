import { User } from 'src/entities/user.entity'
import { DataSourceOptions } from 'typeorm'

export const ormconfig: DataSourceOptions = {
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [User],
    synchronize: true, // Trocar para false em ambiente de produção
}
