import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { mockApi } from '@/services/mockApi'
import { Quotation } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { ArrowLeft, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function Comparison() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ids = searchParams.get('ids')?.split(',') || []
    if (ids.length === 0) {
      navigate('/history')
      return
    }

    const loadData = async () => {
      const all = await mockApi.getQuotations()
      const selected = all.filter((q) => ids.includes(q.id))
      setQuotations(selected)
      setLoading(false)
    }
    loadData()
  }, [searchParams, navigate])

  const removeQuotation = (id: string) => {
    const newQuotations = quotations.filter((q) => q.id !== id)
    if (newQuotations.length < 2) {
      navigate('/history')
    } else {
      setQuotations(newQuotations)
    }
  }

  if (loading) return <div className="p-8">Carregando comparação...</div>

  const metrics = [
    { label: 'Nome', key: 'name', format: (v: any) => v },
    {
      label: 'Origem -> Destino',
      key: 'route',
      format: (_: any, q: Quotation) => `${q.originUf} -> ${q.destinationUf}`,
    },
    { label: 'Distância', key: 'distance', format: (v: any) => `${v} km` },
    {
      label: 'Tipo de Carga',
      key: 'cargoType',
      format: (v: any) => <span className="capitalize">{v}</span>,
    },
    {
      label: 'Valor NF',
      key: 'invoiceValue',
      format: (v: number) =>
        `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    },
    {
      label: 'Frete Final',
      key: 'finalFreight',
      highlight: true,
      format: (v: number) =>
        `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    },
    {
      label: 'Margem %',
      key: 'grossMarginPercent',
      highlight: true,
      format: (v: number) => (
        <span
          className={
            v >= 10 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'
          }
        >
          {v.toFixed(2)}%
        </span>
      ),
    },
    {
      label: 'Custos Totais',
      key: 'totalOperationalCosts',
      format: (v: number) =>
        `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    },
    {
      label: 'ICMS',
      key: 'icmsValue',
      format: (v: number) =>
        `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/history')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          Comparativo de Cotações
        </h2>
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-4 p-4">
          {/* Labels Column */}
          <div className="w-48 flex-shrink-0 space-y-4 pt-12">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="h-12 flex items-center font-medium text-muted-foreground border-b"
              >
                {metric.label}
              </div>
            ))}
          </div>

          {/* Quotation Columns */}
          {quotations.map((quotation) => (
            <Card key={quotation.id} className="w-72 flex-shrink-0 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-6 w-6"
                onClick={() => removeQuotation(quotation.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg truncate pr-6">
                  {quotation.name}
                </CardTitle>
                <Badge
                  variant={quotation.isViable ? 'default' : 'destructive'}
                  className="w-fit"
                >
                  {quotation.isViable ? 'Viável' : 'Inviável'}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {metrics.map((metric) => (
                  <div
                    key={`${quotation.id}-${metric.label}`}
                    className={`h-12 flex items-center border-b ${metric.highlight ? 'bg-muted/30 -mx-6 px-6' : ''}`}
                  >
                    {metric.format((quotation as any)[metric.key], quotation)}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
