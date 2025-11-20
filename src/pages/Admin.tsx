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
import { Upload, FileSpreadsheet, History } from 'lucide-react'
import { toast } from 'sonner'

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
      </Tabs>
    </div>
  )
}
