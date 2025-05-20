import SidebarLayout from '@/components/layout/SidebarLayout';
import { LayoutDashboard, FileText, CreditCard, Bell } from 'lucide-react';

const tenantNavItems = [
  { href: '/tenant/dashboard', label: 'Painel', icon: LayoutDashboard, tooltip: 'Minha Visão Geral' },
  { href: '/tenant/lease', label: 'Meu Contrato', icon: FileText, tooltip: 'Detalhes do Contrato' },
  { href: '/tenant/payments', label: 'Pagamentos', icon: CreditCard, tooltip: 'Histórico de Pagamentos' },
  { href: '/tenant/notifications', label: 'Notificações', icon: Bell, tooltip: 'Atualizações do Condomínio' },
];

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarLayout navItems={tenantNavItems} userRole="tenant">
      {children}
    </SidebarLayout>
  );
}
