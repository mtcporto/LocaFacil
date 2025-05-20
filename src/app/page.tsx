import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Search, UserCog, Users } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-xl shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            DomusLink: Seamless Property Management
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-3xl mx-auto">
            Empowering landlords with smart tools and providing tenants with a transparent, modern rental experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
              <Link href="/properties">
                Browse Available Properties <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="shadow-md hover:shadow-lg transition-shadow">
              <Link href="/auth/login">
                Access Your Portal
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-10 text-primary">Why Choose DomusLink?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="items-center">
              <div className="p-3 bg-accent/20 rounded-full mb-3">
                <Search className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-xl text-center">For Prospective Tenants</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Easily find your next home. Browse detailed listings, view photos, and submit your application digitally.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="items-center">
              <div className="p-3 bg-primary/20 rounded-full mb-3">
                 <UserCog className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl text-center">For Landlords</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Manage properties, tenants, and communications efficiently. Leverage AI for smart notification suggestions.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="items-center">
              <div className="p-3 bg-secondary rounded-full mb-3">
                <Users className="h-8 w-8 text-secondary-foreground" />
              </div>
              <CardTitle className="text-xl text-center">For Current Tenants</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Access your lease information, receive important updates, and manage your tenancy through a dedicated portal.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
         <Card className="overflow-hidden shadow-xl">
          <div className="md:flex">
            <div className="md:w-1/2">
              <Image
                src="https://placehold.co/800x600.png"
                alt="Modern apartment building"
                data-ai-hint="modern apartment building"
                width={800}
                height={600}
                className="object-cover w-full h-64 md:h-full"
              />
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-card">
              <h3 className="text-3xl font-semibold text-primary mb-4">Discover Your Perfect Space</h3>
              <p className="text-foreground/80 mb-6">
                Our platform features a diverse range of properties to suit your lifestyle. From cozy apartments to spacious homes, start your search with DomusLink today.
              </p>
              <Button size="lg" asChild className="self-start shadow-md hover:shadow-lg transition-shadow">
                <Link href="/properties">
                  Explore Listings <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
