
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockServices, type ServiceItem as ServiceItemType } from "@/lib/mockData";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Trash2, Copy, Check, ConciergeBell } from 'lucide-react';

const PIX_KEY = "08.315.079/0001-51"; // CNPJ
const PIX_KEY_TYPE = "CNPJ";

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
  const [isPixCopied, setIsPixCopied] = React.useState(false);

  useEffect(() => {
    let currentTotal = 0;
    for (const serviceId in cart) {
      const service = mockServices.find(s => s.id === serviceId);
      if (service && cart[serviceId] > 0) {
        currentTotal += service.price * cart[serviceId];
      }
    }
    setTotalAmount(currentTotal);
  }, [cart]);

  const handleQuantityChange = (id: string, quantity: number) => {
    setCart(prevCart => ({
      ...prevCart,
      [id]: quantity,
    }));
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsPixCopied(true);
      toast({ title: "Chave PIX copiada!", description: "Use no seu app bancário." });
      setTimeout(() => setIsPixCopied(false), 3000);
    } catch (err) {
      toast({ variant: "destructive", title: "Erro ao copiar", description: "Não foi possível copiar a chave PIX." });
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
        {mockServices.map(service => (
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
            {mockServices.filter(s => cart[s.id] > 0).map(service => (
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full" size="lg" disabled={totalAmount === 0}>
                  Solicitar e Pagar com PIX
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Pagamento via PIX</AlertDialogTitle>
                  <AlertDialogDescription>
                    Para concluir seu pedido de serviços no valor de <strong className="text-foreground">R$ {totalAmount.toFixed(2)}</strong>, utilize a chave PIX abaixo em seu aplicativo bancário.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="my-4 p-4 bg-secondary rounded-md space-y-2">
                  <p className="text-sm text-muted-foreground">Chave PIX ({PIX_KEY_TYPE}):</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-mono text-primary break-all">{PIX_KEY}</p>
                    <Button variant="ghost" size="sm" onClick={() => handleCopyToClipboard(PIX_KEY)}>
                      {isPixCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      <span className="ml-2">{isPixCopied ? "Copiada!" : "Copiar"}</span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Beneficiário: CONSTRUTORA EARLEN LTDA</p>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                      toast({ title: "Pedido de Serviço Registrado!", description: "Seu pedido foi enviado e o pagamento está sendo processado (simulação)." });
                      setCart({}); // Limpa o carrinho após o "pagamento"
                  }}>
                    Já Paguei
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

    