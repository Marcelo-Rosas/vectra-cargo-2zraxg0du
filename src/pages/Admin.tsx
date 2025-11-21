import { useState, useEffect } from 'react'
import { mockApi } from '@/services/mockApi'
import { TableVersion, AuditLog, SchemaField } from '@/types'
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
import { Upload, FileSpreadsheet } from 'lucide-react'
import { toast } from 'sonner'
import { UserManagement } from '@/components/admin/UserManagement'
import { TableViewer } from '@/components/admin/TableViewer'

const ntcLotacaoSchema: SchemaField[] = [
  { name: 'id', type: 'UUID', description: 'ID' },
  { name: 'vehicle_type', type: 'TEXT', description: 'Veículo' },
  { name: 'distance_min', type: 'INTEGER', description: 'Dist. Min' },
  { name: 'distance_max', type: 'INTEGER', description: 'Dist. Max' },
  { name: 'price_per_ton', type: 'DECIMAL', description: 'R$/Ton' },
  { name: 'price_per_trip', type: 'DECIMAL', description: 'R$/Viagem' },
  { name: 'is_active', type: 'BOOLEAN', description: 'Ativo' },
]

const ntcFracionadaSchema: SchemaField[] = [
  { name: 'id', type: 'UUID', description: 'ID' },
  { name: 'distance_min', type: 'INTEGER', description: 'Dist. Min' },
  { name: 'distance_max', type: 'INTEGER', description: 'Dist. Max' },
  { name: 'weight_min', type: 'DECIMAL', description: 'Peso Min' },
  { name: 'weight_max', type: 'DECIMAL', description: 'Peso Max' },
  { name: 'price_per_kg', type: 'DECIMAL', description: 'R$/Kg' },
  { name: 'is_active', type: 'BOOLEAN', description: 'Ativo' },
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
      success: 'Tabela atualizada com sucesso! 1500 registros processados.',
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
        </TabsList>

        <TabsContent value="tables" className="space-y-4">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="upload">Upload & Versões</TabsTrigger>
              <TabsTrigger value="ntc_lotacao">NTC Lotação</TabsTrigger>
              <TabsTrigger value="ntc_fracionada">NTC Fracionada</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Importar Tabela</CardTitle>
                  <CardDescription>
                    Atualize as tabelas de referência.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="table-type">Tipo de Tabela</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
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
                            <FileSpreadsheet className="h-4 w-4" />{' '}
                            {v.tableName}
                          </TableCell>
                          <TableCell>{v.version}</TableCell>
                          <TableCell>
                            {new Date(v.effectiveDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{v.recordsCount}</TableCell>
                          <TableCell>
                            <Badge
                              variant={v.isActive ? 'default' : 'secondary'}
                            >
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

            <TabsContent value="ntc_lotacao" className="mt-4">
              <TableViewer
                tableName="ntc_lotacao"
                title="NTC Lotação"
                description="Tabela de referência para frete lotação"
                schema={ntcLotacaoSchema}
              />
            </TabsContent>

            <TabsContent value="ntc_fracionada" className="mt-4">
              <TableViewer
                tableName="ntc_fracionada"
                title="NTC Fracionada"
                description="Tabela de referência para frete fracionado"
                schema={ntcFracionadaSchema}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>
                Controle de acesso e perfis do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement />
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
      </Tabs>
    </div>
  )
}
