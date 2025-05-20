import SidebarLayout from '@/components/layout/SidebarLayout';
import { LayoutDashboard, Building, Users, Bell } from 'lucide-react';

const landlordNavItems = [
  { href: '/landlord/dashboard', label: 'Dashboard', icon: LayoutDashboard, tooltip: 'Overview' },
  { href: '/landlord/properties', label: 'Properties', icon: Building, tooltip: 'Manage Properties' },
  { href: '/landlord/tenants', label: 'Tenants', icon: Users, tooltip: 'Manage Tenants' },
  { href: '/landlord/notifications', label: 'Notifications', icon: Bell, tooltip: 'Send Notifications' },
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
