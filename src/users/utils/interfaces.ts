export interface UserDefaultReturnInterface {
    cpf: string,
    address: {
        cep: string,
        houseNumber: string,
        city: string,
        state: string,
        street: string,
    }
}