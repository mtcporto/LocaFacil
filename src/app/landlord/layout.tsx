import SidebarLayout from '@/components/layout/SidebarLayout';
import { LayoutDashboard, Building, Users, Bell } from 'lucide-react';

const landlordNavItems = [
  { href: '/landlord/dashboard', label: 'Painel', icon: LayoutDashboard, tooltip: 'Visão Geral' },
  { href: '/landlord/properties', label: 'Imóveis', icon: Building, tooltip: 'Gerenciar Imóveis' },
  { href: '/landlord/tenants', label: 'Inquilinos', icon: Users, tooltip: 'Gerenciar Inquilinos' },
  { href: '/landlord/notifications', label: 'Notificações', icon: Bell, tooltip: 'Enviar Notificações' },
];

export default function LandlordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarLayout navItems={landlordNavItems} userRole="landlord">
      {children}
    </SidebarLayout>
  );
}
