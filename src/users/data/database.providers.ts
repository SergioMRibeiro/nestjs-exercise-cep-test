import { AppDataSource } from "data-source";

export const databaseProviders = [
    {
        provide: 'DataSource',
        useFactory: () => {
            return AppDataSource.initialize();
        }
    }
]