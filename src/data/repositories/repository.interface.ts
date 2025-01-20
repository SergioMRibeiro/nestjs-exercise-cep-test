import { Repository } from "typeorm";
import { ObjectLiteral } from "typeorm";

export abstract class GenericRepository<T extends ObjectLiteral> extends Repository<T> {}