"use client";

import React from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Switch} from "@/components/ui/switch";
import {useToast} from "@/hooks/use-toast";
import {Loader2, Save, Trash2} from "lucide-react";

type Service = {id: string; name: string; description: string; price: number; active: boolean};
type Settings = {rentAmount: number; rentDueDay: number; iptuAmount: number; iptuDueDay: number; tcrAmount: number; tcrDueDay: number; services: Service[]};

export default function PaymentSettingsForm() {
  const {toast} = useToast();
  const [settings, setSettings] = React.useState<Settings | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/settings/payments').then(async response => {
      if (!response.ok) throw new Error();
      const data = await response.json() as Omit<Settings, 'services'> & {services: Omit<Service, 'active'>[]};
      setSettings({...data, services: data.services.map(service => ({...service, active: true}))});
    }).catch(() => toast({variant: 'destructive', title: 'Não foi possível carregar', description: 'Verifique a conexão com o banco.'})).finally(() => setIsLoading(false));
  }, [toast]);

  const updateService = (index: number, change: Partial<Service>) => {
    setSettings(current => current && {...current, services: current.services.map((service, serviceIndex) => serviceIndex === index ? {...service, ...change} : service)});
  };

  const addService = () => {
    setSettings(current => current && {...current, services: [...current.services, {id: crypto.randomUUID(), name: '', description: '', price: 1, active: true}]});
  };

  const save = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings/payments', {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(settings)});
      if (!response.ok) throw new Error();
      toast({title: 'Configurações salvas', description: 'Valores, vencimento e serviços foram atualizados.'});
    } catch {
      toast({variant: 'destructive', title: 'Não foi possível salvar', description: 'Revise os campos e tente novamente.'});
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) return <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Carregando configurações...</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          Aluguel mensal (R$)
          <Input type="number" min="0.01" step="0.01" value={settings.rentAmount} onChange={event => setSettings({...settings, rentAmount: Number(event.target.value)})} />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Dia de vencimento
          <Input type="number" min="1" max="28" value={settings.rentDueDay} onChange={event => setSettings({...settings, rentDueDay: Number(event.target.value)})} />
          <span className="text-xs font-normal text-muted-foreground">Use um dia entre 1 e 28.</span>
        </label>
      </div>
      <div className="grid gap-4 border-t pt-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          IPTU (R$)
          <Input type="number" min="0.01" step="0.01" value={settings.iptuAmount} onChange={event => setSettings({...settings, iptuAmount: Number(event.target.value)})} />
          <span className="text-xs font-normal text-muted-foreground">Dia de vencimento</span>
          <Input type="number" min="1" max="28" value={settings.iptuDueDay} onChange={event => setSettings({...settings, iptuDueDay: Number(event.target.value)})} />
        </label>
        <label className="space-y-2 text-sm font-medium">
          TCR (R$)
          <Input type="number" min="0.01" step="0.01" value={settings.tcrAmount} onChange={event => setSettings({...settings, tcrAmount: Number(event.target.value)})} />
          <span className="text-xs font-normal text-muted-foreground">Dia de vencimento</span>
          <Input type="number" min="1" max="28" value={settings.tcrDueDay} onChange={event => setSettings({...settings, tcrDueDay: Number(event.target.value)})} />
        </label>
      </div>

      <div className="space-y-4 border-t pt-5">
        <div>
          <h3 className="text-lg font-medium">Serviços cobrados</h3>
          <p className="text-sm text-muted-foreground">Serviços inativos não aparecem para os locatários.</p>
        </div>
        {settings.services.map((service, index) => (
          <div key={service.id} className="grid gap-3 rounded-md border p-4 md:grid-cols-[1fr_1fr_120px_auto_auto] md:items-end">
            <label className="space-y-2 text-sm font-medium">Nome<Input value={service.name} onChange={event => updateService(index, {name: event.target.value})} /></label>
            <label className="space-y-2 text-sm font-medium">Descrição<Input value={service.description} onChange={event => updateService(index, {description: event.target.value})} /></label>
            <label className="space-y-2 text-sm font-medium">Preço (R$)<Input type="number" min="0.01" step="0.01" value={service.price} onChange={event => updateService(index, {price: Number(event.target.value)})} /></label>
            <label className="flex items-center gap-2 pb-2 text-sm"><Switch checked={service.active} onCheckedChange={active => updateService(index, {active})} /> Ativo</label>
            <Button type="button" variant="ghost" size="icon" aria-label="Remover serviço" onClick={() => setSettings({...settings, services: settings.services.filter((_, serviceIndex) => serviceIndex !== index)})}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addService}>Adicionar serviço</Button>
      </div>

      <Button type="button" onClick={save} disabled={isSaving}>
        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        Salvar configurações de cobrança
      </Button>
    </div>
  );
}
