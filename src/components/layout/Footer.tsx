export default function Footer() {
  return (
    <footer className="bg-card shadow-t mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} DomusLink. Todos os direitos reservados.</p>
        <p className="text-sm mt-1">Modernizando a Gestão de Imóveis</p>
      </div>
    </footer>
  );
}
