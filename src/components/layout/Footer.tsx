import { MapPin, Phone, MessageSquare } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const construtora = {
    nome: "CONSTRUTORA EARLEN",
    endereco: "Avenida Governador Flávio Ribeiro Coutinho, 707, Sala 219",
    bairro: "Manaíra",
    cidade: "João Pessoa",
    estado: "PB",
    cep: "58037-000",
    telefone: "(83) 3246-1640",
    whatsapp: "+55 83 8884-0081",
    whatsappLink: "https://wa.me/558388840081"
  };

  return (
    <footer className="bg-card shadow-inner mt-auto border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div className="md:col-span-1">
            <h3 className="font-semibold text-primary mb-2">{construtora.nome}</h3>
            <address className="not-italic text-muted-foreground space-y-1">
              <p className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 shrink-0 text-accent" />
                <span>{construtora.endereco}, {construtora.bairro},<br />{construtora.cidade} - {construtora.estado}, CEP: {construtora.cep}</span>
              </p>
              <p className="flex items-center">
                <Phone className="h-4 w-4 mr-2 shrink-0 text-accent" />
                <a href={`tel:${construtora.telefone.replace(/\D/g, '')}`} className="hover:text-primary">{construtora.telefone}</a>
              </p>
              <p className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 shrink-0 text-accent" />
                <a href={construtora.whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{construtora.whatsapp} (WhatsApp)</a>
              </p>
            </address>
          </div>
          <div className="md:col-span-2 md:text-right">
            <p className="text-muted-foreground">&copy; {currentYear} DomusLink. Todos os direitos reservados.</p>
            <p className="text-xs text-muted-foreground/80 mt-1">Modernizando a Gestão de Imóveis</p>
            <p className="text-xs text-muted-foreground/80 mt-2">
              Uma solução <a href="https://earlen.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline">Construtora Earlen</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
