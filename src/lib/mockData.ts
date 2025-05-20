
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
    images: ['https://placehold.co/800x600.png', 'https://placehold.co/1024x768.png', 'https://placehold.co/600x800.png'],
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
    images: ['https://placehold.co/1024x768.png', 'https://placehold.co/700x550.png', 'https://placehold.co/800x500.png'],
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
    images: ['https://placehold.co/700x550.png', 'https://placehold.co/900x600.png', 'https://placehold.co/600x400.png'],
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
    images: ['https://placehold.co/850x500.png', 'https://placehold.co/650x450.png', 'https://placehold.co/1200x700.png'],
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

export type Tenant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
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
};

export const mockTenants: Tenant[] = [
  {
    id: 't1',
    name: 'Maria Silva',
    email: 'maria.silva@example.com',
    phone: '(83) 99999-1111',
    cpf: '111.222.333-44',
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
  },
  {
    id: 't2', 
    name: 'João Santos', 
    email: 'joao.santos@example.com',
    phone: '(83) 91234-5678',
    cpf: '123.456.789-00',
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
  },
  {
    id: 't3',
    name: 'Ana Costa',
    email: 'ana.costa@example.com',
    phone: '(83) 97777-3333',
    cpf: '555.666.777-88',
    propertyId: '3', 
    apartmentUnit: '2A',
    leaseStartDate: '2024-01-01',
    leaseEndDate: '2024-12-31',
    rent_paid_status: 'Pago',
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

// --- Novas definições para Manutenção e Propostas ---

export type MaintenanceRequestStatus = 'Pendente' | 'Em Andamento' | 'Concluído' | 'Cancelado';
export type ProposalStatus = 'Nova' | 'Em Análise' | 'Aceita' | 'Recusada';

export interface MaintenanceRequest {
  id: string;
  tenantId: string; // ID do inquilino que solicitou
  propertyId: string; // ID do imóvel relacionado
  unit: string; // Unidade específica (ex: Apto 309)
  description: string; // Descrição do problema
  dateSubmitted: string; // YYYY-MM-DD
  status: MaintenanceRequestStatus;
  priority?: 'Baixa' | 'Média' | 'Alta';
  assignedTo?: string; // Nome do técnico ou responsável
  resolutionDetails?: string; // Detalhes da solução aplicada
  dateCompleted?: string; // YYYY-MM-DD
}

export interface Proposal {
  id: string;
  prospectName: string;
  prospectEmail: string;
  prospectPhone?: string;
  propertyId: string; // ID do imóvel desejado
  dateSubmitted: string; // YYYY-MM-DD
  status: ProposalStatus;
  message?: string; // Mensagem adicional do proponente
  moveInDate?: string; // Data desejada para mudança (YYYY-MM-DD)
  leaseTerm?: number; // Prazo do contrato desejado em meses
}

export const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'mr1',
    tenantId: 't2', // João Santos
    propertyId: '1', // Edifício Lest Ville
    unit: '309',
    description: 'Vazamento na pia da cozinha. A torneira está pingando constantemente.',
    dateSubmitted: '2024-07-10',
    status: 'Pendente',
    priority: 'Alta',
  },
  {
    id: 'mr2',
    tenantId: 't1', // Maria Silva
    propertyId: '2', // Manaira Prime Residence
    unit: '12B',
    description: 'Ar condicionado do quarto principal não está gelando.',
    dateSubmitted: '2024-07-08',
    status: 'Em Andamento',
    priority: 'Média',
    assignedTo: 'Refrigeração Silva',
  },
  {
    id: 'mr3',
    tenantId: 't3', // Ana Costa
    propertyId: '3', // Condomínio Sunrise
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
    propertyId: '4', // Casa Vale Verde (disponível)
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
    propertyId: '1', // Edifício Lest Ville (atualmente alugado, mas poderia ser proposta para lista de espera)
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
