
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Home, Building, Users, Bell, Settings, LogOut } from 'lucide-react'; // Removidos LayoutDashboard, FileText, CreditCard que eram específicos
import React from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  tooltip?: string;
}

interface SidebarLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  userRole: 'landlord' | 'tenant' | string;
}

export default function SidebarLayout({ children, navItems, userRole }: SidebarLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="flex items-center justify-between p-2">
          <Link href="/" className="text-lg font-semibold text-primary flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <Building /> DomusLink
          </Link>
          <div className="group-data-[collapsible=icon]:hidden">
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== `/${userRole}/dashboard` && item.href !== '/' && pathname.startsWith(item.href))}
                  tooltip={item.tooltip || item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2 mt-auto">
           {userRole === 'landlord' && (
            <SidebarMenuButton tooltip="Configurações" asChild>
              <Link href="/landlord/settings">
                <Settings /> <span>Configurações</span>
              </Link>
            </SidebarMenuButton>
           )}
          <SidebarMenuButton tooltip="Sair" asChild>
            <Link href="/auth/login"> {/* Mock logout */}
                <LogOut /> <span>Sair</span>
            </Link>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-1 md:p-0 group-data-[collapsible=icon]:p-0"> {/* This is the equivalent of main content area */}
          <div className="md:hidden p-2 border-b bg-card"> {/* Mobile header */}
            <SidebarTrigger />
          </div>
          <div className="p-4 md:p-6">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
