import Link from 'next/link';
import { Building, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3 text-foreground transition-colors hover:text-primary">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Building className="h-5 w-5" /></span>
          <span><h1 className="text-xl font-bold tracking-tight">LocaFácil</h1><span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:block">locação com clareza</span></span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/properties">Imóveis</Link>
          </Button>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/landlord/dashboard">Proprietário</Link>
          </Button>
           <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/tenant/dashboard">Inquilino</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/login" className="flex items-center gap-2">
              <LogIn size={18} />
              Entrar
            </Link>
          </Button>
          {/* <Button asChild>
            <Link href="/auth/signup" className="flex items-center gap-2">
              <UserPlus size={18} />
              Cadastrar
            </Link>
          </Button> */}
        </nav>
      </div>
    </header>
  );
}
