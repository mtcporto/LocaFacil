
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CalendarDays, UserCircle, Home, Download, Landmark } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import React from "react";
import { getTenantById, getPropertyById, type Tenant, type Property } from "@/lib/mockData";

// Simulação do ID do inquilino logado. Em um app real, viria do contexto de autenticação.
const MOCK_LOGGED_IN_TENANT_ID = 't2'; // Patrícia Medeiros Cantisani

const constructorDetails = {
  nome: "CONSTRUTORA EARLEN LTDA",
  cnpj: "08.315.079/0001-51",
  enderecoCompleto: "Avenida Flávio Ribeiro Coutinho, 707, Manaíra, João Pessoa, Paraíba",
  // Adicionar outros dados se necessário para o contrato
};

const formatDateForDisplay = (dateString: string | undefined): string => {
  if (!dateString) return '-';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) -1; // Month is 0-indexed
  const day = parseInt(parts[2], 10);
  const localDate = new Date(year, month, day);
  return localDate.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatDateForContract = (dateString: string | undefined): string => {
  if (!dateString) return 'Data não definida';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
  const day = parseInt(parts[2], 10);
  const date = new Date(year, month, day);
  
  const dayFormatted = date.getDate();
  const monthFormatted = date.toLocaleDateString('pt-BR', { month: 'long' });
  const yearFormatted = date.getFullYear();
  return `${dayFormatted} de ${monthFormatted} de ${yearFormatted}`;
};

const getLeaseTemplate = (tenant: Tenant, property: Property) => {
  const contractStartDateFormatted = formatDateForContract(tenant.leaseStartDate);
  const contractEndDateFormatted = formatDateForContract(tenant.leaseEndDate);
  const todayFormatted = formatDateForContract(new Date().toISOString().split('T')[0]); // Data da "assinatura"

  // Calcula a duração do contrato em meses
  let durationMonths = 6; // Padrão do contrato
  if (tenant.leaseStartDate && tenant.leaseEndDate) {
    const start = new Date(tenant.leaseStartDate);
    const end = new Date(tenant.leaseEndDate);
    // Adiciona 1 dia ao final para incluir o último mês corretamente no cálculo de diferença
    // já que o contrato termina em 14/04 (inclusive), não 15/04 (exclusive)
    const adjustedEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1);

    durationMonths = (adjustedEnd.getFullYear() - start.getFullYear()) * 12 + (adjustedEnd.getMonth() - start.getMonth());
    if (durationMonths <= 0) durationMonths = 6; // Fallback se o cálculo for inesperado
  }


  return `
CONTRATO DE LOCAÇÃO DE IMÓVEL

LOCADORA: ${constructorDetails.nome}, pessoa jurídica de direito privado, inscrita no CNPJ/MF sob o n.° ${constructorDetails.cnpj}, estabelecida na ${constructorDetails.enderecoCompleto}, doravante nominada LOCADORA.

LOCATÁRIO(A): ${tenant.name}, brasileira, casada, jornalista, portadora da cédula de identidade nº [RG_LOCATARIO] 2ª via 2SSP/PB, inscrita no CPF/MF nº ${tenant.cpf} e seu esposo Marco Tulio Cicero de Mesquita Porto, brasileiro, portador da cédula de identidade nº [RG_CONJUGE_LOCATARIO] 2ª via, inscrito no CPF/MF nº [CPF_CONJUGE_LOCATARIO], residentes e domiciliados na ${property.address} Apto ${tenant.apartmentUnit} ${property.city} - CEP: ${property.zip} - ${property.state}, Fone: ${tenant.phone} e-mail: ${tenant.email} doravante nominado(a) LOCATÁRIO(A).

CLÁUSULA 1ª – OBJETO DO CONTRATO

1.1. O presente contrato tem como OBJETO o imóvel de propriedade da LOCADORA, situado na ${property.address} - Apto. ${tenant.apartmentUnit} - ${property.name}, ${property.city}, ${property.state} - CEP: ${property.zip}.

CLÁUSULA 2ª – CARACTERÍSTICAS DO IMÓVEL

2.1. As características do imóvel são de conhecimento do(a) LOCATÁRIO(A), que declara aceitar as mesmas, reconhecendo sua perfeita condição de uso e habitação.

CLÁUSULA 3ª – DESTINAÇÃO DO IMÓVEL

3.1. A presente locação destina-se exclusivamente ao uso residencial pelo(a) LOCATÁRIO(A). Qualquer uso diferente do previsto requer autorização expressa e por escrito da LOCADORA, sob pena de incidir os efeitos do artigo 570 do CÓDIGO CIVIL.

3.2. O(A) LOCATÁRIO(A) não poderá ceder, sublocar ou emprestar o imóvel, total ou parcialmente, sem o consentimento expresso e por escrito da LOCADORA.

CLÁUSULA 4ª – PRAZO DE LOCAÇÃO

4.1. O contrato terá a duração de ${durationMonths} (seis) meses, com início a partir de ${contractStartDateFormatted} e término em ${contractEndDateFormatted}, se renovando automaticamente por igual período, caso haja interesse das partes, que deverão comunicar expressamente 60 (sessenta) dias antes da data de término.

4.2. Em caso de renovação automática, o(a) LOCATÁRIO(A) poderá denunciar o contrato mediante aviso por escrito com antecedência mínima de 60 (sessenta) dias, sob pena de pagamento de 1,5 meses de alugueis e encargos vigentes.

4.3. A LOCADORA poderá denunciar o contrato se este for renovado automaticamente, notificando o(a) LOCATÁRIO(A) para desocupar o imóvel em 30 dias.

CLÁUSULA 5ª – RETRIBUIÇÃO DO CONTRATO

5.1. O valor mensal da locação será de R$ ${property.rent_amount.toFixed(2)} (novecentos e cinquenta reais) e deve ser pago até o dia 15 (quinze) de cada mês. Se esta data cair em dia não útil, o vencimento será prorrogado para o primeiro dia útil seguinte.

5.2. Em caso de atraso, o(a) LOCATÁRIO(A) pagará multa de 10% sobre o valor do débito, além de correção monetária e juros moratórios de 1% (um por cento) ao mês; observando-se a inadimplência no pagamento do aluguel mensal, dentro do prazo estabelecido neste contrato, fica a CONSTRUTORA EARLEN LTDA, desde já, autorizada a emitir TÍTULO DE CRÉDITO em nome dos coobrigações (LOCATÁRIO/FIADOR), abaixo assinados, representativo do valor do aluguel e mais despesas inerentes. Não havendo pagamento do débito incluimos seus nomes no serviço de proteção de crédito ou similares.

5.3. Após 90 dias de inadimplência, a LOCADORA poderá rescindir unilateralmente o contrato e exigir a desocupação no prazo de 30 (trinta) dias, mediante notificação prévia do(a) LOCATÁRIO(A) para purgar a mora, sem prejuízo da cobrança judicial do débito, acrescido de multa, juros e honorários legais.

CLÁUSULA 6ª – REAJUSTE DA RETRIBUIÇÃO

6.1. O valor da retribuição mensal será reajustado a partir do 13º mês de locação e a cada 12 meses, de acordo com o índice de maior variação entre o IGPM (Índice Geral de Preços do Mercado) ou IPCA (Índice de Preços ao Consumidor Amplo) IPC-FIP (Índice de Preços ao Consumidor), INPC-IBGE (Índice Nacional de Preço ao Consumidor), ou livre negociação entre as partes.

6.2. Na falta dos mencionados índices, na sua extinção ou se, por algum motivo, tornar-se impraticável sua aplicação, os aluguéis passarão a ser reajustados por outro indicador autorizado pela legislação em vigor, cuja escolha ficará a critério da LOCADORA.

CLÁUSULA 7ª – BENFEITORIAS

7.1. O(A) LOCATÁRIO(A) deve obter autorização por escrito da LOCADORA para realizar benfeitorias necessárias, úteis e voluptuárias no imóvel. Caso seja necessário realizar qualquer serviço no imóvel locado, o(a) LOCATÁRIO(A) deverá apresentar os projetos correspondentes, acompanhados de Anotação de Responsabilidade Técnica (ART) emitida por engenheiro civil devidamente registrado no (CREA) e Laudo Técnico.

7.2. O(A) LOCATÁRIO(A) renuncia qualquer direito de retenção sobre essas benfeitorias, caso o(a) LOCADOR(A) não exija do(a) LOCATÁRIO(A) a reposição do imóvel no estado em que este o recebeu, para tal aqui declara, conhecer a planta arquitetônica original do referido imóvel locado.

7.3. Colocação de luminosos, placas, letreiros, cartazes e quaisquer outros só com autorização prévia e por escrito da LOCADORA.

CLÁUSULA 8ª – DEVERES DA LOCADORA

8.1. A LOCADORA deve entregar o imóvel em condições adequadas para o uso residencial. Deve garantir o uso pacífico do imóvel durante a locação, manter sua forma e destino, responder por vícios ou defeitos anteriores à locação e fornecer descrição minuciosa do estado do imóvel na entrega.

CLÁUSULA 9ª – DEVERES DO LOCATÁRIO

9.1. O(A) LOCATÁRIO(A) deve pagar pontualmente o aluguel e os encargos, usar o imóvel conforme o previsto, cuidar dele como se fosse seu, notificar a LOCADORA de danos ou defeitos, realizar reparos nos danos causados por ele, não modificar o imóvel sem autorização, entre outras obrigações listadas no contrato.

9.2. Além do aluguel, obriga-se o(a) LOCATÁRIO(A) a efetuar o pagamento dos seguintes encargos:

a) IPTU e TCR; b) Consumo de energia elétrica; c) Demais encargos ou tributos que venham a incidir sobre o imóvel.

CLÁUSULA 10ª – DAS PENALIDADES E MULTAS CONTRATUAIS

10.1. Na hipótese de infração de qualquer das cláusulas ou disposições deste contrato, a parte infratora, ressalvada previsão de multa específica no presente contrato, ficará obrigada a pagar a parte prejudicada uma multa correspondente a 1,5 aluguéis mensais vigentes a época da efetiva satisfação da penalidade, observada a proporcionalidade contida no artigo 4º da Lei 8.245/91, podendo, ainda, a parte inocente, se o desejar, considerar rescindido o presente contrato.

10.2. Caso deseje o(a) LOCATÁRIO(A) devolver o imóvel antes do término da vigência pactuada, poderá fazê-lo, desde que pague, PREVIAMENTE, a multa estipulada na cláusula 10.1, proporcionalmente ao período de cumprimento do contrato, nos termos do art. 4º da Lei nº 8.245/91 (Lei do Inquilinato), além dos encargos vigentes no momento da rescisão.

CLÁUSULA 11ª – GARANTIAS LOCATÍCIAS

11.1. O contrato conta com garantia pessoal através de fiança prestada por Pedro Rafael Diniz Marinho, brasileiro, casado, contador, professor, portador da cédula de identidade nº 3.081.721 2ª via SSP/PB, inscrito no CPF/MF nº 079.374.854-26, e sua esposa Emanuelle Waleska Almeida de Farias, brasileira, portadora da cédula de identidade nº 3.025.404 2ª via, inscrita no CPF/MF nº 058.243.154-93 residentes e domiciliados na Rua Desportista Jose de Farias, 00237- Edf Ksdoshi, apto 101 - Altiplano Cabo Branco – CEP: 58.030-001 João Pessoa, Paraíba, Fone:(83) 99676-8715, e-mail: Pedro.Rafael.marinho@gmail.com Esta fiança é solidária e perdura mesmo após o término do prazo contratual.

CLÁUSULA 12ª – LEGISLAÇÃO APLICÁVEL

12.1. Em caso de omissão, aplica-se a Lei 8.245 (Lei do Inquilinato), de 18 de outubro de 1991.

CLÁUSULA 13ª – PROCEDIMENTO LEGAL

13.1. Citações, intimações e notificações em procedimentos judiciais poderão ser realizadas conforme o artigo 58, inciso IV, da Lei nº 8.245, de 18 de outubro de 1991.

CLÁUSULA 14ª – ELEIÇÃO DE FORO

14.1. As partes elegem o foro da Comarca de João Pessoa, capital do Estado da Paraíba, para dirimir quaisquer questões decorrentes deste contrato, renunciando a qualquer outro foro.

E, por estarem assim de pleno acordo, as partes declaram que tomaram ciência de todas as cláusulas constantes no presente contrato, analisando-as em todos os seus termos, concordando com as mesmas, assinando o presente instrumento elaborado em 3 (três) vias, o qual é também assinado por duas testemunhas.

João Pessoa, ${todayFormatted}.

CONSTRUTORA EARLEN LTDA LOCADORA

LOCATÁRIO(A) CÔNJUGE

FIADOR(A) CÔNJUGE

TESTEMUNHAS:

Nome: CPF:

Nome: CPF:
`;
};


export default function TenantLeasePage() {
  const [tenant, setTenant] = React.useState<Tenant | null>(null);
  const [property, setProperty] = React.useState<Property | null>(null);
  const [fullContractText, setFullContractText] = React.useState<string>("");

  React.useEffect(() => {
    const currentTenant = getTenantById(MOCK_LOGGED_IN_TENANT_ID);
    if (currentTenant) {
      setTenant(currentTenant);
      const currentProperty = getPropertyById(currentTenant.propertyId);
      if (currentProperty) {
        setProperty(currentProperty);
      }
    }
  }, []);


  const leaseDetails = tenant && property ? {
    propertyName: `${property.name} - Unidade ${tenant.apartmentUnit}`,
    address: `${property.address}, ${property.city}, ${property.state}`,
    tenantName: tenant.name,
    landlordName: constructorDetails.nome,
    leaseStartDate: tenant.leaseStartDate,
    leaseEndDate: tenant.leaseEndDate,
    rentAmount: property.rent_amount,
    rentDueDate: "Dia 15 de cada mês", // Conforme contrato
    securityDeposit: 0, // Contrato não especifica, ou pode ser calculado (ex: 2x aluguel)
  } : null;


  const handleShowContract = () => {
    if (tenant && property) {
      const contractText = getLeaseTemplate(tenant, property);
      setFullContractText(contractText);
      // O AlertDialog será aberto pelo AlertDialogTrigger
    }
  };
  
  if (!tenant || !property || !leaseDetails) {
    return (
      <div className="space-y-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Detalhes do Meu Contrato</h1>
        <p className="text-muted-foreground">Carregando dados do contrato...</p>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-primary mb-2">Detalhes do Meu Contrato</h1>
        <p className="text-muted-foreground">Revise os termos e condições do seu contrato de locação atual.</p>
      </section>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-6 w-6 text-primary" />
            Resumo do Contrato de Locação
          </CardTitle>
          <CardDescription>
            Imóvel: {leaseDetails.propertyName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <h3 className="font-medium text-foreground flex items-center"><Home className="h-5 w-5 mr-2 text-accent"/>Endereço do Imóvel</h3>
              <p className="text-sm text-muted-foreground">{leaseDetails.address}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground flex items-center"><UserCircle className="h-5 w-5 mr-2 text-accent"/>Inquilino</h3>
              <p className="text-sm text-muted-foreground">{leaseDetails.tenantName}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground flex items-center"><Landmark className="h-5 w-5 mr-2 text-accent"/>Proprietário/Agente</h3>
              <p className="text-sm text-muted-foreground">{leaseDetails.landlordName}</p>
            </div>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <h3 className="font-medium text-foreground flex items-center"><CalendarDays className="h-5 w-5 mr-2 text-accent"/>Data de Início do Contrato</h3>
              <p className="text-sm text-muted-foreground">{formatDateForDisplay(leaseDetails.leaseStartDate)}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground flex items-center"><CalendarDays className="h-5 w-5 mr-2 text-accent"/>Data de Término do Contrato</h3>
              <p className="text-sm text-muted-foreground">{formatDateForDisplay(leaseDetails.leaseEndDate)}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">Aluguel Mensal</h3>
              <p className="text-sm text-muted-foreground">R$ {leaseDetails.rentAmount.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">Data de Vencimento do Aluguel</h3>
              <p className="text-sm text-muted-foreground">{leaseDetails.rentDueDate}</p>
            </div>
            {leaseDetails.securityDeposit > 0 && (
              <div className="space-y-1">
                <h3 className="font-medium text-foreground">Depósito de Segurança</h3>
                <p className="text-sm text-muted-foreground">R$ {leaseDetails.securityDeposit.toFixed(2)}</p>
              </div>
            )}
          </div>
          
          <Separator />

          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full md:w-auto" onClick={handleShowContract}>
                  <Download className="mr-2 h-4 w-4" /> Mostrar Contrato Completo
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-3xl"> {/* Aumentar a largura do diálogo */}
                <AlertDialogHeader>
                  <AlertDialogTitle>Contrato de Locação Completo</AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="max-h-[60vh] overflow-y-auto text-xs bg-secondary/30 p-4 rounded-md border mt-2">
                      <pre style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{fullContractText}</pre>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Fechar</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-xs text-muted-foreground mt-2">
              Observação: Este é um resumo. Para os termos completos, consulte o contrato acima.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

