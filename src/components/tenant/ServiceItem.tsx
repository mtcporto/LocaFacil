
// Este arquivo não será mais necessário, pois a lógica foi incorporada em src/app/tenant/services/page.tsx como ServiceItemCard.
// Deixando este arquivo vazio para que seja removido pelo sistema, ou você pode deletá-lo manualmente.
// Se for manter um componente separado para ServiceItemCard, ele seria algo como o abaixo, mas por ora, está na página.
/*
"use client";

import type React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ServiceItem as ServiceItemType } from "@/lib/mockData"; // Supondo que você exportou o tipo

interface ServiceItemProps {
  item: ServiceItemType;
  quantity: number;
  onQuantityChange: (id: string, quantity: number) => void;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ item, quantity, onQuantityChange }) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 0) val = 0; // Garante que seja um número não negativo
    // Se quiser um máximo, adicione: if (val > MAX_QUANTITY) val = MAX_QUANTITY;
    onQuantityChange(item.id, val);
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">
          {item.icon && <item.icon className="inline-block mr-2 h-5 w-5 text-primary" /> }
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

export default ServiceItem;
*/

    