
import type { LucideIcon } from "lucide-react";

export type PropertyAmenity = "Estacionamento" | "Piscina" | "Academia" | "Aceita Pets" | "Mobiliado" | "Varanda";

export type Property = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  description: string;
  longDescription: string;
  images: string[];
  sq_m: number;
  bedrooms: number;
  bathrooms: number;
  rent_amount: number;
  available: boolean;
  amenities: PropertyAmenity[];
  type: "Apartamento" | "Casa" | "Condomínio";
  floors?: number; // For buildings
  unitsPerFloor?: Record<string, number>; // e.g. { "1": 10, "2": 8 }
};

export const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Edifício Lest Ville',
    address: 'Av. Cabo Branco, 2834',
    city: 'João Pessoa',
    state: 'PB',
    zip: '58045-010',
    description: 'Aconchegante apartamento com vista para o mar.',
    longDescription: 'Descubra o conforto de viver neste bem conservado apartamento no Edifício Lest Ville. Localizado no vibrante bairro de Cabo Branco, esta unidade oferece vistas deslumbrantes do oceano e fácil acesso às comodidades locais. O edifício é gerido profissionalmente, garantindo uma experiência de vida agradável. Ideal para solteiros ou casais que procuram uma localização privilegiada à beira-mar.',
    images: [
        'https://placehold.co/800x600.png',
        'https://placehold.co/1024x768.png',
        'https://placehold.co/600x800.png'
    ],
    sq_m: 30,
    bedrooms: 1,
    bathrooms: 1,
    rent_amount: 950,
    available: false,
    amenities: ['Estacionamento', 'Aceita Pets', 'Mobiliado'],
    type: "Apartamento",
    floors: 3,
    unitsPerFloor: {"1":26, "2":26, "3":26}
  },
  {
    id: '2',
    name: 'Manaira Prime Residence - Apto 12B',
    address: 'Av. Gov. Flavio Ribeiro Coutinho, 707',
    city: 'João Pessoa',
    state: 'PB',
    zip: '58037-000',
    description: 'Espaçoso apartamento de 3 quartos em Manaira.',
    longDescription: 'Experimente o luxo de viver neste espaçoso apartamento de 3 quartos no Manaira Prime Residence. Esta unidade moderna possui acabamentos de alta qualidade, ampla luz natural e varanda privativa. As comodidades do edifício incluem piscina, academia e segurança 24 horas. Perfeitamente situado perto de opções de compras, restaurantes e entretenimento.',
    images: [
        'https://placehold.co/1000x700.png',
        'https://placehold.co/700x500.png',
        'https://placehold.co/800x550.png'
    ],
    sq_m: 120,
    bedrooms: 3,
    bathrooms: 2,
    rent_amount: 3500,
    available: false,
    amenities: ['Estacionamento', 'Piscina', 'Academia', 'Varanda'],
    type: "Apartamento",
  },
  {
    id: '3',
    name: 'Condomínio Sunrise - Unidade 2A',
    address: 'Rua das Palmeiras, 123',
    city: 'Recife',
    state: 'PE',
    zip: '50000-000',
    description: 'Moderno condomínio de 2 quartos com vista para a cidade.',
    longDescription: 'Desfrute da vida urbana neste elegante condomínio de 2 quartos no Condomínio Sunrise. Esta unidade possui um layout de conceito aberto, design contemporâneo e grandes janelas que oferecem vistas panorâmicas da cidade. Os moradores têm acesso a um terraço na cobertura e a uma academia. Convenientemente localizado no coração de Recife, perto de transporte público e atrações culturais.',
    images: [
        'https://placehold.co/750x550.png',
        'https://placehold.co/950x650.png',
        'https://placehold.co/650x450.png'
    ],
    sq_m: 75,
    bedrooms: 2,
    bathrooms: 2,
    rent_amount: 2200,
    available: false,
    amenities: ['Estacionamento', 'Academia', 'Varanda'],
    type: "Condomínio",
  },
  {
    id: '4',
    name: 'Casa Vale Verde',
    address: 'Alameda dos Bosques, 456',
    city: 'Campina Grande',
    state: 'PB',
    zip: '58400-000',
    description: 'Charmosa casa de 4 quartos com jardim.',
    longDescription: 'Esta bela casa de 4 quartos no Vale Verde oferece um refúgio tranquilo com um jardim espaçoso e área de entretenimento ao ar livre. A casa apresenta um design tradicional com atualizações modernas, incluindo cozinha totalmente equipada e banheiros reformados. Amplo espaço de estacionamento disponível. Ideal para famílias que procuram um bairro tranquilo.',
    images: [
        'https://placehold.co/850x550.png',
        'https://placehold.co/650x400.png',
        'https://placehold.co/1200x750.png'
    ],
    sq_m: 200,
    bedrooms: 4,
    bathrooms: 3,
    rent_amount: 4500,
    available: true,
    amenities: ['Estacionamento', 'Aceita Pets', 'Varanda', 'Mobiliado'],
    type: "Casa",
  },
];

export const getPropertyById = (id: string): Property | undefined => {
  return mockProperties.find(p => p.id === id);
};

export type TaxStatus = 'Pago' | 'Pendente' | 'Vencido';

export const maritalStatusOptions = ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União Estável"];

export type Tenant = {
  id: string;
  name: string;
  email: string;
  password?: string; 
  role: 'tenant'; 
  phone: string;
  cpf: string;
  rg: string;
  maritalStatus: string;
  profession: string;
  propertyId: string;
  apartmentUnit: string;
  leaseStartDate: string; // YYYY-MM-DD
  leaseEndDate: string; // YYYY-MM-DD
  rent_paid_status: TaxStatus;
  iptuAmount: number;
  iptuDueDate: string; // YYYY-MM-DD
  iptuStatus: TaxStatus;
  tcrAmount: number;
  tcrDueDate: string; // YYYY-MM-DD
  tcrStatus: TaxStatus;
  guarantorId?: string; // ID do fiador associado
};

export const mockTenants: Tenant[] = [
  {
    id: 't1',
    name: 'Maria Silva',
    email: 'maria.silva@example.com',
    password: 'password123',
    role: 'tenant',
    phone: '(83) 99999-1111',
    cpf: '111.222.333-44',
    rg: '1.111.111 SSP/PB',
    maritalStatus: 'Casado(a)',
    profession: 'Engenheira',
    propertyId: '2', // Manaira Prime Residence
    apartmentUnit: '12B',
    leaseStartDate: '2023-01-15',
    leaseEndDate: '2025-01-14',
    rent_paid_status: 'Pago',
    iptuAmount: 120.50,
    iptuDueDate: '2024-03-10',
    iptuStatus: 'Pago',
    tcrAmount: 85.00,
    tcrDueDate: '2024-04-15',
    tcrStatus: 'Pago',
    guarantorId: 'g2',
  },
  {
    id: 't2',
    name: 'João Santos', // Nome genérico
    email: 'joao.santos@example.com', // Email genérico
    password: 'password123',
    role: 'tenant',
    phone: '(83) 91234-5678', // Telefone genérico
    cpf: '123.456.789-00', // CPF genérico
    rg: '2.222.222 SSP/PB', // RG genérico
    maritalStatus: 'Casado(a)', // Mantido como casado para o template do contrato
    profession: 'Jornalista',
    propertyId: '1', // Edificio Lest Ville
    apartmentUnit: '309',
    leaseStartDate: '2024-10-15',
    leaseEndDate: '2025-04-14',
    rent_paid_status: 'Pendente',
    iptuAmount: 75.00,
    iptuDueDate: '2025-02-10',
    iptuStatus: 'Pendente',
    tcrAmount: 55.25,
    tcrDueDate: '2025-03-15',
    tcrStatus: 'Pendente',
    guarantorId: 'g1',
  },
  {
    id: 't3',
    name: 'Ana Costa',
    email: 'ana.costa@example.com',
    password: 'password123',
    role: 'tenant',
    phone: '(83) 97777-3333',
    cpf: '555.666.777-88',
    rg: '3.333.333 SSP/PB',
    maritalStatus: 'Divorciado(a)',
    profession: 'Designer',
    propertyId: '3',
    apartmentUnit: '2A',
    leaseStartDate: '2024-01-01',
    leaseEndDate: '2024-12-31',
    rent_paid_status: 'Vencido',
    iptuAmount: 90.00,
    iptuDueDate: '2024-10-05',
    iptuStatus: 'Pendente',
    tcrAmount: 60.70,
    tcrDueDate: '2024-11-20',
    tcrStatus: 'Vencido',
  },
];

export type ServiceItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  icon?: React.ElementType;
};

export const mockServices: ServiceItem[] = [
  {
    id: 'serv1',
    name: 'Cópia de Chave Simples',
    description: 'Cópia adicional para chave comum (porta/portão).',
    price: 15.00,
  },
  {
    id: 'serv2',
    name: 'Controle Remoto do Portão',
    description: 'Novo controle remoto para acesso à garagem.',
    price: 50.00,
  },
  {
    id: 'serv3',
    name: 'Chaveiro de Acesso (TAG)',
    description: 'Chaveiro eletrônico para acesso ao prédio/áreas comuns.',
    price: 25.00,
  },
  {
    id: 'serv4',
    name: 'Limpeza Pós-Obra (Pequena)',
    description: 'Limpeza básica após pequenas instalações ou reparos na unidade.',
    price: 150.00,
  },
];

export const getTenantById = (id: string): Tenant | undefined => {
  return mockTenants.find(t => t.id === id);
};


export type MaintenanceRequestStatus = 'Pendente' | 'Em Andamento' | 'Concluído' | 'Cancelado';
export type ProposalStatus = 'Nova' | 'Em Análise' | 'Aceita' | 'Recusada';

export interface MaintenanceRequest {
  id: string;
  tenantId: string;
  propertyId: string;
  unit: string;
  description: string;
  dateSubmitted: string; // YYYY-MM-DD
  status: MaintenanceRequestStatus;
  priority?: 'Baixa' | 'Média' | 'Alta';
  assignedTo?: string;
  resolutionDetails?: string;
  dateCompleted?: string; // YYYY-MM-DD
}

export interface Proposal {
  id: string;
  prospectName: string;
  prospectEmail: string;
  prospectPhone?: string;
  propertyId: string;
  dateSubmitted: string; // YYYY-MM-DD
  status: ProposalStatus;
  message?: string;
  moveInDate?: string;
  leaseTerm?: number;
}

export const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'mr1',
    tenantId: 't2',
    propertyId: '1',
    unit: '309',
    description: 'Vazamento na pia da cozinha. A torneira está pingando constantemente.',
    dateSubmitted: '2024-07-10',
    status: 'Pendente',
    priority: 'Alta',
  },
  {
    id: 'mr2',
    tenantId: 't1',
    propertyId: '2',
    unit: '12B',
    description: 'Ar condicionado do quarto principal não está gelando.',
    dateSubmitted: '2024-07-08',
    status: 'Em Andamento',
    priority: 'Média',
    assignedTo: 'Refrigeração Silva',
  },
  {
    id: 'mr3',
    tenantId: 't3',
    propertyId: '3',
    unit: '2A',
    description: 'Luz do corredor da área comum queimada (próximo à minha porta).',
    dateSubmitted: '2024-06-25',
    status: 'Concluído',
    priority: 'Baixa',
    resolutionDetails: 'Lâmpada substituída.',
    dateCompleted: '2024-06-26',
  },
];

export const mockProposals: Proposal[] = [
  {
    id: 'prop1',
    prospectName: 'Carlos Andrade',
    prospectEmail: 'carlos.andrade@email.com',
    prospectPhone: '(83) 98877-6655',
    propertyId: '4',
    dateSubmitted: '2024-07-12',
    status: 'Nova',
    message: 'Gostaria de saber mais sobre a casa e agendar uma visita.',
    moveInDate: '2024-08-01',
    leaseTerm: 12,
  },
  {
    id: 'prop2',
    prospectName: 'Beatriz Lima',
    prospectEmail: 'beatriz.lima@email.com',
    propertyId: '1',
    dateSubmitted: '2024-07-05',
    status: 'Em Análise',
    message: 'Tenho interesse neste apartamento para quando estiver disponível.',
  },
  {
    id: 'prop3',
    prospectName: 'Fernanda Souza',
    prospectEmail: 'fernanda.s@email.com',
    propertyId: '4',
    dateSubmitted: '2024-06-20',
    status: 'Recusada',
    message: 'Proposta para aluguel com valor abaixo do solicitado.',
  },
];

// --- Novas definições para Despesas, Colaboradores e Fornecedores ---

export type ExpenseCategory = 'Manutenção' | 'Pessoal' | 'Administrativo' | 'Marketing' | 'Impostos' | 'Outros';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  category: ExpenseCategory;
  propertyId?: string; // Opcional, se a despesa for específica de um imóvel
  notes?: string;
}

export type EmployeeRole = 'Porteiro' | 'Zelador' | 'Faxineiro' | 'Administrativo' | 'Segurança' | 'Outro';

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole | string; // Permite string para "Outro"
  phone: string;
  email?: string;
  salary: number;
  hireDate: string; // YYYY-MM-DD
  propertyId?: string; // Opcional, se alocado a um imóvel específico
}

export interface ServiceProvider {
  id: string;
  companyName: string;
  serviceType: string; // Ex: "Dedetização", "Manutenção de Elevador", "Jardinagem"
  contactName?: string;
  phone: string;
  email?: string;
  notes?: string;
  lastServiceDate?: string; // YYYY-MM-DD
}

// --- Definição para Fiadores ---
export interface Guarantor {
  id: string;
  name: string;
  cpf: string;
  rg: string;
  maritalStatus: string; // Ex: "Solteiro(a)", "Casado(a)"
  profession: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string; // Sigla UF
    zip: string; // XXXXX-XXX ou XXXXXXXX
  };
}

export const mockExpenses: Expense[] = [
  { id: 'ex1', description: 'Reparo hidráulico - Apto 309', amount: 150.75, date: '2024-07-11', category: 'Manutenção', propertyId: '1', notes: 'Encanador João.' },
  { id: 'ex2', description: 'Salário Portaria - Junho', amount: 2800.00, date: '2024-07-05', category: 'Pessoal' },
  { id: 'ex3', description: 'Material de limpeza geral', amount: 250.00, date: '2024-07-01', category: 'Administrativo' },
  { id: 'ex4', description: 'Anúncio online - Imóvel 4', amount: 50.00, date: '2024-06-28', category: 'Marketing', propertyId: '4'},
];

export const mockEmployees: Employee[] = [
  { id: 'emp1', name: 'Carlos Ferreira', role: 'Porteiro', phone: '(83) 98888-1234', salary: 1400.00, hireDate: '2022-03-10', propertyId: '1' },
  { id: 'emp2', name: 'Ana Paula Lima', role: 'Zelador', phone: '(83) 97777-5678', salary: 1600.00, hireDate: '2021-08-15', propertyId: '2' },
  { id: 'emp3', name: 'Roberto Alves', role: 'Faxineiro', phone: '(83) 96666-9012', salary: 1350.00, hireDate: '2023-01-20' },
];

export const mockServiceProviders: ServiceProvider[] = [
  { id: 'sp1', companyName: 'Dedetizadora Confiança', serviceType: 'Dedetização', contactName: 'Sr. Jorge', phone: '(83) 3232-1010', email: 'contato@confianca.com', lastServiceDate: '2024-05-15' },
  { id: 'sp2', companyName: 'Elevadores Atlas', serviceType: 'Manutenção de Elevador', phone: '0800 707 0707', notes: 'Contrato mensal, visita preventiva todo dia 10.', lastServiceDate: '2024-07-10'},
  { id: 'sp3', companyName: 'Jardins & Cia', serviceType: 'Jardinagem', contactName: 'Sra. Flora', phone: '(83) 95555-4321', email: 'flora@jardinsecia.com.br' },
];

export const mockGuarantors: Guarantor[] = [
  {
    id: 'g1',
    name: 'Pedro Rafael Diniz Marinho',
    cpf: '079.374.854-26',
    rg: '3.081.721 SSP/PB',
    maritalStatus: 'Casado(a)',
    profession: 'Contador',
    email: 'pedro.rafael.marinho@example.com',
    phone: '(83) 99676-8715',
    address: {
      street: 'Rua Desportista Jose de Farias',
      number: '237',
      complement: 'Apto 101, Edf Ksdoshi',
      neighborhood: 'Altiplano Cabo Branco',
      city: 'João Pessoa',
      state: 'PB',
      zip: '58030-001',
    },
  },
  {
    id: 'g2',
    name: 'Ana Carolina Oliveira',
    cpf: '111.222.333-44',
    rg: '4.000.001 SSP/PE',
    maritalStatus: 'Solteiro(a)',
    profession: 'Advogada',
    email: 'ana.carolina@example.com',
    phone: '(81) 98888-7777',
    address: {
      street: 'Avenida Boa Viagem',
      number: '1200',
      neighborhood: 'Boa Viagem',
      city: 'Recife',
      state: 'PE',
      zip: '51020-001',
    },
  },
];

// Função para buscar nome do imóvel, para ser usada nas listagens
export const getPropertyNameById = (propertyId: string | undefined): string => {
  if (!propertyId) return "N/A";
  const property = mockProperties.find(p => p.id === propertyId);
  return property ? property.name : "Imóvel Desconhecido";
};

export const getGuarantorNameById = (guarantorId: string | undefined): string => {
  if (!guarantorId) return "Nenhum";
  const guarantor = mockGuarantors.find(g => g.id === guarantorId);
  return guarantor ? guarantor.name : "Fiador Desconhecido";
};

    
