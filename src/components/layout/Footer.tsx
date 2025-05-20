export default function Footer() {
  return (
    <footer className="bg-card shadow-t mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} DomusLink. All rights reserved.</p>
        <p className="text-sm mt-1">Modernizing Property Management</p>
      </div>
    </footer>
  );
}
