import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryColumn()
    id: number

    @Column({ length: 16, unique: true })
    cpf: string

    @Column({length: 15})
    cep: string

    @Column({length: 10})
    houseNumber: string
}
