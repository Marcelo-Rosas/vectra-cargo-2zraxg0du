import { useState, useEffect } from 'react'
import { mockApi } from '@/services/mockApi'
import { TableVersion, AuditLog } from '@/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Upload, FileSpreadsheet, Database } from 'lucide-react'
import { toast } from 'sonner'

interface SchemaField {
  name: string
  type: string
  description: string
}

const ntcLotacaoSchema: SchemaField[] = [
  {
    name: 'id',
    type: 'UUID',
    description: 'Identificador único do registro',
  },
  {
    name: 'vehicle_type',
    type: 'TEXT',
    description: 'Tipo de veículo (ex: Semirreboque 3 eixos)',
  },
  {
    name: 'distance_min',
    type: 'INTEGER',
    description: 'Distância mínima em km',
  },
  {
    name: 'distance_max',
    type: 'INTEGER',
    description: 'Distância máxima em km',
  },
  {
    name: 'price_per_ton',
    type: 'DECIMAL(10,2)',
    description: 'Preço por tonelada (R$)',
  },
  {
    name: 'price_per_trip',
    type: 'DECIMAL(10,2)',
    description: 'Preço por viagem (R$)',
  },
  {
    name: 'price_per_km',
    type: 'DECIMAL(10,4)',
    description: 'Preço por km (R$)',
  },
  {
    name: 'freight_value_percent',
    type: 'DECIMAL(5,4)',
    description: 'Frete Valor % (0.0100 = 1%)',
  },
  {
    name: 'gris_percent',
    type: 'DECIMAL(5,4)',
    description: 'GRIS % (0.0100 = 1%)',
  },
  {
    name: 'tso_percent',
    type: 'DECIMAL(5,4)',
    description: 'TSO % (0.0050 = 0.5%)',
  },
  { name: 'version_date', type: 'DATE', description: '' },
  { name: 'is_active', type: 'BOOLEAN', description: '' },
  { name: 'created_at', type: 'TIMESTAMPTZ', description: '' },
  { name: 'updated_at', type: 'TIMESTAMPTZ', description: '' },
]

const ntcFracionadaSchema: SchemaField[] = [
  {
    name: 'id',
    type: 'UUID',
    description: 'Identificador único do registro',
  },
  {
    name: 'distance_min',
    type: 'INTEGER',
    description: 'Distância mínima em km',
  },
  {
    name: 'distance_max',
    type: 'INTEGER',
    description: 'Distância máxima em km',
  },
  {
    name: 'weight_min',
    type: 'DECIMAL(10,2)',
    description: 'Peso mínimo em kg',
  },
  {
    name: 'weight_max',
    type: 'DECIMAL(10,2)',
    description: 'Peso máximo em kg (NULL = sem limite)',
  },
  {
    name: 'price_per_shipment',
    type: 'DECIMAL(10,2)',
    description: 'Preço por despacho (R$)',
  },
  {
    name: 'price_per_kg',
    type: 'DECIMAL(10,4)',
    description: 'Preço por kg (R$)',
  },
  { name: 'freight_value_percent', type: 'DECIMAL(5,4)', description: '' },
  { name: 'gris_percent', type: 'DECIMAL(5,4)', description: '' },
  { name: 'tso_min', type: 'DECIMAL(10,2)', description: '' },
  { name: 'dispatch_fee', type: 'DECIMAL(10,2)', description: '' },
  { name: 'multiplier', type: 'DECIMAL(5,2)', description: '' },
  { name: 'version_date', type: 'DATE', description: '' },
  { name: 'is_active', type: 'BOOLEAN', description: '' },
  { name: 'created_at', type: 'TIMESTAMPTZ', description: '' },
  { name: 'updated_at', type: 'TIMESTAMPTZ', description: '' },
]

const freightQuotationsSchema: SchemaField[] = [
  {
    name: 'id',
    type: 'UUID',
    description: 'Identificador único da cotação',
  },
  {
    name: 'user_id',
    type: 'UUID',
    description: 'ID do usuário que criou a cotação',
  },
  {
    name: 'quotation_name',
    type: 'TEXT',
    description: 'Nome da cotação (opcional)',
  },
  {
    name: 'cargo_type',
    type: 'TEXT',
    description: 'Tipo de carga: lotacao, fracionada ou container',
  },
  { name: 'origin_uf', type: 'TEXT', description: 'UF de origem' },
  { name: 'destination_uf', type: 'TEXT', description: 'UF de destino' },
  {
    name: 'distance_km',
    type: 'DECIMAL(10,2)',
    description: 'Distância em km',
  },
  {
    name: 'vehicle_type',
    type: 'TEXT',
    description: 'Tipo de veículo (se aplicável para containers)',
  },
  {
    name: 'cargo_weight',
    type: 'DECIMAL(10,2)',
    description: 'Peso da carga (se aplicável para containers)',
  },
  {
    name: 'invoice_value',
    type: 'DECIMAL(12,2)',
    description: 'Valor da nota fiscal',
  },
  {
    name: 'use_table',
    type: 'BOOLEAN',
    description: 'Switch: Usar Tabela NTC?',
  },
  {
    name: 'apply_tax_on_costs',
    type: 'BOOLEAN',
    description: 'Switch: Aplicar Impostos em Custos?',
  },
  {
    name: 'apply_markup',
    type: 'BOOLEAN',
    description: 'Switch: Aplicar Markup?',
  },
  {
    name: 'suggested_freight',
    type: 'DECIMAL(12,2)',
    description: 'Frete sugerido (se usar tabela)',
  },
  {
    name: 'informed_freight',
    type: 'DECIMAL(12,2)',
    description: 'Frete informado (se não usar tabela)',
  },
  {
    name: 'freight_value',
    type: 'DECIMAL(12,2)',
    description: 'Valor do frete',
  },
  { name: 'gris', type: 'DECIMAL(12,2)', description: 'GRIS' },
  { name: 'tso', type: 'DECIMAL(12,2)', description: 'TSO' },
  {
    name: 'negotiated_freight',
    type: 'DECIMAL(12,2)',
    description: 'Frete negociado',
  },
  {
    name: 'markup_value',
    type: 'DECIMAL(12,2)',
    description: 'Valor do markup',
  },
  {
    name: 'loading_cost',
    type: 'DECIMAL(12,2)',
    description: 'Custo de carregamento',
  },
  {
    name: 'unloading_cost',
    type: 'DECIMAL(12,2)',
    description: 'Custo de descarregamento',
  },
  {
    name: 'equipment_rent',
    type: 'DECIMAL(12,2)',
    description: 'Aluguel de equipamento',
  },
  { name: 'toll', type: 'DECIMAL(12,2)', description: 'Pedágio' },
  {
    name: 'calculated_revenue',
    type: 'DECIMAL(12,2)',
    description: 'Receita calculada',
  },
  {
    name: 'adjusted_revenue',
    type: 'DECIMAL(12,2)',
    description: 'Receita ajustada',
  },
  {
    name: 'final_freight',
    type: 'DECIMAL(12,2)',
    description: 'Frete final calculado (resultado principal)',
  },
  {
    name: 'operational_costs',
    type: 'DECIMAL(12,2)',
    description: 'Custos operacionais',
  },
  { name: 'total_costs', type: 'DECIMAL(12,2)', description: 'Custos totais' },
  {
    name: 'gross_margin',
    type: 'DECIMAL(12,2)',
    description: 'Margem bruta (R$)',
  },
  {
    name: 'gross_margin_percent',
    type: 'DECIMAL(5,2)',
    description: 'Margem bruta (%)',
  },
  {
    name: 'tax_base',
    type: 'DECIMAL(12,2)',
    description: 'Base de cálculo para impostos',
  },
  {
    name: 'icms_percent',
    type: 'DECIMAL(5,4)',
    description: 'Alíquota de ICMS',
  },
  { name: 'icms_value', type: 'DECIMAL(12,2)', description: 'Valor do ICMS' },
  { name: 'notes', type: 'TEXT', description: 'Notas' },
  { name: 'is_favorite', type: 'BOOLEAN', description: 'É favorito?' },
  { name: 'created_at', type: 'TIMESTAMPTZ', description: '' },
  { name: 'updated_at', type: 'TIMESTAMPTZ', description: '' },
]

export default function Admin() {
  const [versions, setVersions] = useState<TableVersion[]>([])
  const [logs, setLogs] = useState<AuditLog[]>([])

  useEffect(() => {
    mockApi.getTableVersions().then(setVersions)
    mockApi.getAuditLogs().then(setLogs)
  }, [])

  const handleUpload = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: 'Enviando arquivo...',
      success: 'Tabela atualizada com sucesso!',
      error: 'Erro ao enviar arquivo',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight">Administração</h2>

      <Tabs defaultValue="tables" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tables">Gerenciar Tabelas</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="audit">Auditoria</TabsTrigger>
          <TabsTrigger value="schema">Estrutura de Dados</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Importar Tabela NTC</CardTitle>
              <CardDescription>
                Atualize as tabelas de referência para cálculo de frete.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="table-type">Tipo de Tabela</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>NTC Lotação</option>
                  <option>NTC Fracionada</option>
                </select>
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="file">Arquivo CSV/Excel</Label>
                <Input id="file" type="file" />
              </div>
              <Button onClick={handleUpload}>
                <Upload className="mr-2 h-4 w-4" /> Upload e Atualizar
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Versões</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tabela</TableHead>
                    <TableHead>Versão</TableHead>
                    <TableHead>Vigência</TableHead>
                    <TableHead>Registros</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {versions.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" /> {v.tableName}
                      </TableCell>
                      <TableCell>{v.version}</TableCell>
                      <TableCell>
                        {new Date(v.effectiveDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{v.recordsCount}</TableCell>
                      <TableCell>
                        <Badge variant={v.isActive ? 'default' : 'secondary'}>
                          {v.isActive ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>Controle de acesso e perfis.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Funcionalidade simulada. Lista de usuários seria exibida aqui.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Auditoria</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Alvo</TableHead>
                    <TableHead>Detalhes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.action}</Badge>
                      </TableCell>
                      <TableCell>{log.target}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {log.details}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema" className="space-y-6">
          <SchemaViewer
            title="Tabela NTC Lotação (ntc_lotacao)"
            description="Estrutura da tabela de referência para cálculo de frete lotação."
            schema={ntcLotacaoSchema}
          />
          <SchemaViewer
            title="Tabela NTC Fracionada (ntc_fracionada)"
            description="Estrutura da tabela de referência para cálculo de frete fracionado."
            schema={ntcFracionadaSchema}
          />
          <SchemaViewer
            title="Cotações de Frete (freight_quotations)"
            description="Tabela principal onde são armazenadas todas as cotações, incluindo Container."
            schema={freightQuotationsSchema}
            note="Nota Importante: O tipo de carga 'Container' não possui uma tabela própria de referência (como ntc_container). Ele é tratado como um registro na tabela freight_quotations com o campo cargo_type = 'container'. Os campos listados abaixo são os relevantes para este tipo de carga."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SchemaViewer({
  title,
  description,
  schema,
  note,
}: {
  title: string
  description: string
  schema: SchemaField[]
  note?: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {note && (
          <div className="mb-4 p-4 bg-muted rounded-md text-sm text-muted-foreground border-l-4 border-primary">
            {note}
          </div>
        )}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Campo</TableHead>
                <TableHead className="w-[150px]">Tipo</TableHead>
                <TableHead>Descrição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schema.map((field) => (
                <TableRow key={field.name}>
                  <TableCell className="font-mono font-medium text-xs">
                    {field.name}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {field.type}
                  </TableCell>
                  <TableCell className="text-sm">
                    {field.description || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
