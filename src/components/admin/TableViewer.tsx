import { useState, useEffect } from 'react'
import { mockApi } from '@/services/mockApi'
import { SchemaField } from '@/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Search, Database, Loader2 } from 'lucide-react'

interface TableViewerProps {
  tableName: string
  title: string
  description: string
  schema: SchemaField[]
}

export function TableViewer({
  tableName,
  title,
  description,
  schema,
}: TableViewerProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSchema, setShowSchema] = useState(false)
  const [showSample, setShowSample] = useState(false)
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadData()
  }, [tableName])

  const loadData = async () => {
    setLoading(true)
    try {
      const result = await mockApi.getTableData(tableName)
      setData(result)
    } finally {
      setLoading(false)
    }
  }

  const displayData = showSample ? data.slice(0, 5) : data

  const filteredData = displayData.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  )

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar registros..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-schema"
                  checked={showSchema}
                  onCheckedChange={setShowSchema}
                />
                <Label htmlFor="show-schema">Ver Schema</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-sample"
                  checked={showSample}
                  onCheckedChange={(checked) => {
                    setShowSample(checked)
                    setPage(1)
                  }}
                />
                <Label htmlFor="show-sample">Ver Exemplo</Label>
              </div>
            </div>
          </div>

          {showSchema && (
            <div className="rounded-md border bg-muted/50 p-4 mb-4">
              <h4 className="font-semibold mb-2">Estrutura da Tabela</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {schema.map((field) => (
                  <div key={field.name} className="text-sm">
                    <span className="font-mono font-bold">{field.name}</span>:{' '}
                    <span className="text-muted-foreground">{field.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {schema.slice(0, 8).map((field) => (
                    <TableHead key={field.name} className="whitespace-nowrap">
                      {field.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={schema.length}
                      className="text-center py-8"
                    >
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={schema.length}
                      className="text-center py-8"
                    >
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row, i) => (
                    <TableRow
                      key={row.id || i}
                      className={showSample ? 'bg-muted/30' : ''}
                    >
                      {schema.slice(0, 8).map((field) => (
                        <TableCell
                          key={`${row.id}-${field.name}`}
                          className="whitespace-nowrap"
                        >
                          {String(row[field.name] ?? '-')}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!showSample && totalPages > 1 && (
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
