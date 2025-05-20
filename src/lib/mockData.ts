export type PropertyAmenity = "Parking" | "Pool" | "Gym" | "Pet Friendly" | "Furnished" | "Balcony";

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
  type: "Apartment" | "House" | "Condo";
  floors?: number; // For buildings
  unitsPerFloor?: Record<string, number>; // e.g. { "1": 10, "2": 8 }
};

export const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Edificio Lest Ville - Unit 305',
    address: 'Av. Cabo Branco, 2834',
    city: 'João Pessoa',
    state: 'PB',
    zip: '58045-010',
    description: 'Cozy 1-bedroom apartment with ocean views.',
    longDescription: 'Discover comfortable living in this well-maintained 1-bedroom apartment at Edificio Lest Ville. Located in the vibrant Cabo Branco neighborhood, this unit offers stunning ocean views and easy access to local amenities. The building is professionally managed, ensuring a pleasant living experience. Ideal for singles or couples looking for a prime beachfront location.',
    images: ['https://placehold.co/600x400.png?text=Ocean+View+Apt', 'https://placehold.co/600x400.png?text=Living+Room', 'https://placehold.co/600x400.png?text=Bedroom'],
    sq_m: 30,
    bedrooms: 1,
    bathrooms: 1,
    rent_amount: 1200,
    available: true,
    amenities: ['Parking', 'Pet Friendly', 'Furnished'],
    type: "Apartment",
    floors: 3,
    unitsPerFloor: {"1":26, "2":26, "3":26}
  },
  {
    id: '2',
    name: 'Manaira Prime Residence - Apt 12B',
    address: 'Av. Gov. Flavio Ribeiro Coutinho, 707',
    city: 'João Pessoa',
    state: 'PB',
    zip: '58037-000',
    description: 'Spacious 3-bedroom apartment in Manaira.',
    longDescription: 'Experience luxury living in this spacious 3-bedroom apartment at Manaira Prime Residence. This modern unit features high-end finishes, ample natural light, and a private balcony. Building amenities include a swimming pool, gym, and 24-hour security. Perfectly situated near shopping, dining, and entertainment options.',
    images: ['https://placehold.co/600x400.png?text=Luxury+Apt+Manaira', 'https://placehold.co/600x400.png?text=Kitchen', 'https://placehold.co/600x400.png?text=Master+Bedroom'],
    sq_m: 120,
    bedrooms: 3,
    bathrooms: 2,
    rent_amount: 3500,
    available: false,
    amenities: ['Parking', 'Pool', 'Gym', 'Balcony'],
    type: "Apartment",
  },
  {
    id: '3',
    name: 'Sunrise Condos - Unit 2A',
    address: 'Rua das Palmeiras, 123',
    city: 'Recife',
    state: 'PE',
    zip: '50000-000',
    description: 'Modern 2-bedroom condo with city views.',
    longDescription: 'Enjoy urban living in this stylish 2-bedroom condo at Sunrise Condos. This unit boasts an open-concept layout, contemporary design, and large windows offering panoramic city views. Residents have access to a rooftop terrace and a fitness center. Conveniently located in the heart of Recife, close to public transport and cultural attractions.',
    images: ['https://placehold.co/600x400.png?text=City+View+Condo', 'https://placehold.co/600x400.png?text=Dining+Area', 'https://placehold.co/600x400.png?text=Bathroom'],
    sq_m: 75,
    bedrooms: 2,
    bathrooms: 2,
    rent_amount: 2200,
    available: true,
    amenities: ['Parking', 'Gym', 'Balcony'],
    type: "Condo",
  },
  {
    id: '4',
    name: 'Green Valley House',
    address: 'Alameda dos Bosques, 456',
    city: 'Campina Grande',
    state: 'PB',
    zip: '58400-000',
    description: 'Charming 4-bedroom house with garden.',
    longDescription: 'This beautiful 4-bedroom house in Green Valley offers a tranquil retreat with a spacious garden and outdoor entertaining area. The home features a traditional design with modern updates, including a fully equipped kitchen and renovated bathrooms. Ample parking space is available. Ideal for families seeking a peaceful neighborhood.',
    images: ['https://placehold.co/600x400.png?text=Family+House+Garden', 'https://placehold.co/600x400.png?text=Garden+View', 'https://placehold.co/600x400.png?text=Interior+Shot'],
    sq_m: 200,
    bedrooms: 4,
    bathrooms: 3,
    rent_amount: 4500,
    available: true,
    amenities: ['Parking', 'Pet Friendly', 'Balcony', 'Furnished'],
    type: "House",
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
  rent_paid_status: 'Paid' | 'Due' | 'Overdue';
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
    rent_paid_status: 'Paid',
  },
  {
    id: 't2',
    name: 'João Santos',
    email: 'joao.santos@example.com',
    phone: '(83) 98888-2222',
    propertyId: '1', // Edificio Lest Ville
    apartmentUnit: '301', // Assuming 301 is occupied
    leaseStartDate: '2022-06-01',
    leaseEndDate: '2024-05-31',
    rent_paid_status: 'Due',
  },
];
