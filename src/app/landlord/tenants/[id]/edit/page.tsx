
"use client";

import AddTenantForm from "@/components/tenant/AddTenantForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserCog } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTenantById, type Tenant } from "@/lib/mockData";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditTenantPage() {
  const params = useParams();
  const router = useRouter();
  const [tenant, setTenant] = useState<Tenant | null | undefined>(undefined); // undefined for loading state

  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      const foundTenant = getTenantById(id);
      setTenant(foundTenant || null); // null if not found
    }
  }, [id]);

  if (tenant === undefined) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center">
            <UserCog className="mr-3 h-8 w-8" /> <Skeleton className="h-8 w-64" />
          </h1>
          <Button variant="outline" asChild>
            <Link href="/landlord/tenants">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Inquilinos
            </Link>
          </Button>
        </div>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
            <CardDescription><Skeleton className="h-4 w-full max-w-md" /></CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (tenant === null) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold text-destructive">Inquilino não encontrado</h1>
        <p className="text-muted-foreground mt-2">O inquilino com o ID fornecido não foi encontrado.</p>
        <Button asChild variant="link" className="mt-6 text-primary">
          <Link href="/landlord/tenants">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a lista de inquilinos
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center">
            <UserCog className="mr-3 h-8 w-8" />
            Editar Inquilino: {tenant.name}
          </h1>
          <p className="text-muted-foreground">Modifique os detalhes do inquilino e do contrato.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/landlord/tenants">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Inquilinos
          </Link>
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Detalhes do Inquilino e Contrato</CardTitle>
          <CardDescription>Atualize as informações conforme necessário.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddTenantForm tenantToEdit={tenant} />
        </CardContent>
      </Card>
    </div>
  );
}
