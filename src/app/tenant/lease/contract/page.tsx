"use client";

import Link from "next/link";
import React from "react";
import {ArrowLeft, FileText, Printer} from "lucide-react";
import {Button} from "@/components/ui/button";
import {getPropertyById, getTenantById, type Property, type Tenant} from "@/lib/mockData";
import {getLeaseTemplate} from "@/lib/leaseContract";

const MOCK_LOGGED_IN_TENANT_ID = 't2';

export default function TenantLeaseContractPage() {
  const [tenant, setTenant] = React.useState<Tenant | null>(null);
  const [property, setProperty] = React.useState<Property | null>(null);

  React.useEffect(() => {
    const currentTenant = getTenantById(MOCK_LOGGED_IN_TENANT_ID);
    if (!currentTenant) return;
    setTenant(currentTenant);
    setProperty(getPropertyById(currentTenant.propertyId) || null);
  }, []);

  if (!tenant || !property) {
    return <main className="contract-page p-8 text-center text-slate-950">Carregando contrato...</main>;
  }

  const contractText = getLeaseTemplate(tenant, property);

  return (
    <main className="contract-page min-h-screen bg-white px-4 py-6 text-slate-950 sm:px-8 print:px-0 print:py-0">
      <div className="contract-actions mx-auto mb-6 flex max-w-4xl items-center justify-between gap-3 print:hidden">
        <Button variant="outline" asChild>
          <Link href="/tenant/lease"><ArrowLeft className="mr-2 h-4 w-4" />Voltar ao contrato</Link>
        </Button>
        <Button onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Imprimir / Salvar PDF</Button>
      </div>

      <article className="mx-auto max-w-4xl border border-slate-300 bg-white px-6 py-8 shadow-sm sm:px-12 sm:py-12 print:max-w-none print:border-0 print:px-12 print:py-8 print:shadow-none">
        <header className="mb-10 border-b-2 border-slate-900 pb-6 text-center">
          <FileText className="mx-auto mb-3 h-8 w-8 text-slate-900" />
          <h1 className="text-2xl font-bold tracking-wide text-slate-950">CONTRATO DE LOCAÇÃO DE IMÓVEL</h1>
          <p className="mt-2 text-sm text-slate-700">Documento contratual completo</p>
        </header>
        <pre className="contract-text whitespace-pre-wrap font-serif text-[15px] leading-7 text-slate-950">{contractText}</pre>
      </article>
    </main>
  );
}
