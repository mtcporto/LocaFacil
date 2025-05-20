import SidebarLayout from '@/components/layout/SidebarLayout';
import { LayoutDashboard, FileText, CreditCard, Bell } from 'lucide-react';

const tenantNavItems = [
  { href: '/tenant/dashboard', label: 'Dashboard', icon: LayoutDashboard, tooltip: 'My Overview' },
  { href: '/tenant/lease', label: 'My Lease', icon: FileText, tooltip: 'Lease Details' },
  { href: '/tenant/payments', label: 'Payments', icon: CreditCard, tooltip: 'Payment History' },
  { href: '/tenant/notifications', label: 'Notifications', icon: Bell, tooltip: 'Building Updates' },
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
