
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ConstructorInfoForm from "@/components/settings/ConstructorInfoForm";
import { Settings } from "lucide-react";

export default function LandlordSettingsPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-primary mb-2 flex items-center">
          <Settings className="mr-3 h-8 w-8" />
          Configurações da Construtora
        </h1>
        <p className="text-muted-foreground">
          Gerencie as informações de contato e detalhes da sua construtora que serão exibidos na plataforma.
        </p>
      </section>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Informações de Contato</CardTitle>
          <CardDescription>
            Atualize os dados da construtora. Estas informações serão exibidas no rodapé e em outras áreas relevantes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConstructorInfoForm />
        </CardContent>
      </Card>
    </div>
  );
}
