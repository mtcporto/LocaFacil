import { getPropertyById, PropertyAmenity } from '@/lib/mockData';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, BedDouble, Bath, Home, DollarSign, Check, Building, Layers } from 'lucide-react';

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = getPropertyById(params.id);

  if (!property) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold">Property not found</h1>
        <Button asChild variant="link" className="mt-4">
          <Link href="/properties">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to properties
          </Link>
        </Button>
      </div>
    );
  }

  const amenityIcons: Record<PropertyAmenity, React.ElementType> = {
    "Parking": ({className})=><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 18V7.5a3.5 3.5 0 0 1 7 0V18"/><circle cx="12" cy="18" r="3"/><path d="M12 15v- строительный3"/></svg>, // simple P icon
    "Pool": ({className})=><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 12H8a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2z"/><path d="M12 4v2"/><path d="M12 20v-2"/><path d="M4 12h2"/><path d="M20 12h-2"/><path d="M7.05 7.05l1.414 1.414"/><path d="M15.536 15.536l1.414 1.414"/><path d="M7.05 16.95l1.414 -1.414"/><path d="M15.536 8.464l1.414 -1.414"/></svg>, // pool / umbrella like
    "Gym": ({className})=><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/></svg>, // dumbbell
    "Pet Friendly": ({className})=><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 14s-3 -2 -3 -5a3 3 0 0 1 6 0c0 3 -3 5 -3 5z"/><path d="M12 14v6"/><path d="M10 12h4"/></svg>, // paw
    "Furnished": ({className})=><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 9v10a2 2 0 0 1 -2 2H6a2 2 0 0 1 -2 -2V9"/><path d="M4 7V5a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v2"/><path d="M10 12h4"/></svg>, // chair
    "Balcony": ({className})=><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12h20"/><path d="M2 9h20"/><path d="M6 9v12h12V9M10 9V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4"/></svg>, // balcony
  };


  return (
    <div className="space-y-8">
      <div className="flex justify-start mb-4">
        <Button variant="outline" asChild>
          <Link href="/properties">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
          </Link>
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
            <div>
                <CardTitle className="text-3xl font-bold text-primary">{property.name}</CardTitle>
                <CardDescription className="flex items-center text-lg text-muted-foreground mt-1">
                    <MapPin className="h-5 w-5 mr-2 shrink-0" /> {property.address}, {property.city}, {property.state} {property.zip}
                </CardDescription>
            </div>
            <Badge variant={property.available ? "default" : "destructive"} className={`text-lg px-4 py-2 ${property.available ? 'bg-green-500 hover:bg-green-600' : ''}`}>
              {property.available ? 'Available' : 'Rented'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-h-[400px] overflow-hidden rounded-lg">
            {property.images.slice(0,3).map((src, index) => (
              <div key={index} className={`relative w-full h-64 md:h-96 ${index > 0 ? 'hidden md:block' : ''} ${index === 0 ? 'md:col-span-2' : ''}`}>
                <Image
                  src={src}
                  alt={`${property.name} - Image ${index + 1}`}
                  data-ai-hint="apartment interior"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md shadow-md"
                />
              </div>
            ))}
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-2xl font-semibold text-primary border-b pb-2">Property Details</h2>
              <p className="text-foreground/80 leading-relaxed">{property.longDescription}</p>

              {property.type === "Apartment" && property.floors && (
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground flex items-center"><Building className="h-5 w-5 mr-2 text-accent"/>Building Information</h3>
                  <p className="text-sm text-muted-foreground">Type: {property.type}</p>
                  <p className="text-sm text-muted-foreground">Total Floors: {property.floors}</p>
                  {property.unitsPerFloor && Object.entries(property.unitsPerFloor).map(([floor, units]) => (
                     <p key={floor} className="text-sm text-muted-foreground">Floor {floor}: {units} units</p>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Card className="bg-secondary/50 p-6 rounded-lg">
                 <h3 className="text-xl font-semibold text-primary mb-4">Key Information</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-foreground"><Home className="h-5 w-5 mr-3 text-accent shrink-0" /> Area: {property.sq_m} m²</li>
                  <li className="flex items-center text-foreground"><BedDouble className="h-5 w-5 mr-3 text-accent shrink-0" /> Bedrooms: {property.bedrooms}</li>
                  <li className="flex items-center text-foreground"><Bath className="h-5 w-5 mr-3 text-accent shrink-0" /> Bathrooms: {property.bathrooms}</li>
                  <li className="flex items-center text-foreground text-xl font-bold"><DollarSign className="h-6 w-6 mr-3 text-accent shrink-0" /> R$ {property.rent_amount} <span className="text-sm font-normal text-muted-foreground ml-1">/month</span></li>
                </ul>
                 {property.available && (
                    <Button size="lg" className="w-full mt-6 transition-transform duration-150 hover:scale-105">
                        Apply Now
                    </Button>
                  )}
              </Card>
              
              <div>
                <h3 className="text-xl font-semibold text-primary mb-3">Amenities</h3>
                <ul className="space-y-2">
                  {property.amenities.map(amenity => {
                    const IconComponent = amenityIcons[amenity] || Check;
                    return (
                      <li key={amenity} className="flex items-center text-foreground">
                        <IconComponent className="h-5 w-5 mr-3 text-green-500 shrink-0" /> {amenity}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
