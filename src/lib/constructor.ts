export type ConstructorInfo = {
  nome: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone: string;
  whatsapp: string;
  email: string;
  site: string;
};

export const defaultConstructorInfo: ConstructorInfo = {
  nome: 'CONSTRUTORA EARLEN',
  logradouro: 'Avenida Governador Flávio Ribeiro Coutinho',
  numero: '707',
  complemento: 'Sala 219',
  bairro: 'Manaíra',
  cidade: 'João Pessoa',
  estado: 'PB',
  cep: '58037-000',
  telefone: '(83) 3246-1640',
  whatsapp: '+55 83 8884-0081',
  email: '',
  site: 'https://earlen.com.br/',
};