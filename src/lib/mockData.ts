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
    name: 'Edifício Lest Ville - Unidade 305',
    address: 'Av. Cabo Branco, 2834',
    city: 'João Pessoa',
    state: 'PB',
    zip: '58045-010',
    description: 'Aconchegante apartamento de 1 quarto com vista para o mar.',
    longDescription: 'Descubra o conforto de viver neste bem conservado apartamento de 1 quarto no Edifício Lest Ville. Localizado no vibrante bairro de Cabo Branco, esta unidade oferece vistas deslumbrantes do oceano e fácil acesso às comodidades locais. O edifício é gerido profissionalmente, garantindo uma experiência de vida agradável. Ideal para solteiros ou casais que procuram uma localização privilegiada à beira-mar.',
    images: ['https://placehold.co/600x400.png?text=Apto+Vista+Mar', 'https://placehold.co/600x400.png?text=Sala+de+Estar', 'https://placehold.co/600x400.png?text=Quarto'],
    sq_m: 30,
    bedrooms: 1,
    bathrooms: 1,
    rent_amount: 1200,
    available: true,
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
    images: ['https://placehold.co/600x400.png?text=Apto+Luxo+Manaira', 'https://placehold.co/600x400.png?text=Cozinha', 'https://placehold.co/600x400.png?text=Quarto+Principal'],
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
    images: ['https://placehold.co/600x400.png?text=Condo+Vista+Cidade', 'https://placehold.co/600x400.png?text=Sala+Jantar', 'https://placehold.co/600x400.png?text=Banheiro'],
    sq_m: 75,
    bedrooms: 2,
    bathrooms: 2,
    rent_amount: 2200,
    available: true,
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
    images: ['https://placehold.co/600x400.png?text=Casa+Familia+Jardim', 'https://placehold.co/600x400.png?text=Vista+Jardim', 'https://placehold.co/600x400.png?text=Foto+Interior'],
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

export type Tenant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string; 
  apartmentUnit: string;
  leaseStartDate: string;
  leaseEndDate: string;
  rent_paid_status: 'Pago' | 'Pendente' | 'Atrasado';
};

export const mockTenants: Tenant[] = [
  {
    id: 't1',
    name: 'Maria Silva',
    email: 'maria.silva@example.com',
    phone: '(83) 99999-1111',
    propertyId: '2', // Manaira Prime Residence
    apartmentUnit: '12B',
    leaseStartDate: '2023-01-15',
    leaseEndDate: '2025-01-14',
    rent_paid_status: 'Pago',
  },
  {
    id: 't2',
    name: 'João Santos',
    email: 'joao.santos@example.com',
    phone: '(83) 98888-2222',
    propertyId: '1', // Edificio Lest Ville
    apartmentUnit: '301', 
    leaseStartDate: '2022-06-01',
    leaseEndDate: '2024-05-31',
    rent_paid_status: 'Pendente',
  },
];
