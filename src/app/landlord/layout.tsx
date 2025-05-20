
"use client";

import SidebarLayout from '@/components/layout/SidebarLayout';
import { LayoutDashboard, Building, Users, Bell, Wrench, ClipboardList, Receipt, UsersRound, Truck, ShieldCheck } from 'lucide-react';

const landlordNavItems = [
  { href: '/landlord/dashboard', label: 'Painel', icon: LayoutDashboard, tooltip: 'Visão Geral' },
  { href: '/landlord/properties', label: 'Imóveis', icon: Building, tooltip: 'Gerenciar Imóveis' },
  { href: '/landlord/tenants', label: 'Inquilinos', icon: Users, tooltip: 'Gerenciar Inquilinos' },
  { href: '/landlord/guarantors', label: 'Fiadores', icon: ShieldCheck, tooltip: 'Gerenciar Fiadores' },
  { href: '/landlord/notifications', label: 'Notificações', icon: Bell, tooltip: 'Enviar Notificações' },
  { href: '/landlord/maintenance', label: 'Manutenção', icon: Wrench, tooltip: 'Solicitações de Manutenção' },
  { href: '/landlord/proposals', label: 'Propostas', icon: ClipboardList, tooltip: 'Propostas Recebidas' },
  { href: '/landlord/expenses', label: 'Despesas', icon: Receipt, tooltip: 'Gerenciar Despesas' },
  { href: '/landlord/staff', label: 'Colaboradores', icon: UsersRound, tooltip: 'Gerenciar Colaboradores' },
  { href: '/landlord/providers', label: 'Fornecedores', icon: Truck, tooltip: 'Gerenciar Fornecedores' },
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

    