import { BadRequestException, Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class AddressService {
    async getaddressByCep(userCep: string, houseNumber: string) {

        userCep = userCep.replace(/\D/g, '');
    
        if (!userCep.match(/^[0-9]+$/) || userCep.length !== 8) {
          throw new BadRequestException('Invalid CEP');
        }
    
        const response = await axios.get(`http://viacep.com.br/ws/${userCep}/json/`)
          .then(response => response.data)
          .catch(() => {
            throw new BadRequestException('Invalid CEP');
          });
    
        const { cep, localidade, estado, logradouro } = response;
        return {
          cep,
          houseNumber,
          city: localidade,
          state: estado,
          street: logradouro
        }
      }
    
}