import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, BedDouble, Bath, Home, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import type { Property } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="relative w-full h-48">
        <Image
          src={property.images[0]}
          alt={property.name}
          data-ai-hint="exterior apartamento"
          layout="fill"
          objectFit="cover"
        />
        {property.available ? (
          <Badge variant="default" className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-white">
            Disponível
          </Badge>
        ) : (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Alugado
          </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary truncate">{property.name}</CardTitle>
        <CardDescription className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1 shrink-0" /> {property.address}, {property.city}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <p className="text-sm text-foreground/80 line-clamp-2">{property.description}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <Home className="h-4 w-4 mr-2 text-accent shrink-0" /> {property.sq_m} m²
          </div>
          <div className="flex items-center">
            <BedDouble className="h-4 w-4 mr-2 text-accent shrink-0" /> {property.bedrooms} quarto(s)
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-2 text-accent shrink-0" /> {property.bathrooms} banheiro(s)
          </div>
          <div className="flex items-center font-semibold">
            <DollarSign className="h-4 w-4 mr-2 text-accent shrink-0" /> R$ {property.rent_amount.toFixed(2)}/mês
          </div>
        </div>
        <div className="pt-2">
            {property.amenities.slice(0,3).map(amenity => (
                <Badge key={amenity} variant="secondary" className="mr-1 mb-1">{amenity}</Badge>
            ))}
            {property.amenities.length > 3 && <Badge variant="secondary">+{property.amenities.length - 3} mais</Badge>}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full transition-transform duration-150 hover:scale-105">
          <Link href={`/properties/${property.id}`}>Ver Detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
