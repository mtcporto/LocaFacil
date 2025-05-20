import Link from 'next/link';
import { Building, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
          <Building className="h-8 w-8" />
          <h1 className="text-2xl font-bold">DomusLink</h1>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/properties">Properties</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/landlord/dashboard">Landlord</Link>
          </Button>
           <Button variant="ghost" asChild>
            <Link href="/tenant/dashboard">Tenant</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/login" className="flex items-center gap-2">
              <LogIn size={18} />
              Login
            </Link>
          </Button>
          {/* <Button asChild>
            <Link href="/auth/signup" className="flex items-center gap-2">
              <UserPlus size={18} />
              Sign Up
            </Link>
          </Button> */}
        </nav>
      </div>
    </header>
  );
}
