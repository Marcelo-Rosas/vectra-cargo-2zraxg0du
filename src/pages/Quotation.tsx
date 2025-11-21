import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { calcularFreteLotacao } from '@/services/calculo-lotacao'
import { QuotationService } from '@/services/quotation'
import { QuotationResult } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MaskedInput } from '@/components/ui/masked-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Loader2, Save, FileDown, Calculator } from 'lucide-react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts'
import { useAuthStore } from '@/stores/useAuthStore'

const formSchema = z.object({
  name: z.string().optional(),
  cargoType: z.enum(['lotacao', 'fracionada', 'container']),
  originUf: z.string().min(2, 'Selecione a UF'),
  destinationUf: z.string().min(2, 'Selecione a UF'),
  originCep: z.string().min(8, 'CEP inválido').optional(),
  destinationCep: z.string().min(8, 'CEP inválido').optional(),
  distance: z.coerce.number().min(1, 'Distância obrigatória'),
  vehicleType: z.string().optional(),
  weight: z.coerce.number().min(1, 'Peso obrigatório'),
  invoiceValue: z.coerce.number().min(1, 'Valor da NF obrigatório'),
  useTable: z.boolean().default(true),
  applyTaxOnCosts: z.boolean().default(false),
  applyMarkup: z.boolean().default(false),
  suggestedFreight: z.coerce.number().optional(),
  informedFreight: z.coerce.number().optional(),
  loadingCost: z.coerce.number().optional(),
  unloadingCost: z.coerce.number().optional(),
  equipmentRent: z.coerce.number().optional(),
  toll: z.coerce.number().optional(),
})

const UFS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
]

export default function Quotation() {
  const [result, setResult] = useState<QuotationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { user } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cargoType: 'lotacao',
      useTable: true,
      applyTaxOnCosts: false,
      applyMarkup: false,
    },
  })

  const useTable = form.watch('useTable')

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsCalculating(true)
    try {
      const data = await calcularFreteLotacao(values as any)
      setResult(data)
      toast.success('Cotação calculada com sucesso!')

      if (data.grossMarginPercent < 10) {
        toast.warning(
          `Atenção: Margem bruta baixa (${data.grossMarginPercent.toFixed(1)}%) para esta cotação.`,
          { duration: 6000 },
        )
      }
    } catch (error: any) {
      toast.error(`Erro ao calcular cotação: ${error.message}`)
    } finally {
      setIsCalculating(false)
    }
  }

  const handleSave = async () => {
    if (!result || !user) {
      if (!user) toast.error('Você precisa estar logado para salvar.')
      return
    }

    setIsSaving(true)
    const values = form.getValues()
    try {
      await QuotationService.save({
        ...values,
        ...result,
        userId: user.id,
        isFavorite: false,
        status: 'saved',
      } as any)
      toast.success(`Cotação '${values.name || 'Sem nome'}' salva com sucesso.`)
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar cotação')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12 animate-fade-in">
      <div className="lg:col-span-7 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Nova Cotação</CardTitle>
            <CardDescription>
              Preencha os dados para calcular o frete.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Identificação */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Cotação (Opcional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Carga SP-RJ Cliente X"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cargoType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Carga</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="lotacao">Lotação</SelectItem>
                            <SelectItem value="fracionada">
                              Fracionada
                            </SelectItem>
                            <SelectItem value="container">Container</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Rota */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="originCep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP Origem</FormLabel>
                        <FormControl>
                          <MaskedInput
                            mask="cep"
                            placeholder="00000-000"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="originUf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UF Origem</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="UF" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {UFS.map((uf) => (
                              <SelectItem key={uf} value={uf}>
                                {uf}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="destinationCep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP Destino</FormLabel>
                        <FormControl>
                          <MaskedInput
                            mask="cep"
                            placeholder="00000-000"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="destinationUf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UF Destino</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="UF" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {UFS.map((uf) => (
                              <SelectItem key={uf} value={uf}>
                                {uf}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="distance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distância (km)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Carga */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="invoiceValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor NF (R$)</FormLabel>
                        <FormControl>
                          <MaskedInput
                            mask="currency"
                            placeholder="R$ 0,00"
                            {...field}
                            onValueChange={(val) => field.onChange(val)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Veículo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="truck">Truck</SelectItem>
                            <SelectItem value="carreta">Carreta</SelectItem>
                            <SelectItem value="vuc">VUC</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Configurações */}
                <div className="flex flex-col md:flex-row gap-6">
                  <FormField
                    control={form.control}
                    name="useTable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm w-full">
                        <div className="space-y-0.5">
                          <FormLabel>Usar Tabela NTC</FormLabel>
                          <FormDescription>
                            Calcular base na tabela
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="applyTaxOnCosts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm w-full">
                        <div className="space-y-0.5">
                          <FormLabel>Impostos em Custos</FormLabel>
                          <FormDescription>Aplicar na base</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Valores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {useTable ? (
                    <FormField
                      control={form.control}
                      name="suggestedFreight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frete Sugerido (Tabela)</FormLabel>
                          <FormControl>
                            <MaskedInput
                              mask="currency"
                              placeholder="R$ 0,00"
                              {...field}
                              onValueChange={(val) => field.onChange(val)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="informedFreight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frete Informado (Manual)</FormLabel>
                          <FormControl>
                            <MaskedInput
                              mask="currency"
                              placeholder="R$ 0,00"
                              {...field}
                              onValueChange={(val) => field.onChange(val)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <Separator />
                <h3 className="text-lg font-medium">Custos Operacionais</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="loadingCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carga (R$)</FormLabel>
                        <FormControl>
                          <MaskedInput
                            mask="currency"
                            placeholder="R$ 0,00"
                            {...field}
                            onValueChange={(val) => field.onChange(val)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unloadingCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descarga (R$)</FormLabel>
                        <FormControl>
                          <MaskedInput
                            mask="currency"
                            placeholder="R$ 0,00"
                            {...field}
                            onValueChange={(val) => field.onChange(val)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="equipmentRent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipamento (R$)</FormLabel>
                        <FormControl>
                          <MaskedInput
                            mask="currency"
                            placeholder="R$ 0,00"
                            {...field}
                            onValueChange={(val) => field.onChange(val)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="toll"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pedágio (R$)</FormLabel>
                        <FormControl>
                          <MaskedInput
                            mask="currency"
                            placeholder="R$ 0,00"
                            {...field}
                            onValueChange={(val) => field.onChange(val)}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Deixe 0 para cálculo automático
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isCalculating}
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                      Calculando...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-4 w-4" /> Calcular Frete
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-5 space-y-6">
        {result ? (
          <div className="space-y-6 animate-slide-up">
            <Card className="bg-primary text-primary-foreground border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Resultado da Cotação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-primary-foreground/80">
                    Frete Final
                  </span>
                  <span className="text-4xl font-bold">
                    R${' '}
                    {result.finalFreight.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <Separator className="bg-primary-foreground/20" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-primary-foreground/80">
                      Margem Bruta
                    </span>
                    <div className="text-xl font-semibold">
                      R${' '}
                      {result.grossMarginValue.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-primary-foreground/80">
                      Margem %
                    </span>
                    <div
                      className={`text-xl font-bold ${result.isViable ? 'text-green-300' : 'text-red-300'}`}
                    >
                      {result.grossMarginPercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${result.isViable ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}
                  >
                    {result.isViable
                      ? '✅ Operação Viável'
                      : '❌ Operação Inviável'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Composição do Frete</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: { label: 'Valor', color: 'hsl(var(--primary))' },
                  }}
                  className="h-[200px]"
                >
                  <BarChart
                    data={[
                      {
                        name: 'Receita',
                        value: result.calculatedRevenue,
                        fill: 'hsl(var(--primary))',
                      },
                      {
                        name: 'Custos',
                        value: result.totalOperationalCosts,
                        fill: 'hsl(var(--destructive))',
                      },
                      {
                        name: 'Impostos',
                        value:
                          result.icmsValue +
                          result.pisValue +
                          result.cofinsValue,
                        fill: 'hsl(var(--chart-4))',
                      },
                      {
                        name: 'Margem',
                        value: result.grossMarginValue,
                        fill: 'hsl(var(--chart-2))',
                      },
                    ]}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      className="text-xs"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      className="text-xs"
                      tickFormatter={(v) => `R$${v}`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {[
                        {
                          name: 'Receita',
                          value: result.calculatedRevenue,
                          fill: 'hsl(var(--primary))',
                        },
                        {
                          name: 'Custos',
                          value: result.totalOperationalCosts,
                          fill: 'hsl(var(--destructive))',
                        },
                        {
                          name: 'Impostos',
                          value:
                            result.icmsValue +
                            result.pisValue +
                            result.cofinsValue,
                          fill: 'hsl(var(--chart-4))',
                        },
                        {
                          name: 'Margem',
                          value: result.grossMarginValue,
                          fill: 'hsl(var(--chart-2))',
                        },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Receita Calculada
                  </span>
                  <span>R$ {result.calculatedRevenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Custos Operacionais
                  </span>
                  <span className="text-destructive">
                    - R$ {result.totalOperationalCosts.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    ICMS ({result.icmsRate}%)
                  </span>
                  <span className="text-orange-500">
                    - R$ {result.icmsValue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PIS/COFINS</span>
                  <span className="text-orange-500">
                    - R$ {(result.pisValue + result.cofinsValue).toFixed(2)}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Margem Líquida Estimada</span>
                  <span>R$ {result.netMargin.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Salvar
                </Button>
                <Button className="flex-1" variant="secondary">
                  <FileDown className="mr-2 h-4 w-4" /> PDF
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
            <div className="text-center">
              <Calculator className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Preencha o formulário e calcule para ver os resultados</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
