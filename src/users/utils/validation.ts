export function isValidCPF(cpf: string): boolean {
    const regex = /^\d{11}$/;
    return regex.test(cpf);
  }
  
  export function isValidCEP(cep: string): boolean {
    const regex = /^\d{8}$/;
    return regex.test(cep);
  }