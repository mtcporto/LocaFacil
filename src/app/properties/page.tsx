import PropertyCard from '@/components/property/PropertyCard';
import { mockProperties } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

export default function PropertiesPage() {
  // Em um app real, os imóveis seriam buscados e poderiam ser filtrados/pesquisados
  const properties = mockProperties;

  return (
    <div className="space-y-8">
      <section className="bg-card p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-primary mb-4">Encontre Seu Próximo Lar</h1>
        <p className="text-muted-foreground mb-6">
          Navegue pela nossa lista selecionada de imóveis disponíveis. Use os filtros para refinar sua busca.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input type="search" placeholder="Buscar por endereço, cidade ou nome..." className="pl-10 w-full" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filtros
          </Button>
        </div>
      </section>

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">Nenhum imóvel disponível no momento. Por favor, verifique mais tarde.</p>
        </div>
      )}
    </div>
  );
}
