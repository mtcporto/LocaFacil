
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ServiceItem as ServiceItemType } from "@/lib/mockData";
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, ConciergeBell } from 'lucide-react';

interface CartItem extends ServiceItemType {
  quantity: number;
}

const ServiceItemCard: React.FC<{ item: ServiceItemType; onQuantityChange: (id: string, quantity: number) => void; quantity: number }> = ({ item, onQuantityChange, quantity }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 0) val = 0;
    onQuantityChange(item.id, val);
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          {item.icon && <item.icon className="mr-2 h-5 w-5 text-primary" />}
          {item.name}
        </CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <p className="text-xl font-semibold text-primary">R$ {item.price.toFixed(2)}</p>
        <div className="flex items-center space-x-2">
          <label htmlFor={`quantity-${item.id}`} className="text-sm font-medium">Qtd:</label>
          <Input
            id={`quantity-${item.id}`}
            type="number"
            min="0"
            value={quantity}
            onChange={handleInputChange}
            className="w-20 h-9 text-center"
          />
        </div>
      </CardContent>
    </Card>
  );
};


export default function TenantServicesPage() {
  const { toast } = useToast();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [services, setServices] = useState<Array<ServiceItemType & {active: boolean}>>([]);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);

  useEffect(() => {
    fetch('/api/settings/payments').then(async response => {
      if (!response.ok) throw new Error();
      const data = await response.json() as {services?: Array<ServiceItemType & {active: boolean}>};
      setServices((data.services || []).filter(service => service.active));
    }).catch(() => toast({variant: 'destructive', title: 'Não foi possível carregar os serviços'}));
  }, [toast]);

  useEffect(() => {
    let currentTotal = 0;
    for (const serviceId in cart) {
      const service = services.find(s => s.id === serviceId);
      if (service && cart[serviceId] > 0) {
        currentTotal += service.price * cart[serviceId];
      }
    }
    setTotalAmount(currentTotal);
  }, [cart, services]);

  const handleQuantityChange = (id: string, quantity: number) => {
    setCart(prevCart => ({
      ...prevCart,
      [id]: quantity,
    }));
  };

  const handleCreatePayment = async () => {
    setIsCreatingPayment(true);
    try {
      const response = await fetch('/api/payments', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({kind: 'services', items: Object.entries(cart).filter(([, quantity]) => quantity > 0).map(([id, quantity]) => ({id, quantity}))})});
      const data = await response.json() as {checkoutUrl?: string; error?: string};
      if (!response.ok || !data.checkoutUrl) throw new Error(data.error || 'Não foi possível iniciar o pagamento.');
      window.location.assign(data.checkoutUrl);
    } catch (error) {
      toast({variant: 'destructive', title: 'Pagamento indisponível', description: error instanceof Error ? error.message : 'Tente novamente.'});
    } finally {
      setIsCreatingPayment(false);
    }
  };
  
  const hasItemsInCart = () => Object.values(cart).some(qty => qty > 0);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-primary mb-2 flex items-center">
          <ConciergeBell className="mr-3 h-8 w-8" />
          Solicitação de Serviços Adicionais
        </h1>
        <p className="text-muted-foreground">Precisa de uma cópia de chave ou um novo controle? Solicite aqui.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <ServiceItemCard 
            key={service.id} 
            item={service} 
            onQuantityChange={handleQuantityChange}
            quantity={cart[service.id] || 0}
          />
        ))}
      </div>

      {hasItemsInCart() && (
        <Card className="shadow-xl sticky bottom-4 bg-card border-primary border-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="mr-2 h-6 w-6 text-primary" />
              Resumo do Pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="space-y-1">
            {services.filter(s => cart[s.id] > 0).map(service => (
              <li key={service.id} className="flex justify-between items-center text-sm">
                <span>{service.name} (x{cart[service.id]})</span>
                <span>R$ {(service.price * cart[service.id]).toFixed(2)}</span>
              </li>
            ))}
            </ul>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total:</span>
                <span className="text-primary">R$ {totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg" disabled={totalAmount === 0 || isCreatingPayment} onClick={handleCreatePayment}>
              {isCreatingPayment ? 'Abrindo checkout...' : 'Solicitar e pagar com PIX ou cartão'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

    